import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {

    const { setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const AddOrUpdatePrice = async (items) => {

        let data = {}, status = false;

        const productId = props.row['product'].find((x) => x.key === 'Product_id').value;

        let rslt = await Support.AddOrUpdatePrice(items);
        if (rslt.status) {
            items.find((x) => x.key === 'PpId').value = rslt.id;

            // Update product with child references
            data = {
                Product_id: parseInt(productId),
                ProductProductPrice: parseInt(rslt.id)
            }
            rslt = await Support.AddOrUpdateProduct(data);
            status = rslt.status;

        }

        return { status };
    }

    const OnSubmit = async (e) => {

        if (e) e.preventDefault();
        let rslt, products = props.row[tag];

        rslt = await AddOrUpdatePrice(products); if (!rslt) return;
        global.AlertPopup("success", "Produce price is updated successfully!");
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
            <RenderFormContols {...props} setForm={setForm} type="productprice" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;