import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {

    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const AddOrUpdatePrice = async () => {

        return new Promise(async (resolve) => {

            let rslt, data;
            let productId, priceId;

            productId = props.row['product'].find((x) => x.key === 'Product_id').value || 0;

            // Add Or Update Product Price
            rslt = await Support.AddOrUpdatePrice(props.row['productprice']);
            if (!rslt.status) return resolve(false);
            props.row['productprice'].find((x) => x.key === 'PpId').value = rslt.id;

            priceId = props.row['productprice'].find((x) => x.key === 'PpId').value || 0;

            // Update product with child references
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductProductPrice", value: parseInt(priceId) }
            ];

            rslt = await Support.AddOrUpdateProduct(data, enums);
            if (!rslt.status) return resolve(false);
            row['product'].find((x) => x.key === 'ProductProductPrice').value = priceId;

            return resolve(true);

        });
    }

    const OnSubmit = async (e) => {

        if (e) e.preventDefault();

        await AddOrUpdatePrice().then((status) => {
            if (status) {
                global.AlertPopup("success", "Produce price is updated successfully!");
                setIsSubmitted(true);
            }
        });

    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let products = props.row[tag];
        products.find((x) => x.key == name).value = value;
        props.row[tag] = products;
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="productprice" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;