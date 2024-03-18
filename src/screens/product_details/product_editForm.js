
import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import * as Api from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import ProductJsonConfig from "config/product_config.json";
import RenderFormContols from "./child/formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

import { GetDocument, GetProductOtherImages } from "shared/services";

const screenItems = ['producttype', 'product', 'otherdetails', 'productprice'];

const Component = (props) => {
    const { title } = props;
    const [form, setForm] = useState(null);
    const theme = useTheme();
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [showUpdate, setShowUpdate] = useState(false);
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const TrackChanges = (name) => {
        const source = JSON.parse(JSON.stringify(backRow[name]));
        const target = JSON.parse(JSON.stringify(row[name]));

        let changes = [];
        for (let prop of source) {
            let value1 = source.find((x) => x.key === prop.key).value ?? "";
            let value2 = target.find((x) => x.key === prop.key).value ?? "";
            if (['MainImage', 'OtherImages'].indexOf(prop.key) > -1) {
                value1 = value1.DocName ?? "";
                value2 = value2.DocName ?? "";
            }
            if (value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const FetchProductDetails = async (enums) => {

        let item = {}, tmp;

        screenItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (id) {
            global.Busy(true);

            // Get Product Details
            let rslt = await Api.GetProduct(id, "$expand=MainImage,ProductType,ProductPrice");
            const product = rslt.values;
            if (rslt.status) {
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
                if (product.MainImage) {
                    const _document = await Support.ExtractDocument(product.MainImage, product.MainImage.DocId);
                    item['product'].find((x) => x.key === "MainImage").value = _document;
                }

                if (product.ProductType) {
                    Object.keys(product.ProductType).forEach(x => {
                        item['producttype'].find(z => z.key === x).value = product.ProductType[x];
                    })
                }

                if (product.ProductPrice) {
                    Object.keys(product.ProductPrice).forEach(x => {
                        item['productprice'].find(z => z.key === x).value = product.ProductPrice[x];
                    })
                }

            }

            // Get Product Other Details
            if (item['otherdetails'] && product.ProductOtherDetails) {
                rslt = await Api.GetOtherDetails(product.ProductOtherDetails);
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
            }

            // Get Product Other Images
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

            let bItem = {};
            screenItems.forEach(elm => {
                let bItems = [];
                for (let prop of item[elm]) {
                    bItems.push({ key: prop.key, value: prop.value });
                }
                bItem[elm] = bItems;
            });
            setRow(item);
            setBackupRow(bItem);
            global.Busy(false);
        }
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            await Api.GetProductTypes()
                .then(async (res) => {
                    if (res.status) {
                        const pValues = res.values.map((x) => { return { Name: x.ProductTypeName, Desc: x.ProductTypeDesc, Value: x.PtId } });
                        await GetMetaDataInfo()
                            .then(async (res2) => {
                                const enums = res2.filter((x) => x.Type === 'Enum') || [];
                                enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
                                setDropDownOptions(enums);
                                global.Busy(false);
                                return resolve(enums);
                            });

                    } else {
                        global.Busy(false);
                        console.log(res.statusText);
                        return resolve([]);
                    }
                });

        });
    }

    const UpdateBackUp = (name, value) => {
        setBackupRow((prev) => ({ ...prev, [name]: value }));
        setState(!state);
    }

    const OnSubmit = async () => {
        let rslt, data, changes = [];
        let productId, otherDetailsId, priceId, mainImageId, otherImagesId;
        debugger;

        changes = TrackChanges('product');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdateProduct(row['product'], dropDownOptions, ["MainImage", "OtherImages"]);
            if (rslt.status) {
                row['product'].find((x) => x.key === 'Product_id').value = rslt.id;
                UpdateBackUp('product', Helper.CopyObject(row['product']));
            } else { return; }
        }

        productId = row['product'].find((x) => x.key === 'Product_id').value || 0;

        changes = TrackChanges('otherdetails');
        if (changes.length > 0) {
            const filters = ['MainImage', 'OtherImages'];
            let tmp = changes.filter((x) => filters.indexOf(x) === -1);
            if (tmp.length > 0) {
                rslt = await Support.AddOrUpdateOtherDetails(row['otherdetails'], dropDownOptions, ['MainImage', 'OtherImages']);
                if (rslt.status) {
                    row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value = rslt.id;
                    UpdateBackUp('otherdetails', Helper.CopyObject(row['otherdetails']));
                } else { return; }

                // Update product with child references
                otherDetailsId = row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value || 0;
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductOtherDetails", value: parseInt(otherDetailsId) }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;
                row['product'].find((x) => x.key === 'ProductOtherDetails').value = otherDetailsId;
            }
        }

        changes = TrackChanges('productprice');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdatePrice(row['productprice']);
            if (rslt.status) {
                row['productprice'].find((x) => x.key === 'PpId').value = rslt.id;
                UpdateBackUp('productprice', Helper.CopyObject(row['productprice']));
            } else { return; }

            // Update product with child references
            priceId = row['productprice'].find((x) => x.key === 'PpId').value || 0;
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductProductPrice", value: parseInt(priceId) }
            ];

            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
            row['product'].find((x) => x.key === 'ProductProductPrice').value = priceId;
        }

        changes = TrackChanges('otherdetails');
        if (changes.length > 0 && changes.indexOf('MainImage') > -1) {
            data = row['otherdetails'].find((x) => x.key === 'MainImage');
            rslt = await Support.AddOrUpdateDocument(data);
            if (rslt.status) {
                let newValues = row['otherdetails'].find((x) => x.key === 'MainImage').value;
                newValues = { ...newValues, DocId: rslt.id };
                row['otherdetails'].find((x) => x.key === 'MainImage').value = newValues
                UpdateBackUp('otherdetails', Helper.CopyObject(row['otherdetails']));
            } else { return; }

            // Update product with child references
            mainImageId = row['otherdetails'].find((x) => x.key === 'MainImage').value?.DocId || 0;
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductMainImage", value: parseInt(mainImageId) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
            row['product'].find((x) => x.key === 'ProductMainImage').value = mainImageId;
        }

        changes = TrackChanges('otherdetails');
        if (changes.length > 0 && changes.indexOf('OtherImages') > -1) {
            data = row['otherdetails'].find((x) => x.key === 'OtherImages');
            rslt = await Support.AddOrUpdateDocument(data);
            if (rslt.status) {
                let oldData = row['otherdetails'].find((x) => x.key === 'OtherImages').value;
                oldData = { ...oldData, DocId: rslt.id };
                row['otherdetails'].find((x) => x.key === 'OtherImages').value = oldData
                UpdateBackUp('otherdetails', Helper.CopyObject(row['otherdetails']));
            } else { return; }

            otherImagesId = row['otherdetails'].find((x) => x.key === 'OtherImages').value?.DocId || 0;
            let productOtherImagesId = row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId || 0;
            productOtherImagesId = parseInt(productOtherImagesId);
            // Update product other images with child referenc
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "Id", value: productOtherImagesId > 0 ? productOtherImagesId : null },
                { key: "DocId", value: parseInt(otherImagesId) }
            ];

            rslt = await Support.AddOrUpdateProductOtherImages(data);
            if (rslt.status) {
                row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId = rslt.id;
            } else { return; }
        }

        global.AlertPopup("success", "Product is updated successfully!");
        setShowUpdate(false);
        NavigateTo("/products");
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name);
        if (_index > -1) {
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
        }
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
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols {...props} shadow={true} setForm={setForm} mode={"edit"} controls={row} options={dropDownOptions}
                    onInputChange={OnInputChange} onSubmit={OnSubmit} />

                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                <Button variant="contained" onClick={(e) => OnSubmitForm(e)}>Update</Button>
                                <Button variant="outlined" onClick={() => NavigateTo("/products")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </>

    );

};

export default Component;