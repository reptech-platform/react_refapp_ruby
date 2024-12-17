
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

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
        let rslt, data, prodImages, productId, numfields;
        const mapItems = MapItems;

        let product = row['product'];
        numfields = Helper.GetAllNumberFields(product);
        if (numfields.length > 0) Helper.UpdateNumberFields(product, numfields);

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            productId = rslt.id;
        } else { return; }

        for (let i = 0; i < mapItems.length; i++) {
            // Add or Update the product and navigation entity if it is deos not exist
            let navItem = product.find(x => x.uicomponent === mapItems[i].uicomponent);
            if (!Helper.IsJSONEmpty(navItem) && Helper.IsNullValue(navItem.value)) {

                let childItem = row[navItem.uicomponent];
                numfields = Helper.GetAllNumberFields(childItem);
                if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

                rslt = await mapItems[i].func(childItem, dropDownOptions);
                if (rslt.status) {
                    data = [
                        { key: "Product_id", value: parseInt(productId) },
                        { key: navItem.key, value: parseInt(rslt.id) }
                    ];
                    rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                    if (!rslt.status) return;

                } else { return; }
            }
        }

        // Add Product Main Image
        prodImages = product.find((x) => x.key === 'MainImage');
        if (prodImages && !Helper.IsNullValue(prodImages.value)) {
            rslt = await Support.AddOrUpdateDocument(prodImages);
            if (rslt.status) {
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductMainImage", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                if (!rslt.status) return;
            } else { return; }
        }

        // Add Product Other Images
        prodImages = product.find((x) => x.key === 'OtherImages').value;
        if (prodImages && !Helper.IsNullValue(prodImages.value)) {
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
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = tValue;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['uicomponent'])) {
                UpdateMappingPannel(_row, item, tValue);
            }
        }
    }

    const UpdateMappingPannel = (_row, item, value) => {

        const { uicomponent, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = value ? Values.find(x => x[valueId] === value) : null;
        let _rowMap = _row[uicomponent] || [];

        for (let i = 0; i < _rowMap.length; i++) {

            let tmpField = _rowMap[i];
            let bEditable = true;
            let _cValue = null;

            if (!Helper.IsNullValue(obj)) {
                _cValue = obj[tmpField.key];
                if (tmpField.type === 'dropdown') {
                    const _dValues = dropDownOptions.find(x => x.Name === _rowMap[i].source).Values;
                    _cValue = _dValues.find(x => x.Name === _cValue)[_rowMap[i].valueId];
                } else if (tmpField.type === 'date') {
                    _cValue = Helper.ToDate(_cValue, "YYYY-MM-DD");
                }
                bEditable = false;
            }

            tmpField.editable = bEditable;
            tmpField.value = _cValue;

            _rowMap[i] = tmpField;

        }
        if (_row[uicomponent]) _row[uicomponent] = _rowMap;
        setRow(_row);
        setState(!state);
    };

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    useEffect(() => {
        setShowButton(true);
    }, []);

    const fetchData = async () => {
        await Extract().then(rslt => {
            const { row, options } = rslt;
            setRow(row);
            setDropDownOptions(options);
            setState(!state);
        })
    };

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