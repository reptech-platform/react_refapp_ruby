import React from 'react';
import { Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import { ShoppingBasket, Toc, EditNote, Checklist, Tab, GridView as GridViewIcon, Share as ShareIcon } from '@mui/icons-material';
import { DRAWER_WIDTH } from "config";
import { useNavigate } from 'react-router-dom';

const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
    border: 0,
    borderRight: `solid rgba(0,0,0,.15) 1px`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    border: 0,
    borderRight: `solid rgba(0,0,0,.15) 1px`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const CustomDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

const Component = (props) => {
    const { open } = props;
    const [expand, setExpand] = React.useState(false);
    const NavigateTo = useNavigate();

    const handleClick = () => {
        setExpand(!expand);
    };

    const theme = useTheme();

    return (
        <CustomDrawer variant="permanent" open={open} anchor="left">
            <Toolbar />
            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <List component="div" disablePadding>
                        <ListItemButton onClick={() => NavigateTo("/products")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Products">
                                    <ShoppingBasket color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Products" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/productsmany")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Products One to Many">
                                    <ShareIcon color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Products-One2Many" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/producttypes")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Product Types">
                                    <Toc color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Product Types" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/infoform")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Information Form">
                                    <EditNote color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Information Form" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/stepper")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Stepper Form">
                                    <Checklist color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Stepper Form" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/tabbed")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Tabbed Layout">
                                    <Tab color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Tabbed Layout" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/producttiles")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="Tiles Layout">
                                    <GridViewIcon color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="Tiles Layout" sx={{ pl: 1 }} />}
                        </ListItemButton>
                        <ListItemButton onClick={() => NavigateTo("/productlist")} sx={{ height: 50 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Tooltip title="List Layout">
                                    <Toc color="primary" />
                                </Tooltip>
                            </ListItemIcon>
                            {open && <ListItemText primary="List Layout" sx={{ pl: 1 }} />}
                        </ListItemButton>
                    </List>
                </ListItem>
            </List>
        </CustomDrawer>
    );
}

export default Component;
