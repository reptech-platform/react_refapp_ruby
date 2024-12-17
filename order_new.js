
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Container from "screens/container";
import RenderFormContols from "components/formControls/RenderFormContols";
import { useNavigate } from "react-router-dom";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";
import CustomTable from './child/customtable';
import { Extract } from "./child/extract";
import { SetOrders } from "shared/services";

const numberItems = ['VendorTelephoneNumber', 'DestinationCityCode', 'Pincode', 'Order_item_price', 'Order_item_quantity', 'RMA_number'];

const RenderTableComponent = (props) => {
    const { dataRows, row, title, onTableRowUpdated } = props;

    return (
        <>
            <Box sx={{ float: "left", minWidth: "95%", margin: 2 }}>
                <CustomTable {...props} title={title} configData={row} rows={dataRows} onTableRowUpdated={onTableRowUpdated} />
            </Box>
        </>
    )
}

const RenderFormComponent = (props) => {
    const { row, title, location, onInputChange } = props;

    const boxShadow = "0 1px 5px rgba(0,0,0,.15) !important";
    const borderRadius = "3px !important";

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange({ ...e, location });
    }

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <>
            <Box sx={{ float: "left", minWidth: "95%", margin: 2, boxShadow, borderRadius }}>
                <RenderFormContols shadow={true} location={location} title={title} onInputChange={OnInputChange}
                    controls={row} />
            </Box>
        </>
    )
}

const Component = (props) => {

    const [row, setRow] = useState({});
    const [rowItems, setRowItems] = useState([]);
    const [collections, setCollections] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;
    const form = React.useRef(null);

    const OnTableRowUpdated = (e) => {
        const { id, keyIdName, action, data } = e;
        if (action === 'add') {
            const guid = Helper.GetGUID();
            setRowItems(r => [...r, { id: guid, [keyIdName]: guid, ...data }]);
        } else if (action === 'edit') {
            const updatedItems = [...rowItems];
            const index = updatedItems.findIndex(x => x.id === id);
            updatedItems[index] = data;
            setRowItems(updatedItems);
        }
        else if (action === 'delete') {
            let updatedItems = [...rowItems];
            updatedItems = updatedItems.filter(x => x.id !== id);
            setRowItems(updatedItems);
        }
    }

    const ExtractObject = (input, enums, excludesItems) => {

        let data = {};
        let excludes = excludesItems || [];

        const tmp = Object.values(input);

        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
                if (x.type === 'dropdown') {
                    data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } else if (numberItems.indexOf(x.key) > -1) {
                    if (x.value) data[x.key] = parseFloat(x.value);
                } else {
                    data[x.key] = x.value;
                }
            }
        });

        return data;
    }

    const handleSubmit = async () => {

        let order = row['order'];
        if (Helper.IsNullValue(rowItems) || rowItems.length === 0) {
            global.AlertPopup("error", "Atleast add one order item!");
            return;
        }

        order.filter(x => x.type === 'date').forEach(m => { m.value = `${m.value}T00:00:00.000`; });

        let orderitems = [];
        let keyIdName = row['orderitem'].find(k => k.type === 'keyid').key;
        let dateFields = row['orderitem'].filter(k => k.type === 'date').map(m => m.key);
        rowItems.forEach(x => {
            let _orderItem = Helper.CloneObject(row['orderitem']);
            for (let p in x) {
                let index = _orderItem.findIndex(m => m.key === p);
                if (index > -1) _orderItem[index].value = x[p];
            }
            orderitems.push(ExtractObject(_orderItem, dropDownOptions, [keyIdName]));
        });

        orderitems.forEach(x => {
            dateFields.forEach(m => {
                x[m] = `${x[m]}T00:00:00.000`;
            })
        });

        let data = ExtractObject(order, dropDownOptions);
        data.Items = orderitems;
        data.ShippingAddress = ExtractObject(row['shippingaddress'], dropDownOptions);

        global.Busy(true);
        let rslt = await SetOrders(data);
        global.Busy(false);
        if (rslt.status) {
            global.AlertPopup("success", "Order is created successfully!");
            setInitialized(true);
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }
    }

    const OnInputChange = (e) => {
        const { name, value, location } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = tValue;
            setRow(_row);
            setShowUpdate(true);
        }
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    useEffect(() => {
        setShowButton(true);
    }, []);

    const fetchData = async () => {
        setCollections([]);
        setRow([]);
        setDropDownOptions([]);
        await Extract().then(rslt => {
            const { collections, row, options } = rslt;
            setCollections(collections);
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
                                onClick={() => NavigateTo("/orders")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <Box sx={{ width: '100%' }}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Box style={{ display: 'block', width: '100%', marginBottom: 5 }}>
                            {collections && collections.length > 0 && collections.map((x, index) => {
                                if (x.child) {
                                    return <RenderTableComponent onTableRowUpdated={OnTableRowUpdated} dataRows={rowItems}
                                        shadow={true} key={index} {...props} title={x.title} row={row[x.name]} />
                                } else {
                                    return <RenderFormComponent location={x.name} key={index} {...props} onInputChange={OnInputChange}
                                        title={x.title} row={row[x.name]} />
                                }
                            })}
                        </Box>
                    </ValidatorForm>
                </Box>

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