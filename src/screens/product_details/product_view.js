import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import * as Api from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import ProductJsonConfig from "config/product_config.json";
import RenderFormContols from "./child/formcontrols";
import Helper from "shared/helper";

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
        const keyItems = Object.keys(ProductJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (id) {
            global.Busy(true);
            // Get Product Details
            let rslt = await Api.GetProduct(id, "$expand=ODetails,OtherImages,MainImage,PType,SellingPrice,BuyingPrice,ProductVendor");
            if (rslt.status) {

                const product = rslt.values;

                for (let prop in product) {
                    const tItem = item['product'].find((x) => x.key === prop);
                    if (tItem && !Helper.IsNullValue(product[prop])) {
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
                if (product.PType) {
                    Object.keys(product.PType).forEach(x => {
                        item['producttype'].find(z => z.key === x).value = product.PType[x];
                    })
                }

                // Get Product Other Details
                if (product.ODetails) {
                    Object.keys(product.ODetails).forEach(prop => {
                        const tItem = item['otherdetails'].find((x) => x.key === prop);
                        if (tItem) {
                            if (prop === 'UnitOfMeasurement') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === product.ODetails[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'AvailabilityStatus') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === product.ODetails[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'ManufacturingDate') {
                                let tmpDate = product.ODetails[prop].split('T');
                                item['otherdetails'].find((x) => x.key === prop).value = tmpDate[0];
                            } else {
                                item['otherdetails'].find((x) => x.key === prop).value = product.ODetails[prop];
                            }
                        }
                    })
                }

                // Product Selling Price
                if (product.SellingPrice) {
                    Object.keys(product.SellingPrice).forEach(x => {
                        item['productsellingprice'].find(z => z.key === x).value = product.SellingPrice[x];
                    })
                }

                // Product Buying Price
                if (product.BuyingPrice) {
                    Object.keys(product.BuyingPrice).forEach(x => {
                        item['productbuyingprice'].find(z => z.key === x).value = product.BuyingPrice[x];
                    })
                }

                // Product Vendor
                if (product.ProductVendor) {
                    Object.keys(product.ProductVendor).forEach(x => {
                        item['productvendor'].find(z => z.key === x).value = product.ProductVendor[x];
                    })
                }

                // Main Image
                if (product.MainImage) {
                    tmp = {};
                    ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                        tmp[x] = product.MainImage[x]
                    });

                    if (tmp.DocId > 0) {
                        rslt = await Api.GetDocument(tmp.DocId, true);
                        if (rslt.status) tmp['DocData'] = rslt.values;
                    }
                    item['product'].find((x) => x.key === "MainImage").value = tmp;
                }

                // Get Product Other Images
                if (!Helper.IsJSONEmpty(product.OtherImages) && product.OtherImages.length > 0) {
                    let _document = [];

                    for (let i = 0; i < product.OtherImages.length; i++) {
                        let docItem = product.OtherImages[i];
                        let tmp = {};

                        ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => { tmp[x] = docItem[x] });

                        if (parseInt(tmp.DocId) > 0) {
                            rslt = await Api.GetDocument(tmp.DocId, true);
                            if (rslt.status) tmp['DocData'] = rslt.values;
                        }

                        tmp['index'] = i;
                        _document.push(tmp);
                    }

                    item['product'].find((x) => x.key === "OtherImages").value = _document;
                }

            }

            setRow(item);
            global.Busy(false);
        }

    }

    const FetchDropdownItems = async () => {
        return new Promise(async (resolve) => {

            global.Busy(true);

            let items = [];

            Object.values(ProductJsonConfig).forEach(elm => {
                items = [...items, ...elm];
            });

            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            // Default get all enums list items
            let res = await GetMetaDataInfo();

            const enums = res.filter((x) => x.Type === 'Enum') || [];
            const otherItems = items.filter(x => enums.findIndex(z => z.Name === x) === -1);

            // Extract the required entities as enums
            for (let i = 0; i < otherItems.length; i++) {
                const item = otherItems[i];
                await Api.GetEntityInfo(item + 's').then(rslt => {
                    if (rslt.status) {
                        enums.push({ Name: item, Type: 'Entity', Values: rslt.values });
                    }
                });
            }

            setDropDownOptions(enums);
            global.Busy(false);
            return resolve(enums);
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (initialized) {
                await FetchDropdownItems().then(async (enums) => {
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