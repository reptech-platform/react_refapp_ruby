import { useState, useEffect, useMemo } from "react";
import { Stack, Box, Grid, Typography, IconButton, Tooltip, TablePagination } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataGrid, DataTable } from './childs';
import { GetProducts, GetProductsCount, DeleteProduct } from "shared/services";
import { SearchInput, GridContainer, CardItem, ToggleButtons, ConfirmDialog } from "components";
import Helper from "shared/helper";
import { GetProductTypesApi, GetProductImage } from "shared/services";
import { Add as AddBoxIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

const Component = (props) => {
    const { title } = props;
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
    const [dialogInfo, setDialogInfo] = useState({ title: "Confirmation", description: "Are you sure? You want to delete?" });

    const NavigateTo = useNavigate();

    const LoadData = async (types) => {

        let query = null, filters = [];
        //setRows([]); queryCount = null, 
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

<<<<<<< Updated upstream
        if (!Helper.IsJSONEmpty(sortBy)) {
            console.log(filters)
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
            console.log(filters)
        }

        if (pageInfo.page > 0) {
            const _skip = pageInfo.page * pageInfo.pageSize;
            console.log(pageInfo)
            console.log(filters)
            // filters.push(`$skip=${_skip}`);
            console.log(filters)
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetProducts(query)
            .then(async (res) => {
                if (res) {
                    let _rows = res.value;
                    _rows.forEach((e, i) => {
                        e.id = i + 1;
                        e.ProductProductType = _types.find((x) => x.ProductTypeCode === e.ProductProductType)?.ProductTypeDescription || 'NA';
                    });
                    console.log(_rows)
=======
        /* filters.push(`limit=${pageInfo.pageSize}`);
        query = filters.join("&"); */

        let _rows = [];
        await GetProducts(query)
            .then(async (res) => {
                if (res) {
                    _rows = res.value;
                    for (let i = 0; i < _rows.length; i++) {
                        _rows[i].id = i + 1;
                        _rows[i].ProductProductType = _types.find((x) => x.ProductTypeCode === _rows[i].ProductProductType)?.ProductTypeDescription || 'NA';
                        _rows[i].ProductImage = await GetProductImage(_rows[i].ProductProductImage);
                    }
                    //console.log(_rows);
>>>>>>> Stashed changes
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

    useEffect(() => { setRefresh(true); }, [sortBy, pageInfo, searchStr]);
    useEffect(() => { setInitialize(true); }, []);
<<<<<<< Updated upstream

    const handleSortModelChange = (e) => {
        setSortBy(null); if (e && e.length > 0) setSortBy(e[0]);
    }

    const handlePaginationModel = (e) => {
        setPageInfo({ page: 0, pageSize: 5 });
        if (e) {
            console.log(e);
            setPageInfo(e);
        }
    }
=======
    useEffect(() => {
        if (deletedId > 0) setShowConfirm(true);
    }, [deletedId]);
>>>>>>> Stashed changes

    const OnSearchChanged = (e) => {
        setSearchStr(e);
    }

    const handleChangePage = (event, newPage) => {
        setPageInfo((prev) => ({
            ...prev,
            page: newPage
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        setPageInfo({ page: 0, pageSize: parseInt(event.target.value, 5) });
    };
    const OnSortClicked = (e) => { setSortBy(null); if (e && e.length > 0) setSortBy(e[0]); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e && e.length > 0) setPageInfo(e[0]); }

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

    const OnActionClicked = (id, bEdit) => {
        const _route = bEdit ? `/products/edit/${id}` : `/products/view/${id}`;
        NavigateTo(_route);
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
                            <ToggleButtons OnViewChanged={(e) => setViewType(e)} />
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                }}
                                onClick={() => NavigateTo("/products/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    {viewType === 'LIST' && <DataTable rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} onDeleteClicked={OnDeleteClicked} />}
                    {viewType === 'GRID' && <DataGrid rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onPageClicked={OnPageClicked} onDeleteClicked={OnDeleteClicked} />}
                </Box>
                <ConfirmDialog open={showConfirm} {...dialogInfo} onCloseClicked={OnCloseClicked} />
            </Container>
        </>

    );

};

export default Component;