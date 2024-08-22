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
        rslt = await Support.AddOrUpdateDocument(prodImages);
        if (rslt.status) {
            product.find((x) => x.key === 'ProductMainImage')['value'] = rslt.id;
            // Add Or Update Product
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductMainImage", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;

        } else { return; }

        // Add Product Other Images
        prodImages = product.find((x) => x.key === 'OtherImages').value;
        for (let i = 0; i < prodImages.length; i++) {
            rslt = await Support.AddOrUpdateDocument({ value: prodImages[i] });
            if (rslt.status) {
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "DocId", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProductOtherImages(data);
                if (!rslt.status) return;
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