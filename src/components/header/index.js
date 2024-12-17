import * as React from 'react';
import { IconButton, AppBar, Toolbar, Typography, CssBaseline, Avatar, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, Person, Settings as SettingsIcon } from '@mui/icons-material';
import LogoIcon from "assets/logo.png";
import { Image, CustomDialog } from 'components';
import TimerSession from 'shared/useTimerSession';
import Session from 'shared/session';

const Component = ({ open, onDrawerClicked }) => {
    const [showSettings, setShowSettings] = React.useState(false);
    const [lastTheme] = TimerSession("theme");

    const [backupTheme] = React.useState(lastTheme);

    const handleChangeTheme = (e, value) => {
        Session.Store('theme', value);
    };

    const onSettingsClicked = () => {
        setShowSettings(true);
    }

    const OnCloseClicked = (e) => {
        if (!e) {
            Session.Store('theme', backupTheme);
        }
        setShowSettings(false);
    }

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
                    <Typography noWrap sx={{ paddingRight: 2 }}>Theme:&nbsp;{lastTheme}</Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => onSettingsClicked()}>
                        <SettingsIcon />
                    </IconButton>
                    <Typography variant="avatar" noWrap component="div" sx={{ marginRight: 1 }}>Welcome! User</Typography>
                    <Avatar
                        style={{ cursor: "pointer" }}
                    ><Person />
                    </Avatar>
                </Toolbar>
            </AppBar>
            <CustomDialog open={showSettings} title={"Theme"} action={'apply'} onCloseClicked={OnCloseClicked}>

                <ToggleButtonGroup
                    color="primary"
                    value={lastTheme}
                    exclusive
                    onChange={handleChangeTheme}
                    aria-label="Platform"
                >
                    <ToggleButton value="Default">Default</ToggleButton>
                    <ToggleButton value="Light">Light</ToggleButton>
                    <ToggleButton value="Dark">Dark</ToggleButton>
                    <ToggleButton value="Red">Red</ToggleButton>
                    <ToggleButton value="Blue">Blue</ToggleButton>
                </ToggleButtonGroup>
            </CustomDialog>
        </>
    );
}

export default Component;
