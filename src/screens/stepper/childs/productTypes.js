import React from 'react';
import { Box } from '@mui/material';
import Helper from "shared/helper";
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import Support from "shared/support";

const Component = React.forwardRef((props, ref) => {

    const { enums, setIsSubmitted, tag, shadow } = props;
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

        productTypeId = props.row['producttype'].find((x) => x.key === 'PtId').value || 0;
        productTypeId = parseInt(productTypeId);

        if (productTypeId === 0) {
            rslt = await Support.AddOrUpdateProductType(props.row['producttype'], ["ProductOptionType"]);
            if (rslt.status) {
                productTypeId = parseInt(rslt.id);
                props.row['producttype'].find((x) => x.key === 'PtId').value = rslt.id;
            } else { return; }
        }

        props.row['product'].find((x) => x.key === 'ProductProductType').value = productTypeId;

        global.AlertPopup("success", "Product type is created successfully!");
        setIsSubmitted(true);
    }

    const ResetValues = (name, items) => {
        const { TargetTypeName, TargetTypeId, TargetTypeDesc } = items.find((x) => x.key == name);
        items.find((x) => x.key == TargetTypeId).value = null;
        items.find((x) => x.key == TargetTypeName).value = null;
        items.find((x) => x.key == TargetTypeDesc).value = null;
        items.find((x) => x.key == TargetTypeName).editable = true;
        items.find((x) => x.key == TargetTypeDesc).editable = true;
        items.find((x) => x.key == name).value = null;
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let products = props.row[tag];
        if (name === 'ProductOptionType') {
            const { TargetTypeName, TargetTypeId, TargetTypeDesc } = products.find((x) => x.key == name);
            ResetValues(name, products);
            if (!Helper.IsNullValue(value)) {
                const { Name, Desc, Value } = enums.find((x) => x.Name === 'ProductTypes').Values.find((x) => x.Value === value);
                products.find((x) => x.key == TargetTypeId).value = Value;
                products.find((x) => x.key == TargetTypeName).value = Name;
                products.find((x) => x.key == TargetTypeName).editable = false;
                products.find((x) => x.key == TargetTypeDesc).value = Desc;
                products.find((x) => x.key == TargetTypeDesc).editable = false;
                products.find((x) => x.key == name).value = value;
            }
        } else {
            products.find((x) => x.key == name).editable = true;
            products.find((x) => x.key == name).value = null;
        }
        props.row[tag] = products;
        setRows(products);
        setState(!state);
    }

    React.useEffect(() => {
        let _prop = props.row[tag] || [];
        const PtId = _prop.find((x) => x.key === 'PtId')?.value || 0;
        if (PtId > 0) {
            const { Name, Desc, Value } = enums.find((x) => x.Name === 'ProductTypes').Values.find((x) => x.Value === PtId);
            const { TargetTypeName, TargetTypeDesc } = _prop.find((x) => x.key == 'ProductOptionType');
            _prop.find((x) => x.key == 'ProductOptionType').value = Value;
            _prop.find((x) => x.key == TargetTypeName).value = Name;
            _prop.find((x) => x.key == TargetTypeName).editable = false;
            _prop.find((x) => x.key == TargetTypeDesc).value = Desc;
            _prop.find((x) => x.key == TargetTypeDesc).editable = false;
            props.row[tag] = _prop;
            setRows(props.row[tag]);
            setState(!state);
        }
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