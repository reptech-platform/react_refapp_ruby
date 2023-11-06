import React, { useState } from "react";
import { TablePagination, Grid, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Close as CancelIcon, Done as DoneIcon } from '@mui/icons-material';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";

import { GridContainer, CardItem } from "components";

const columns = [
    { headerName: "Id", field: "Product_Id" },
    { headerName: "Name", field: "Name", flex: 1 },
    { headerName: "Description", field: "Product_description", flex: 1 },
    { headerName: "Manufacturer", field: "Manufacturer", flex: 1 },
    { headerName: "UOM", field: "UnitOfMeasurement", flex: 1 },
    { headerName: "Weight", field: "Weight", flex: 1 },
    { headerName: "Size", field: "Size", flex: 1 },
    { headerName: "Color", field: "Color", flex: 1 }
];

const Component = (props) => {

    const { rowsCount, rows, pageInfo, onActionClicked, onPageClicked } = props;

    const handleChangePage = (event, newPage) => {
        const _page = { page: newPage, pageSize: pageInfo.pageSize };
        if (onPageClicked) onPageClicked(_page);
    };

    const handleChangeRowsPerPage = (event) => {
        /* setPageInfo({ page: 0, pageSize: parseInt(event.target.value, 5) }); */
    };

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    return (
        <>
            <GridContainer>
                {rows && rows.map((x, index) => (
                    <CardItem key={index} keyName="Product_Id" row={x} title={x.Name} imgsrc={x.ProductImage} width={300}
                        description={x.ProductDescription} onActionClicked={OnActionClicked}>
                        <Grid container direction="column">
                            <Typography variant="caption" color="text.secondary">
                                <strong>Type:</strong>&nbsp;{x.ProductProductType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                <strong>Price:</strong>&nbsp;{x.ProductPrice}
                            </Typography>
                        </Grid>
                    </CardItem>
                ))}
            </GridContainer>
            {rows && rows.length > 0 && <TablePagination
                component="div"
                count={rowsCount}
                page={pageInfo.page}
                rowsPerPageOptions={ROWSPERPAGE}
                onPageChange={handleChangePage}
                rowsPerPage={pageInfo.pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />}
        </>
    );

};

export default Component;