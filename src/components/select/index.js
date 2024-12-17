import * as React from "react";
import { MenuItem, Typography, Select } from "@mui/material";

const Component = (props) => {

    const { mode, id, name, value, nameId, valueId, contentId, sx, style, defaultLabel,
        validators, validationMessages, options, onDropDownChange } = props;
    const label = defaultLabel || 'Select a column';

    const [inputValue, setInputValue] = React.useState(value);
    const defValues = [{ id: -1, value: 'NONE', content: label }];

    const handleChange = (e) => {
        const { name, value } = e.target;
        const lValue = value === 'NONE' ? "" : value;
        setInputValue(value);
        if (onDropDownChange) {
            onDropDownChange({ name, value: lValue });
        }
    }

    if (mode && mode === 'view') {
        let tValue = options.find((x) => parseInt(x[valueId]) === parseInt(value)) || "";
        if (tValue) tValue = tValue[contentId];
        return (
            <>
                <Typography nowrap="true">{tValue}</Typography>
            </>
        )
    }

    return (
        <>
            <Select
                onChange={handleChange}
                onBlur={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                autoComplete="off"
                id={id}
                size="small"
                name={name}
                value={(options && options.length > 0 && inputValue) || "NONE"}
                inputlabelprops={{ shrink: false }}
                fullWidth
                style={{
                    width: "100%",
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
            </Select>
        </>
    );
}

export default Component;
