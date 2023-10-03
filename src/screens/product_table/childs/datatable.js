import React from "react";
import { Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

const columns = [
    { headerName: "Id", field: "Product_Id" },
    { headerName: "Name", field: "ProductName", flex: 1 },
    { headerName: "Description", field: "ProductDescription", flex: 1 },
    { headerName: "Type", field: "ProductProductType", flex: 1 }
];

const Component = (props) => {

    const { rowsCount, rows, pageInfo, onActionClicked,
        onSortClicked, onPageClicked, onDeleteClicked } = props;

    const handleDeleteClick = (id) => {
        if (onDeleteClicked) onDeleteClicked(id);
    };

    const RenderGridActions = () => {

        return {
            headerName: "Actions", type: 'actions', field: "actions", width: 115,
            getActions: ({ row }) => {
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
                        onClick={() => onActionClicked && onActionClicked(row.Product_Id, false)}
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
                        onClick={() => onActionClicked && onActionClicked(row.Product_Id, true)}
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

    const handleSortModelChange = (e) => {
        if (onSortClicked) onSortClicked(e[0]);
    }

    const handlePaginationModel = (e) => {
        if (onPageClicked) onPageClicked(e[0]);
    }

    return (
        <>
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
                editMode="row"
                sx={{
                    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                        outline: "none !important",
                    }
                }}
            />
        </>
    );

};

export default Component;