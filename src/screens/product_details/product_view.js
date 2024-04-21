import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import Container from "screens/container";
import { useNavigate, useParams } from "react-router-dom";
import RenderFormContols from "./child/formcontrols";

import { Extract } from "./child/extract";

const Component = (props) => {
    const { title } = props;
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const fetchData = async () => {

        await Extract(id).then(rslt => {
            const { row, options } = rslt;
            setRow(row);
            setDropDownOptions(options);
        })

    };

    if (initialized) { setInitialized(false); fetchData(); }

    useEffect(() => { setInitialized(true); }, [id]);

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
                <RenderFormContols shadow={true} {...props} mode={"view"} options={dropDownOptions} controls={row} />
            </Container>
        </>

    );

};

export default Component;