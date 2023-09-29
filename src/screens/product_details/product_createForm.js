import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "../container";
import { useTheme } from '@mui/material/styles';
import ProductJsonConfig from "config/productConfig.json";
import RenderFormContols from "components/formControls/RenderFormContols";
import { useNavigate } from "react-router-dom";
import { SetProductImage, SetProducts, GetProductTypesApi } from "shared/services";
import Helper from "shared/helper";

const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [newRow, setNewRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [productTypes, setProductTypes] = useState([]);
    const NavigateTo = useNavigate();
    const theme = useTheme();
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data = newRow;
        global.Busy(true);
        const { status, Doc_Id } = await UploadImage();
        if (status) {
            OnInputChange('ProductProductImage', Doc_Id);
            delete data['ProductImageData'];
            data.ProductProductImage = Doc_Id;
            data.ProductSize = parseFloat(data.ProductSize);
            data.ProductPrice = parseFloat(data.ProductPrice);
            console.log(data)
            rslt = await SetProducts(data);
            global.Busy(false);
            if (rslt.status) {
                global.AlertPopup("success", "Record is created successful!");
                setShowButton(false);
                setNewRow({});
            } else {
                global.AlertPopup("error", "Something went wroing while creating record!");
            }

        } else {
            global.Busy(false);
            global.AlertPopup("error", "Failed uploading image!");
        }
    }

    const OnInputChange = (e) => {
        setNewRow((prev) => ({
            ...prev,
            [e.name]: e.value
        }));
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const UploadImage = async () => {
        return new Promise(async (resolve) => {
            const body = newRow.ProductImageData;
            let splits = newRow.ProductProductImage.split(".");
            const rslt = await SetProductImage(body, { FileType: splits[0], FileName: splits[1] });
            return resolve(rslt);
        })
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

    useEffect(() => {
        setShowButton(true);
    }, []);

    if (initialized) {
        setInitialized(false);
        GetProductTypes();

        ['details', 'others', 'types'].forEach(elm => {
            for (let prop of ProductJsonConfig[elm]) {
                delete prop['value'];
            }
        });

        setRow(ProductJsonConfig);
    }

    useEffect(() => {
        setInitialized(true);
    }, []);

    return (

        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Typography nowrap="true" variant="subheader" component="div" sx={{ width: "100%" }}>
                            {title}
                        </Typography>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols {...props} setForm={setForm} onInputChange={OnInputChange} productTypes={productTypes}
                    controls={row} onSubmit={OnSubmit} />
                {!Helper.IsJSONEmpty(newRow) && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="contained" onClick={() => NavigateTo("/products")} sx={{
                                    color: theme.palette.primary.main,
                                    backgroundColor: theme.palette.secondary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.dark
                                    },
                                }}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;