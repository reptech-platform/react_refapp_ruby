
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import RenderFormContols from "./child/formcontrols";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';

import { Extract } from "./child/extract";

const Component = (props) => {

    const { title } = props;
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);

    const fetchData = async () => {
        console.log(id);
        await Extract(id).then(rslt => {
            console.log(rslt);
            const { row, options, collections } = rslt;
            setRow(row);
            setChildCollections(collections);
            setDropDownOptions(options);
        })
    };

    if (initialized) { setInitialized(false); fetchData(); }
    useEffect(() => { setInitialized(true); }, [id]);

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
                <RenderFormContols shadow={true} {...props} mode={"view"} options={dropDownOptions} controls={row} />
            </Container >
        </>

    );

};

export default Component;