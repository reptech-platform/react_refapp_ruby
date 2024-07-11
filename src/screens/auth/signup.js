import { useEffect, useState } from "react";
import { Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import authConfig from "config/authConfig.json";
import RenderAuthControls from "components/formControls/RenderAuthControls";
import { useNavigate } from "react-router-dom";
import { GenerateOTP, LoginUser, SignupUser, VerifyUser } from "shared/services";
import LogoIcon from "assets/images/LOGO.svg";
import { Image } from "components";
import { OTPComp } from "./childs";
import session from "shared/session";
import poster from "assets/images/poster.png";
import { ValidatorForm } from 'react-material-ui-form-validator';

const Component = (props) => {
  const [row, setRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [OTPForm,setOTPForm] = useState(false);

  const navigate = useNavigate();
  
  const OnSubmit = async () => {
      const payload = {
        userName : newRow.Email,
        email : newRow.Email,
        password : newRow.Password
      }
      global.Busy(true);
      const res = await SignupUser(payload);
      if(res.status){
        setNewRow((prev) => ({
          ...prev, user: res.values
      }));
        const GRes = await GenerateOTP(newRow.Email);
        global.Busy(false);
        if(GRes.status){
          setOTPForm(true);
        }
      }else{
        global.Busy(false);
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
      ['signup'].forEach(elm => {
          for (let prop of authConfig[elm]) {
              delete prop['value'];
          }
      });
      setRow(authConfig);
  }

  useEffect(() => {
      setInitialized(true);
  }, []);
  
   const handleConfirmOTP = async () => {
    global.Busy(true);
       const res = await VerifyUser(newRow.user.userId);
       if(res.status){
         const loginRes = await LoginUser({userName:newRow.Email,password:newRow.Password});
         global.Busy(false);
         if(loginRes.status){
           session.Store("isAuthenticated",true);
           session.Store("jwtToken",loginRes.values.token);
           navigate('/');
           global.AlertPopup("success", "You are signed up successfully!");
         }
       }else{
        global.Busy(false);
        global.AlertPopup("error", res.statusText);
      }
  };
  useEffect(() => {
    ValidatorForm.addValidationRule('isStrongPassword', (value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
    });
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === newRow.Password;
    });
    return () => {
      ValidatorForm.removeValidationRule('isStrongPassword');
      ValidatorForm.removeValidationRule('isPasswordMatch');
    };
  }, [newRow.Password]);

  return (
    <Stack direction="row">
        <Image sx={{ width: "49%", height: "100vh" }} alt="poster" src={poster} />
        {OTPForm ? (
          <OTPComp  setOTPForm={(x) => setOTPForm(x)} onSubmit={handleConfirmOTP} newRow={newRow} />
        ) : (
         <Stack direction="column" alignItems="center" justifyContent="center" gap={3} sx={{ width:"460px",mx:"auto" }}>
             <Image sx={{ width: 190, height: 100, mr: 2 }} alt="logo" src={LogoIcon} />
              <Typography variant="h4" component="div" sx={{fontWeight:"bold"}}>
                Signup via Email 
              </Typography>
              <Typography variant="inherit">
                We’ll send a verification code to your email, which you can enter on the following screen.
              </Typography>
              <RenderAuthControls {...props} onInputChange={OnInputChange}
                  controls={row.signup} onSubmit={OnSubmit} formSubmit="Signup" />
               <Typography variant="inherit" onClick={() => navigate("/login")} sx={{cursor:"pointer"}}>
                Login
              </Typography>
          </Stack> 
        )}
    </Stack>
  )
}

export default Component