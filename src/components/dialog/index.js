import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Done as DoneIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ValidatorForm } from 'react-material-ui-form-validator';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Component = (props) => {

    const { open, width, height, title, onCloseClicked, children } = props;

    const handleStateChange = (e, bState) => {
        if (onCloseClicked) onCloseClicked(bState);
    }

    return (
        <BootstrapDialog
            sx={{
                "& .MuiDialog-paper": {
                    width: width || 400,
                    height: height
                }
            }}
            aria-labelledby="customized-dialog-title"
            open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent dividers sx={{ display: "flex", alignItems: "center" }}>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" startIcon={<DoneIcon />} onClick={(e) => handleStateChange(e, true)}>
                    Yes
                </Button>
                <Button variant="outlined" startIcon={<CloseIcon />} onClick={(e) => handleStateChange(e, false)}>
                    No
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default Component;