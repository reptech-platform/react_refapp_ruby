import * as React from "react";
import {
    TableContainer, Table, TableBody, TableCell, TableRow, Paper,
    Box, Typography
} from '@mui/material';
import { TextInput, ColorPicker, FileInput, CheckInput, DropDown, DateTimePicker } from "components";
import { ValidatorForm } from 'react-material-ui-form-validator';

const RenderFormContols = ({ mode, title, controls, productTypes, onInputChange }) => {

    const paddingTop = mode && mode === 'view' ? undefined : 3;

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange(e);
    }

    const IsMandatory = (e) => {
        if (!e) return false;
        return e.findIndex((x) => x && x.toLowerCase() === 'required') > -1;
    }

    return (
        <>
            <Typography variant="subheader">{title}</Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table sx={{ display: 'tableis', width: '100%', border: 0, }}>
                    <TableBody>
                        {controls && controls.filter((z) => !z.nocreate).map((x, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell align="right" sx={{ verticalAlign: "top", paddingTop, border: 0, whiteSpace: "nowrap" }}>
                                        {x.type === 'check' && (' ')}
                                        {x.type !== 'check' && (
                                            <Typography nowrap="true" variant="labelheader">{x.label}{IsMandatory(x.validators) && (!mode && <Typography variant="mandatory">*</Typography>)}</Typography>)}
                                    </TableCell>
                                    <TableCell sx={{ border: 0, width: "100%" }}>
                                        {x.type === 'text' && (
                                            <TextInput mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'check' && (
                                            <CheckInput mode={mode} label={x.label} id={x.key} name={x.key} value={x.value || x.default}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'color' && (
                                            <ColorPicker mode={mode} id={x.key} name={x.key} value={x.value} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'file' && (
                                            <FileInput mode={mode} id={x.key} name={x.key} value={x.value} fileName={x.fileName}
                                                validators={x.validators} validationMessages={x.validationMessages}
                                                acceptTypes=".JPG,.JPEG,.PNG" OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'date' && (
                                            <TextInput type="date" mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />

                                        )}
                                        {x.type === 'datetime' && (
                                            <DateTimePicker mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'dropdown' && (
                                            <DropDown mode={mode} id={x.key} name={x.key} value={x.value} options={productTypes} valueId="ProductTypeCode" size="small"
                                                nameId="ProductTypeCode" contentId="ProductTypeDescription" sx={{ width: 250 }} style={{ width: 250 }}
                                                validators={x.validators} validationMessages={x.validationMessages} onDropDownChange={OnInputChange} />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

}

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
                        <RenderFormContols mode={props.mode} productTypes={props.productTypes} title={"Types"} controls={props.controls.types} onInputChange={OnInputChange} />
                    </Box>
                </Box>
            </ValidatorForm>
        </Box>
    );

}

export default Component;