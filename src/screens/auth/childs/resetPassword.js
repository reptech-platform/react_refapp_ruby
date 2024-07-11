import React, { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography, Button } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';

import RenderAuthControls from "components/formControls/RenderAuthControls";
import { GenerateOTP, ResetPassword } from "shared/services";

import { OTPComp } from ".";

const Component = (props) => {
  const { row, setPasswordForm } = props;
  const [newRow, setNewRow] = useState({});
  const [OTPForm,setOTPForm] = useState(false);
  const [resetPassword,setResetPassword] = useState(false)
  
  const handleBackButtonClick = () => {
    setPasswordForm(false)
  };

  const OnInputChange = (e) => {
    setNewRow((prev) => ({
        ...prev,
        [e.name]: e.value
    }));
  }
  
  const OnSubmit = async (email) => {
   const payload = {
      email: newRow.Email,
      newPassword: newRow.Password,
      verifyPassword: newRow.ConfirmPassword
   }
   global.Busy(true);
   const res = await ResetPassword(payload);
   global.Busy(false);
   if(res.status){
      setPasswordForm(false);
      global.AlertPopup("success", "Password resetted successfully!");
    }else{
      global.AlertPopup("error", res.statusText);
    }
  }

 const onSubmitEmail = async () => {
  global.Busy(true);
  const res = await GenerateOTP(newRow.Email);
  global.Busy(false);
  if(res.status){
    setOTPForm(true);
  }
 }

 const handleOTPSubmit = () => {
  setOTPForm(false);
  setResetPassword(true);
 }

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
   <>
     {OTPForm ? (
      <OTPComp  setOTPForm={(x) => setOTPForm(x)} onSubmit={handleOTPSubmit} newRow={newRow} />
      ) : (
      <Box sx={{position: 'relative', width: '50%', padding: "50px", backgroundColor: '#f7f9fd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={handleBackButtonClick} sx={{ position: 'absolute', top: '20px', left: '20px'}}>
          <ArrowBackIcon sx={{ color: '#232A36' }}/>
        </Button>
        {resetPassword ? (
               <Box sx={{ width: "85%", borderRadius: "13px", backgroundColor: 'white', padding: '40px' }}>
               <Box>
                 <Typography variant="h4" sx={{ fontWeight: 700,color: '#293241' }}>
                   Reset your password
                 </Typography>
                 <RenderAuthControls {...props} onInputChange={OnInputChange}
                       controls={row.resetPassword} onSubmit={OnSubmit} formSubmit="Confirm" />
                   <Typography variant="body1" sx={{ color: '#536075CC', mt:2, textAlign:"center"}}>
                     Need help? Email us help@recodign.com
                   </Typography>
               </Box>
             </Box>
        ) : (
           <Box sx={{ width: "85%", borderRadius: "13px", backgroundColor: 'white', padding: '40px', boxSizing: 'border-box' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#293241' }}>
                  Enter your Email
                </Typography>
                <RenderAuthControls {...props} onInputChange={OnInputChange}
                      controls={row.forgotPassword} onSubmit={onSubmitEmail} formSubmit="Confirm" />
                  <Typography variant="body1" sx={{color: '#536075CC', mt:2, textAlign:"center" }}>
                    Need help? Email us help@recodign.com
                  </Typography>
              </Box>
            </Box>
        )}
       </Box>
      )}
   </>
  )
}

export default Component;