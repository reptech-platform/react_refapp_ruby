import * as React from "react";
import { SelectValidator } from 'react-material-ui-form-validator';
import { MenuItem, Typography } from "@mui/material";
import Helper from "shared/helper";

const Component = (props) => {

    const { mode, id, name, value, nameId, valueId, contentId, sx, style, defaultLabel, createOption, createLabel,
        validators, validationMessages, options, onDropDownChange } = props;

    const label = defaultLabel || 'Select a column';
    const clabel = createLabel || 'Create a column';

    const [inputValue, setInputValue] = React.useState(value);
    let defValues = [{ id: -1, value: 'NONE', content: label }];
    if (createOption) defValues = [...defValues, { id: 0, value: 'CNONE', content: clabel }];

    const handleChange = (e) => {
        const { name, value } = e.target;
        const lValue = value === 'NONE' ? "" : value;
        setInputValue(value);
        if (onDropDownChange) {
            onDropDownChange({ name, value: lValue });
        }
    }

    if (mode && mode === 'view') {
        let tValue = null;
        if (!Helper.IsNullValue(value)) {
            tValue = options.find((x) => parseInt(x[valueId]) === parseInt(value)) || "";
        }
        if (tValue) tValue = tValue[contentId];
        return (
            <>
                <Typography nowrap="true">{tValue}</Typography>
            </>
        )
    }

    React.useEffect(() => { setInputValue(value); }, [value]);

    const ParseValue = () => {
        let tValue = "NONE";
        if (options && options.length > 0 && !Helper.IsNull(inputValue)) {
            tValue = inputValue;
        }
        return tValue;
    }

    return (
        <>
            <SelectValidator
                onChange={handleChange}
                onBlur={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                autoComplete="off"
                id={id}
                size="small"
                name={name}
                value={ParseValue()}
                validators={validators}
                errorMessages={validationMessages}
                InputLabelProps={{ shrink: false }}
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
            >
                {defValues.map((x, index) => (
                    <MenuItem key={1000 + index} disabled={x.disabled} value={x.value} name={x.name}>
                        {x.content}
                    </MenuItem>
                ))}

                {options && options.map((x, index) => (
                    <MenuItem key={2000 + index} value={x[valueId]} name={x[nameId]}>
                        {x[contentId]}
                    </MenuItem>
                ))}
            </SelectValidator>
        </>
    );
}

export default Component;
