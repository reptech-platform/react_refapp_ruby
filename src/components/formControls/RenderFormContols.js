import * as React from "react";
import { TableContainer, Table, TableBody, TableCell, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { TextInput, ColorPicker, FileInput, CheckInput, DropDown, DateTimePicker } from "components";
import { Edit as EditIcon } from "@mui/icons-material";


const RenderUploadDocument = (props) => {

    const { mode, name, type, acceptTypes, value, validators, validationMessages, width, onInputChange } = props;

    const [values, setValues] = React.useState([]);
    const [state, setState] = React.useState(false);

    const OnInputChange = (e) => {
        const nvalue = e.value;
        let tmp = values || [];
        tmp[nvalue.index] = nvalue;
        setValues(tmp);
        if (onInputChange) onInputChange({ name, value: tmp });
        setState(!state);
    }

    const OnAddMoreClicked = (e) => {
        e.preventDefault();
        let tmp = values || [];
        tmp.push({ index: tmp.length });
        setValues(tmp);
        setState(!state);
    }

    const OnDeleteClicked = (e, index) => {
        e.preventDefault();
        let tmp = values || [];
        if (tmp.length > 0) {
            tmp = tmp.filter((x) => x.index !== index);
            tmp.forEach((x, index) => x.index = index);
            setValues(tmp);
            if (onInputChange) onInputChange({ name, value: tmp });
            setState(!state);
        }
    }

    React.useEffect(() => {
        let tmp = value || [{ index: 0 }];
        setValues(tmp);
    }, [value]);

    return (
        <>
            {values && values.length > 0 && values.map((x) => (
                <FileInput key={x.index} mode={mode} id={name} name={name} type={type} value={x} index={x.index} count={values.length}
                    validators={validators} validationMessages={validationMessages} sx={{ width: width }} addmore={true} onDeleteClicked={OnDeleteClicked}
                    acceptTypes={acceptTypes} OnInputChange={OnInputChange} onAddMoreClicked={OnAddMoreClicked} />
            ))}
        </>
    );
}

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
        let tmp = controls && controls.filter((z) => !z.nocreate && z.type !== "keyid") || [];
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
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} />
                                        )}
                                        {x.type === 'check' && (
                                            <CheckInput mode={mode} label={x.label} id={x.key} name={x.key} value={x.value || x.default}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} />
                                        )}

                                        {x.type === 'color' && (
                                            <ColorPicker mode={mode} id={x.key} name={x.key} value={x.value} OnInputChange={OnInputChange} sx={{ width: x.width }} />
                                        )}
                                        {!x.multiple && x.type === 'doc' && (
                                            <FileInput mode={mode} id={x.key} name={x.key} type={x.type} value={x.value}
                                                validators={x.validators} validationMessages={x.validationMessages} sx={{ width: x.width }}
                                                acceptTypes={x.accept} OnInputChange={OnInputChange} />
                                        )}
                                        {x.multiple && x.type === 'doc' && (
                                            <RenderUploadDocument mode={mode} name={x.key} type={x.type} value={x.value}
                                                validators={x.validators} validationMessages={x.validationMessages} width={x.width}
                                                acceptTypes={x.accept} onInputChange={OnInputChange} />
                                        )}
                                        {x.type === 'date' && (
                                            <TextInput type="date" mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} />
                                        )}
                                        {x.type === 'datetime' && (
                                            <DateTimePicker mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                                validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} />
                                        )}
                                        {x.type === 'dropdown' && (
                                            <DropDown mode={mode} id={x.key} name={x.key} value={x.value} options={GetDropDownOptions(x.source)} valueId={x.valueId} size="small"
                                                nameId={x.nameId} contentId={x.contentId} defaultLabel={`Select ${x.label}`} sx={{ width: x.width }}
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