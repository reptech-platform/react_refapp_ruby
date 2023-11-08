import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));


    const OnSubmit = async (e) => {
        if (e) e.preventDefault();

        let rslt = await Support.AddOrUpdateProduct(props.row[tag], enums);
        if (!rslt.status) return;
        props.row['product'].find((x) => x.key === 'Product_id').value = parseInt(rslt.id);
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