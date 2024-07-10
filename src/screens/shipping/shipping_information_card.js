import * as React from "react";
import { TextInput, DropDown, CheckInput } from "components";
import { useTheme } from '@mui/material';

const ShippingInformationCard = ({ shippingInfo, onInputChange, onDropDownChange }) => {
    const theme=useTheme()
    const stateOptions = [
        { id: 1, value: 'ANDHRA_PRADESH', content: 'Andhra Pradesh' },
        { id: 2, value: 'ARUNACHAL_PRADESH', content: 'Arunachal Pradesh' },
        { id: 3, value: 'ASSAM', content: 'Assam' },
        { id: 4, value: 'BIHAR', content: 'Bihar' },
        { id: 5, value: 'CHHATTISGARH', content: 'Chhattisgarh' },
        { id: 6, value: 'GOA', content: 'Goa' },
        { id: 7, value: 'GUJARAT', content: 'Gujarat' },
        { id: 8, value: 'HARYANA', content: 'Haryana' },
        { id: 9, value: 'HIMACHAL_PRADESH', content: 'Himachal Pradesh' },
        { id: 10, value: 'JHARKHAND', content: 'Jharkhand' },
        { id: 11, value: 'KARNATAKA', content: 'Karnataka' },
        { id: 12, value: 'KERALA', content: 'Kerala' },
        { id: 13, value: 'MADHYA_PRADESH', content: 'Madhya Pradesh' },
        { id: 14, value: 'MAHARASHTRA', content: 'Maharashtra' },
        { id: 15, value: 'MANIPUR', content: 'Manipur' },
        { id: 16, value: 'MEGHALAYA', content: 'Meghalaya' },
        { id: 17, value: 'MIZORAM', content: 'Mizoram' },
        { id: 18, value: 'NAGALAND', content: 'Nagaland' },
        { id: 19, value: 'ODISHA', content: 'Odisha' },
        { id: 20, value: 'PUNJAB', content: 'Punjab' },
        { id: 21, value: 'RAJASTHAN', content: 'Rajasthan' },
        { id: 22, value: 'SIKKIM', content: 'Sikkim' },
        { id: 23, value: 'TAMIL_NADU', content: 'Tamil Nadu' },
        { id: 24, value: 'TELANGANA', content: 'Telangana' },
        { id: 25, value: 'TRIPURA', content: 'Tripura' },
        { id: 26, value: 'UTTARPRADESH', content: 'Uttar Pradesh' },
        { id: 27, value: 'UTTARAKHAND', content: 'Uttarakhand' },
        { id: 28, value: 'WESTBENGAL', content: 'West Bengal' }
      ];

    return (
        <div style={{ padding: 20, boxSizing: "border-box",backgroundColor:theme.palette.background.paper, borderRadius: 10, boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h2>Shipping Information</h2>
            <div style={{ marginBottom: 20 }}>
                <label>Full Name</label>
                <TextInput
                    mode="edit"
                    type="text"
                    placeHolder="Full Name"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    editable={true}
                    style={{ width: "100%" }}
                    validators={["required"]}
                    validationMessages={["Name should not be empty"]}
                    OnInputChange={onInputChange}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between",  marginBottom: 20 }}>
                <div style={{ flex: 2 }}>
                    <label>Street Address</label>
                    <TextInput
                        mode="edit"
                        type="text"
                        placeHolder="Street Address"
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingInfo.streetAddress}
                        editable={true}
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["Street address should not be empty"]}
                        OnInputChange={onInputChange}
                    />
                </div>
                <div style={{ flex: 1, marginLeft: 20 }}>
                    <label>Apt/Suite</label>
                    <TextInput
                        mode="edit"
                        type="text"
                        placeHolder="Apt/Suite"
                        id="aptSuite"
                        name="aptSuite"
                        value={shippingInfo.aptSuite}
                        editable={true}
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["Apt/Suite should not be empty"]}
                        OnInputChange={onInputChange}
                    />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between",  marginBottom: 20 }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                    <label>City</label>
                    <TextInput
                        mode="edit"
                        type="text"
                        placeHolder="City"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        editable={true}
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["City should not be empty"]}
                        OnInputChange={onInputChange}
                    />
                </div>
                <div style={{ flex: 1, marginRight: 10 }}>
                    <label>State</label>
                    <DropDown
                        mode="edit"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        options={stateOptions}
                        valueId="value"
                        nameId="value"
                        contentId="content"
                        defaultLabel="Select State"
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["State should not be empty"]}
                        onDropDownChange={onDropDownChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label>Zip Code</label>
                    <TextInput
                        mode="edit"
                        type="text"
                        placeHolder="Zip Code"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        editable={true}
                        style={{ width: "100%" }}
                        validators={["required"]}
                        validationMessages={["Zip Code should not be empty"]}
                        OnInputChange={onInputChange}
                    />
                </div>
            </div>
            <div style={{ marginBottom: 20 }}>
                <label>Email Address</label>
                <TextInput
                    mode="edit"
                    type="email"
                    placeHolder="Email Address"
                    id="emailAddress"
                    name="emailAddress"
                    value={shippingInfo.emailAddress}
                    editable={true}
                    style={{ width: "100%" }}
                    validators={["required", "isEmail"]}
                    validationMessages={["Email should not be empty", "Email is not valid"]}
                    OnInputChange={onInputChange}
                />
            </div>
            <div style={{ marginBottom: 20 }}>
                <CheckInput
                    mode="edit"
                    label="Billing address is same as service address"
                    id="billingAddress"
                    name="billingAddress"
                    value={shippingInfo.billingAddress}
                    editable={true}
                    validators={["required"]}
                    validationMessages={["This field is required"]}
                    OnInputChange={onInputChange}
                    sx={{ width: "100%" }}
                />
            </div>
        </div>
    );
};

export default ShippingInformationCard;
