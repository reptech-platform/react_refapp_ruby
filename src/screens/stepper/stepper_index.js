import React from 'react';
import Container from "screens/container";
import { GetMetaDataInfo } from "shared/common";
import { Box, Grid, Stack, Button, Typography } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import ProductJsonConfig from "config/stepper_config.json";
import { ProductDetailsForm, ProductForm, ProductPriceForm, ProductReviewForm, ProductTypesForm } from "./childs";
import * as Api from "shared/services";
import { useNavigate } from "react-router-dom";
import Stepper from "components/stepper";

const steps = ['Product Type', 'Product', 'OtherDetails', 'ProductPrice', "Review"];

const Component = (props) => {
    const { title } = props;
    const [initialize, setInitialize] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [jumpStep, setJumpStep] = React.useState(0);
    const [row, setRow] = React.useState({});
    const [stepperComponents, setStepperComponents] = React.useState([]);
    const inputRefs = React.useRef({ productForm: null });
    const [state, setState] = React.useState(false);

    const NavigateTo = useNavigate();

    const OnStepClicked = (e) => { setJumpStep(e); }

    const PrepareStepperComponents = async (item, enums) => {
        return new Promise(async (resolve) => {

            const _items = [];

            _items.push(<ProductTypesForm
                name="productType" tag="producttype" ref={r => inputRefs.current['productType'] = r} setIsSubmitted={setIsSubmitted}
                row={item} enums={enums} />);

            _items.push(<ProductForm
                name="productForm" tag="product" ref={r => inputRefs.current['productForm'] = r} setIsSubmitted={setIsSubmitted}
                row={item} enums={enums} excludestepper={true} />);

            _items.push(<ProductDetailsForm
                name="productDetails" tag="otherdetails" ref={r => inputRefs.current['productDetails'] = r} setIsSubmitted={setIsSubmitted}
                row={item} enums={enums} />);

            _items.push(<ProductPriceForm
                name="productPrice" tag="productprice" ref={r => inputRefs.current['productPrice'] = r} setIsSubmitted={setIsSubmitted}
                row={item} enums={enums} />);

            _items.push(<ProductReviewForm
                name="productReview" tag="all" ref={r => inputRefs.current['productReview'] = r} setIsSubmitted={setIsSubmitted}
                onStepClicked={OnStepClicked} row={item} enums={enums} />);

            setStepperComponents(_items);

            return resolve(true);
        });

    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            await Api.GetProductTypes()
                .then(async (res) => {
                    if (res.status) {
                        const pValues = res.values.map((x) => { return { Name: x.ProductTypeName, Value: x.PtId, Desc: x.ProductTypeDesc } });
                        await GetMetaDataInfo()
                            .then(async (res2) => {
                                const enums = res2.filter((x) => x.Type === 'Enum') || [];
                                enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
                                global.Busy(false);
                                return resolve(enums);
                            });

                    } else {
                        global.Busy(false);
                        console.log(res.statusText);
                        return resolve([]);
                    }
                });

        });
    }

    const FetchProductDetails = async () => {
        return new Promise(async (resolve) => {
            let item = {};
            ['product', 'producttype', 'otherdetails', 'productprice'].forEach(elm => {
                let items = [];
                for (let prop of ProductJsonConfig[elm]) {
                    items.push({ ...prop, value: null });
                }
                item[elm] = items;
            });
            setRow(item);
            setState(!state);
            return resolve(item);
        });
    }

    const fetchData = async () => {
        await FetchProductTypes().then(async (enums) => {
            await FetchProductDetails().then(async (item) => {
                await PrepareStepperComponents(item, enums);
            });
        });
    };

    if (initialize) { setInitialize(false); fetchData(); }
    React.useEffect(() => { setInitialize(true); }, []);

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
                <Stepper requiredSubmit={true} inputRefs={inputRefs.current} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}
                    steps={steps} step={jumpStep} stepComponents={stepperComponents} />
            </Container>
        </>
    )
}

export default Component;
