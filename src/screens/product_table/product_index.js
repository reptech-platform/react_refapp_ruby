import { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GetProducts, GetProductsCount, DeleteProduct } from "shared/services";
import { SearchInput } from "components";
import Helper from "shared/helper";
import { Close as CancelIcon, Done as DoneIcon } from '@mui/icons-material';
import { GetProductTypesApi } from "shared/services";
import {
    AddBox as AddBoxIcon, Edit as EditIcon,
    DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon
} from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

const columns = [
    { headerName: "Id", field: "Product_Id" },
    { headerName: "Name", field: "ProductName", flex: 1 },
    { headerName: "Description", field: "ProductDescription", flex: 1 },
    { headerName: "Type", field: "ProductProductType", flex: 1 }
];

const Component = (props) => {
    const { title } = props;
    const [initialize, setInitialize] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [rowModesModel, setRowModesModel] = useState({});

    const NavigateTo = useNavigate();

    const handleDeleteClick = (id) => {
        setRowModesModel({ [id]: { mode: "Delete" } });
    };

    const OnConfirmDelete = async (id, bConfirm) => {
        if (bConfirm) {
            const rslt = await DeleteProduct(id);
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                global.AlertPopup("error", "Something went wroing while creating record!");
            }
        }

        setRowModesModel({});
    }

    const RenderGridActions = () => {

        return {
            headerName: "Actions", type: 'actions', field: "actions", width: 115,
            getActions: ({ row }) => {

                const isDeleteMode = rowModesModel[row.Product_Id]?.mode === 'Delete';

                if (isDeleteMode) {
                    return [
                        <GridActionsCellItem
                            icon={<DoneIcon />}
                            label="Delete"
                            sx={{
                                color: 'secondary.main',
                            }}
                            onClick={() => OnConfirmDelete(row.Product_Id, true)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                            onClick={() => OnConfirmDelete(row.Product_Id, false)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={
                            <Tooltip title="View" arrow>
                                <VisibilityIcon />
                            </Tooltip>
                        }
                        label="View"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => NavigateTo(`/products/view/${row.Product_Id}`)}
                    />,
                    <GridActionsCellItem
                        icon={
                            <Tooltip title="Edit" arrow>
                                <EditIcon />
                            </Tooltip>
                        }
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => NavigateTo(`/products/edit/${row.Product_Id}`)}
                    />,
                    <GridActionsCellItem
                        icon={
                            <Tooltip title="Delete" arrow>
                                <DeleteIcon />
                            </Tooltip>
                        }
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteClick(row.Product_Id)}
                    />,
                ];
            }
        };

    }

    const LoadData = async (types) => {

        let query = null, filters = [];
        setLoading(true);
        //setRows([]);
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
                if (res) setRowsCount(parseInt(res));
            })
            .catch((err) => console.log(err));

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
                    setRows(_rows);
                }
            })
            .catch((err) => console.log(err));

        setLoading(false);
        global.Busy(false);
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
        await GetProductTypes().then(async (types) => {
            await LoadData(types);
        });
    }

    if (initialize) { setInitialize(false); FetchResults(); }
    if (refresh) { setRefresh(false); LoadData(); }

    useEffect(() => { setRefresh(true); }, [sortBy, pageInfo, searchStr]);
    useEffect(() => { setInitialize(true); }, []);

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

    const OnSearchChanged = (e) => {
        setSearchStr(e);
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
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                onClick={() => NavigateTo("/products/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataGrid
                        autoHeight
                        disableColumnMenu
                        columns={[...columns, RenderGridActions()]}
                        rowCount={rowsCount}
                        rows={rows}
                        initialState={{
                            pagination: {
                                paginationModel: pageInfo,
                            },
                        }}
                        pageSizeOptions={ROWSPERPAGE}
                        onSortModelChange={handleSortModelChange}
                        onPaginationModelChange={handlePaginationModel}
                        loading={loading}
                        editMode="row"
                        sx={{
                            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                                outline: "none !important",
                            }
                        }}
                    />
                </Box>
            </Container>
        </>

    );

};

export default Component;