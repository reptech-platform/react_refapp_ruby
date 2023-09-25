import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, Divider, IconButton, Tooltip } from '@mui/material';
import { AddBox as AddBoxIcon, Edit as EditIcon, DeleteOutlined as DeleteIcon, Close as CancelIcon, Done as DoneIcon } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import Container from "screens/container";
import { SearchInput } from "components";
import { GetProductTypesApi, SetProductTypesApi, GetProductTypesCount } from "shared/services";
import Helper from "shared/helper";

const columns = [
    { headerName: "Code", field: "ProductTypeCode", flex: 1, editable: false },
    { headerName: "Description", field: "ProductTypeDescription", flex: 1, editable: true }
];

const Component = (props) => {
    const { title } = props;

    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchStr, setSearchStr] = useState("");
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [sortBy, setSortBy] = useState(null);

    const handleSaveClick = (id, row) => () => {
        const { mode, ProductTypeCode, ProductTypeDescription } = row;
        if (mode === 'Delete') {
            DoAction('DELETE', ProductTypeCode, ProductTypeDescription)
                .then((status) => {
                    if (status) {
                        const tmp = rows.filter((row) => row.id !== id);
                        setRows(tmp);
                        setRowsCount(tmp.length);
                    }
                });
        }
        setRowModesModel({ [id]: { mode: GridRowModes.View } });
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ [id]: { mode: GridRowModes.Edit, fieldToFocus: 'ProductTypeDescription' } });
    };

    const handleDeleteClick = (id) => () => {
        setRowModesModel({ [id]: { mode: "Delete" } });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({ [id]: { mode: GridRowModes.View, ignoreModifications: true } });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }

    };

    const RenderGridActions = () => {

        return {
            headerName: "Actions", type: 'actions', field: "actions", width: 115,
            getActions: (props) => {
                const { id, row } = props;
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit || rowModesModel[id]?.mode === 'Delete';
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<DoneIcon />}
                            label="Save"
                            sx={{
                                color: 'secondary.main',
                            }}
                            onClick={handleSaveClick(id, { ...row, mode: rowModesModel[id]?.mode })}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={
                            <Tooltip title="Edit" arrow>
                                <EditIcon />
                            </Tooltip>
                        }
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={
                            <Tooltip title="Delete" arrow>
                                <DeleteIcon />
                            </Tooltip>
                        }
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            }
        };

    }

    const OnSearchChanged = (e) => {
        setSearchStr(e);
    }

    const OnAddClicked = (e) => {
        e.preventDefault();
        const newId = rows.length + 1;
        let newRow = { id: newId, ProductTypeCode: '', ProductTypeDescription: '', isNew: true };
        const tmp = [newRow, ...rows];
        setRows(tmp);
        setRowsCount(tmp.length);
        setRowModesModel({
            [newId]: { id: newId, mode: GridRowModes.Edit, fieldToFocus: 'ProductTypeDescription', isNew: true }
        });
    }

    const LoadData = async () => {

        let query = null, filters = [];
        setLoading(true); setRowsCount(0);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(ProductTypeDescription, '${searchStr}')`);
        }

        /* if (!Helper.IsJSONEmpty(sortBy)) {
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
        } */

        if (pageInfo.page > 0) {
            const _skip = pageInfo.page * pageInfo.pageSize;
            filters.push(`$skip=${_skip}`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetProductTypesCount(query)
            .then(async (res) => {
                if (res) setRowsCount(parseInt(res));
            })
            .catch((err) => console.log(err));

        const productTypes = await GetProductTypesApi(query);
        const { value } = productTypes || { value: [] };

        let _rows = value || [];
        _rows.map((x, index) => { x['id'] = index + 1; });
        setRows(_rows);
        setRowsCount(_rows.length);
        setLoading(false);
        global.Busy(false);
    }

    if (initialize) { setInitialize(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, []);

    const processRowUpdate = async (newRow) => {
        const { id, isNew, ProductTypeDescription, ProductTypeCode } = newRow;

        if (Helper.IsNullValue(ProductTypeDescription)) {
            global.AlertPopup("error", `Product type description is required`);
            setRowModesModel({ [id]: { mode: GridRowModes.Edit, fieldToFocus: 'ProductTypeDescription', isNew } });
            return;
        }

        const httpMethod = isNew ? 'POST' : 'PATCH';
        let updatedRow;

        DoAction(httpMethod, ProductTypeCode, ProductTypeDescription)
            .then((status) => {
                if (status) {
                    updatedRow = { ...newRow, isNew: false };
                    const tmp = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
                    setRows(tmp);
                    setRowsCount(tmp.length);
                }
                return updatedRow;
            });

    };

    const DoAction = async (httpMethod, productCode, description) => {
        return new Promise(async (resolve) => {
            let success, failed;

            if (httpMethod === 'POST') {
                success = 'created';
                failed = 'creating';
            }
            else if (httpMethod === 'PATCH') {
                success = 'updated';
                failed = 'updating';
            } else if (httpMethod === 'DELETE') {
                success = 'deleted';
                failed = 'deleting';
            }

            global.Busy(true);
            const { status } = await SetProductTypesApi(httpMethod, description, productCode);
            if (status) {
                global.AlertPopup("success", `Record is ${success} successful!`);
            } else {
                global.AlertPopup("error", `Something went wroing while ${failed} record!`);
            }
            global.Busy(false);
            return resolve(status);
        });
    }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

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
                                    color: 'secondary.main',
                                }}
                                onClick={OnAddClicked}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <Box style={{ width: '100%' }}>
                    <DataGrid
                        sx={{
                            '& .MuiDataGrid-row--editing': {
                                boxShadow: "none"
                            },
                            '& .MuiDataGrid-cell.MuiDataGrid-cell--editing': {
                                borderWidth: 1,
                                borderColor: "rgba(0, 0, 0, 0.87)"
                            },
                            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                                outline: "none !important",
                            }
                        }}
                        editMode="row"
                        rowModesModel={rowModesModel}
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
                        pageSizeOptions={[5, 10, 15, 20, 25]}
                        loading={loading}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={(err) => console.log(err)}
                    />
                </Box>

            </Container>
        </>
    )

}

export default Component;
