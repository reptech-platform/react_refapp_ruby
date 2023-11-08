import React from 'react';
import { Box, Stepper, Step, StepLabel, Divider, Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StepperContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderTopWidth: "thin",
    borderBottomWidth: "thin",
    padding: "15px 0px 15px 0px"
}));

const Component = (props) => {
    const { steps, step, stepComponents, isSubmitted, setIsSubmitted, requiredSubmit, inputRefs } = props;

    const stepItems = steps || [];
    const stepsCount = stepItems.length - 1;

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = () => {
        return activeStep > 0 && activeStep < stepsCount;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        setIsSubmitted(false);
        if (requiredSubmit) {
            const stepName = stepComponents[activeStep].props.name;
            inputRefs[stepName].submit();
        } else {
            const newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped.delete(activeStep);
            }
            setSkipped(newSkipped);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setIsSubmitted(false);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        setIsSubmitted(false);
        const newSkipped = skipped;
        newSkipped.add(activeStep);
        setSkipped(newSkipped);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    React.useEffect(() => {
        const fn = () => {
            const newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped.delete(activeStep);
            }
            setSkipped(newSkipped);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        };
        if (isSubmitted) fn();

    }, [isSubmitted]);

    React.useEffect(() => {
        if (step) setActiveStep(step);
    }, [step]);


    const RenderStepperActions = () => {
        return (
            <>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                        {activeStep > 0 && <Button variant="contained" onClick={handleBack}>Prev</Button>}
                        {isStepOptional() && (
                            <Button variant="contained" onClick={handleSkip} >Skip</Button>
                        )}
                        {activeStep < stepsCount && <Button variant="contained" onClick={handleNext}>Next</Button>}
                        {activeStep === stepsCount && <Button variant="contained">Submit</Button>}
                    </Grid>
                </Box>
            </>
        );
    }

    return (
        <>
            <StepperContainer>
                <Stepper activeStep={activeStep}>
                    {stepItems.map((label, index) => {
                        const stepProps = {};
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </StepperContainer>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    {stepComponents[activeStep]}
                </>
            )}
            <Divider />
            <RenderStepperActions />
        </>
    )
}

export default Component;