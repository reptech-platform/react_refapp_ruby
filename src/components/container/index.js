import * as React from 'react';
import { Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DRAWER_WIDTH } from "config";

const openedMixin = (theme) => ({
    marginLeft: DRAWER_WIDTH,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        marginLeft: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const ContentBody = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    padding: 0,
    height: "100vh",
    height: "100%",
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

const Component = ({ children, open }) => {
    return (
        <ContentBody open={open}>
            <Toolbar />
            {children}
        </ContentBody>
    );
}

export default Component;
