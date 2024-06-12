import * as React from "react";
import { Box } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import CustomTable from "./customtable";

const Component = (props) => {

    const { onInputChange, onSubmit, shadow } = props;
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
                        const { child, UIComponentTitle } = props.controls[x].find(z => z.type === 'keyid');
                        if (child) {
                            return (
                                <Box key={index} sx={{ float: "left", minWidth: "95%", margin: 2, boxShadow, borderRadius }}>
                                    <CustomTable location={x} title={UIComponentTitle} mode={props.mode} controls={props.controls[x]} options={props.options} />
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