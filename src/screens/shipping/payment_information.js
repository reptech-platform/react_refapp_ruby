import React from 'react';
import { TextInput } from 'components';
import { useTheme } from '@mui/material';

const PaymentInformationCard = ({ cardDetails, onInputChange }) => {
    const theme = useTheme();
    return (
        <div style={{ padding: 20, boxSizing: "border-box",backgroundColor:theme.palette.background.paper, borderRadius: 10, boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h2>Payment Information</h2>
            <div style={{ marginBottom: 20 }}>
                <label>Card Number</label>
                <TextInput
                    mode="edit"
                    type="text"
                    placeHolder="Card Number"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    editable={true}
                    style={{ width: "100%" }}
                    validators={["required"]}
                    validationMessages={["Card number should not be empty"]}
                    OnInputChange={onInputChange}
                />
            </div>
            <div style={{ marginBottom: 20 }}>
                <label>Name on Card</label>
                <TextInput
                    mode="edit"
                    type="text"
                    placeHolder="Name on Card"
                    id="nameOnCard"
                    name="nameOnCard"
                    value={cardDetails.nameOnCard}
                    editable={true}
                    style={{ width: "100%" }}
                    validators={["required"]}
                    validationMessages={["Name on card should not be empty"]}
                    OnInputChange={onInputChange}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                    <label>Expiration Date</label>
                    <div style={{ display: 'flex' }}>
                        <TextInput
                            mode="edit"
                            type="text"
                            placeHolder="MM"
                            id="expirationMonth"
                            name="expirationMonth"
                            value={cardDetails.expirationMonth}
                            editable={true}
                            style={{ width: "50%", marginRight: 5 }}
                            validators={["required"]}
                            validationMessages={["Expiration month should not be empty"]}
                            OnInputChange={onInputChange}
                        />
                        <TextInput
                            mode="edit"
                            type="text"
                            placeHolder="YYYY"
                            id="expirationYear"
                            name="expirationYear"
                            value={cardDetails.expirationYear}
                            editable={true}
                            style={{ width: "50%" }}
                            validators={["required"]}
                            validationMessages={["Expiration year should not be empty"]}
                            OnInputChange={onInputChange}
                        />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label>Security Code</label>
                    <TextInput
                        mode="edit"
                        type="text"
                        placeHolder="CVV"
                        id="securityCode"
                        name="securityCode"
                        value={cardDetails.securityCode}
                        editable={true}
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["Security code should not be empty"]}
                        OnInputChange={onInputChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentInformationCard;
