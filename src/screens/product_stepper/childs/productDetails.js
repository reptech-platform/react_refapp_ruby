import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({ submit: () => form.current.submit() }));

    const AddOrUpdateDocument = async () => {

        return new Promise(async (resolve) => {

            let rslt, data, productId;

            productId = props.row['product'].find((x) => x.key === 'Product_id').value || 0;

            let childItem = props.row['otherdetails'];
            let numfields = Helper.GetAllNumberFields(childItem);
            if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

            // Add Product Other Details
            rslt = await Support.AddOrUpdateOtherDetails(childItem, enums);
            if (rslt.status) {
                // Add Or Update Product
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "ProductODetails", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProduct(data, enums);
                if (!rslt.status) return resolve(false);

            } else { return resolve(false); }

            return resolve(true);
        });
    }

    const OnSubmit = async (e) => {
        if (e) e.preventDefault();
        await AddOrUpdateDocument().then((status) => {
            if (status) {
                global.AlertPopup("success", "Other Details are updated successfully!");
                setIsSubmitted(true);
            }
        })
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let products = props.row[tag];
        let _index = products.findIndex((x) => x.key === name);
        if (_index > -1) {
            products[_index].value = value;
            props.row[tag] = products;
        }
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="otherdetails" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;