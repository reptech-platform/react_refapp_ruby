import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import { useTheme } from '@mui/material/styles';
import ProductJsonConfig from "config/stepperConfig.json";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import * as Api from "shared/services";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";

const Component = (props) => {
    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const NavigateTo = useNavigate();
    const theme = useTheme();
    const [showUpdate, setShowUpdate] = useState(false);
    const [state, setState] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data;
        let productTypeId, productId, otherDetailsId, priceId, mainImageId, otherImagesId;

        productTypeId = row['producttype'].find((x) => x.key === 'PtId').value || 0;
        productTypeId = parseInt(productTypeId);

        if (productTypeId === 0) {
            rslt = await Support.AddOrUpdateProductType(row['producttype'], ["ProductOptionType"]);
            if (rslt.status) {
                productTypeId = parseInt(rslt.id);
                row['producttype'].find((x) => x.key === 'PtId').value = rslt.id;
            } else { return; }
        }

        row['product'].find((x) => x.key === 'ProductProductType').value = productTypeId;

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(row['product']);
        if (rslt.status) {
            row['product'].find((x) => x.key === 'Product_id').value = parseInt(rslt.id);
        } else { return; }

        productId = row['product'].find((x) => x.key === 'Product_id').value || 0;

        // Add or Update Other Details
        rslt = await Support.AddOrUpdateOtherDetails(row['otherdetails'], dropDownOptions, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value = rslt.id;
        } else { return; }

        otherDetailsId = row['otherdetails'].find((x) => x.key === 'OtherDetailsId').value || 0;


        // Add Or Update Document for Main Image
        data = row['otherdetails'].find((x) => x.key === 'MainImage');
        rslt = await Support.AddOrUpdateDocument(data);
        if (rslt.status) {
            let newValues = row['otherdetails'].find((x) => x.key === 'MainImage').value;
            newValues = { ...newValues, DocId: rslt.id };
            row['otherdetails'].find((x) => x.key === 'MainImage').value = newValues;
        } else { return; }

        mainImageId = row['otherdetails'].find((x) => x.key === 'MainImage').value?.DocId || 0;

        // Update product with child references
        data = {
            Product_id: parseInt(productId),
            ProductMainImage: parseInt(mainImageId),
            ProductOtherDetails: parseInt(otherDetailsId)
        }
        rslt = await Support.AddOrUpdateProduct(data);
        if (!rslt.status) return;

        // Add Or Update Document for Other Images
        data = row['otherdetails'].find((x) => x.key === 'OtherImages');
        rslt = await Support.AddOrUpdateDocument(data);
        if (rslt.status) {
            let oldData = row['otherdetails'].find((x) => x.key === 'OtherImages').value;
            oldData = { ...oldData, DocId: rslt.id };
            row['otherdetails'].find((x) => x.key === 'OtherImages').value = oldData;
        } else { return; }

        otherImagesId = row['otherdetails'].find((x) => x.key === 'OtherImages').value?.DocId || 0;
        let productOtherImagesId = row['otherdetails'].find((x) => x.key === 'ProductOtherImagesId').value || 0;

        // Update product other images with child referenc
        data = {
            Id: parseInt(productOtherImagesId),
            Product_id: parseInt(productId),
            DocId: parseInt(otherImagesId)
        };

        rslt = await Support.AddOrUpdateProductOtherImages(data);
        if (rslt.status) {
            row['otherdetails'].find((x) => x.key === 'ProductOtherImagesId').value = rslt.id;
        } else { return; }

        // Add Or Update Product Price
        rslt = await Support.AddOrUpdatePrice(row['productprice']);
        if (rslt.status) {
            row['productprice'].find((x) => x.key === 'PpId').value = rslt.id;
        } else { return; }

        priceId = row['productprice'].find((x) => x.key === 'PpId').value || 0;

        // Update product with child references
        data = {
            Product_id: parseInt(productId),
            ProductProductPrice: parseInt(priceId)
        }
        rslt = await Support.AddOrUpdateProduct(data);
        if (!rslt.status) return;

        global.AlertPopup("success", "Product is created successfully!");
        setShowUpdate(false);
        NavigateTo("/products");
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        if (name === "ProductOptionType") {
            OnProductTypeChanged(e);
        }
        else {
            let _row = row;
            let _index = row[location].findIndex((x) => x.key === name);
            if (_index > -1) {
                _row[location][_index].value = value;
                setRow(_row);
                setShowUpdate(true);
            }
        }
    }

    const ResetValues = (location, name) => {
        let _row = row;
        const { TargetTypeName, TargetTypeId, TargetTypeDesc } = _row[location].find((x) => x.key == name);
        _row[location].find((x) => x.key == TargetTypeId).value = null;
        _row[location].find((x) => x.key == TargetTypeName).value = null;
        _row[location].find((x) => x.key == TargetTypeDesc).value = null;
        _row[location].find((x) => x.key == TargetTypeName).editable = true;
        _row[location].find((x) => x.key == TargetTypeDesc).editable = true;
        _row[location].find((x) => x.key == name).value = null;
        setRow(_row);
        return _row;
    }

    const OnProductTypeChanged = async (e) => {
        const { name, value, location, ...others } = e;
        let _row = ResetValues(location, name);
        const _prodType = _row[location].find((x) => x.key == name);
        const { TargetTypeName, TargetTypeId, TargetTypeDesc } = _prodType;

        if (!Helper.IsNullValue(value)) {
            const { Name, Desc, Value } = dropDownOptions.find((x) => x.Name === 'ProductTypes').Values.find((x) => x.Value === value);
            _row[location].find((x) => x.key == TargetTypeId).value = Value;
            _row[location].find((x) => x.key == TargetTypeName).value = Name;
            _row[location].find((x) => x.key == TargetTypeName).editable = false;
            _row[location].find((x) => x.key == TargetTypeDesc).value = Desc;
            _row[location].find((x) => x.key == TargetTypeDesc).editable = false;
            _row[location].find((x) => x.key == name).value = value;
        } else {
            _row[location].find((x) => x.key == name).editable = true;
            _row[location].find((x) => x.key == name).value = null;
        }
        setRow(_row);
        setState(!state);
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            await Api.GetProductTypes()
                .then(async (res) => {
                    if (res.status) {
                        const pValues = res.values.map((x) => { return { Name: x.ProductTypeName, Value: x.PtId } });
                        await GetMetaDataInfo()
                            .then(async (res2) => {
                                const enums = res2.filter((x) => x.Type === 'Enum') || [];
                                enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
                                setDropDownOptions(enums);
                                global.Busy(false);
                                return resolve(true);
                            });

                    } else {
                        global.Busy(false);
                        console.log(res.statusText);
                        return resolve(true);
                    }
                });

        });
    }

    const FetchProductDetails = async () => {
        let item = {};
        ['producttype', 'product', 'otherdetails', 'productprice'].forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        setRow(item);
    }

    const fetchData = async () => {
        await FetchProductTypes().then(async () => {
            await FetchProductDetails();
        });
    };

    useEffect(() => {
        setShowButton(true);
    }, []);

    if (initialized) {
        setInitialized(false);
        fetchData();
    }

    useEffect(() => {
        setInitialized(true);
    }, []);

    return (

        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange}
                    controls={row} onSubmit={OnSubmit} options={dropDownOptions} />
                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="outlined" onClick={() => NavigateTo("/products")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;