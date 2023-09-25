import * as React from 'react';
import { IconButton, AppBar, Toolbar, Typography, CssBaseline, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Person from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from "assets/logo.png";
import { Image } from 'components';

const Component = ({ open, onDrawerClicked }) => {

    const theme = useTheme();

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => onDrawerClicked()}>
                        {!open ? <MenuIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    <Image sx={{ width: 40, height: 40, mr: 2 }} alt="logo" src={LogoIcon} />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        XYZ Company
                    </Typography>
                    <Typography variant="avatar" noWrap component="div" sx={{ marginRight: 1 }}>Welcome! User</Typography>
                    <Avatar
                        style={{
                            backgroundColor: theme.palette.secondary.main,
                            cursor: "pointer",
                        }}
                    ><Person />
                    </Avatar>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Component;
