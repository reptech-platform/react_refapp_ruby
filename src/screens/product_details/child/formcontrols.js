import * as React from "react";
import { Box } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";

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
                        const title = props.controls[x].find(z => z.type === 'keyid').UIComponentTitle;
                        return (
                            <Box key={index} sx={{ float: "left", minWidth: "45%", margin: 2, boxShadow, borderRadius }}>
                                <RenderFormContols shadow={true} location={x} mode={props.mode} title={title}
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