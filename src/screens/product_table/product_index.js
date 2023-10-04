import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataGrid, DataTable } from '../childs';
import { GetProducts, GetProductsCount, DeleteProduct } from "shared/services";
import { SearchInput, ToggleButtons, CustomDialog } from "components";
import Helper from "shared/helper";
import { GetProductTypesApi, GetProductImage } from "shared/services";
import { Add as AddBoxIcon } from '@mui/icons-material';

const columns = [
    { headerName: "Id", field: "Product_Id" },
    { headerName: "Name", field: "ProductName", flex: 1 },
    { headerName: "Description", field: "ProductDescription", flex: 1 },
    { headerName: "Type", field: "ProductProductType", flex: 1 }
];

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [viewType, setViewType] = useState('LIST');
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);

    const NavigateTo = useNavigate();

    const LoadData = async (types) => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        const _types = types || productTypes;

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(ProductDescription, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetProductsCount(query)
            .then(async (res) => {
                if (res) {
                    setRowsCount(parseInt(res));
                }
            })
            .catch((err) => console.log(err));

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

        let _rows = [];
        await GetProducts(query)
            .then(async (res) => {
                if (res) {
                    _rows = res.value;
                    for (let i = 0; i < _rows.length; i++) {
                        _rows[i].id = Helper.GetGUID();
                        _rows[i].ProductProductType = _types.find((x) => x.ProductTypeCode === _rows[i].ProductProductType)?.ProductTypeDescription || 'NA';
                        if (viewType === 'GRID') {
                            _rows[i].ProductImage = await GetProductImage(_rows[i].ProductProductImage);
                        }
                    }
                    setRows(_rows);
                }
            })
            .catch((err) => console.log(err));

        global.Busy(false);

        return _rows;
    }

    const GetProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const productTypes = await GetProductTypesApi();
            const { value } = productTypes || { value: [] };
            setProductTypes(value);
            global.Busy(false);
            return resolve(value);
        });
    }

    const FetchResults = async () => {

        setDeletedId(0);
        setShowConfirm(false);

        await GetProductTypes().then(async (types) => {
            await LoadData(types);
        });
    }

    if (initialize) { setInitialize(false); FetchResults(); }
    if (refresh) { setRefresh(false); LoadData(); }

    useEffect(() => { setRefresh(true); }, [sortBy, pageInfo, searchStr, viewType]);
    useEffect(() => { setInitialize(true); }, []);
    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    const OnViewChanged = (e) => { setViewType(e); }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await DeleteProduct(deletedId);
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                global.AlertPopup("error", "Something went wroing while creating record!");
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
                            <ToggleButtons OnViewChanged={(e) => OnViewChanged(e)} />
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
                    {viewType === 'LIST' && <DataTable keyId={'Product_Id'} columns={columns} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />}
                    {viewType === 'GRID' && <DataGrid rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} onDeleteClicked={OnDeleteClicked} />}
                </Box>
                <CustomDialog open={showConfirm} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;