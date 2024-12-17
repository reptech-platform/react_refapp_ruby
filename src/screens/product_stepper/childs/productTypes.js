import React from 'react';
import { Box } from '@mui/material';
import Helper from "shared/helper";
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {

    const { setIsSubmitted, tag, shadow } = props;
    const [rows, setRows] = React.useState(props.row[tag]);
    const [state, setState] = React.useState(false);
    const form = React.useRef(null);

    const boxShadow = shadow ? "0 1px 5px rgba(0,0,0,.15) !important" : null;
    const borderRadius = shadow ? "3px !important" : null;

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        if (e) e.preventDefault();
        let rslt, productTypeId;

        let childItem = props.row['producttype'];
        let numfields = Helper.GetAllNumberFields(childItem);
        if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

        rslt = await Support.AddOrUpdateProductType(childItem, ["ProductOptionType"]);
        if (rslt.status) {
            productTypeId = parseInt(rslt.id);
            props.row['producttype'].find((x) => x.key === 'PtId').value = rslt.id;
        } else { return; }

        props.row['product'].find((x) => x.key === 'ProductPType').value = productTypeId;

        global.AlertPopup("success", "Product type is created successfully!");
        setIsSubmitted(true);
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let products = props.row[tag];
        let index = products.findIndex((x) => x.key === name);
        if (index > -1) {
            products[index].value = value;

            props.row[tag] = products;
            setRows(products);
            setState(!state);
        }
    }

    React.useEffect(() => {
        let _prop = props.row[tag] || [];
    }, [props]);

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <ValidatorForm ref={form} onSubmit={OnSubmit}>
                    <Box style={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ width: `100%`, margin: 2, boxShadow, borderRadius }}>
                            <RenderFormContols mode={props.mode} options={props.enums} controls={rows} onInputChange={OnInputChange} />
                        </Box>
                    </Box>
                </ValidatorForm>
            </Box>
        </>
    )
});

export default Component;