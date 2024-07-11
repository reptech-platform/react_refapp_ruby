import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { Header, Container, Drawer, AlertMessage } from 'components';
import RouteItems from "./Routes";
import { DefaultTheme, DarkTheme, LightTheme } from "./theme";
import TimerSession from "shared/useTimerSession";
import "./App.css";
import { useLocation } from 'react-router-dom';

global.Busy = (bBool) => {
  var x = document.getElementById("busyloader");
  if (x) x.className = bBool ? "loader display-block" : "loader display-none";
};

global.AlertPopup = (type, msg) => {
  sessionStorage.setItem('alert', JSON.stringify({ msg, type }));
};
const FScreenList = ["/signup","/login"];

const Component = () => {
  const [open, setOpen] = React.useState(false);
  const [customTheme, setCustomTheme] = React.useState(DefaultTheme);
  const [theme] = TimerSession('theme');

  const location = useLocation();
  const currentPath = location.pathname;

  const OnDrawerClicked = () => { setOpen(!open); }

  React.useEffect(() => {
    if (theme === 'Light') {
      setCustomTheme(LightTheme);
    } else if (theme === 'Dark') {
      setCustomTheme(DarkTheme);
    }
  }, [theme]);
 
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
        {FScreenList.includes(currentPath) ? (
                <RouteItems />
          ) : (
              <>
              <Header open={open} onDrawerClicked={OnDrawerClicked} />
                <Drawer open={open} />
                <Container open={open}>
                  <RouteItems />
                </Container>
              </>
          )}
          <AlertMessage />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Component;
