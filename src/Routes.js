import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    Dashboard, Products, ProductCreate, ProductTiles, ProductList,
    ProductEdit, StepperForm, TabbedLayout,
    ProductView, ProductTypes, InformatForm,
    ProductOneToMany, ProductOneToManyCreate, ProductOneToManyEdit, ProductOneToManyView
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
            <Route path="/productsmany" element={<ProductOneToMany {...props} title={'Products One To Many'} />} />
            <Route path="/productsmany/create" element={<ProductOneToManyCreate {...props} title={'Create Products One To Many'} />} />
            <Route path="/productsmany/view/:id" element={<ProductOneToManyView {...props} title={'View Products One To Many'} />} />
            <Route path="/productsmany/edit/:id" element={<ProductOneToManyEdit {...props} title={'Edit Products One To Many'} />} />
            {/* <Route path="/" element={<Products {...props} title={'Products Table'} nolistbar={true} />} /> */}
            <Route exact path="/" element={<Dashboard {...props} title={'Dashboard'} />} />
        </Routes>
    )

};

export default Component;