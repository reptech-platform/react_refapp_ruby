import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import { GetProduct, GetProductImage, GetProductTypesApi } from "shared/services";
import Helper from "shared/helper";
import ProductJsonConfig from "config/productConfig.json";
import RenderFormContols from "./child/formcontrols";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [productTypes, setProductTypes] = useState([]);

    const GetProductDetails = async () => {
        if (id) {
            global.Busy(true);
            let rslt = await GetProduct(id);
            if (!Helper.IsJSONEmpty(rslt)) {

                const imageId = rslt.ProductProductImage;
                rslt.ProductProductImage = await GetProductImage(imageId);
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
                        <Grid container sx={{ alignItems: "center", justifyContent: 'flex-end', gap: 1, pt: 1, pb: 1 }}>
                            <Button variant="contained" startIcon={<EditIcon />}
                                onClick={() => NavigateTo(`/products/edit/${id}`)}
                            >Edit</Button>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols {...props} mode={"view"} productTypes={productTypes} controls={row} />
            </Container>
        </>

    );

};

export default Component;