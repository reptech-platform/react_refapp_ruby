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
                    display: "flex",
                    flexDirection: "column",
                    border: '0.75px solid #D2D4D7',
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
                            {footerItems && footerItems.length > 0 && (
                                <Table sx={{ display: 'table', width: '100%', border: 0, backgroundColor: "#ffffff" }}>
                                    <TableBody>
                                        <TableRow sx={{ borderTop: '0.75px solid #D2D4D7' }}>
                                            {footerItems.map((x, index) => (
                                                <TableCell key={index} sx={{ width: footerItems.length > 1 ? "50%" : "100%", padding: "8px", borderRight: index === 0 && footerItems.length > 1 ? "0.75px solid #D2D4D7" : 0 }}>
                                                    <Typography gutterBottom component="p" sx={{ fontWeight: "bold", color: "#000000" }}>{x.name}</Typography>
                                                    <Box sx={{ paddingTop: "2px", paddingLeft: "8px" }}>
                                                        <Typography variant="body2" color="text.secondary" component="p" sx={{ color: "#000000" }}>
                                                            {row[x.value]?.toString()}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            ))}

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>

                    </CardActions>
                </Card>
            </Grid>
        </>
    )
}

export default Component;