import * as React from 'react';
import { Grid, Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { Typography, IconButton } from '@mui/material';
import { Edit as EditIcon, DeleteOutlined as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const Component = ({ row, keyName, children, width, sx, onActionClicked }) => {

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
                    <CardMedia
                        component="img"
                        sx={{ height: 140 }}
                        src={row.ProductImage}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {row.ProductName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="p">
                            {row.ProductDescription}
                        </Typography>
                        {children}
                    </CardContent>
                    <CardActions disableSpacing sx={{ mt: "auto" }}>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="view"
                            onClick={() => OnActionClicked(row[keyName], 'view')}
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="Edit"
                            onClick={() => OnActionClicked(row[keyName], 'edit')}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="Delete"
                            onClick={() => OnActionClicked(row[keyName], 'delete')}
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