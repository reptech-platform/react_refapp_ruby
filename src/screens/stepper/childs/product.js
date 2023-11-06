import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {
    const { setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));


    const OnSubmit = async (e) => {
        if (e) e.preventDefault();

        let rslt, data = {};

        const products = Object.values(props.row[tag]);
        products.filter((x) => x.value).map((x) => {
            if (x.key === 'UnitOfMeasurement') {
                data[x.key] = props.enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m.Value) === parseInt(x.value)).Name;
            } else if (x.key === 'Weight') {
                data[x.key] = parseFloat(x.value);
            } else {
                data[x.key] = x.value;
            }
        });

        rslt = await Support.AddOrUpdateProduct(data);
        if (rslt.status) {
            products.find((x) => x.key === 'Product_id').value = rslt.id;
            global.AlertPopup("success", "Product is created successfully!");
            setIsSubmitted(true);
        }
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