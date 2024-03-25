import * as React from 'react';
import { Grid, useTheme } from '@mui/material';

const Component = ({ children }) => {

    const theme = useTheme();

    return (
        <>
            <Grid container sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                padding: 4,
                borderRadius: "4px",
                backgroundColor: theme.customBackColor,
                border: theme.customBorder
            }}>
                {children}
            </Grid>
        </>
    )
}

export default Component;