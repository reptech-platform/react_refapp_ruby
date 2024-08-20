
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import RenderFormContols from "./child/formcontrols";
import { useNavigate, useParams } from "react-router-dom";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const numberItems = ['Pincode'];

const Component = (props) => {

    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);
    const [productPComponents, setProductPComponents] = useState([]);

    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const TrackChanges = (name) => {
        if (Helper.IsNullValue(backRow[name])) return [];
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

    const OnSubmit = async () => {
        let rslt, data, prodImages, productId, changes;
        const mapItems = MapItems;

        // Attach inline objects
        let product = row['product'];
        productId = row['product'].find((x) => x.type === 'keyid').value;

        let inlineObjs = childCollections.filter(x => !x.child);
        inlineObjs.forEach(x => {
            let vObj = {};
            let obj = row[x.name];
            const tmp = Object.values(obj);
            tmp.filter((x) => x.value).map((x) => {
                if (x.type === 'dropdown') {
                    vObj[x.key] = dropDownOptions.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } else if (numberItems.indexOf(x.key) > -1) {
                    if (x.value) vObj[x.key] = parseFloat(x.value);
                } else {
                    vObj[x.key] = x.value;
                }
            });
            product.push({ key: x.property, value: vObj, type: "inline" });
        });

        // Add or Update Collection Items
        let updateChild = [];
        inlineObjs = childCollections.filter(x => x.child) || [];
        inlineObjs.forEach(x => {
            let _obj = row[x.name].find(z => z.type === 'keyid');
            let _values = _obj?.values;
            let _keyId = _obj?.key;
            let filterRowItems = Helper.CloneObject(_values).filter(x => ['add', 'edit', 'delete'].indexOf(x.action) > -1);
            filterRowItems.forEach(m => {
                delete m['id'];
                switch (m['action']) {
                    case 'add': break;
                    case 'edit': m.Edited = true; break;
                    case 'delete': m.Deleted = true; break;
                }
                if (m['action'] === 'delete') {
                    m.Deleted = true;
                } else if (m['action'] === 'add') {
                    delete m[_keyId];
                }
                delete m['id'];
                delete m['action'];
            });

            filterRowItems.forEach(m => updateChild.push(m));

        });

        if (inlineObjs.length === 0) {
            global.AlertPopup("error", "Atleaset one child item should exist!");
            return;
        }

        // Add Or Update Product
        changes = TrackChanges('product');
        if (changes.length > 0) {
            rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ['MainImage', 'OtherImages']);
            if (rslt.status) {
                productId = rslt.id;
            } else { return; }
        }

        let bAllStatus = false;
        for (let i = 0; i < updateChild.length; i++) {
            let _data = updateChild[i];
            let compProductMapId = null;
            if (_data.Deleted && !Helper.IsNullValue(_data.CompId)) {
                compProductMapId = productPComponents.find(x => x.CompId === _data.CompId && x.Product_id === productId).Id;
            }
            rslt = await Support.AddOrUpdateProductComponent(compProductMapId, productId, _data);
            bAllStatus = !bAllStatus ? rslt.status : bAllStatus;
        }

        if (!bAllStatus && updateChild.length > 0) {
            global.AlertPopup("error", "Somthing went wrong to update!");
            return;
        }

        for (let i = 0; i < mapItems.length; i++) {

            // Check is there any changes
            const mapItem = MapItems[i];
            changes = TrackChanges(mapItem.uicomponent);
            if (changes.length > 0) {
                // Add or Update the product and navigation entity if it is deos not exist
                let navItem = product.find(x => x.uicomponent === mapItems[i].uicomponent);
                if (!Helper.IsJSONEmpty(navItem)) {
                    rslt = await mapItems[i].func(row[navItem.uicomponent], dropDownOptions);
                    if (rslt.status) {
                        data = [
                            { key: "Product_id", value: parseInt(productId) },
                            { key: navItem.key, value: parseInt(rslt.id) }
                        ];
                        rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                        if (!rslt.status) return;

                        // Update Back for next tracking purpose
                        UpdateBackUp(mapItem.target);

                    } else { return; }
                }
            }
        }

        // Add Product Main Image
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.indexOf('MainImage') > -1) {
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
        }

        // Add Product Other Images
        changes = TrackChanges('product');
        if (changes.length > 0 && changes.indexOf('OtherImages') > -1) {
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
        }

        global.AlertPopup("success", "Product is created successfully!");
        setShowUpdate(false);
        NavigateTo("/productsmany");
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

        if ( _row[uicomponent] ) _row[uicomponent] = _rowMap;

        setRow(_row);
        setState(!state);
    };

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const fetchData = async () => {
        await Extract(id).then(rslt => {
            const { row, options, collections, mapitems, backRow } = rslt;
            setRow(row);
            setChildCollections(collections);
            setDropDownOptions(options);
            setProductPComponents(mapitems);
            setBackupRow(backRow);
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
    useEffect(() => { setInitialized(true); }, [id]);

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