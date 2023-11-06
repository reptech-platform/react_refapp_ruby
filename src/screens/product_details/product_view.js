import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import { GetProductTypes, GetProduct, GetOtherDetails, GetProductPrice, GetProductOtherImages, GetDocument } from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";
import ProductJsonConfig from "config/stepperConfig.json";
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

            let MainImageDocId = 0;
            // Get Product Details
            let rslt = await GetProduct(id, "$expand=MainImage");
            const product = rslt.values;
            if (rslt.status) {
                MainImageDocId = product.MainImage.DocId;
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

                const keyName = "MainImage";
                let docData = null;

                if (MainImageDocId > 0) {
                    docData = await GetDocument(MainImageDocId, true, product.MainImage.DocType);
                    //console.log(docData);
                }

                product.MainImage['DocData'] = docData;
                for (let prop in product.MainImage) {
                    tmp = item['otherdetails'].find((x) => x.key === keyName)[prop];
                    if (!Helper.IsNull(tmp)) {
                        item['otherdetails'].find((x) => x.key === keyName)[prop] = product.MainImage[prop];
                    } else if (prop === 'DocName') {
                        item['otherdetails'].find((x) => x.key === keyName).value = product.MainImage[prop];
                    }
                }
            }

            // Get Product Other Details
            rslt = await GetOtherDetails(product.ProductOtherDetails);
            //console.log(rslt);
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

            // Get Product Other Images
            rslt = await GetProductOtherImages(null, `Product_id eq ${product.Product_id}`);
            if (rslt.status) {
                let docId = rslt.values && rslt.values.value[0].DocId;
                let docData = null;
                const _document = await GetDocument(docId);
                if (_document) {
                    docData = await GetDocument(docId, true, _document.DocType);
                    _document['DocData'] = docData;
                }
                const keyName = "OtherImages";
                for (let prop in _document) {
                    tmp = item['otherdetails'].find((x) => x.key === keyName)[prop];
                    if (!Helper.IsNull(tmp)) {
                        item['otherdetails'].find((x) => x.key === keyName)[prop] = _document[prop];
                    } else if (prop === 'DocName') {
                        item['otherdetails'].find((x) => x.key === keyName).value = _document[prop];
                    }
                }
            }

            // Get Product Price Details
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