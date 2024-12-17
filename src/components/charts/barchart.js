

import React from "react";
import { BarChart } from '@mui/x-charts';

const Component = (props) => {

    const { data } = props;
    const sourceData = data || [];
    const xLabels = sourceData.map(x => x.label);
    const xValues = sourceData.map(x => x.value);

    return (

        <>
            <BarChart
                width={600}
                height={300}
                series={[{ data: xValues }]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
            />
        </>

    );

};

export default Component;