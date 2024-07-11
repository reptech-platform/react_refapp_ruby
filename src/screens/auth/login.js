import { useEffect, useState } from "react";
import { Typography, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";

import authConfig from "config/authConfig.json";
import RenderAuthControls from "components/formControls/RenderAuthControls";
import { LoginUser } from "shared/services";
import LogoIcon from "assets/images/LOGO.svg";
import { Image } from "components";
import { ResetPassword } from "./childs";
import session from "shared/session";
import poster from "assets/images/poster.png";

const Component = (props) => {
  const [row, setRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [passwordForm,setPasswordForm] = useState(false);
  const navigate = useNavigate();

  const OnSubmit = async () => {
      global.Busy(true);
      const res = await LoginUser({userName:newRow.Email,password:newRow.Password});
      global.Busy(false);
      if(res.status){
        session.Store("isAuthenticated",true);
        session.Store("jwtToken",res.values.token);
        session.Store("email",newRow.Email);
        navigate('/');
        global.AlertPopup("success", "You are logged in successfully!");
      }else{
        global.AlertPopup("error", res.statusText);
      }
  }

  const OnInputChange = (e) => {
      setNewRow((prev) => ({
          ...prev,
          [e.name]: e.value
      }));
  }

  if (initialized) {
      setInitialized(false);

      ['login'].forEach(elm => {
          for (let prop of authConfig[elm]) {
              delete prop['value'];
          }
      });
      setRow(authConfig);
  }

  useEffect(() => {
      setInitialized(true);
  }, []);


  return (
    <Stack direction="row">
        <Image sx={{ width: "49%", height: "100vh" }} alt="poster" src={poster} />
        {passwordForm ? (
          <ResetPassword row={row} passwordForm={passwordForm} setPasswordForm={(x) => setPasswordForm(x)} />
        ) : (
         <Stack direction="column" alignItems="center" justifyContent="center" gap={3} sx={{ width:"460px", mx:"auto" }}>
             <Image sx={{ width: 190, height: 100 }} alt="logo" src={LogoIcon} />
              <Typography variant="h4" component="div" sx={{fontWeight:"bold"}}>
                Welcome Back
              </Typography>
              <RenderAuthControls {...props} onInputChange={OnInputChange}
                  controls={row.login} onSubmit={OnSubmit} formSubmit="Login" />
              <Typography variant="inherit" onClick={() => setPasswordForm(true)} sx={{cursor:"pointer"}}>
                forgot Password?
              </Typography>
              <Typography variant="inherit" onClick={() => navigate("/signup")} sx={{cursor:"pointer"}}>
                Signup
              </Typography>
          </Stack> 
        )}       
    </Stack>
  )
}

export default Component