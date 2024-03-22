
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

import { GetDocument } from "shared/services";

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

            if (prop.key === 'MainImage') {
                value1 = value1.DocName ?? "";
                value2 = value2.DocName ?? "";
            } else if (prop.key === 'OtherImages') {
                if (value1.length !== value2.length) {
                    value1 = ""; value2 = "CHANGED";
                } else {
                    for (let k = 0; k < value1.length; k++) {
                        if (value1[k].DocName !== value2[k].DocName) {
                            value1 = ""; value2 = "CHANGED";
                            break;
                        }
                    }
                }
            }
            if (value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const FetchProductDetails = async (enums) => {

        let item = {};

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
            let rslt = await Api.GetProduct(id, "$expand=MainImage,ProductType,ProductPrice,OtherDetails,OtherImages");
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

                if (product.ProductType) {
                    Object.keys(product.ProductType).forEach(x => {
                        item['producttype'].find(z => z.key === x).value = product.ProductType[x];
                    })
                }

                if (product.OtherDetails) {
                    Object.keys(product.OtherDetails).forEach(prop => {
                        const tItem = item['otherdetails'].find((x) => x.key === prop);
                        if (tItem) {
                            if (prop === 'UnitOfMeasurement') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === product.OtherDetails[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'AvailabilityStatus') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === product.OtherDetails[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'ManufacturingDate') {
                                let tmpDate = product.OtherDetails[prop].split('T');
                                item['otherdetails'].find((x) => x.key === prop).value = tmpDate[0];
                            } else {
                                item['otherdetails'].find((x) => x.key === prop).value = product.OtherDetails[prop];
                            }
                        }
                    })
                }

                if (product.ProductPrice) {
                    Object.keys(product.ProductPrice).forEach(x => {
                        item['productprice'].find(z => z.key === x).value = product.ProductPrice[x];
                    })
                }

                // Get Product Other Images
                if (!Helper.IsJSONEmpty(product.OtherImages) && product.OtherImages.length > 0) {
                    let _document = [];
                    rslt = await Api.GetProductOtherImages(null, `Product_id eq ${product.Product_id}`);
                    let productOtherImagesList = rslt.values;

                    for (let i = 0; i < product.OtherImages.length; i++) {
                        let docItem = product.OtherImages[i];

                        const { Id } = productOtherImagesList.find(x => parseInt(x.DocId) === parseInt(docItem.DocId));
                        docItem.ProductOtherImagesId = Id;

                        let tmp = {};

                        ['ProductOtherImagesId', 'DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                            tmp[x] = docItem[x]
                        });

                        if (parseInt(tmp.DocId) > 0) {
                            rslt = await GetDocument(tmp.DocId, true, tmp.DocType);
                            if (rslt.status) tmp['DocData'] = rslt.values;
                        }

                        tmp['index'] = i;
                        _document.push(tmp);
                    }

                    item['product'].find((x) => x.key === "OtherImages").value = _document;
                }

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
            setBackupRow(Helper.CloneObject(bItem));
            global.Busy(false);
        }
    }

    const FetchMetaDataInfo = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const rlst = await GetMetaDataInfo();
            const enums = rlst.filter((x) => x.Type === 'Enum') || [];
            setDropDownOptions(enums);
            global.Busy(false);
            return resolve(enums);
        });
    }

    const UpdateBackUp = (name) => {
        let obj = Helper.CloneObject(row[name]);
        let bItems = [];
        for (let prop of obj) {
            bItems.push({ key: prop.key, value: prop.value });
        }
        setBackupRow((prev) => ({ ...prev, [name]: bItems }));
        setState(!state);
    }

    const OnSubmit = async () => {
        let rslt, data, changes = [];
        let productId, otherDetailsId, priceId;

        let product = row['product'];

        // Update Product
        changes = TrackChanges('product');
        if (changes.length > 0) {
            // Check the product details are changed other than the images
            const filters = ['MainImage', 'OtherImages'];
            let tmp = changes.filter((x) => filters.indexOf(x) === -1);
            if (tmp.length > 0) {
                rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ["MainImage", "OtherImages"]);
                if (rslt.status) {
                    product.find((x) => x.key === 'Product_id').value = rslt.id;
                    // Update Back for next tracking purpose
                    UpdateBackUp('product');
                } else { return; }
            }
        }

        productId = product.find((x) => x.key === 'Product_id').value || 0;

        // Update Product Type
        changes = TrackChanges('producttype');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdateProductType(row['producttype']);
            if (rslt.status) {
                // Add Or Update Product
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductProductType", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;
                row['producttype'].find((x) => x.key === 'PtId').value = parseInt(rslt.id);
                row['product'].find((x) => x.key === 'ProductProductType').value = parseInt(rslt.id);
                // Update Back for next tracking purpose
                UpdateBackUp('producttype');
            } else { return; }
        }

        changes = TrackChanges('otherdetails');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdateOtherDetails(row['otherdetails'], dropDownOptions);
            if (rslt.status) {
                otherDetailsId = parseInt(rslt.id);
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductOtherDetails", value: otherDetailsId }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;

                row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value = rslt.id;
                row['product'].find((x) => x.key === 'ProductOtherDetails').value = otherDetailsId;

                // Update Back for next tracking purpose
                UpdateBackUp('otherdetails');

            } else { return; }
        }

        changes = TrackChanges('productprice');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdatePrice(row['productprice']);
            if (rslt.status) {
                priceId = praseInt(rslt.id);
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductProductPrice", value: priceId }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;
                row['productprice'].find((x) => x.key === 'PpId').value = priceId;
                row['product'].find((x) => x.key === 'ProductProductPrice').value = priceId;
                // Update Back for next tracking purpose              
                UpdateBackUp('productprice');

            } else { return; }

        }

        // Add or Update Product Main Image
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.indexOf('MainImage') > -1) {
            data = product.find((x) => x.key === 'MainImage');
            rslt = await Support.AddOrUpdateDocument(data);
            if (rslt.status) {
                let newImageId = parseInt(rslt.id);
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductMainImage", value: newImageId }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;

                let newValues = product.find((x) => x.key === 'MainImage').value;
                newValues = { ...newValues, DocId: newImageId };
                row['product'].find((x) => x.key === 'MainImage').value = newValues
                row['product'].find((x) => x.key === 'ProductMainImage').value = newImageId;
                // Update Back for next tracking purpose
                UpdateBackUp('product');

            } else { return; }
        }

        // Add or Update Product Other Images
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.indexOf('OtherImages') > -1) {
            let prodImages = product.find((x) => x.key === 'OtherImages').value;
            const source = JSON.parse(JSON.stringify(backRow["product"])).find((x) => x.key === 'OtherImages').value;
            for (let i = 0; i < prodImages.length; i++) {
                if (i < source.length && source[i].DocName === prodImages[i].DocName) continue;
                let productOtherImagesId = prodImages[i].ProductOtherImagesId || 0;

                await Support.AddOrUpdateDocument({ value: { DocData: { Deleted: true }, DocId: prodImages[i].DocId } });

                rslt = await Support.AddOrUpdateDocument({ value: prodImages[i] });
                let otherImagesDocId = parseInt(rslt.id);
                if (rslt.status) {
                    data = [
                        { key: "Id", value: parseInt(productOtherImagesId) > 0 ? parseInt(productOtherImagesId) : null },
                        { key: "Product_id", value: parseInt(productId) },
                        { key: "DocId", value: otherImagesDocId }
                    ];
                    rslt = await Support.AddOrUpdateProductOtherImages(data);
                    if (!rslt.status) return;
                    productOtherImagesId = parseInt(rslt.id);
                }
                prodImages[i].ProductOtherImagesId = productOtherImagesId;
                prodImages[i].DocId = otherImagesDocId;
            }

            row['product'].find((x) => x.key === 'OtherImages').value = prodImages;
            UpdateBackUp('product');
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
                await FetchMetaDataInfo().then(async (enums) => {
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