import * as React from "react";
import { Box, Rating, Typography } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator';

const Component = (props) => {

    const { mode, name, label, value, OnInputChange, style, sx, validators, validationMessages } = props;

    const [inputValue, setInputValue] = React.useState(value);

    const handleChange = (e, value) => {
        console.log(value)
        /* const { name, value } = e.target;
        setInputValue(value);
        if (OnInputChange) OnInputChange({ name, value }); */
    }

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1, padding: "2px" }}>
                {label && <Typography component="legend">{label}</Typography>}
                <Rating
                    name={name}
                    value={value}
                    onChange={handleChange}
                />
            </Box>
        </>
    );
}

export default Component;
