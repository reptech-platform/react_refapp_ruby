
import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import {
    GetProduct, PatchProducts, GetProductTypesApi,
    SetProductImage, GetProductImage, DeleteProductImage
} from "shared/services";
import Helper from "shared/helper";

import ProductJsonConfig from "config/productConfig.json";
import RenderFormContols from "./child/formcontrols";

const Component = (props) => {
    const { title } = props;
    const [form, setForm] = useState(null);
    const theme = useTheme();
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [newRow, setNewRow] = useState({});
    const [imageId, setImageId] = useState(0);
    const [productTypes, setProductTypes] = useState([]);

    const GetProductDetails = async () => {
        if (id) {
            global.Busy(true);
            let rslt = await GetProduct(id);
            if (!Helper.IsJSONEmpty(rslt)) {
                const _imageId = rslt.ProductProductImage;
                setImageId(_imageId);
                rslt.ProductProductImage = await GetProductImage(_imageId);
                const { FileName, FileType } = rslt.ProductImage;
                ['details', 'others', 'types'].forEach(elm => {
                    for (let prop of ProductJsonConfig[elm]) {
                        let key = prop.key;
                        prop.value = rslt[key];
                        if (key === 'ProductProductImage') prop.fileName = `${FileName}.${FileType}`;
                    }
                });
                setRow(ProductJsonConfig);
            }
            global.Busy(false);
        }
    }

    const GetProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const productTypes = await GetProductTypesApi();
            const { value } = productTypes || { value: [] };
            setProductTypes(value);
            global.Busy(false);
            return resolve(true);
        });
    }

    const OnSubmit = async () => {
        let rslt, data = newRow;
        global.Busy(true);
        if (data['ProductProductImage']) {
            rslt = await DeleteImage();
            const { status, Doc_Id } = await UploadImage();
            if (status) {
                OnInputChange('ProductProductImage', Doc_Id);
                delete data['ProductImageData'];
                data.ProductProductImage = Doc_Id;
            }
        }

        if (!Helper.IsJSONEmpty(data)) {
            if (data['ProductSize']) data.ProductSize = parseFloat(data.ProductSize);
            if (data['ProductPrice']) data.ProductPrice = parseFloat(data.ProductPrice);

        }
        rslt = await PatchProducts(id, data);
        global.Busy(false);
        if (rslt.status) {
            NavigateTo("/products");
            global.AlertPopup("success", "Product is updated successfully!");
        } else {
            global.AlertPopup("error", "Something went wroing while updating Product!");
        }
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const OnInputChange = (e) => {
        setNewRow((prev) => ({
            ...prev,
            [e.name]: e.value
        }));
    }

    const UploadImage = async () => {
        return new Promise(async (resolve) => {
            const body = newRow.ProductImageData;
            let splits = newRow.ProductProductImage.split(".");
            const rslt = await SetProductImage(body, { FileType: splits[0], FileName: splits[1] });
            return resolve(rslt);
        })
    }

    const DeleteImage = async () => {
        return new Promise(async (resolve) => {
            const rslt = await DeleteProductImage(imageId);
            return resolve(rslt);
        })
    }

    // if (initialized) {
    //     setInitialized(false);
    //     GetProductTypes();
    //     GetProductDetails();
    // }

    useEffect(() => {
        const fetchData = async () => {
            if (initialized) {
                await GetProductTypes();
                await GetProductDetails();
            }
        };
        fetchData();
    }, [initialized]);

    useEffect(() => {
        setInitialized(true);
    }, [id]);

    return (

        <>
            <Container {...props}>
                <Box style={{ paddingBottom: 4, width: "100%" }}>
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
                <RenderFormContols {...props} setForm={setForm} mode={"edit"} controls={row} productTypes={productTypes}
                    onInputChange={OnInputChange} onSubmit={OnSubmit} />

                {!Helper.IsJSONEmpty(newRow) && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                <Button variant="contained" onClick={(e) => OnSubmitForm(e)}>Update</Button>
                                <Button variant="outlined" onClick={() => NavigateTo("/products")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </>

    );

};

export default Component;