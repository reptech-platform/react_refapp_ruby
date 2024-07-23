import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";


const labels = ["5k", "10k", "15k", "20k", "25k", "30k", "35k", "40k", "45k", "50k", "55k", "60k"];

let width, height, gradient;
function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(1, "#E1EAFC");
    }

    return gradient;
}

const options = {
    plugins: {
        legend: {
            display: false
        },
    },
};

const data = {
    labels: labels,
    datasets: [
        {
            backgroundColor: function (context) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                    return;
                }
                return getGradient(ctx, chartArea);
            },
            borderColor: "#6592F1",
            fill: true,
            data: [65, 59, 80, 81, 56, 55, 65, 59, 80, 81, 56, 55, 65],
            tension: 0.01
        },
    ],
};

const LineChart = () => {
    return (
        <Box sx={{ height: 366 }}>
            <Line data={data} options={options} />
        </Box>
    );
};

export default LineChart;