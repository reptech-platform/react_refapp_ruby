import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Done as DoneIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Component = (props) => {

    const { open, width, height, title, onCloseClicked, children, sxContent, action } = props;

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
            <DialogContent dividers sx={{
                ...sxContent, display: "flex", alignItems: "center"
            }}>
                {children}
            </DialogContent>
            <DialogActions>
                {action === 'add' && <Button variant="contained" startIcon={<DoneIcon />} onClick={(e) => handleStateChange(e, true)}>Add</Button>}
                {action === 'edit' && <Button variant="contained" startIcon={<DoneIcon />} onClick={(e) => handleStateChange(e, true)}>Update</Button>}
                {action === 'delete' && <Button variant="contained" startIcon={<DoneIcon />} onClick={(e) => handleStateChange(e, true)}>Ok</Button>}
                {action === 'apply' && <Button variant="contained" startIcon={<DoneIcon />} onClick={(e) => handleStateChange(e, true)}>Apply</Button>}
                <Button variant="outlined" startIcon={<CloseIcon />} onClick={(e) => handleStateChange(e, false)}>
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default Component;