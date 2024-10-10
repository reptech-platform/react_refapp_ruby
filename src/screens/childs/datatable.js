import React from "react";
import { Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

const Component = (props) => {

    const { columns, rowsCount, rows, pageInfo, onActionClicked, sortBy, keyId, pageMode, onColumnClicked,
        onSortClicked, onPageClicked, sx, noActions, hideFooter } = props;

    const paginationMode = pageMode || "server";

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

    const GetColumns = () => {
        if (noActions) return [...columns];
        return [...columns, RenderGridActions(props)];
    }

    return (
        <>
            <DataGrid
                autoHeight
                disableColumnMenu
                columns={GetColumns()}
                rowCount={rowsCount}
                rows={rows}
                rowSelection={false}
                hideFooter={hideFooter || false}
                paginationModel={pageInfo}
                initialState={{
                    pagination: {
                        paginationModel: pageInfo,
                    },
                }}
                pageSizeOptions={ROWSPERPAGE}
                sortModel={sortBy && [sortBy] || [{ field: "", sort: "asc" }]}
                paginationMode={paginationMode}
                sortingMode={paginationMode}
                onSortModelChange={handleSortModelChange}
                onPaginationModelChange={handlePaginationModel}
                sx={{
                    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                        outline: "none !important",
                    },
                    ...sx
                }}
                onCellClick={(params, event) => {
                    event.defaultMuiPrevented = true;
                    const { field, row, colDef } = params;
                    if (onColumnClicked) onColumnClicked({ field, row, type: colDef["ctype"] });
                }}
            />
        </>
    );

};

export default Component;