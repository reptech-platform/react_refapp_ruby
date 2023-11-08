import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({ submit: () => form.current.submit() }));

    const AddOrUpdateDocument = async () => {

        return new Promise(async (resolve) => {

            let rslt, data;
            let productId, otherDetailsId, mainImageId, otherImagesId;

            productId = props.row['product'].find((x) => x.key === 'Product_id').value || 0;

            // Add or Update Other Details
            rslt = await Support.AddOrUpdateOtherDetails(props.row['otherdetails'], enums, ['MainImage', 'OtherImages']);
            if (!rslt.status) return resolve(false);
            props.row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value = parseInt(rslt.id);
            otherDetailsId = parseInt(rslt.id);


            // Add Or Update Document for Main Image
            data = props.row['otherdetails'].find((x) => x.key === 'MainImage');
            rslt = await Support.AddOrUpdateDocument(data);
            if (!rslt.status) return resolve(false);
            let newValues = props.row['otherdetails'].find((x) => x.key === 'MainImage').value;
            newValues = { ...newValues, DocId: rslt.id };
            props.row['otherdetails'].find((x) => x.key === 'MainImage').value = newValues;

            mainImageId = props.row['otherdetails'].find((x) => x.key === 'MainImage').value?.DocId || 0;

            // Update product with child references
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductMainImage", value: parseInt(mainImageId) },
                { key: "ProductOtherDetails", value: parseInt(otherDetailsId) }
            ];

            rslt = await Support.AddOrUpdateProduct(data, enums);
            if (!rslt.status) return resolve(false);
            props.row['product'].find((x) => x.key === 'ProductMainImage').value = mainImageId;

            // Add Or Update Document for Other Images
            data = props.row['otherdetails'].find((x) => x.key === 'OtherImages');
            rslt = await Support.AddOrUpdateDocument(data);
            if (!rslt.status) return resolve(false);
            let oldData = props.row['otherdetails'].find((x) => x.key === 'OtherImages').value;
            oldData = { ...oldData, DocId: rslt.id };
            props.row['otherdetails'].find((x) => x.key === 'OtherImages').value = oldData;

            otherImagesId = props.row['otherdetails'].find((x) => x.key === 'OtherImages').value?.DocId || 0;
            let productOtherImagesId = props.row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId || 0;
            productOtherImagesId = parseInt(productOtherImagesId);

            // Update product other images with child reference
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "Id", value: productOtherImagesId > 0 ? productOtherImagesId : null },
                { key: "DocId", value: parseInt(otherImagesId) }
            ];

            rslt = await Support.AddOrUpdateProductOtherImages(data);
            if (!rslt.status) return resolve(false);

            props.row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId = rslt.id;

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
            setShowUpdate(true);
        }
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="otherdetails" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;