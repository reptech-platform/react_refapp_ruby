import * as React from 'react';
import { Grid } from '@mui/material';

const Component = ({ children }) => {

    return (
        <>
            <Grid container sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                padding: 1
            }}>
                {children}
            </Grid>
        </>
    )
}

export default Component;