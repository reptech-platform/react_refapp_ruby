import React from "react";
import { Box, Typography, Divider, Grid, Button } from '@mui/material';
import Container from "screens/container";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { styled } from '@mui/material/styles';
import { TextInput, FileInput, RadioGroup, RatingGroup } from "components";
import InformationForm from "config/informationForm.json";

const BoxContainer = styled(Box)(() => ({
    margin: "10px 0px 10px 0px", padding: 5, display: 'flex', flexDirection: "column",
    width: '100%', borderRadius: 5, border: '1px solid lightgrey'
}));

const InputContainer = ({ item, children }) => {

    const OnInputChange = (e) => {
        console.log(e);
    }

    return (
        <>
            <BoxContainer>
                <Typography noWrap variant="subheader" component="div">
                    {item.label}
                </Typography>
                {item.type === 'para' && (
                    <Typography variant="body1" component="div">
                        {item.content}
                    </Typography>
                )}
                {item.caption && (
                    <Typography variant="colorcaption" component="div">
                        {item.caption}
                    </Typography>
                )}
                {item.type === 'text' && (
                    <TextInput id={item.key} name={item.key} placeHolder={item.label} value={item.value} validators={item.validators}
                        validationMessages={item.validationMessages} OnInputChange={OnInputChange} />
                )}
                {item.type === 'file' && (
                    <FileInput id={item.key} name={item.key} value={item.value} fileName={item.fileName} type={item.ftype}
                        validators={item.validators} validationMessages={item.validationMessages}
                        acceptTypes={item.accepttypes} OnInputChange={OnInputChange} />
                )}
                {item.type === 'option' && (
                    <RadioGroup id={item.key} name={item.key} options={item.options}
                        placeHolder={item.label} value={item.value} validators={item.validators}
                        validationMessages={item.validationMessages} OnInputChange={OnInputChange} />
                )}
                {item.type === 'rating' && (
                    <RatingGroup id={item.key} name={item.key} value={item.value} validators={item.validators}
                        validationMessages={item.validationMessages} OnInputChange={OnInputChange} />
                )}

                {item.type === 'ratinggroup' && item.options && item.options.map((x, i) => (
                    <RatingGroup id={item.key} name={item.key} label={x}
                        placeHolder={item.label} value={item.value} validators={item.validators}
                        validationMessages={item.validationMessages} OnInputChange={OnInputChange} />
                ))}

                {children}
            </BoxContainer>
        </>
    );
}

const Component = (props) => {
    const { title } = props;
    const form = React.useRef(null);
    const [initialized, setInitialized] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    const handleSubmit = () => {

    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    if (initialized) {
        setInitialized(false);
        for (let prop of InformationForm) {
            delete prop['value'];
        }
        setRows(InformationForm);
    }

    React.useEffect(() => {
        setInitialized(true);
    }, []);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                </Box>
                <Divider />
                <ValidatorForm ref={form} onSubmit={handleSubmit}>
                    {rows.map((x) => (
                        <InputContainer key={x.key} item={x} />
                    ))}
                </ValidatorForm>
                <Divider />
                <Box sx={{ width: '100%' }}>
                    <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                        <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>
                    </Grid>
                </Box>
            </Container>
        </>

    );

};

export default Component;