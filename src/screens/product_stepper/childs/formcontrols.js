import * as React from "react";
import { Box, Grid } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";

const Component = (props) => {
    const { onInputChange, onSubmit, type, review, shadow, onStepClicked } = props;
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

    const OnEditClicked = (e) => {
        if (onStepClicked) onStepClicked(e);
    }

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                {review ? (
                    <>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "10px" }}>
                            <Box sx={{ width: "100%", boxShadow, borderRadius }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludes={['ProductOptionType']} excludestepper={props.excludestepper}
                                    title={"Product Type"} shadow={shadow} step={0} options={props.enums} controls={props.row['producttype']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "10px" }}>
                            <Box sx={{ width: "100%", boxShadow, borderRadius }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludestepper={props.excludestepper}
                                    title={"Product"} shadow={shadow} step={1}
                                    options={props.enums} controls={props.row['product']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "10px" }}>
                            <Box sx={{ width: "100%", boxShadow, borderRadius }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludestepper={props.excludestepper}
                                    title={"Other Details"} shadow={shadow} step={2}
                                    options={props.enums} controls={props.row['otherdetails']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "10px" }}>
                            <Box sx={{ width: "100%", boxShadow, borderRadius }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludestepper={props.excludestepper}
                                    title={"Product Price"} shadow={shadow} step={3}
                                    options={props.enums} controls={props.row['productprice']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box style={{ display: 'flex', width: '100%' }}>
                            <Box sx={{ width: `100%`, margin: 2 }}>
                                <RenderFormContols mode={props.mode} excludestepper={props.excludestepper} options={props.enums} controls={props.row[type]} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                    </>
                )}
            </ValidatorForm>
        </Box>
    );

};

export default Component;