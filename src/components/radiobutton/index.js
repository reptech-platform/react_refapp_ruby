import * as React from "react";
import { RadioGroup, Radio, FormControl, FormControlLabel } from '@mui/material';
import { TextValidator } from 'react-material-ui-form-validator';

const Component = (props) => {

    const { mode, type, id, name, placeHolder, options, value, OnInputChange, style, sx, validators, validationMessages } = props;

    const [inputValue, setInputValue] = React.useState(value);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue(value);
        if (OnInputChange) OnInputChange({ name, value });
    }

    if (mode && mode === 'view') {
        return <Typography nowrap="true">{value}</Typography>
    }

    return (
        <>
            <RadioGroup
                row
                value={inputValue}
                name={name}
            >
                {options && options.map((x, index) => (
                    <FormControlLabel key={`opt_${index}`} value={x} control={<Radio />} label={x} />
                ))}

            </RadioGroup>
        </>
    );
}

export default Component;
