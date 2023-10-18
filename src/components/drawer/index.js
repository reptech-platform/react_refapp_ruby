import React from 'react';
import { Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import { Pages, ShoppingBasket, Toc, EditNote, Checklist } from '@mui/icons-material';
import { DRAWER_WIDTH } from "config";
import { useNavigate } from 'react-router-dom';

const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
    border: 0,
    borderRight: `dashed ${theme.palette.grey[600]} 1px`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    border: 0,
    borderRight: `dashed ${theme.palette.grey[600]} 1px`,
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
                    <ListItemButton sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }} onClick={open ? handleClick : undefined}>
                        <ListItemIcon sx={{
                            minWidth: 0,
                            mr: open ? 1 : 'auto',
                            justifyContent: 'center',
                        }}>
                            <Pages sx={{ width: 24, height: 24, mr: 0 }} />
                        </ListItemIcon>
                        <ListItemText primary={"Pages"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    {open && <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => NavigateTo("/products")}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <ShoppingBasket />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => NavigateTo("/producttypes")}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Toc />
                            </ListItemIcon>
                            <ListItemText primary="Product Types" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => NavigateTo("/infoform")}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <EditNote />
                            </ListItemIcon>
                            <ListItemText primary="Information Form" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => NavigateTo("/stepper")}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <Checklist />
                            </ListItemIcon>
                            <ListItemText primary="Stepper Form" />
                        </ListItemButton>
                    </List>
                    }
                </ListItem>
            </List>
        </CustomDrawer>
    );
}

export default Component;
