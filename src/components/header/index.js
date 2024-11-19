import * as React from 'react';
import { IconButton, AppBar, Toolbar, Typography, CssBaseline, Avatar, Switch } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, Person } from '@mui/icons-material';
import LogoIcon from "assets/logo.png";
import { Image } from 'components';
import TimerSession from 'shared/useTimerSession';
import Session from 'shared/session';

const Component = ({ open, onDrawerClicked }) => {
    const [themeName, setThemeName] = React.useState("Light");
    const [themeLabel, setThemeLabel] = React.useState("Dark");
    const [lastTheme] = TimerSession("theme");

    const onSwitchChanged = (e) => {
        let _thName = e.target.checked ? "Dark" : 'Light';
        let _thLabel = e.target.checked ? 'Light' : "Dark";
        setThemeLabel(_thLabel);
        setThemeName(_thName);
        Session.Store('theme', _thName);
    }

    React.useEffect(() => {
        if (lastTheme) {
            let _thLabel = lastTheme === 'Light' ? "Dark" : 'Light';
            setThemeName(lastTheme);
            setThemeLabel(_thLabel);
        }
    }, [lastTheme]);

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
                    {/* <Typography noWrap>{themeLabel}</Typography><Switch value="active" onChange={onSwitchChanged} checked={themeName === 'Dark'}></Switch> */}
                    <Typography variant="avatar" noWrap component="div" sx={{ marginRight: 1 }}>Welcome! User</Typography>
                    <Avatar
                        style={{ cursor: "pointer" }}
                    ><Person />
                    </Avatar>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Component;
