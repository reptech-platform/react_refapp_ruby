import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Delete } from '@mui/icons-material';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import RenderFormContols from "./child/formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const Component = (props) => {
    const { title } = props;
    const [form, setForm] = useState(null);
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [showUpdate, setShowUpdate] = useState(false);
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const TrackChanges = (name) => {
        if (Helper.IsNullValue(backRow[name])) return [];
        const source = JSON.parse(JSON.stringify(backRow[name]));
        const target = JSON.parse(JSON.stringify(row[name]));

        let changes = [];
        for (let prop of source) {
            let value1 = source.find((x) => x.key === prop.key).value ?? "";
            let value2 = target.find((x) => x.key === prop.key).value ?? "";

            if (prop.key === 'MainImage') {
                value1 = value1 ?? "";
                value2 = value2 ?? "";
            } else if (prop.key === 'OtherImages') {
                if (value1.length === 0 && value2.length > 0) {
                    value2.forEach(e => {
                        changes.push({ key: prop.key, index: e.index, value: e.DocData });
                    });
                } else {

                    // Check any deleted images
                    value1.forEach(e => {
                        let index = value2.findIndex(x => x.DocData === e.DocData);
                        if (index === -1) {
                            changes.push({ key: prop.key, index: e.index, Delete: true });
                        }
                    });

                    // Check any new images
                    value2.forEach(e => {
                        let index = value1.findIndex(x => x.DocData === e.DocData);
                        if (index === -1) {
                            changes.push({ key: prop.key, index: e.index, value: e.DocData });
                        }
                    });
                }
            }
            if (prop.key !== 'OtherImages' && value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const UpdateBackUp = (name) => {
        if (name) {
            let obj = Helper.CloneObject(row[name]);
            let bItems = [];
            for (let prop of obj) {
                bItems.push({ key: prop.key, value: prop.value });
            }
            setBackupRow((prev) => ({ ...prev, [name]: bItems }));
            setState(!state);
        }
    }

    const OnSubmit = async () => {
        let rslt, data, changes = [], productId, product, numfields;

        product = row['product'];
        productId = row['product'].find((x) => x.type === 'keyid').value;

        for (let i = 0; i < MapItems.length; i++) {
            // Check is there any changes
            const mapItem = MapItems[i];

            if (!Helper.IsJSONEmpty(mapItem.navpropname)) {
                changes = TrackChanges(mapItem.uicomponent);
                if (changes.length > 0) {
                    // Check any excluded items are configured
                    let tmp = changes.filter((x) => mapItem.exclude.indexOf(x) === -1);
                    if (tmp.length > 0) {
                        let newObject = row[mapItem.uicomponent];
                        numfields = Helper.GetAllNumberFields(newObject);
                        if (numfields.length > 0) Helper.UpdateNumberFields(newObject, numfields);
                        rslt = await mapItem.func(newObject, dropDownOptions, mapItem.exclude);
                        if (rslt.status) {
                            newObject.find((x) => x.type === 'keyid').value = rslt.id;
                            if (Helper.IsNullValue(mapItem.navpropname)) productId = rslt.id;

                            const mapPropKey = product.find(x => x.uicomponent === mapItem.uicomponent).key;
                            data = [
                                { key: "Product_id", value: parseInt(productId) },
                                { key: mapPropKey, value: parseInt(rslt.id) }
                            ];
                            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                            if (!rslt.status) return;

                            // Update Back for next tracking purpose
                            UpdateBackUp(mapItem.target);
                        } else { return; }
                    }
                }
            }

        }

        // Add or Update Product Main Image
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.indexOf('MainImage') > -1) {
            data = product.find((x) => x.key === 'MainImage');
            let entityTypeKeyName = data?.entityTypeKeyName;
            let entityTypeName = data?.entityTypeName;
            if (!Helper.IsNullValue(entityTypeKeyName)) {
                let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                rslt = await docFuns.setFun(data.value, entityTypeKeyName);
                if (rslt.status) {
                    let newImageId = parseInt(rslt.id);
                    data = [
                        { key: "Product_id", value: parseInt(productId) },
                        { key: "ProductMainImage", value: newImageId }
                    ];
                    rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                    if (!rslt.status) return;

                } else { return; }
            }
        }

        // Add or Update Product Other Images
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.findIndex(x => x.key === 'OtherImages') > -1) {
            changes = changes.filter(x => x.key === 'OtherImages');
            let data = product.find((x) => x.key === 'OtherImages');
            let entityTypeKeyName = data?.entityTypeKeyName;
            let entityTypeName = data?.entityTypeName;
            if (!Helper.IsNullValue(entityTypeKeyName)) {
                let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
                    let change = changes[changeIndex];
                    if (!change.Deleted) {
                        rslt = await docFuns.setFun(change.value, entityTypeKeyName);
                        if (rslt.status) {
                            let newImageId = parseInt(rslt.id);
                            data = [
                                { key: "Product_id", value: parseInt(productId) },
                                { key: entityTypeKeyName, value: newImageId }
                            ];
                            rslt = await Support.AddOrUpdateProductOtherImages(data);
                            if (!rslt.status) return;
                        } else { return; }
                    }

                }
            }
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
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = value;
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

    const fetchData = async () => {

        await Extract(id).then(rslt => {
            const { row, options, backRow } = rslt;
            setRow(row);
            setDropDownOptions(options);
            setBackupRow(backRow);
            setState(!state);
        })

    };

    if (initialized) { setInitialized(false); fetchData(); }

    useEffect(() => { setInitialized(true); }, [id]);

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