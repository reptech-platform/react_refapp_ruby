import * as React from "react";
import { TextValidator } from 'react-material-ui-form-validator';
import { InputAdornment, IconButton } from '@mui/material';
import { FindInPage } from '@mui/icons-material';
import Helper from "shared/helper";
import { Image } from "components";

const Component = (props) => {

    const { mode, id, name, value, OnInputChange, style, sx, acceptTypes, fileName,
        validators, validationMessages } = props;

    const [inputValue, setInputValue] = React.useState(value);
    const [imageValue, setImageValue] = React.useState(value);
    const [error, setError] = React.useState(null);
    let fileRef = React.createRef();

    const OnFileBrowseClicked = () => {
        setError(null);
        fileRef.click();
    }

    const OnFileInputChanged = (e) => {
        e.preventDefault();
        setError(null);
        setImageValue(null);
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
                ReadImageFile(_file);
                setInputValue(_file.name);
                if (OnInputChange) {
                    OnInputChange({ name, value: _file.name });
                }
            }
        }
    }

    const ReadImageFile = (input) => {
        var reader = new FileReader();
        reader.onload = (e) => {
            setImageValue(e.target.result);
            if (OnInputChange) {
                OnInputChange({ name: 'ProductImageData', value: e.target.result });
            }
        };
        reader.readAsDataURL(input);
    }

    React.useEffect(() => {
        if (mode && (mode === 'view' || mode === 'edit')) {
            setInputValue(fileName);
        }
    }, [mode, fileName]);

    return (
        <>
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
                fullWidth
                style={{
                    width: "100%",
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
                                color="secondary"
                                aria-label="filebrowse"
                                disabled={mode && mode === 'view' ? true : false}
                                onClick={OnFileBrowseClicked}>
                                <FindInPage />
                                <input type="file" hidden accept={acceptTypes}
                                    ref={input => fileRef = input} onChange={OnFileInputChanged} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {error && <div style={{ color: "rgb(211, 47, 47)" }}>{error}</div>}
            {/* {mode && mode !== 'view' && inputValue && <Image sx={{ width: 200, height: 200, m: 2 }} alt={"Product Image"} src={inputValue} />} */}
            {imageValue &&
                <Image borderRadius="4px" sx={{ width: 300, border: '1px solid #ddd', p: 1, mt: 2 }} alt={"Product Image"} src={imageValue} />
            }

        </>
    );
}

export default Component;
