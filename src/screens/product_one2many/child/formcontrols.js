import * as React from "react";
import { Box } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import CustomTable from "./customtable";
import Helper from "shared/helper";

const Component = (props) => {

    const { onInputChange, onSubmit, shadow, onTableRowUpdated } = props;
    const form = React.useRef(null);

    const boxShadow = shadow ? "0 1px 5px rgba(0,0,0,.15) !important" : null;
    const borderRadius = shadow ? "3px !important" : null;
    const elementKeys = Object.keys(props.controls);

    const handleSubmit = () => {
        if (onSubmit) onSubmit();
    }

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange(e);
    }

    const OnTableRowUpdated = (e) => {
        const { id, rows, keyIdName, action, data, location } = e;
        let items = rows || [];
        if (action === 'add') {
            const guid = Helper.GetGUID();
            items = [...items, { action, id: guid, [keyIdName]: guid, ...data }];
        } else if (action === 'edit') {
            const updatedItems = [...items];
            const index = updatedItems.findIndex(x => x.id === id);
            updatedItems[index] = { action, ...data };
            items = updatedItems;
        } else if (action === 'delete') {
            let updatedItems = [...items];
            updatedItems.find(x => x.id === id).action = 'delete';
            items = updatedItems;
        }
        if (onTableRowUpdated) onTableRowUpdated({ location, items });
    }

    React.useEffect(() => {
        if (props.setForm) props.setForm(form);
    }, [props, form]);

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                <Box style={{ display: 'block', width: '100%', marginBottom: 5 }}>

                    {elementKeys && elementKeys.map((x, index) => {
                        const { child, UIComponentTitle, values } = props.controls[x].find(z => z.type === 'keyid');
                        if (child) {
                            return (
                                <Box key={index} sx={{ float: "left", minWidth: "95%", margin: 2, boxShadow, borderRadius }}>
                                    <CustomTable location={x} title={UIComponentTitle} mode={props.mode}
                                        controls={props.controls[x]} rows={values.filter(m => m.action !== 'delete')} options={props.options} onTableRowUpdated={OnTableRowUpdated} />
                                </Box>
                            )
                        }
                        return (
                            <Box key={index} sx={{ float: "left", minWidth: "45%", margin: 2, boxShadow, borderRadius }}>
                                <RenderFormContols shadow={true} location={x} mode={props.mode} title={UIComponentTitle}
                                    controls={props.controls[x]} options={props.options} onInputChange={OnInputChange} />
                            </Box>
                        )
                    })}

                </Box>
            </ValidatorForm>
        </Box>
    );

}

export default Component;