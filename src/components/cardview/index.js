import * as React from 'react';
import { Grid, Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const Component = ({ title, keyid, description, imgsrc, children, width, sx, onActionClicked }) => {

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
                    ...sx
                }}>
                    {imgsrc ? (
                        <CardMedia
                            component="img"
                            sx={{ height: 140, objectFit: "contain" }}
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
                    <CardActions disableSpacing sx={{ mt: "auto" }}>
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
                </Card>
            </Grid>
        </>
    )
}

export default Component;