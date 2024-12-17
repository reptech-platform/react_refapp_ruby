import * as React from "react";
import { Box, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import dayjs from 'dayjs';

class TimeValidator extends ValidatorComponent {

    renderValidatorComponent() {
        const { mode, label, errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <>
                <Box sx={{ width: '100%', m: 0, p: 0 }}>
                    <Box sx={{
                        display: "flex", alignItems: "center", flexDirection: "row", columnGap: 1,
                        "& span": { padding: 0, margin: 0 }
                    }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker {...rest}
                                ref={(r) => { this.input = r; }} />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", flexDirection: "row" }}>
                        {this.errorText()}
                    </Box>
                </Box>
            </>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={{ color: "#d32f2f" }}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

const Component = (props) => {

    const { mode, id, name, value, label, OnInputChange, validators, validationMessages } = props;
    const [inputValue, setInputValue] = React.useState(value ? dayjs(value, "HH:mm:ss") : null);

    const disabled = mode && mode === 'view' ? true : undefined;

    const OnTimeChanged = (newValue) => {
        const utcTime = newValue ? dayjs(newValue).format('HH:mm:ss') : null;
        setInputValue(newValue);
        if (OnInputChange) OnInputChange({ name, value: utcTime });
    }

    if (mode === 'view') {
        return (
            <>
                <Typography noWrap component="div">
                    {inputValue ? inputValue.format("hh:mm A") : "No time set"}
                </Typography>
            </>
        )
    }

    return (
        <>
            <TimeValidator
                id={id}
                name={name}
                size="medium"
                color="secondary"
                onChange={OnTimeChanged}
                value={inputValue}
                validators={validators}
                errorMessages={validationMessages}
                label={label}
                disabled={disabled}
            />
        </>
    );
}

export default Component;
