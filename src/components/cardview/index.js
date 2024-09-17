import * as React from 'react';
import { Grid, Card, CardActions, CardContent, CardMedia, Box } from '@mui/material';

import { Typography, IconButton, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const Component = (props) => {

    const { title, keyid, description, imgsrc, row, children, width, sx, onActionClicked, footerItems } = props;

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    return (
        <>
            <Grid item>
                <Card sx={{
                    width: width || 345,
                    height: '100%',
                    boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    border: '0.75px solid #00000080',
                    borderRadius: '15px',
                    ...sx
                }}>
                    {imgsrc ? (
                        <CardMedia
                            component="img"
                            sx={{ height: 140 }}
                            src={imgsrc}
                        />
                    ) : (
                        <CardMedia sx={{
                            height: 140,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#8c92ac",
                            textAlign: "center"
                        }}>
                            Preview <br /> Not Available
                        </CardMedia>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="p">
                            {description}
                        </Typography>
                        {children}
                    </CardContent>
                    <CardActions disableSpacing sx={{ m: 0, p: 0 }}>
                        <TableContainer sx={{ width: "100%", m: 0, p: 0 }}>
                            <Box>
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    aria-label="view"
                                    onClick={() => OnActionClicked(keyid, 'view')}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    aria-label="Edit"
                                    onClick={() => OnActionClicked(keyid, 'edit')}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    aria-label="Delete"
                                    onClick={() => OnActionClicked(keyid, 'delete')}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <Table sx={{ display: 'table', width: '100%', border: 0, backgroundColor: "#E9EAEB" }}>
                                <TableBody>
                                    <TableRow sx={{ borderTop: 1 }}>

                                        <TableCell sx={{ width: "50%", borderRight: 1, padding: "8px" }}>
                                            <Typography gutterBottom component="p" sx={{ fontWeight: "bold" }}>{footerItems[0].name}</Typography>
                                            <Box sx={{ paddingTop: "2px", paddingLeft: "8px" }}>
                                                <Typography variant="body2" color="text.secondary" component="p">
                                                    {row[footerItems[0].value]}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ width: "50%", padding: "8px" }}>
                                            <Typography gutterBottom component="p" sx={{ fontWeight: "bold" }}>{footerItems[1].name}</Typography>
                                            <Box sx={{ paddingTop: "2px", paddingLeft: "8px" }}>
                                                <Typography variant="body2" color="text.secondary" component="p">
                                                    {row[footerItems[1].value]}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}

export default Component;