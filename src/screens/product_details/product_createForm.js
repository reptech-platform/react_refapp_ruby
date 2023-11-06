
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import { useTheme } from '@mui/material/styles';
import ProductJsonConfig from "config/productConfig.json";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import * as Api from "shared/services";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { GetMetaDataInfo } from "shared/common";

const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const NavigateTo = useNavigate();
    const theme = useTheme();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data;
        let productId, otherDetailsId, priceId, mainImageId, otherImagesId;

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(row['product'], dropDownOptions);
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
        data = [
            { key: "Product_id", value: parseInt(productId) },
            { key: "ProductMainImage", value: parseInt(mainImageId) },
            { key: "ProductOtherDetails", value: parseInt(otherDetailsId) }
        ];

        rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
        if (!rslt.status) return;
        row['product'].find((x) => x.key === 'ProductMainImage').value = mainImageId;

        // Add Or Update Document for Other Images
        data = row['otherdetails'].find((x) => x.key === 'OtherImages');
        rslt = await Support.AddOrUpdateDocument(data);
        if (rslt.status) {
            let oldData = row['otherdetails'].find((x) => x.key === 'OtherImages').value;
            oldData = { ...oldData, DocId: rslt.id };
            row['otherdetails'].find((x) => x.key === 'OtherImages').value = oldData;
        } else { return; }

        otherImagesId = row['otherdetails'].find((x) => x.key === 'OtherImages').value?.DocId || 0;
        let productOtherImagesId = row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId || 0;
        productOtherImagesId = parseInt(productOtherImagesId);

        // Update product other images with child referenc

        data = [
            { key: "Product_id", value: parseInt(productId) },
            { key: "Id", value: productOtherImagesId > 0 ? productOtherImagesId : null },
            { key: "DocId", value: parseInt(otherImagesId) }
        ];

        rslt = await Support.AddOrUpdateProductOtherImages(data);
        if (rslt.status) {
            row['otherdetails'].find((x) => x.key === 'OtherImages').ProductOtherImagesId = rslt.id;
        } else { return; }

        // Add Or Update Product Price
        rslt = await Support.AddOrUpdatePrice(row['productprice']);
        if (rslt.status) {
            row['productprice'].find((x) => x.key === 'PpId').value = rslt.id;
        } else { return; }

        priceId = row['productprice'].find((x) => x.key === 'PpId').value || 0;

        // Update product with child references
        data = [
            { key: "Product_id", value: parseInt(productId) },
            { key: "ProductProductPrice", value: parseInt(priceId) }
        ];

        rslt = await Support.AddOrUpdateProduct(data);
        if (!rslt.status) return;
        row['product'].find((x) => x.key === 'ProductProductPrice').value = priceId;

        global.AlertPopup("success", "Product is created successfully!");
        setShowUpdate(false);
        NavigateTo("/products");
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name);
        if (_index > -1) {
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
        }
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
        ['product', 'otherdetails', 'productprice'].forEach(elm => {
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