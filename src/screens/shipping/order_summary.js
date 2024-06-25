import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material';
import minusicon from './baseline-minus-icon.png';
import plusicon from './baseline-plus-icon.png';
import * as Api from "shared/services";

const OrderSummary = (props) => {
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [items, setItems] = useState([]);
    console.log("items",items[0]?.img)

    const FetchResults = async () => {
        global.Busy(true);
        const { values } = await Api.GetOrderItems();
        setItems(values);
        global.Busy(false);
    };

    const handleIncrease = (index) => {
        const newItems = [...items];
        newItems[index].Order_item_quantity += 1;
        setItems(newItems);
    };

    const handleDecrease = (index) => {
        const newItems = [...items];
        if (newItems[index].Order_item_quantity > 1) {
            newItems[index].Order_item_quantity -= 1;
            setItems(newItems);
        }
    };

    useEffect(() => {
        if (!initialize) {
            setInitialize(true);
            FetchResults();
        }
    }, [initialize]);

    const totalPrice = items.reduce((total, item) => total + item.Order_item_price, 0);

    return (
        <div style={{ padding: 20, borderRadius: 10, backgroundColor: theme.palette.background.paper, boxShadow: '0 0 10px rgba(0,0,0,0.1)', margin: 'auto' }}>
            <h2 style={{ marginBottom: 20 }}>Order Summary</h2>
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    {item.OIProduct?.MainImage?(
                        <img src={item.img} alt={item.OIProduct ? item.OIProduct.Name : ""}  style={{ width: 50, height: 50, marginRight: 15 }} />
                    ): (<img src='https://via.placeholder.com/150' alt="no product Image"  style={{ width: 50, height: 50, marginRight: 15 }} />)}
                    <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{item.OIProduct?.Name}</div>
                        <div>Status: {item.Order_item_status}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Quantity:
                            <img 
                                src={minusicon} 
                                alt="Decrease" 
                                onClick={() => handleDecrease(index)} 
                                style={{ 
                                    width: 18, 
                                    height: 18, 
                                    margin: '0 5px', 
                                    cursor: 'pointer' 
                                }} 
                            />
                            {item.Order_item_quantity}
                            <img 
                                src={plusicon} 
                                alt="Increase" 
                                onClick={() => handleIncrease(index)} 
                                style={{ 
                                    width: 18, 
                                    height: 18, 
                                    margin: '0 5px', 
                                    cursor: 'pointer' 
                                }} 
                            />
                        </div>
                    </div>
                    <div style={{ marginLeft: 10 }}>Rs {item.Order_item_price}</div>
                </div>
            ))}
            <div style={{ borderTop: '1px solid #ddd', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Price:</div>
                    <div>Rs {totalPrice}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Delivery Charges:</div>
                    <div>Free</div>
                </div>
                <div style={{ borderTop: '1px solid #ddd', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 10 }}>
                    <div>Total:</div>
                    <div>Rs {totalPrice}</div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
