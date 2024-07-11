import * as React from "react";
import {
    TableContainer, Table, TableBody, TableCell, TableRow, Paper,
    Box, Typography,
    Stack,
    Button
} from '@mui/material';
import { TextInput, ColorPicker, FileInput, CheckInput, DropDown, DateTimePicker } from "components";
import { ValidatorForm } from 'react-material-ui-form-validator';

const RenderAuthContols = ({ mode, title, controls, productTypes, onInputChange }) => {
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
            <TableContainer component={Paper} sx={{ boxShadow: 0,width:"100%" }}>
                <Table sx={{ display: 'tableis', width: '100%', border: 0, }}>
                    <TableBody>
                        {controls && controls.filter((z) => !z.nocreate).map((x, i) => {
                            return (
                                <TableRow key={i}>
                                    {x.label && (
                                        <TableCell align="right" sx={{ verticalAlign: "top", paddingTop, border: 0, whiteSpace: "nowrap" }}>
                                            {x.type === 'check' || !x.label && (' ')}
                                            {x.type !== 'check' && (
                                                <Typography nowrap="true" variant="labelheader">{x.label}{IsMandatory(x.validators)}</Typography>)}
                                        </TableCell>
                                    )}
                                    <TableCell sx={{ border: 0, width: "100%" }}>
                                        {x.type === 'text' && (
                                            <TextInput mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{width:"100%"}} editable={x.editable}/>
                                        )}
                                        {x.type === 'password' && (
                                            <TextInput mode={mode} id={x.key} type={x.type} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{width:"100%"}} editable={x.editable}/>
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

    const { onInputChange, onSubmit, controls, formSubmit } = props;
    const form = React.useRef(null);

    const handleSubmit = () => {
        if (onSubmit) onSubmit();
    }

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange(e);
    }


    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }
    return (
        <Box sx={{ width: '100%' }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Stack direction="column" sx={{ width: "100%", margin: 2 }}>
                        <RenderAuthContols mode={props.mode} controls={controls} onInputChange={OnInputChange} />
                    </Stack>
                </Box>
                <Button color="primary" variant="contained" sx={{bgcolor:"#2E2E2E",color:"#fff",width:"100%"}} onClick={(e) => OnSubmitForm(e)}>
                 {formSubmit}
                </Button>
            </ValidatorForm>
        </Box>
    );

}

export default Component;