import React from 'react';
import phonepay_img from './phonepay.png';
import scanner_img from './scanner.png';
import paytm_img from './paytm.png';
import gpay_img from './gpay.png';
import { useTheme } from '@mui/material';

const PayWithUPIQR = () => {
  const theme = useTheme();
  return (
    <div style={{
      padding: 20,
      backgroundColor:theme.palette.background.paper,
      borderRadius: 10,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: '1.5em', marginBottom: 20 }}>Pay With UPI QR</h2>
      <div style={{ display: 'flex', alignItems: 'center',border:"1px solid rgba(0,0,0,0.1)",borderRadius:"5px"}}>
        <div style={{ position: 'relative',width:"50%",marginRight:'20px'}}>
          <img src={scanner_img} alt="QR Code" style={{ width: "100%", height: "300px"}} />
          <button style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: "translate(-50%,-50%)",
            padding: '10px 20px',
            background: 'linear-gradient(180deg, #DBE68E, #DD776F)',
            border: 'none',
            borderRadius: 15,
            color: 'white',
            cursor: 'pointer',
          }} type="button">
            Show QR
          </button>
        </div>
        <div style={{padding:'10px'}} >
          <p>Scan the QR using any UPI app on your phone.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <img src={phonepay_img} alt="UPI Icon 1" style={{ width: 24, height: 24,borderRadius:"50%"}} />
            <img src={gpay_img} alt="UPI Icon 2" style={{ width: 24, height: 24,borderRadius:"50%" }} />
            <img src={paytm_img} alt="UPI Icon 3" style={{ width: 24, height: 24,borderRadius:"50%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayWithUPIQR;
