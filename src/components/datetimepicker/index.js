import * as React from "react";
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import moment from "moment";


class DateTimeValidator extends ValidatorComponent {

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
                            <DateTimePicker {...rest}
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
    const [inputValue, setInputValue] = React.useState(value);

    const disabled = mode && mode === 'view' ? true : undefined;

    const OnDateChanged = ({ $d }) => {
        let utcTime = moment.utc($d).format(
            "YYYY-MM-DDTHH:mm:ss[Z]"
        );   
        setInputValue($d);
        if (OnInputChange) OnInputChange({ name, value: utcTime });
    }

    return (
        <>
            <DateTimeValidator
                id={id}
                name={name}
                size="medium"
                color="secondary"
                onChange={(e) => OnDateChanged(e)}
                value={inputValue || null}
                validators={validators}
                errorMessages={validationMessages}
                label={label}
                disabled={disabled}
            />
        </>
    );
}

export default Component;
