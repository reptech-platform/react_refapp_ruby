import * as React from "react";
import { TableContainer, Table, TableBody, TableCell, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { TextInput, ColorPicker, FileInput, CheckInput, DropDown, DateTimePicker } from "components";
import { Edit as EditIcon } from "@mui/icons-material";

const Component = (props) => {

    const { mode, step, title, review, controls, options, onInputChange,
        location, onEditClicked, shadow, excludes, excludestepper } = props;

    const paddingTop = mode && mode === 'view' ? undefined : 3;
    const headerVariant = shadow ? "subheadercenter" : "subheader";

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange({ ...e, location });
    }

    const OnEditClicked = (e) => {
        e.preventDefault();
        if (onEditClicked) onEditClicked(step);
    }

    const IsMandatory = (e) => {
        if (!e) return false;
        return e.findIndex((x) => x && x.toLowerCase() === 'required') > -1;
    }

    const GetDropDownOptions = (e) => {
        return options.find((x) => x.Name === e)?.Values;
    }

    const GetFilters = (e) => {
        let tmp = controls && controls.filter((z) => !z.nocreate) || [];
        if (excludestepper) {
            tmp = tmp.filter((x) => !x.nostepper);
        }

        if (excludes) {
            tmp = tmp.filter((x) => excludes.indexOf(x.key) === -1);
        }
        return tmp;
    }

    return (
        <>
            <Typography variant={headerVariant}>
                {review && (
                    <>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="Edit"
                            sx={{ width: 18, height: 18, margin: 0, padding: 0 }}
                            onClick={(e) => OnEditClicked(e)}
                        >
                            <EditIcon color="primary" sx={{ width: 18, height: 18 }} />
                        </IconButton>
                        &nbsp;
                    </>
                )}
                {title}
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table sx={{ display: 'table', width: '100%', border: 0, }}>
                    <TableBody>
                        {GetFilters().map((x, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell align="right" sx={{ verticalAlign: "top", paddingTop, border: 0, whiteSpace: "nowrap" }}>
                                        {x.type === 'check' && (' ')}
                                        {x.type !== 'check' && (
                                            <Typography nowrap="true" variant="labelheader">{x.label}{IsMandatory(x.validators) && (mode !== 'view' && <Typography variant="mandatory">*</Typography>)}</Typography>)}
                                    </TableCell>
                                    <TableCell sx={{ border: 0, width: "100%" }}>
                                        {x.type === 'text' && (
                                            <TextInput mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'check' && (
                                            <CheckInput mode={mode} label={x.label} id={x.key} name={x.key} value={x.value || x.default}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}

                                        {x.type === 'color' && (
                                            <ColorPicker mode={mode} id={x.key} name={x.key} value={x.value} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'doc' && (
                                            <FileInput mode={mode} id={x.key} name={x.key} type={x.type} docName={x.value?.DocName} docType={x.value?.DocExt} docData={x.value?.DocData}
                                                validators={x.validators} validationMessages={x.validationMessages}
                                                acceptTypes={x.accept} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'date' && (
                                            <TextInput type="date" mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'datetime' && (
                                            <DateTimePicker mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'dropdown' && (
                                            <DropDown mode={mode} id={x.key} name={x.key} value={x.value} options={GetDropDownOptions(x.source)} valueId={x.valueId} size="small"
                                                nameId={x.nameId} contentId={x.contentId} defaultLabel={`Select ${x.label}`}
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

export default Component;