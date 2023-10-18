import React from "react";
import { Tooltip, useTheme } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

const Component = (props) => {

    const theme = useTheme();

    const { columns, rowsCount, rows, pageInfo, onActionClicked, sortBy, keyId,
        onSortClicked, onPageClicked } = props;

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    const RenderGridActions = (props) => {
        const noView = props.noView;

        return {
            headerName: "Actions", type: 'actions', field: "actions", width: 115,
            getActions: ({ row }) => {

                const actions = [];

                if (!noView) {
                    actions.push(<GridActionsCellItem
                        icon={
                            <Tooltip title="View" arrow>
                                <VisibilityIcon />
                            </Tooltip>
                        }
                        label="View"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => OnActionClicked(row[keyId], 'view')}
                    />)
                }

                actions.push(<GridActionsCellItem
                    icon={
                        <Tooltip title="Edit" arrow>
                            <EditIcon />
                        </Tooltip>
                    }
                    label="Edit"
                    className="textPrimary"
                    color="inherit"
                    onClick={() => OnActionClicked(row[keyId], 'edit')}
                />);

                actions.push(<GridActionsCellItem
                    icon={
                        <Tooltip title="Delete" arrow>
                            <DeleteIcon />
                        </Tooltip>
                    }
                    label="Delete"
                    color="inherit"
                    onClick={() => OnActionClicked(row[keyId], 'delete')}
                />);

                return actions;
            }
        };

    }

    const handleSortModelChange = (e) => {
        if (onSortClicked) onSortClicked(e[0]);
    }

    const handlePaginationModel = (e) => {
        if (onPageClicked) onPageClicked(e);
    }

    return (
        <>
            <DataGrid
                autoHeight
                disableColumnMenu
                columns={[...columns, RenderGridActions(props)]}
                rowCount={rowsCount}
                rows={rows}
                rowSelection={false}
                paginationModel={pageInfo}
                initialState={{
                    pagination: {
                        paginationModel: pageInfo,
                    },
                }}
                pageSizeOptions={ROWSPERPAGE}
                sortModel={sortBy && [sortBy] || [{ field: "", sort: "asc" }]}
                paginationMode="server"
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                onPaginationModelChange={handlePaginationModel}
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