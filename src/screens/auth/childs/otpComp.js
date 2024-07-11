import React, { useState, useRef } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography, Button } from '@mui/material';
import { VerifyOTP } from "shared/services";

const Component = (props) => {

  const { setOTPForm, onSubmit, newRow } = props;
  const inputsRef = useRef([]);
  const [otpError,setOtpError]=useState(false)
  const [otpValue, setOtpValue] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);


  const handleBackButtonClick = () => {
   setOTPForm(false);
  };

  const handleOtpInputChange = (index, e) => {
    const value = e.target.value;
    
    const updatedOtpValue = [...otpValue];
    updatedOtpValue[index] = value;
  
    setOtpValue(updatedOtpValue.join(''));
  
    const nextInput = inputsRef.current[index + 1];
    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  
    if (updatedOtpValue.join('').length === 4) {
      setShowConfirmButton(true);
    } else {
      setShowConfirmButton(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && !e.target.value) {
      inputsRef.current[index - 1].focus();
    }
    
    inputsRef.current.forEach(input => {
        input.style.borderColor = "#D9D9D9";
    });
    setOtpError(false)
    
  };
    
  const handleSubmit = async () => {
    global.Busy(true);
    const res = await VerifyOTP({[newRow.Email] : otpValue});
    global.Busy(false);
    if(res.status && res.values){
        if (onSubmit) onSubmit();
        inputsRef.current.forEach(input => {
          input.style.borderColor = "blue";
        });
        setOtpError(false);
      } else {
        inputsRef.current.forEach(input => {
          input.style.borderColor = "red";
        });
        setOtpError(true);
      }
    }

  const resendOTP = async () => {
    global.Busy(true);
    const res = await GenerateOTP(newRow.Email);
    global.Busy(false);
    if(res.status){
      global.AlertPopup("success", "OTP sent to your mail successfully");
    }else{
      global.AlertPopup("error", "Something went wrong while sending record!");
    }
  }

  return (
      <Box sx={{position: 'relative', width: '50%', height: '100vh', padding: "50px", backgroundColor: '#f7f9fd', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button onClick={handleBackButtonClick} sx={{ position: 'absolute', top: '20px', left: '20px'}}>
        <ArrowBackIcon sx={{ color: '#232A36' }}/>
      </Button>
        <Box sx={{ width: "85%", borderRadius: "13px", backgroundColor: 'white', padding: '40px' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#293241' }}>
              Verify Code
            </Typography>
            <Typography variant="body1" sx={{ color: '#536075CC' }}>
              Code is sent to {newRow?.Email}        
            </Typography>
            <br /><br />
            <Typography variant="body1" sx={{ color: '#536075CC' }}>
              We have sent a 4-digit OTP to your registered email<br />
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center',justifyContent:"center", marginTop: "10px" }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="tel"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength="1"
                  value={otpValue[index] || ''}
                  onChange={(e) => handleOtpInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '40px',
                    marginRight: '25px',
                    height: "40px",
                    borderRadius: "5px",
                    border: '1px solid #D9D9D9',
                    textAlign: 'center',
                  }}
                />
              ))}
            </div>

            {otpError && <Typography variant="body1" sx={{ fontSize: '12px', color: '#EF3D47CC',marginTop:"4px"}}>Invalid mobile OTP please try again</Typography>}
            <br />

            {showConfirmButton && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="contained" onClick={handleSubmit} sx={{width:"100%",height: "30px",boxSizing:"border-box",borderRadius: "8px",backgroundColor: '#2E2E2E',color: '#FFFFFF',fontweight:700,fontSize:16,padding: '20px 24px',marginTop:"20px"}}>
                  Confirm OTP
                </Button>
              </Box>
            )}
            <br/>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: '#536075CC' }}>
                Need help? Email us help@recodign.com
              </Typography>
              <br />
              <Typography variant="body1" sx={{ color: '#2BACA6', cursor:"pointer" }}
               onClick={resendOTP}
              >
                Resend Code
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
  )
}

export default Component;