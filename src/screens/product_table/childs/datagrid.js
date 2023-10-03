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
    { headerName: "Name", field: "ProductName", flex: 1 },
    { headerName: "Description", field: "ProductDescription", flex: 1 },
    { headerName: "Type", field: "ProductProductType", flex: 1 }
];

const Component = (props) => {

    const { rowsCount, rows, pageInfo, onActionClicked,
        onPageClicked, onDeleteClicked } = props;


    const handleChangePage = (event, newPage) => {
        const _page = { page: newPage, pageSize: pageInfo.pageSize };
        if (onPageClicked) onPageClicked([_page]);
    };

    const handleChangeRowsPerPage = (event) => {
        /* setPageInfo({ page: 0, pageSize: parseInt(event.target.value, 5) }); */
    };

    React.useEffect(() => {
        console.log(pageInfo);
    }, []);

    return (
        <>
            <GridContainer>
                {rows && rows.splice(pageInfo.page, pageInfo.pageSize).map((x, index) => (
                    <CardItem key={index} row={x} title={x.ProductName} imgsrc={x.ProductImage} description={x.ProductDescription} width={300}>
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