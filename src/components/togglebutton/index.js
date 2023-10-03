import * as React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { GridView as GridViewIcon, TableRows as TableRowsIcon } from '@mui/icons-material';

const Component = (props) => {
    const { OnViewChanged } = props;
    const [alignment, setAlignment] = React.useState('LIST');

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
        if (OnViewChanged) OnViewChanged(newAlignment);
    };

    return (
        <>
            <ToggleButtonGroup
                size='small'
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="GRID" aria-label="grid view">
                    <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="LIST" aria-label="table view">
                    <TableRowsIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export default Component;