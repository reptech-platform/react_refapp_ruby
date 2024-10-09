import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        let rslt, data, prodImages, productId, numfields;
        let product = props.row['product'];

        numfields = Helper.GetAllNumberFields(product);
        if (numfields.length > 0) Helper.UpdateNumberFields(product, numfields);

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(product, enums, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            productId = rslt.id;
            product.find((x) => x.key === 'Product_id').value = rslt.id;
            props.row['product'].find((x) => x.key === 'Product_id').value = rslt.id;
        } else { return; }

        // Add Product Main Image
        prodImages = product.find((x) => x.key === 'MainImage');
        if (prodImages && !Helper.IsNullValue(prodImages.value)) {
            let entityTypeKeyName = prodImages?.entityTypeKeyName;
            let entityTypeName = prodImages?.entityTypeName;
            if (!Helper.IsNullValue(entityTypeKeyName)) {
                let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                rslt = await docFuns.setFun(prodImages.value, entityTypeKeyName);
                if (rslt.status) {
                    let newImageId = parseInt(rslt.id);
                    data = [
                        { key: "Product_id", value: parseInt(productId) },
                        { key: "ProductMainImage", value: newImageId }
                    ];
                    rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
                    if (!rslt.status) return;

                } else { return; }
            }
        }

        // Add Product Other Images
        prodImages = product.find((x) => x.key === 'OtherImages');
        if (prodImages && !Helper.IsNullValue(prodImages.value)) {

            let entityTypeKeyName = keyItems?.entityTypeKeyName;
            let entityTypeName = keyItems?.entityTypeName;

            if (!Helper.IsNullValue(entityTypeKeyName)) {
                let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                let values = prodImages.value;
                for (let i = 0; i < values.length; i++) {
                    rslt = await docFuns.setFun(values[i].DocData, entityTypeKeyName);
                    if (rslt.status) {
                        let newImageId = parseInt(rslt.id);
                        data = [
                            { key: "Product_id", value: parseInt(productId) },
                            { key: entityTypeKeyName, value: newImageId }
                        ];
                        rslt = await Support.AddOrUpdateProductOtherImages(data);
                        if (!rslt.status) return;
                    } else { return; }
                }
            }
        }

        global.AlertPopup("success", "Product is created successfully!");
        setIsSubmitted(true);
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let products = props.row[tag];
        products.find((x) => x.key == name).value = value;
        props.row[tag] = products;
    }

    return (
        <>
            <RenderFormContols {...props}
                setForm={setForm} type="product" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;