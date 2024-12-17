import * as React from "react";
import { Typography } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator';

const Component = (props) => {

    const { mode, type, id, name, editable, placeHolder, value, OnInputChange, style, sx, validators, validationMessages } = props;

    const [inputValue, setInputValue] = React.useState(value);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue(value);
        if (OnInputChange) OnInputChange({ name, value });
    }

    if (mode && mode === 'view') {
        return <Typography nowrap="true">{value}</Typography>
    }

    React.useEffect(() => {
        setInputValue(value);
    }, [value])

    return (
        <>
            <TextValidator
                onChange={handleChange}
                autoComplete="off"
                id={id}
                size="small"
                type={type}
                name={name}
                value={inputValue || ""}
                validators={validators}
                errorMessages={validationMessages}
                InputLabelProps={{ shrink: false }}
                placeholder={placeHolder}
                disabled={!editable ? true : false}
                style={{
                    minWidth: 250,
                    ...style
                }}
                sx={{
                    "& label": {
                        display: "none"
                    },
                    ...sx
                }}
            />
        </>
    );
}

export default Component;
