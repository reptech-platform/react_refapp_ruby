import React from "react";
import { MenuItem, Select } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const Component = (props) => {
    const { initOptions, clear, value, name, options, selectedColumns,
        onDropDownChange } = props;

    const theme = useTheme();

    const [selectedValue, setSelectedValue] = React.useState(value || 'NONE');
    const [dpOptions, setDpOptions] = React.useState(options || []);

    let defValues = initOptions || [{ id: -1, value: 'NONE', disabled: true, content: 'Select a column' }];

    if (clear) {
        defValues = defValues.filter((x) => x.value !== 'Clear');
        defValues.push({ id: -2, value: 'Clear', name: 'Clear', content: 'Clear Selection' });
    }

    const OnChange = (e) => {
        e.stopPropagation();
        let value = e.target.value;
        if (value === 'Clear') value = 'NONE';
        setSelectedValue(value);
        if (onDropDownChange) onDropDownChange(e);
    }

    const onOpen = (e) => {
        e.stopPropagation();
        let lastColumns = [];
        let props = selectedColumns || [];
        for (let key in props) lastColumns.push(props[key].value);

        const _options = options.filter((x) => !lastColumns.includes(x.name));
        if (selectedValue && selectedValue !== 'NONE') {
            const _this = _options.find((x) => x.mame === selectedValue);
            if (!_this) {
                const _pos = options.findIndex((x) => x.name === selectedValue);
                const existItem = options.find((x) => x.name === selectedValue);
                _options.splice(_pos, 0, existItem);
            }
        }
        setDpOptions(_options);
    }

    return (
        <>
            <Select variant="standard" name={name} value={selectedValue || 'NONE'} theme={theme}
                onChange={(e) => OnChange(e)}
                onOpen={(e) => onOpen(e)}
                onBlur={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                MenuProps={{
                    sx: {
                        "&& .Mui-selected": { ...theme.selected }
                    }
                }}
                sx={{
                    width: "100%", height: "5vh"
                }}
            >
                {defValues.map((x, index) => (
                    <MenuItem key={1000 + index} disabled={x.disabled} value={x.value} name={x.name}>
                        {x.content}
                    </MenuItem>
                ))}

                {dpOptions.map((x, index) => (
                    <MenuItem key={2000 + index} value={x.name}>
                        {x.name}
                    </MenuItem>
                ))}

            </Select>
        </>
    )
}

export default Component;