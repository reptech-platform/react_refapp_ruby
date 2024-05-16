import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataList } from '../childs';
import * as Api from "shared/services";
import { SearchInput } from "components";
import { Add as AddBoxIcon } from '@mui/icons-material';
import ProductJsonConfig from "config/product_list_config.json";
import Helper from "shared/helper";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");

    const NavigateTo = useNavigate();

    const FetchResults = async () => {
        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        const navItems = Object.values(ProductJsonConfig);
        const source = navItems.find(x => x.target === 'keyId').source;
        const expands = navItems.filter(x => !Helper.IsNullValue(x.expand))?.map(z => z.expand);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(ProductDescription, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _url = `${source}/$count`;
        if (!Helper.IsNullValue(query)) {
            _url = `${_url}?${query}`;
        }

        await Api.GetEntityInfoCount(_url)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];

        _url = `${source}`;
        if (!Helper.IsNullValue(query)) {
            _url = `${_url}?${query}`;
        }
        if (expands.length > 0) {
            let tmpExpand = expands.join(",");
            if (!Helper.IsNullValue(query)) {
                _url = `${_url}&$expand=${tmpExpand}`;
            } else {
                _url = `${_url}?$expand=${tmpExpand}`;
            }
        }

        await Api.GetEntityInfo(_url)
            .then(async (res) => {
                if (res.status) {
                    let _values = res.values || [];
                    for (let i = 0; i < _values.length; i++) {
                        const _value = _values[i];
                        let _row = {};
                        for (let j = 0; j < navItems.length; j++) {
                            let tNav = navItems[j];
                            if (tNav.type === 'doc' && !Helper.IsNullValue(_value[tNav.key])) {
                                await Api.GetDocument(_value[tNav.key], true).then((rslt) => {
                                    _row[tNav.target] = rslt.values;
                                })
                            } else {
                                if (tNav.expand) {
                                    let navItem = _value[tNav.expand] || {};
                                    _row[tNav.target] = navItem[tNav.key];
                                } else {
                                    _row[tNav.target] = _value[tNav.key];
                                }
                            }
                        }
                        _rows.push(_row);
                    }
                    setRows(_rows);
                    global.Busy(false);
                } else {
                    console.log(res.statusText);
                    global.Busy(false);
                }
            }).catch((err) => {
                console.log(err);
                global.Busy(false);
            });

    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [pageInfo, searchStr]);

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