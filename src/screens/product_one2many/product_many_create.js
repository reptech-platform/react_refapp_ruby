
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const numberItems = ['Pincode'];

const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);
    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data, prodImages, productId, numfields;
        const mapItems = MapItems;

        // Attach inline objects
        let product = row['product'];

        numfields = Helper.GetAllNumberFields(product);
        if (numfields.length > 0) Helper.UpdateNumberFields(product, numfields);

        let inlineObjs = childCollections.filter(x => !x.child);
        inlineObjs.forEach(x => {
            let vObj = {};
            let obj = row[x.name];

            numfields = Helper.GetAllNumberFields(obj);
            if (numfields.length > 0) Helper.UpdateNumberFields(obj, numfields);

            const tmp = Object.values(obj);
            tmp.filter((x) => x.value).map((x) => {
                if (x.type === 'dropdown') {
                    vObj[x.key] = dropDownOptions.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } else {
                    vObj[x.key] = x.value;
                }
            });
            product.push({ key: x.property, value: vObj, type: "inline" });
        });

        inlineObjs = childCollections.filter(x => x.child);
        inlineObjs.forEach(x => {
            let obj = row[x.name];
            let _values = obj.find(z => z.type === 'keyid')?.values;
            let valueList = [];
            _values.forEach(m => {
                ['action', 'CompId', 'id'].forEach(z => delete m[z]);
                let oValues = Object.keys(m);
                let newFldList = [];
                oValues.forEach(z => {
                    let fld = obj.find(k => k.key === z);
                    fld.value = m[z];
                    if (fld.type === 'dropdown') {
                        fld.value = dropDownOptions.find((zz) => zz.Name === fld.source).Values.find((kk) => kk[fld.nameId] === fld.value)[fld.valueId];
                        if (fld.enum) {
                            fld.value = fld.value?.toString();
                        }
                    }

                    newFldList.push(fld);
                });

                numfields = Helper.GetAllNumberFields(newFldList);
                if (numfields.length > 0) Helper.UpdateNumberFields(newFldList, numfields);

                let tmp2 = {};

                newFldList.forEach(j => {
                    tmp2 = { ...tmp2, [j.key]: j.value };
                });

                valueList.push(tmp2);

            });

            product.push({ key: x.property, value: valueList, type: "collections" });
        });

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
        prodImages = product.find((x) => x.key === 'OtherImages');
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

    const fetchData = async () => {
        await Extract().then(rslt => {
            const { row, options, collections } = rslt;
            setRow(row);
            setChildCollections(collections);
            setDropDownOptions(options);
            setState(!state);
        })
    };

    const OnTableRowUpdated = (e) => {
        const { location, items } = e;
        let _row = { ...row };
        _row[location].find(x => x.type === 'keyid').values = items;
        setRow(_row);
        setShowUpdate(true);
    }

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
                                onClick={() => NavigateTo("/productsmany")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange} onTableRowUpdated={OnTableRowUpdated}
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