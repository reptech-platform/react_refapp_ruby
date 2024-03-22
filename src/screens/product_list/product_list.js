import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataList } from '../childs';
import * as Api from "shared/services";
import { SearchInput, ToggleButtons } from "components";
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

    const OnViewChanged = (e) => {
        let _route;
        if (e === 'DETAILS') _route = `/products`;
        if (e === 'TILES') _route = `/producttiles`;
        if (e === 'CONTENT') _route = `/productcontent`;
        if (e === 'LIST') _route = `/productlist`;
        if (_route) NavigateTo(_route);
    }

    const FetchResults = async () => {
        setRows([]);
        setRowsCount(0);

        let _rows = [];

        global.Busy(true);
        await Api.GetProductOnBoardings().then(async (res) => {
            if (res.status) {
                let _values = res.values || [];
                for (let i = 0; i < _values.length; i++) {

                    /* Pull the data from product onboarding */
                    /* let _row = {
                        productId: _values[i].ProductId, name: _values[i].Name,
                        status: _values[i].Status, description: _values[i].Description
                    };

                    await Api.GetProduct(_row.productId).then(async (resP) => {
                        if (resP.status) {
                            let _product = resP.values;
                            _row = { ..._row, unitOfMeasurement: _product.UnitOfMeasurement, weight: _product.Weight };

                            if (_product.ProductMainImage > 0) {
                                await Api.GetDocument(_product.ProductMainImage, true, "image/jpeg").then((resI) => {
                                    _row = { ..._row, mainImage: resI.values };
                                })
                            }

                        }
                    }); */

                    /* Pull the data from product from product onboarding product id */
                    await Api.GetProduct(_values[i].ProductId, null, "MainImage").then(async (resP) => {
                        if (resP.status) {
                            let _product = resP.values;
                            let nameItems = ProductJsonConfig['product'];

                            let _row = { status: _values[i].Status };

                            for (let j = 0; j < nameItems.length; j++) {
                                let _nameItem = nameItems[j];
                                if (_nameItem.key === "MainImage" && _product[_nameItem.key]) {
                                    await Api.GetDocument(_product.MainImage.DocId, true, _product.MainImage.DocType).then((resI) => {
                                        _row = { ..._row, mainImage: resI.values };
                                    })
                                } else {
                                    _row = { ..._row, [_nameItem.target]: _product[_nameItem.key] };
                                }
                            }

                            _rows.push(_row);

                        }
                    });

                }

                setRows(_rows);
                setRowsCount(_rows.length);
                global.Busy(false);
            } else {
                global.Busy(false);
                console.log(res.statusText);
            }
        }).catch((err) => {
            console.log(err);
            global.Busy(false);
        });

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
                            <ToggleButtons viewName='LIST' OnViewChanged={(e) => OnViewChanged(e)} />
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