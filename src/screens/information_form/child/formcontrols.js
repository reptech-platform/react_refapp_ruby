import * as React from "react";
import { Box } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";

const Component = (props) => {

    const { onInputChange, onSubmit, shadow } = props;
    const form = React.useRef(null);

    const boxShadow = shadow ? "0 1px 5px rgba(0,0,0,.15) !important" : null;
    const borderRadius = shadow ? "3px !important" : null;

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
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderFormContols shadow={true} location="producttype" mode={props.mode} title={"Product Type"} controls={props.controls.producttype} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderFormContols excludestepper={true} shadow={true} location="product" mode={props.mode} title={"Product"} controls={props.controls.product} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderFormContols shadow={true} location="otherdetails" mode={props.mode} title={"Other Details"} controls={props.controls.otherdetails} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Box>
                {/* 
                
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderFormContols shadow={true} location="productprice" mode={props.mode} title={"Product Price"}
                            controls={props.controls.productprice} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Box> */}
            </ValidatorForm>
        </Box>
    );

}

export default Component;