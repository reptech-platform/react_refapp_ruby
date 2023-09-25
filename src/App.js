import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Header, Container, Drawer, AlertMessage } from 'components';
import RouteItems from "./Routes";
import "./App.css";

global.Busy = (bBool) => {
  var x = document.getElementById("busyloader");
  if (x) x.className = bBool ? "loader display-block" : "loader display-none";
};

global.AlertPopup = (type, msg) => {
  sessionStorage.setItem('alert', JSON.stringify({ msg, type }));
};

const Component = () => {
  const [open, setOpen] = React.useState(false);

  const theme = useTheme();

  const OnDrawerClicked = () => {
    setOpen(!open);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Header open={open} onDrawerClicked={OnDrawerClicked} theme={theme} />
        <Drawer open={open} />
        <Container open={open}>
          <RouteItems />
        </Container>
        <AlertMessage />
      </Box>
    </>
  );
}

export default Component;
