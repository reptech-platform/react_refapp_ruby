import React from "react";
import Container from "screens/container";
import { CustomTable } from '../childs';

const Component = (props) => {
    return (
        <>
            <Container {...props}>
                <CustomTable {...props} configFile={"product_type_config.json"} />
            </Container>
        </>
    )

}

export default Component;
