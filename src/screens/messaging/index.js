import React from 'react';
import { Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Container from "screens/container";

const Component = (props) => {
  return (
    <Container {...props}>
      <Typography variant="h6" gutterBottom style={{fontSize:'16px',fontWeight:'500'}}>
        <strong>User name,</strong> Here’s what’s happening with your chats last 24 hours
      </Typography>
      
      <div style={{ display: 'flex', width:"80%",gap:'10px',marginTop:'15px'}}>
        <div style={{ backgroundColor: '#EAFFF3', borderRadius: '6px', border: '0.2px solid #00000010', boxShadow: '0 2px 10px #00000008',padding:'10px', height: 'fit-content', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
            <div>
              <Typography variant="h6" style={{ color: '#1F8B4F', fontWeight: '400', fontSize: '14px' }}>Active Chats</Typography>
              <Typography variant="h4" style={{ color: '#252525', fontWeight: 'bold' }}>03</Typography>
            </div>
            <IconButton style={{ padding: '5px', backgroundColor: 'white', borderRadius: '50%' }}>
              <ArrowForwardIosIcon style={{ color: '#252525', padding: '2px' }} />
            </IconButton>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#FFECF1', borderRadius: '6px', border: '0.2px solid #00000010', boxShadow: '0 2px 10px #00000008', padding:'10px', height: 'fit-content', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="h6" style={{ color: '#BD0C3A', fontWeight: '400', fontSize: '14px' }}>Unseen Missed Chats</Typography>
              <Typography variant="h4" style={{ color: '#252525', fontWeight: 'bold' }}>02</Typography>
            </div>
            <IconButton style={{ padding: '5px', backgroundColor: 'white', borderRadius: '50%' }}>
              <ArrowForwardIosIcon style={{ color: '#252525', padding: '2px' }} />
            </IconButton>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#F0ECFF', borderRadius: '6px', border: '0.2px solid #00000010', boxShadow: '0 2px 10px #00000008', padding:'10px', height: 'fit-content', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
            <div>
              <Typography variant="h6" style={{ color: '#2C1096', fontWeight: '400', fontSize: '14px' }}>In Queue</Typography>
              <Typography variant="h4" style={{ color: '#252525', fontWeight: 'bold' }}>04</Typography>
            </div>
            <IconButton style={{ padding: '5px', backgroundColor: 'white', borderRadius: '50%' }}>
              <ArrowForwardIosIcon style={{ color: '#252525', padding: '2px' }} />
            </IconButton>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', position: 'relative' }}>
        <div style={{display:'flex',position: 'absolute', top: '-20px', left: '10px', backgroundColor: 'white',borderTop: '1px solid', borderRadius: '6px 6px 0 0', padding: '5px 10px', boxSizing: 'border-box',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{borderRadius:'50%',backgroundColor:'red',height:'10px',width:'10px',marginRight:"8px"}}></div>
          <Typography variant="body2" style={{ color: 'black',height:'20px' }}>Live Chat</Typography>
        </div>
        <div style={{ borderRadius: '6px', border: '0.2px solid #00000010', height: '100px',backgroundColor: 'white',boxShadow: '0 2px 10px #00000008', paddingTop: '20px' }}>
          
        </div>
      </div>
    </Container>
  );
};

export default Component;
