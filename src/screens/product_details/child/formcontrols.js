import * as React from "react";
import { Box } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";

const Component = (props) => {

    const { onInputChange, onSubmit } = props;
    const form = React.useRef(null);

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
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "49%", margin: 2 }}>
                        <RenderFormContols mode={props.mode} title={"Details"} controls={props.controls.details} onInputChange={OnInputChange} />
                    </Box>
                    <Box sx={{ width: "49%", margin: 2 }}>
                        <RenderFormContols mode={props.mode} title={"Others"} controls={props.controls.others} onInputChange={OnInputChange} />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "49%", margin: 2 }}>
                        <RenderFormContols mode={props.mode} options={props.productTypes} title={"Types"} controls={props.controls.types} onInputChange={OnInputChange} />
                    </Box>
                </Box>
            </ValidatorForm>
        </Box>
    );

}

export default Component;