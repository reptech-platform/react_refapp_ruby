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

            let rslt, data, productId;

            productId = props.row['product'].find((x) => x.key === 'Product_id').value || 0;

            // Add Or Update Product Price
            rslt = await Support.AddOrUpdatePrice(props.row['productprice']);
            if (rslt.status) {
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductProductPrice", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProduct(data, enums);
                if (!rslt.status) return resolve(false);
            } else { return resolve(false); }

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