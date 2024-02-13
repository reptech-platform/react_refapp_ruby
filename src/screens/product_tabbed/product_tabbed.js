import React from 'react';
import Container from "screens/container";
import { Box, Grid, Stack, Button, Typography, Tabs, Tab } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

import ProductsTable from "./products";
import ProductPrices from "./prices";

const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Component = (props) => {
    const { title } = props;

    const NavigateTo = useNavigate();
    const [value, setValue] = React.useState(0);

    const handleChange = (e, value) => {
        e.preventDefault();
        setValue(value);
    };

    return (
        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="About" sx={{ textTransform: "none" }} />
                        <Tab label="Products" sx={{ textTransform: "none" }} />
                        <Tab label="Prices" sx={{ textTransform: "none" }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    About
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <ProductsTable noActions={true} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <ProductPrices />
                </CustomTabPanel>
            </Container>
        </>
    )
}

export default Component;
