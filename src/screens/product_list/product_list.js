import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataList } from '../childs';
import * as Api from "shared/services";
import { SearchInput } from "components";
import { Add as AddBoxIcon } from '@mui/icons-material';
import ProductJsonConfig from "config/product_list_config.json";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");

    const NavigateTo = useNavigate();

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const FetchResults = async () => {
        setRows([]);
        setRowsCount(0);

        let _rows = [];
        global.Busy(true);

        const navItems = Object.values(ProductJsonConfig);
        const source = navItems.find(x => x.target === 'keyId').source;

        await Api.GetEntityInfo(source).then(res => {
            if (res.status) {
                let _values = res.values || [];
                for (let i = 0; i < _values.length; i++) {
                    const _value = _values[i];
                    let _row = {};
                    navItems.forEach(m => {
                        _row = { ..._row, [m.target]: _value[m.key] };
                    });
                    _rows.push(_row);
                }
            }
        }).catch((err) => {
            console.log(err);
            global.Busy(false);
        });

        setRows(_rows);
        global.Busy(false);

    }


    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, []);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                    <Stack direction="row">
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: theme.borderBottom
                                }}
                                onClick={() => NavigateTo("/products/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataList rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onPageClicked={OnPageClicked} />
                </Box>
            </Container>
        </>

    );

};

export default Component;