import * as React from "react";
import { Checkbox, Box, Typography } from '@mui/material';
import { ValidatorComponent } from 'react-material-ui-form-validator';

class CheckBoxValidator extends ValidatorComponent {

    renderValidatorComponent() {
        const { mode, label, errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <>
                <Box sx={{ width: '100%', m: 0, p: 0 }}>
                    <Box sx={{
                        display: "flex", alignItems: "center", flexDirection: "row", columnGap: 1,
                        "& span": { padding: 0, margin: 0 }
                    }}>
                        <Checkbox
                            {...rest}
                            ref={(r) => { this.input = r; }}
                        />
                        <Typography nowrap="true" sx={{ textAlign: "left" }}
                            variant="labelheader">{label}</Typography>
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

    const { mode, id, name, value, label, OnInputChange, validationMessages } = props;
    const [inputValue, setInputValue] = React.useState(value);

    const disabled = mode && mode === 'view' ? true : undefined;

    const OnCheckChanged = (e) => {
        const { name, checked } = e.target;
        const value = checked;
        setInputValue(value);
        if (OnInputChange) OnInputChange({ name, value });
    }

    return (
        <>
            <CheckBoxValidator
                id={id}
                name={name}
                size="medium"
                color="secondary"
                onChange={(e) => OnCheckChanged(e)}
                value={inputValue || "false"}
                checked={inputValue || false}
                validators={['isTruthy']}
                errorMessages={validationMessages}
                label={label}
                disabled={disabled}
            />
        </>
    );
}

export default Component;
