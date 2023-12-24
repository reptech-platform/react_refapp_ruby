import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    ProductCreate,
    Products, ProductTiles, ProductList,
    ProductEdit, StepperForm,
    ProductView, ProductTypes, InformatForm
} from "screens";

const Component = (props) => {

    return (
        <Routes>
            <Route path="/infoform" element={<InformatForm {...props} title={'Information Form'} />} />
            <Route path="/stepper" element={<StepperForm {...props} title={'Stepper Form'} />} />
            <Route path="/producttypes" element={<ProductTypes {...props} title={'Product Types'} />} />
            <Route path="/products/view/:id" element={<ProductView {...props} title={'View Product'} />} />
            <Route path="/products/edit/:id" element={<ProductEdit {...props} title={'Edit Product'} />} />
            <Route path="/products/create" element={<ProductCreate {...props} title={'Create Product'} />} />
            <Route path="/products" element={<Products {...props} title={'Products Table'} />} />
            <Route path="/producttiles" element={<ProductTiles {...props} title={'Products Table'} />} />
            <Route path="/productlist" element={<ProductList {...props} title={'Products List'} />} />
            <Route path="/" element={<Products {...props} title={'Products Table'} nolistbar={true} />} />
        </Routes>
    )

};

export default Component;