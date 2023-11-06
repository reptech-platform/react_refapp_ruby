import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {
    const { setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    const [updates, setUpdates] = React.useState({
        MainImage: false, OtherImages: false,
        OtherDetails: false, ProductOtherImages: false
    });

    React.useImperativeHandle(ref, () => ({ submit: () => form.current.submit() }));

    const AddOrUpdateDocument = async (productId, items, tagName) => {

        let status = false;
        const input = items.find((x) => x.key === tagName);

        let rslt = await Support.AddOrUpdateDocument(input);
        if (rslt.status) {
            if (tagName === 'MainImage') {

                let newValues = items['otherdetails'].find((x) => x.key === 'MainImage').value;
                newValues = { ...newValues, DocId: rslt.id };
                items['otherdetails'].find((x) => x.key === 'MainImage').value = newValues;

                // Update product with child references
                data = {
                    Product_id: parseInt(productId),
                    ProductMainImage: parseInt(rslt.id)
                }
                rslt = await Support.AddOrUpdateProduct(data);
            } else if (tagName === 'OtherImages') {
                let newValues = items['otherdetails'].find((x) => x.key === 'OtherImages').value;
                newValues = { ...newValues, DocId: rslt.id };
                items['otherdetails'].find((x) => x.key === 'OtherImages').value = newValues;

                let productOtherImagesId = row['otherdetails'].find((x) => x.key === 'ProductOtherImagesId').value || 0;
                // Update product with child references
                data = {
                    Product_id: parseInt(productId),
                    DocId: parseInt(rslt.id),
                    Id: parseInt(productOtherImagesId)
                }
                rslt = await Support.AddOrUpdateProductOtherImages(data);
                if (rslt.status) {
                    row['otherdetails'].find((x) => x.key === 'ProductOtherImagesId').value = rslt.id;
                }
            }
            status = rslt.status;
        }

        return { status };
    }

    const AddOrUpdateOtherDetails = async (productId, items) => {

        let data = {}, status = false;

        let rslt = await Support.AddOrUpdateOtherDetails(data, props.enums, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            items.find((x) => x.key === 'OtherDetailsId')['value'] = rslt.id;

            // Update product with child references
            data = {
                Product_id: parseInt(productId),
                ProductOtherDetails: parseInt(rslt.id)
            }
            rslt = await Support.AddOrUpdateProduct(data);
            status = rslt.status;

        }

        return { status };
    }

    const AddOrUpdatePrice = async (productId, items) => {

        let data = {}, status = false;

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

        const productId = row['product'].find((x) => x.key === 'Product_id').value;

        // Add Or Update Documents
        rslt = await AddOrUpdateDocument(productId, products, 'MainImage'); if (!rslt) return;
        rslt = await AddOrUpdateDocument(productId, products, 'OtherImages'); if (!rslt) return;
        rslt = await AddOrUpdateOtherDetails(productId, products); if (!rslt) return;

        global.AlertPopup("success", "Other Details are updated successfully!");
        setIsSubmitted(true);
    }

    const OnInputChange = async (e) => {
        const { name, value, type } = e;
        let products = props.row[tag];
        if (type) {
            products.find((x) => x.key == name)['value'] = value.DocName;
            products.find((x) => x.key == name)['DocType'] = value.DocType;
            products.find((x) => x.key == name)['DocData'] = value.DocData;
            products.find((x) => x.key == name)['docExt'] = value.DocExt;
        } else {
            products.find((x) => x.key == name).value = value;
        }
        props.row[tag] = products;
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="otherdetails" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;