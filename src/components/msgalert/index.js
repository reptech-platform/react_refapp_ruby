import React from 'react';
import { Alert as MuiAlert, Snackbar, Stack } from '@mui/material';
import TimerSession from "shared/useTimerSession";
import Helper from "shared/helper";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Component = (props) => {

    const [alert] = TimerSession('alert', true);

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        sessionStorage.removeItem('alert');
        setOpen(false);
    };

    React.useEffect(() => {
        const fn = () => {
            let bBool = !Helper.IsJSONEmpty(alert) || false;
            setOpen(bBool);
        };
        fn();

    }, [alert]);


    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert?.type} sx={{ width: '100%' }}>
                    {alert?.msg}
                </Alert>
            </Snackbar>
        </Stack>
    );

};

export default Component;