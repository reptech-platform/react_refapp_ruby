
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

    const TrackChildChanges = (name) => {

        if (Helper.IsNullValue(backRow[name])) return [];
        const sourceItems = JSON.parse(JSON.stringify(backRow[name]));
        let tmp = JSON.parse(JSON.stringify(row[name]));
        let docKeyId = tmp.find(x => x.type === 'doc')?.key;
        let keyName = tmp.find(x => x.type === 'keyid')['key'];

        let fields = tmp.filter(m => m.type !== 'keyid').map(x => x.key);
        const targetItems = tmp.find(z => z.type === 'keyid')?.values;

        let changes = [];
        let finalChanges = [];

        let tFiltered;
        if (targetItems.length > sourceItems.length) {
            tFiltered = targetItems.filter(mm => mm.action === 'add');
            tFiltered.forEach(x => {
                changes.push({ values: x, fields, keyName, docKeyId, action: 'add' });
            })

        }

        tFiltered = targetItems.filter(mm => mm.action !== 'add');

        for (let sIndex = 0; sIndex < sourceItems.length; sIndex++) {

            const source = sourceItems[sIndex];
            const target = targetItems.find(x => parseInt(x[keyName]) === parseInt(source[keyName]));
            let changeFields = [];
            fields.forEach(mm => {
                let value1 = source[mm] ?? "";
                let value2 = target[mm] ?? "";
                if (value1.toString() !== value2.toString()) {
                    changeFields.push(mm);
                }
            })

            if (changeFields.length > 0) {
                changes.push({ values: target, fields: changeFields, keyName, docKeyId, action: 'edit' });
            } else if (target.action === 'delete') {
                changes.push({ values: target, fields: changeFields, keyName, docKeyId, action: 'delete' });
            }
        }

        if (changes.length > 0) {
            finalChanges = [];

            for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
                let tmp = JSON.parse(JSON.stringify(row[name]));

                let _index = tmp.findIndex(x => x.type === 'keyid');
                delete tmp[_index]['values'];

                let fldInfo = JSON.parse(JSON.stringify(row[name]));

                let item = changes[changeIndex].values;
                let docKeyId = changes[changeIndex].docKeyId;


                fldInfo.forEach(p => {
                    let _value = item[p.key];
                    if (p.type === 'dropdown' && !Helper.IsNullValue(_value)) {
                        _value = dropDownOptions.find(kk => kk.Name === p.source).Values.find(jj => jj[p.nameId] === _value)[p.valueId];
                        if (p.enum) {
                            _value = _value?.toString();
                        }
                    }
                    tmp.find(x => x.key === p.key).value = _value;
                });

                let numfields = Helper.GetAllNumberFields(fldInfo);
                if (numfields.length > 0) Helper.UpdateNumberFields(tmp, numfields);

                // Set Images and streams
                if (!Helper.IsNullValue(item['stream'])) {
                    [`${docKeyId}_Image`, 'stream', 'id'].forEach(x => {
                        let tIndex = tmp.findIndex(m => m.key === docKeyId);
                        tmp[tIndex][x] = item[x];
                    });
                }

                changes[changeIndex].values = tmp;

                finalChanges.push(changes[changeIndex]);

            }

        }

        return finalChanges;
    }

    const OnSubmit = async () => {
        let rslt, data, prodImages, productId, changes, numfields;
        const mapItems = MapItems;

        // Attach inline objects
        let product = row['product'];
        productId = row['product'].find((x) => x.type === 'keyid').value;

        let inlineObjs = childCollections.filter(x => !x.child);

        for (let inLineCnt = 0; inLineCnt < inlineObjs.length; inLineCnt++) {
            let x = inlineObjs[inLineCnt];

            let vObj = {};
            let changes = TrackChanges(x.name);
            if (changes.length > 0) {
                let obj = row[x.name];

                numfields = Helper.GetAllNumberFields(obj);
                if (numfields.length > 0) Helper.UpdateNumberFields(obj, numfields);

                const tmp = Object.values(obj);
                tmp.filter((x) => x.value).map((x) => {
                    if (x.type === 'dropdown' && !Helper.IsNullValue(x.value)) {
                        vObj[x.key] = dropDownOptions.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                    } else if (numberItems.indexOf(x.key) > -1) {
                        if (x.value) vObj[x.key] = parseFloat(x.value);
                    } else {
                        vObj[x.key] = x.value;
                    }
                });
                let _dtKey = row['product'].find((x) => x.type === 'keyid');
                let _data = [_dtKey,
                    { key: x.property, value: vObj, type: "inline" }
                ]

                rslt = await Support.AddOrUpdateProduct(_data, dropDownOptions, ['MainImage', 'OtherImages']);
                if (rslt.status) {
                    productId = rslt.id;
                } else { return; }
            }
        }

        // Add or Update Collection Items

        let isChildExist = mapItems.filter(x => x.child) || [];

        inlineObjs = childCollections.filter(x => x.child) || [];

        if (isChildExist.length > 0 && inlineObjs.length === 0) {
            global.AlertPopup("error", "Atleaset one child item should exist!");
            return;
        }

        for (let parentCnt = 0; parentCnt < inlineObjs.length; parentCnt++) {

            let parentObj = inlineObjs[parentCnt];
            let changes = TrackChildChanges(parentObj.name);

            if (changes.length > 0) {

                for (let changeIndex = 0; changeIndex < changes.length; changeIndex++) {
                    let changeItem = changes[changeIndex];
                    let docKeyId = changes[changeIndex].docKeyId;
                    let newItem = changes[changeIndex].values;
                    let keyName = changes[changeIndex].keyName;
                    let fields = changes[changeIndex].fields;
                    fields.push(keyName);

                    // Add or Update document
                    if (changeItem.fields.indexOf(docKeyId) > -1) {
                        let docIndex = newItem.findIndex(x => x.key === docKeyId);
                        let item = newItem[docIndex];
                        if (!Helper.IsNullValue(item.stream)) {
                            rslt = await Support.AddOrUpdateDocument({ value: item.stream });
                            if (rslt.status) {
                                newItem[docIndex].value = parseInt(rslt.id);
                                delete newItem[docIndex]['stream'];
                                delete newItem[docIndex][`${docKeyId}_Image`];
                            } else { return; }
                        }
                    }

                    let CompId = newItem.find(x => x.key === keyName)?.value;
                    let compProductMapId = productPComponents.find(x =>
                        parseInt(x[keyName]) === parseInt(CompId) && x.Product_id === productId)?.Id;
                    let data = { compProductMapId, ProductId: productId, CompId, action: changeItem.action };

                    if (changeItem.action === 'add') {
                        let _index = newItem.findIndex(x => x.key === keyName);
                        newItem[_index].value = null;
                        data = { ...data, values: newItem };
                    } else if (changeItem.action === 'edit') {
                        let editItem = [];
                        fields.forEach(x => {
                            let item = newItem.find(z => z.key === x);
                            editItem.push(item);
                        })
                        data = { ...data, values: editItem };
                    } else if (changeItem.action === 'delete') {
                        data = { ...data, values: newItem };
                    }

                    rslt = await Support.AddOrUpdateProductComponent(data);
                    if (!rslt.status) {
                        global.AlertPopup("error", "Somthing went wrong to update!");
                        return;
                    }

                }

            }

        }

        // Add Or Update Product
        changes = TrackChanges('product');
        if (changes.length > 0) {

            numfields = Helper.GetAllNumberFields(product);
            if (numfields.length > 0) Helper.UpdateNumberFields(product, numfields);

            rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ['MainImage', 'OtherImages']);
            if (rslt.status) {
                productId = rslt.id;
            } else { return; }
        }

        for (let i = 0; i < mapItems.length; i++) {

            // Check is there any changes
            const mapItem = MapItems[i];
            if (!mapItem.child) {
                changes = TrackChanges(mapItem.uicomponent);
                if (changes.length > 0) {
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

                            // Update Back for next tracking purpose
                            UpdateBackUp(mapItem.target);

                        } else { return; }
                    }
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

        if (_row[uicomponent]) _row[uicomponent] = _rowMap;

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

    useEffect(() => {
        let product = row['product'] || [];
        let uiList = product.filter(x => !Helper.IsNullValue(x.uicomponent));
        uiList.forEach(m => {
            UpdateMappingPannel(row, m, m.value);
        });
    }, [row, dropDownOptions]);

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