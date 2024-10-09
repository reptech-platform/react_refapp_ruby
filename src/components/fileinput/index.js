import * as React from "react";
import { TextValidator } from 'react-material-ui-form-validator';
import { Box, InputAdornment, IconButton, Typography, Table, TableBody, TableRow, TableCell, Tooltip } from '@mui/material';
import { FindInPage, Add as AddIcon, Delete as DeleteIcon, DownloadForOfflineOutlined as DownloadIcon } from '@mui/icons-material';
import Helper from "shared/helper";
import { Image } from "components";

const ImagesTypes = ["JPG", "JPEG", "PNG"];

const RenderDocument = (props) => {
    const { name, mode, docType, docData, alt } = props;

    const OnDownloadFile = (e) => {
        e.preventDefault();
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = docData;
        link.download = '';
        link.click();
    }

    let _index = ImagesTypes.findIndex((x) => x.toUpperCase() === docType);

    if (_index > -1) {
        return (
            <Image borderRadius="4px" sx={{ width: 300, border: '1px solid #ddd', p: 1, mt: 2 }} alt={alt || "Product Image"} src={docData} />
        );
    } else {
        if (mode) {
            return (
                <Box display="flex" alignItems="center">
                    <Typography component="div" sx={{ ml: 1 }}>
                        {name}
                    </Typography>

                    <Tooltip title="Download">
                        <IconButton
                            variant="contained"
                            size="small"
                            edge="start"
                            aria-label="download"
                            onClick={OnDownloadFile}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        } else {
            return null;
        }
    }

}

const Component = (props) => {

    const { mode, index, id, name, value, OnInputChange,
        addmore, onAddMoreClicked, count, onDeleteClicked, alt,
        style, sx, acceptTypes, validators, validationMessages } = props;

    const [inputValue, setInputValue] = React.useState("");

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
                setIDocType(_ext.toUpperCase());
                ReadDocument(_file);
            }
        }
    }

    const ReadDocument = (input) => {
        var reader = new FileReader();
        reader.onload = (e) => {
            const tDocData = e.target.result;
            setIDocData(tDocData);
            setInputValue(input.name);
            if (OnInputChange) {
                OnInputChange({ name, index, value: tDocData });
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
        if (value) {
            let tmp = !Helper.IsNullValue(index?.toString()) ? value.DocData : value;
            let fileType = Helper.ExtractFileType(tmp);
            setIDocType(fileType);
            setIDocData(tmp);
        }
    }, [value]);

    return (
        <>

            {Helper.IsNullValue(mode) && mode !== 'view' && (
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

            {!Helper.IsNullValue(iDocData) && <RenderDocument alt={alt} name={inputValue} mode={mode} docType={iDocType} docData={iDocData} />}

        </>
    );
}

export default Component;
