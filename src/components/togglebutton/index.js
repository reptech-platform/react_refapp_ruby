import * as React from 'react';
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { GridView as TilesViewIcon, TableRows as DetailsIcon, ViewList as ViewListIcon } from '@mui/icons-material';

const Component = (props) => {
    const { OnViewChanged, viewName } = props;
    const [alignment, setAlignment] = React.useState("");

    const handleAlignment = (event, newAlignment) => {
        const nAlign = newAlignment || alignment;
        setAlignment(nAlign);
        if (OnViewChanged) OnViewChanged(nAlign);
    };

    React.useEffect(() => { setAlignment(viewName); }, [viewName]);

    return (
        <>
            <ToggleButtonGroup
                size='small'
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="DETAILS" aria-label="Details view">
                    <Tooltip title="Details View">
                        <DetailsIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="TILES" aria-label="Tiles view">
                    <Tooltip title="Tiles View">
                        <TilesViewIcon />
                    </Tooltip>
                </ToggleButton>
                {/* <ToggleButton value="CONTENT" aria-label="Content view">
                    <Tooltip title="Content View">
                        <ViewListIcon />
                    </Tooltip>
                </ToggleButton> */}
                <ToggleButton value="LIST" aria-label="List view">
                    <Tooltip title="List View">
                        <ViewListIcon />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export default Component;