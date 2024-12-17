

import React from "react";
import { BarChart, LineChart } from '@mui/x-charts';

const Component = (props) => {

    const { data } = props;
    const sourceData = data || [];
    const xLabels = sourceData.map(x => x.label);
    const xValues = sourceData.map(x => x.value);

    return (

        <>
            <LineChart
                width={600}
                height={300}
                series={[{ data: xValues }]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
            />
        </>

    );

};

export default Component;