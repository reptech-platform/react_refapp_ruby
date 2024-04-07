
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import ProductJsonConfig from "config/product_config.json";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import * as Api from "shared/services";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";

const screenItems = ['product', 'producttype', 'otherdetails', 'productvendor', 'productbuyingprice', 'productsellingprice'];

const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data, prodImages, productId;

        let product = row['product'];

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            productId = rslt.id;
        } else { return; }

        console.log(productId);

        // Add Product Type
        rslt = await Support.AddOrUpdateProductType(row['producttype']);
        if (rslt.status) {
            // Add Or Update Product
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductPType", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;

        } else { return; }

        // Add Product Other Details
        rslt = await Support.AddOrUpdateOtherDetails(row['otherdetails'], dropDownOptions);
        if (rslt.status) {
            // Add Or Update Product
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductODetails", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;

        } else { return; }

        // Add Or Update Product Price
        rslt = await Support.AddOrUpdatePrice(row['productprice']);
        if (rslt.status) {
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductSellingPrice", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
        } else { return; }

        // Add Product Main Image
        prodImages = product.find((x) => x.key === 'MainImage');
        rslt = await Support.AddOrUpdateDocument(prodImages);
        if (rslt.status) {
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductMainImage", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
        } else { return; }

        // Add Product Other Images
        prodImages = product.find((x) => x.key === 'OtherImages').value;
        for (let i = 0; i < prodImages.length; i++) {
            rslt = await Support.AddOrUpdateDocument({ value: prodImages[i] });
            if (rslt.status) {
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "DocId", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProductOtherImages(data);
                if (!rslt.status) return;
            }
        }

        global.AlertPopup("success", "Product is created successfully!");
        setShowUpdate(false);
        NavigateTo("/products");
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['mapitem'])) {
                UpdateMappingPannel(item, value);
            }
        }
    }

    const UpdateMappingPannel = (item, value) => {
        const { mapitem, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = Values.find(x => x[valueId] === value);
        let _row = row[mapitem];
        for (let i = 0; i < _row.length; i++) {
            let _cValue = obj[_row[i].key];
            if (_row[i].type === 'dropdown') {
                const _dValues = dropDownOptions.find(x => x.Name === _row[i].source).Values;
                _cValue = _dValues.find(x => x.Name === _cValue)[_row[i].valueId];
            } else if (_row[i].type === 'date') {
                _cValue = Helper.ToDate(_cValue, "YYYY-MM-DD");
            }
            _row[i].value = _cValue;
        }
        row[mapitem] = _row;
        setRow(row);
        setState(!state);
    };

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const FetchDropdownItems = async (items) => {
        return new Promise(async (resolve) => {

            global.Busy(true);

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
            return resolve(true);
        });
    };

    const FetchProductDetails = async () => {
        let item = {};
        return new Promise(async (resolve) => {
            screenItems.forEach(elm => {
                let items = [];
                for (let prop of ProductJsonConfig[elm]) {
                    items.push({ ...prop, value: null });
                    //items.push({ ...prop });
                }
                item[elm] = items;
            });
            setRow(item);
            return resolve(item);
        });
    }

    const fetchData = async () => {
        await FetchProductDetails().then(async (item) => {
            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));
            await FetchDropdownItems(items);
        });
    };

    useEffect(() => { setShowButton(true); }, []);
    if (initialized) { setInitialized(false); fetchData(); }
    useEffect(() => { setInitialized(true); }, []);

    return (

        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
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
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange}
                    controls={row} onSubmit={OnSubmit} options={dropDownOptions} />
                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="outlined" onClick={() => NavigateTo("/products")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;