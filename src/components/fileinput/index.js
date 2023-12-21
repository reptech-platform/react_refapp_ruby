import * as React from "react";
import { Link } from "react-router-dom";
import { TextValidator } from 'react-material-ui-form-validator';
import { InputAdornment, IconButton, Typography, Table, TableBody, TableRow, TableCell, Tooltip } from '@mui/material';
import { FindInPage, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Helper from "shared/helper";
import { Image } from "components";

const Images = ["JPG", "JPEG", "PNG"];

const Component = (props) => {

    const { mode, index, id, name, type, value, OnInputChange, addmore, onAddMoreClicked, count, onDeleteClicked,
        style, sx, acceptTypes, validators, validationMessages, alt } = props;

    const [inputValue, setInputValue] = React.useState("");

    const [iDocId, setIDocId] = React.useState();
    const [iDocType, setIDocType] = React.useState();
    const [iDocData, setIDocData] = React.useState();

    const [error, setError] = React.useState(null);

    let fileRef = React.createRef();

    const OnFileBrowseClicked = () => {
        setError(null);
        fileRef.click();
    }

    const OnFileInputChanged = (e) => {
        e.preventDefault();
        setError(null);
        setIDocData(null);
        let _file = e.target.files[0];
        if (!Helper.IsNullValue(_file)) {
            let _ext = _file.name.split(".").pop();
            let _index = acceptTypes.toUpperCase().split(",").findIndex((x) => x === `.${_ext.toUpperCase()}`);
            if (_index === -1) {
                setInputValue(null);
                // eslint-disable-next-line
                let tmp = `Supported Format: ${acceptTypes.toUpperCase().replace(/\./g, "").replace(/\,/g, ", ")}`;
                setError(tmp);
            } else {
                ReadDocument(_file);
            }
        }
    }

    const ReadDocument = (input) => {
        var reader = new FileReader();
        reader.onload = (e) => {
            setIDocData(e.target.result);
            setInputValue(input.name);

            const iDocName = input.name.split(".")[0];
            const tDocType = input.type;
            const iDocExt = input.name.split(".").pop().toUpperCase();
            const tDocData = e.target.result;

            if (OnInputChange) {
                OnInputChange({
                    name, value: {
                        index, DocId: iDocId, DocName: iDocName, DocExt: iDocExt,
                        DocType: tDocType, DocData: tDocData
                    }, type
                });
            }
        };
        reader.readAsDataURL(input);
    }

    const OnAddMoreClicked = (e) => {
        if (onAddMoreClicked) onAddMoreClicked(e);
    }

    const OnDeleteClicked = (e) => {
        if (onDeleteClicked) onDeleteClicked(e, index);
    }

    React.useEffect(() => {
        setIDocType(null);
        if (inputValue) {
            let tmp = inputValue.split(".").pop().toUpperCase(); setIDocType(tmp);
        }
    }, [inputValue]);

    React.useEffect(() => {
        let tValue = "";
        if (value) {
            tValue = value.DocName && value.DocExt && `${value.DocName}.${value.DocExt}`;
            setInputValue(tValue);
            setIDocId(value.DocId);
            setIDocType(value.DocExt);
            setIDocData(value.DocData);
        }
    }, [value]);

    return (
        <>
            {mode && mode === 'view' ? (
                <>
                    <Typography>{inputValue}</Typography>
                </>
            ) : (
                <>

                    <Table sx={{ display: 'table', width: '100%', p: 0, m: 0, border: 0, ...sx }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ p: 0, m: 0, border: 0, ...sx }}>
                                    <TextValidator
                                        autoComplete="off"
                                        id={id}
                                        size="small"
                                        name={name}
                                        disabled
                                        value={inputValue || ""}
                                        validators={validators}
                                        errorMessages={validationMessages}
                                        InputLabelProps={{ shrink: false }}
                                        style={{
                                            minWidth: 250,
                                            ...style
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                paddingLeft: "1px"
                                            },
                                            "& label": {
                                                display: "none"
                                            },
                                            ...sx
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton
                                                        variant="contained"
                                                        size="small"
                                                        edge="start"
                                                        aria-label="filebrowse"
                                                        disabled={mode && mode === 'view' ? true : false}
                                                        onClick={OnFileBrowseClicked}>
                                                        <FindInPage />
                                                        <input type="file" hidden accept={acceptTypes}
                                                            ref={input => fileRef = input} onChange={OnFileInputChanged} />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {error && <div style={{ color: "rgb(211, 47, 47)" }}>{error}</div>}
                                </TableCell>
                                <TableCell sx={{ padding: "0px 0px 0px 5px", m: 0, border: 0, whiteSpace: "nowrap" }}>
                                    {addmore && (
                                        <>
                                            {count - 1 === index && (
                                                <Tooltip title="Add more">
                                                    <IconButton
                                                        variant="contained"
                                                        size="small"
                                                        edge="start"
                                                        aria-label="add more"
                                                        onClick={OnAddMoreClicked}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {count > 1 && (
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        variant="contained"
                                                        size="small"
                                                        edge="start"
                                                        aria-label="delete one"
                                                        onClick={OnDeleteClicked}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </>
            )}
            {/* {mode && mode !== 'view' && inputValue && <Image sx={{ width: 200, height: 200, m: 2 }} alt={"Product Image"} src={inputValue} />} */}
            {Images.indexOf(iDocType) > -1 && iDocData && !Helper.IsNullValue(iDocData) &&
                <Image borderRadius="4px" sx={{ width: 300, border: '1px solid #ddd', p: 1, mt: 2 }} alt={alt || "Product Image"} src={iDocData} />
            }

        </>
    );
}

export default Component;
