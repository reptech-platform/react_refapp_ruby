import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    ProductCreate,
    Products, ProductTiles, ProductList,
    ProductEdit, StepperForm, TabbedLayout,
    ProductView, ProductTypes, InformatForm,
    Shipping,
    OrderList, OrderNew, OrderView, OrderEdit
} from "screens";

const Component = (props) => {
    

    return (
        <Routes>
            <Route path="/infoform" element={<InformatForm {...props} title={'Information Form'} />} />
            <Route path="/stepper" element={<StepperForm {...props} title={'Stepper Form'} />} />
            <Route path="/tabbed" element={<TabbedLayout {...props} title={'Tabbed Layout'} />} />
            <Route path="/producttypes" element={<ProductTypes {...props} title={'Product Types'} />} />
            <Route path="/products/view/:id" element={<ProductView {...props} title={'View Product'} />} />
            <Route path="/products/edit/:id" element={<ProductEdit {...props} title={'Edit Product'} />} />
            <Route path="/products/create" element={<ProductCreate {...props} title={'Create Product'} />} />
            <Route path="/products" element={<Products {...props} title={'Products Table'} />} />
            <Route path="/producttiles" element={<ProductTiles {...props} title={'Products Table'} />} />
            <Route path="/productlist" element={<ProductList {...props} title={'Products List'} />} />
            <Route path="/orders" element={<OrderList {...props} title={'Orders'} />} />
            <Route path="/order/new" element={<OrderNew {...props} title={'Create Order'} />} />
            <Route path="/order/view/:id" element={<OrderView {...props} title={'View Order'} />} />
            <Route path="/order/edit/:id" element={<OrderEdit {...props} title={'Edit Order'} />} />

            <Route path="/" element={<Products {...props} title={'Products Table'} nolistbar={true} />} />
            <Route path="/shipping" element={<Shipping />} />
        </Routes>
    )

};

export default Component;