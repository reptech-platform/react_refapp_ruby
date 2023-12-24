import React from "react";
import { TablePagination, Typography, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { ROWSPERPAGE } from "config";
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Component = (props) => {

    const { rowsCount, rows, pageInfo, onPageClicked } = props;

    const handleChangePage = (event, newPage) => {
        const _page = { page: newPage, pageSize: pageInfo.pageSize };
        if (onPageClicked) onPageClicked(_page);
    };

    const handleChangeRowsPerPage = (event) => {
        /* setPageInfo({ page: 0, pageSize: parseInt(event.target.value, 5) }); */
    };

    return (
        <>
            <List dense={true} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {rows && rows.map((x, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Travis Howard" src={x.mainImage}><ImageNotSupportedIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText sx={{ width: "50%" }}
                                primary={
                                    <Typography variant="h6" component="span">
                                        {x.name}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography component="span" variant="body2">
                                            {x.description}
                                        </Typography>
                                    </React.Fragment>
                                } />
                            <ListItemText sx={{ width: "50%" }}
                                primary={
                                    <React.Fragment>
                                        <Typography component="span" variant="body2">
                                            &nbsp;{x.weight}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography paragraph component="span">&nbsp;</Typography>
                                        <Typography component="span" variant="body2">
                                            {x.unitOfMeasurement}
                                        </Typography>
                                        <br />
                                        <Typography paragraph component="span">&nbsp;</Typography>
                                        <Typography variant={x.status && x.status.toLowerCase()} component="span">
                                            {x.status}
                                        </Typography>
                                    </React.Fragment>
                                } />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            {/* {rows && rows.map((x, index) => (
                <CardItem key={index} keyid={x.Product_id} title={x.Name} imgsrc={x.ProductMainImageData} width={300}
                    description={x.Product_description} onActionClicked={OnActionClicked} productStatus={x.ProductStatus} >
                    <Grid container direction="column">
                        <Typography variant="caption" color="text.secondary">
                            <strong>Type:</strong>&nbsp;{x.ProductTypeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Price:</strong>&nbsp;₹{x.ProductPrice}
                        </Typography>
                    </Grid>
                </CardItem>
            ))} */}
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