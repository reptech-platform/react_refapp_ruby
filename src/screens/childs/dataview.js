import React from "react";
import { TablePagination, Grid, Typography } from '@mui/material';
import { ROWSPERPAGE } from "config";

import { GridContainer, CardView as CardItem } from "components";

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
            {/* <GridContainer> */}
            {rows && rows.map((x, index) => (
                <CardItem key={index} keyid={x.Product_id} title={x.Name} imgsrc={x.ProductMainImageData} width={300}
                    description={x.Product_description} onActionClicked={OnActionClicked} productStatus={x.ProductStatus} >
                    {/* <Grid container direction="column">
                        <Typography variant="caption" color="text.secondary">
                            <strong>Type:</strong>&nbsp;{x.ProductTypeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Price:</strong>&nbsp;₹{x.ProductPrice}
                        </Typography>
                    </Grid> */}
                </CardItem>
            ))}
            {/* </GridContainer> */}
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