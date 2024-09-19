import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataGrid } from '../childs';
import * as Api from "shared/services";
import ProductJsonConfig from "config/product_tiles_config.json";

import { SearchInput, CustomDialog } from "components";
import Helper from "shared/helper";
import { Add as AddBoxIcon } from '@mui/icons-material';

const defaultError = "Something went wroing while creating record!";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const NavigateTo = useNavigate();

    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Product_description, '${searchStr}') or contains(Name, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetProductsCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        if (!Helper.IsJSONEmpty(sortBy)) {
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        // MainImage,PType,SellingPrice,ODetails,OtherImages
        let _rows = [];
        const entityItems = "PType,SellingPrice,MainImage";
        const nameItems = entityItems.split(",");
        await Api.GetProducts(query, entityItems)
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    for (let i = 0; i < _rows.length; i++) {
                        _rows[i].id = Helper.GetGUID();
                        for (let j = 0; j < nameItems.length; j++) {
                            let nameId = nameItems[j];
                            for (let prop of ProductJsonConfig[nameId]) {
                                if (_rows[i][nameId]) {
                                    if (nameId === 'MainImage') {
                                        await Api.GetDocument(_rows[i][nameId].DocId, true).then((rslt) => {
                                            _rows[i].ProductMainImageData = rslt.values;
                                        })
                                    } else {
                                        _rows[i][prop.key] = _rows[i][nameId][prop.key] || prop.default;
                                    }
                                }

                            }
                        }
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        setShowResults(true);
        global.Busy(false);
        return _rows;
    }

    const OnViewChanged = (e) => {
        let _route;
        if (e === 'DETAILS') _route = `/products`;
        if (e === 'TILES') _route = `/producttiles`;
        if (e === 'CONTENT') _route = `/productcontent`;
        if (e === 'LIST') _route = `/productlist`;
        if (_route) NavigateTo(_route);
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await Api.SetProduct({ Product_id: deletedId, Deleted: true });
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
            }
        } else {
            setDeletedId(0);
            setShowConfirm(false);
        }
    }

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/products/edit/${id}`;
        if (type === 'view') _route = `/products/view/${id}`;
        if (type === 'delete') setDeletedId(id);;
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

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
                {showResults && (
                    <>
                        {rowsCount > 0 ? (
                            <Box style={{ width: '100%' }}>
                                <DataGrid keyId={'Product_id'} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                                    footerItems={[{ name: "Size", value: "Size" }, { name: "Weight", value: "Weight" }]}
                                    onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} onDeleteClicked={OnDeleteClicked} />
                            </Box>
                        ) : (
                            <Box component={"div"} sx={{
                                mt: 5,
                                display: "flex", width: '100%',
                                height: 150, backgroundColor: "#ffffff",
                                justifyContent: "center", alignItems: "center",
                                border: "1px solid lightgray"
                            }}>
                                <Typography noWrap variant="colorcaption" component="div" sx={{ fontSize: "0.95rem" }}>
                                    No Records found
                                </Typography>
                            </Box>

                        )}
                    </>
                )}

                <CustomDialog open={showConfirm} action={'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;