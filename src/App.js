import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { Header, Container, Drawer, AlertMessage } from 'components';
import RouteItems from "./Routes";
import { DefaultTheme, DarkTheme, LightTheme } from "./theme";
import TimerSession from "shared/useTimerSession";

import "./App.css";

const defaultToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzYWluaWtoaWxhMTk5OUBnbWFpbC5jb20iLCJleHAiOjE3MjMwNzY1OTQsImlhdCI6MTcyMTI3NjU5NCwiZW1haWwiOiJzYWluaWtoaWxhMTk5OUBnbWFpbC5jb20ifQ.uUPOMMSrMOTNHnIPcEThLLsOkl6oPKhF8Rl4z9IKNgW_iuaWuh9SUjPWgoTh02LffOPy9mrir-46fITZY2RuZw";

window.Busy = (bBool) => {
  var x = document.getElementById("busyloader");
  if (x) x.className = bBool ? "loader display-block" : "loader display-none";
};

window.AlertPopup = (type, msg) => {
  sessionStorage.setItem('alert', JSON.stringify({ msg, type }));
};

const Component = () => {
  const [open, setOpen] = React.useState(false);
  const [customTheme, setCustomTheme] = React.useState(DefaultTheme);
  const [theme] = TimerSession('theme');

  const OnDrawerClicked = () => { setOpen(!open); }

  React.useEffect(() => {
    if (theme === 'Light') {
      setCustomTheme(LightTheme);
    } else if (theme === 'Dark') {
      setCustomTheme(DarkTheme);
    }
    sessionStorage.setItem('jwtToken', defaultToken);
  }, [theme]);

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <Header open={open} onDrawerClicked={OnDrawerClicked} />
          <Drawer open={open} />
          <Container open={open}>
            <RouteItems />
          </Container>
          <AlertMessage />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Component;
