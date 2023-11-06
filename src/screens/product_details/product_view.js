import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import { GetProductTypes, GetProduct, GetOtherDetails, GetProductPrice, GetProductOtherImages, GetDocument } from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";
import ProductJsonConfig from "config/productConfig.json";
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

        ['product', 'otherdetails', 'productprice'].forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (id) {
            global.Busy(true);

            // Get Product Details
            let rslt = await GetProduct(id, "$expand=MainImage");
            const product = rslt.values;

            if (rslt.status) {

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

                if (product.MainImage) {
                    const keyName = "MainImage";
                    let docData = null;
                    let MainImageDocId = product.MainImage?.DocId || 0;
                    MainImageDocId = parseInt(MainImageDocId);

                    if (MainImageDocId > 0) {
                        rslt = await GetDocument(MainImageDocId, true, product.MainImage.DocType);
                        docData = !Helper.IsNullValue(rslt?.values) ? rslt?.values : null;
                    }
                    product.MainImage['DocData'] = docData;
                    tmp = {};
                    ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                        tmp[x] = product.MainImage[x]
                    });
                    tmp = item['otherdetails'].find((x) => x.key === keyName).value = tmp;
                }
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

            // Get Product Other Images
            rslt = await GetProductOtherImages(null, `Product_id eq ${product.Product_id}`);
            if (rslt.status) {
                let docId = rslt.values && rslt.values.length > 0 && rslt.values[0].DocId || 0;
                if (docId > 0) {
                    let docData = null;
                    let _document = {};
                    rslt = await GetDocument(docId);
                    _document = !Helper.IsNullValue(rslt?.values) ? rslt?.values : null;
                    if (_document) {
                        rslt = await GetDocument(docId, true, _document.DocType);
                        docData = !Helper.IsNullValue(rslt?.values) ? rslt?.values : null;
                        _document['DocData'] = docData;
                    }
                    const keyName = "OtherImages";
                    tmp = {};
                    ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                        tmp[x] = _document && _document[x] || null
                    });
                    tmp = item['otherdetails'].find((x) => x.key === keyName).value = tmp;
                }
            }

            // Get Product Price Details
            if (product.ProductProductPrice) {
                rslt = await GetProductPrice(product.ProductProductPrice);
                if (rslt.status) {
                    tmp = rslt.values;
                    for (let prop in tmp) {
                        const tItem = item['productprice'].find((x) => x.key === prop);
                        if (tItem) {
                            item['productprice'].find((x) => x.key === prop).value = tmp[prop];
                        }
                    }
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