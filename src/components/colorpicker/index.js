import * as React from "react";
import { Box, InputAdornment, Input } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator';


const Component = (props) => {

    const { mode, id, name, value, OnInputChange, sx, validators, validationMessages } = props;

    const [selectedColor, setSelectedColor] = React.useState(value) || "#FFFFFF";
    const [inputColor, setInputColor] = React.useState(value);

    const handleInput = (e) => {
        setSelectedColor(e.target.value);
        setInputColor(e.target.value);
        if (OnInputChange) OnInputChange({ name, value: e.target.value });
    };

    const handleInputBlur = (e) => {
        setSelectedColor(e.target.value);
        if (OnInputChange) OnInputChange({ name, value: e.target.value });
    };

    const handleTextInput = (e) => {
        setInputColor(e.target.value);
    }

    React.useEffect(() => {
        // eslint-disable-next-line
        if (mode && mode !== 'edit' && OnInputChange) OnInputChange({ name, value: selectedColor });
    }, []);

    if (mode && mode === 'view') {
        return (
            <>
                <Box sx={{ display: "flex" }}>
                    <InputAdornment position="start">
                        <Input
                            value={selectedColor}
                            type="color"
                            id="input-with-icon-adornment"
                            margin="dense"
                            disableUnderline={true}
                            variant="standard"
                            sx={{ paddingTop: "1.4rem" }}
                            disabled
                        />
                    </InputAdornment>
                    {inputColor}
                </Box>
            </>
        );
    }

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <TextValidator
                    onChange={handleTextInput}
                    onBlur={handleInputBlur}
                    id={id}
                    size="small"
                    name={name}
                    value={inputColor || "#FFFFFF"}
                    validators={validators}
                    errorMessages={validationMessages}
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            paddingLeft: "10px"
                        },
                        minWidth: 250,
                        ...sx
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Input
                                    value={selectedColor || "#FFFFFF"}
                                    type="color"
                                    id="input-with-icon-adornment"
                                    margin="dense"
                                    disableUnderline={true}
                                    variant="standard"
                                    onChange={handleInput}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

            </Box>
        </>
    );
}

export default Component;