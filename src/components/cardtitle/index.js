import * as React from 'react';
import { Box, Grid, Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const Component = ({ title, keyid, description, imgsrc, children, width, sx, productStatus, onActionClicked }) => {

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    return (
        <>
            <Grid item>
                <Card sx={{
                    boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.25)",
                    display: "flex", m: 1
                }}>
                    {imgsrc ? (
                        <CardMedia
                            sx={{
                                width: "10%", objectFit: "contain",
                                borderRight: 1, borderColor: "rgba(0, 0, 0, 0.05)"
                            }}
                            component="img"
                            src={imgsrc}
                        />
                    ) : (
                        <CardMedia sx={{
                            width: "10%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#8c92ac",
                            textAlign: "center",
                            borderRight: 1, borderColor: "rgba(0, 0, 0, 0.05)"
                        }}>
                            Preview <br /> Not Available
                        </CardMedia>
                    )}
                    <Box sx={{ display: 'flex', flex: '1 0 auto', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="p">
                                {description}
                            </Typography>
                            {children}
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <CardActions disableSpacing sx={{ mt: "auto" }}>
                                <Typography variant={productStatus && productStatus.toLowerCase()} component="p">
                                    {productStatus}
                                </Typography>
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
                            </CardActions>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </>
    )
}

export default Component;