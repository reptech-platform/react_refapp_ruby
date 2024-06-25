import React from 'react';
import Container from "screens/container";
import ShippingInformationCard from './shipping_information_card';
import OrderSummary from './order_summary';
import PaymentInformationCard from './payment_information';
import PayWithUPIQR from './payment_QR';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { useTheme } from '@mui/material';



const Component = (props) => {
    const theme=useTheme()
    const [shippingInfo, setShippingInfo] = React.useState({
        fullName: '',
        streetAddress: '',
        aptSuite: '',
        city: '',
        state: '',
        zipCode: '',
        emailAddress: '',
        billingAddress: false
    });

    const [cardDetails, setCardDetails] = React.useState({
        cardNumber: '',
        nameOnCard: '',
        expirationMonth: '',
        expirationYear: '',
        securityCode: ''
    });

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value)
    }, []);

    const handleShippingInfoChange = (e) => {
        const { name, value } = e
        setShippingInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
        
    };

    const handleDropDownChange = ({ name, value }) => {
        setShippingInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
       
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e
        setCardDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();  
        console.log('Shipping Info:', shippingInfo);
        console.log('Card Details:', cardDetails);
    };

    return (
        <Container {...props}>
        <ValidatorForm onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20,boxSizing:"border-box"}}>
                <div style={{ flexGrow: 1,flexShrink:2, marginRight: 20,}}>
                    <ShippingInformationCard
                        shippingInfo={shippingInfo}
                        onInputChange={handleShippingInfoChange}
                        onDropDownChange={handleDropDownChange}
                    />
                    <PaymentInformationCard
                        cardDetails={cardDetails}
                        onInputChange={handleCardDetailsChange}
                    />
                    <PayWithUPIQR />
                </div>
                <div style={{ flexGrow:1,flexShrink:1}}>
                    <OrderSummary />
                    <button style={{
                        width: '100%',
                        height: '45px',
                        padding: '8px 15px',
                        backgroundColor: theme.palette.mode === "dark" ? 'white' : 'black',
                        color:  theme.palette.mode === "dark" ? 'black' : 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        marginTop: 30,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxSizing: 'border-box',
                    }} type="submit">
                        Place Your Order
                    </button>
                </div>
            </div>
        </ValidatorForm>
        </Container>
    );
};

export default Component;
