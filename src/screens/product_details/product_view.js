import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import {
    GetProductTypes, GetProduct, GetOtherDetails, GetProductPrice,
    GetProductOtherImages, GetDocument, GetProductType
} from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import ProductJsonConfig from "config/product_config.json";
import RenderFormContols from "./child/formcontrols";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const FetchProductDetails = async (enums) => {

        let item = {}, tmp;

        ['producttype', 'product', 'otherdetails', 'productprice'].forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (id) {
            global.Busy(true);
            // Get Product Details
            let rslt = await GetProduct(id, "$expand=MainImage,ProductType,ProductPrice");
            if (rslt.status) {

                const product = rslt.values;

                for (let prop in product) {
                    const tItem = item['product'].find((x) => x.key === prop);
                    if (tItem) {
                        if (prop === 'UnitOfMeasurement') {
                            const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                            const _value = dpItems.find((m) => m.Name === product[prop]).Value;
                            item['product'].find((x) => x.key === prop).value = parseInt(_value);
                        } else {
                            item['product'].find((x) => x.key === prop).value = product[prop];
                        }
                    }
                }

                // Product Type
                if (product.ProductType) {
                    Object.keys(product.ProductType).forEach(x => {
                        item['producttype'].find(z => z.key === x).value = product.ProductType[x];
                    })
                }

                // Get Product Other Details
                if (product.ProductOtherDetails) {
                    rslt = await GetOtherDetails(product.ProductOtherDetails);
                    if (rslt.status) {
                        tmp = rslt.values;
                        for (let prop in tmp) {
                            const tItem = item['otherdetails'].find((x) => x.key === prop);
                            if (tItem) {
                                if (prop === 'UnitOfMeasurement') {
                                    const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                    const _value = dpItems.find((m) => m.Name === tmp[prop]).Value;
                                    item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                                } else if (prop === 'AvailabilityStatus') {
                                    const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                    const _value = dpItems.find((m) => m.Name === tmp[prop]).Value;
                                    item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                                } else if (prop === 'ManufacturingDate') {
                                    let tmpDate = tmp[prop].split('T');
                                    item['otherdetails'].find((x) => x.key === prop).value = tmpDate[0];
                                } else {
                                    item['otherdetails'].find((x) => x.key === prop).value = tmp[prop];
                                }
                            }
                        }
                    }
                }

                // Product Price
                if (product.ProductPrice) {
                    Object.keys(product.ProductPrice).forEach(x => {
                        item['productprice'].find(z => z.key === x).value = product.ProductPrice[x];
                    })
                }

                // Main Image
                if (product.MainImage) {
                    tmp = {};
                    ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                        tmp[x] = product.MainImage[x]
                    });

                    if (tmp.DocId > 0) {
                        rslt = await GetDocument(tmp.DocId, true, tmp.DocType);
                        if (rslt.status) tmp['DocData'] = rslt.values;
                    }
                    item['product'].find((x) => x.key === "MainImage").value = tmp;
                }

                // Other Images
                rslt = await GetProductOtherImages(null, `Product_id eq ${product.Product_id}`);
                if (rslt.status && rslt.values && rslt.values.length > 0) {
                    let docIdList = rslt.values.map((x) => x.DocId);
                    let _document = [];
                    for (let i = 0; i < docIdList.length; i++) {
                        rslt = await GetDocument(docIdList[i]);
                        if (rslt.status) {
                            tmp = {};
                            ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                                tmp[x] = rslt.values[x]
                            });

                            if (tmp.DocId > 0) {
                                rslt = await GetDocument(tmp.DocId, true, tmp.DocType);
                                if (rslt.status) tmp['DocData'] = rslt.values;
                            }
                            tmp['index'] = i;
                            _document.push(tmp);
                        }
                    }

                    item['product'].find((x) => x.key === "OtherImages").value = _document;
                }

            }

            setRow(item);
            global.Busy(false);
        }
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const productTypes = await GetProductTypes();
            const { values } = productTypes || { values: [] };
            const pValues = values.map((x) => { return { Name: x.ProductTypeName, Value: x.PtId } });
            const rlst = await GetMetaDataInfo();
            const enums = rlst.filter((x) => x.Type === 'Enum') || [];
            enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
            setDropDownOptions(enums);
            global.Busy(false);
            return resolve(enums);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            if (initialized) {
                await FetchProductTypes().then(async (enums) => {
                    await FetchProductDetails(enums);
                });
            }
        };
        fetchData();
    }, [initialized]);

    useEffect(() => {
        setInitialized(true);
    }, [id]);

    return (

        <>
            <Container {...props}>
                <Box style={{ paddingBottom: 4, width: "100%" }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Grid container sx={{ alignItems: "center", justifyContent: 'flex-end', gap: 1, pt: 1, pb: 1 }}>
                            <Button variant="contained" startIcon={<EditIcon />}
                                onClick={() => NavigateTo(`/products/edit/${id}`)}
                            >Edit</Button>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols shadow={true} {...props} mode={"view"} options={dropDownOptions} controls={row} />
            </Container>
        </>

    );

};

export default Component;