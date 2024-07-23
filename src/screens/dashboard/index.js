

import React, { useState } from "react";
import Container from "screens/container";
import { Box, Grid, Stack } from '@mui/material';
import { CounterContainer, LineChart } from "components";
import Helper from "shared/helper";
import { DataTable } from '../childs';

const columns = [
    { headerName: "Product Name", field: "productname", flex: 1, sortable: false },
    { headerName: "Location", field: "location", flex: 1, sortable: false },
    { headerName: "Date-Time", field: "DateOfTime", flex: 1, sortable: false },
    { headerName: "Piece", field: "piece", flex: 1, sortable: false },
    { headerName: "Amount", field: "amount", flex: 1, sortable: false, renderCell: (index) => Helper.INRCurrencyFormat(index.row.amount, true) },
    {
        headerName: "Status", field: "status", flex: 1, sortable: false,
        renderCell: (index) => <div className={index.row.status?.toLowerCase()}>{index.row.status}</div>
    }
];

const Component = (props) => {

    const [rows, setRows] = useState([

        { id: 1, productname: "Apple Watch", location: "6096 Marjolaine Land", DateOfTime: "12.09.2019 - 12.53 P", piece: 423, amount: 34295, status: "Delivered" },
        { id: 2, productname: "Apple Watch", location: "6096 Marjolaine Land", DateOfTime: "12.09.2019 - 12.53 P", piece: 423, amount: 34295, status: "Pending" }


    ]);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });

    return (

        <>
            <Container {...props} styles={{ backgroundColor: "#F7F9FD" }}>
                <Grid container rowGap={6} sx={{ p: 2 }} >
                    <Stack direction={"row"} columnGap={5}>
                        <CounterContainer title="Total Users" count="40,689" trendingUp={true} trendingValue={"8.5%"} trendingLabel={"Up from yesterday"} />
                        <CounterContainer title="Total Orders" count="10293" trendingUp={true} trendingValue={"1.3%"} trendingLabel={"Up from past week"} />
                        <CounterContainer title="Total Sales" count={Helper.INRCurrencyFormat(89000, true)} trendingUp={false} trendingValue={"4.3%"} trendingLabel={"Down from yesterday"} />
                    </Stack>
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid #E7E7E7",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "6px 6px 54px 0px #0000000D",
                        borderRadius: 1,
                        p: 2
                    }}>
                        <LineChart />
                    </Box>
                    <Box sx={{
                        width: "100%",
                        border: "1px solid #E7E7E7",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "6px 6px 54px 0px #0000000D",
                        borderRadius: 1,
                        p: 2
                    }}>
                        <DataTable

                            sx={{
                                "& .MuiTablePagination-input, & .MuiTablePagination-selectLabel": {
                                    display: "none !important"
                                },
                                "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus": {
                                    outline: "none !important",
                                },
                                "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
                                    outline: "none !important",
                                },
                                '& .MuiDataGrid-columnSeparator': {
                                    display: 'none',
                                },
                                "& .MuiDataGrid-cell": {
                                    fontFamily: "arial",
                                    fontSize: "0.86em",
                                    color: "#353535"
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    minHeight: "48px !important",
                                    maxHeight: "48px !important",
                                    lineHeight: "48px !important",
                                    backgroundColor: "#F1F4F9 !important"
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    lineHeight: "21px"
                                },
                                border: "0px !important"
                            }}
                            columns={columns} rowsCount={0} rows={rows} pageInfo={pageInfo} noActions={true} hideFooter={true} />
                    </Box>
                </Grid>
            </Container>
        </>

    );

};

export default Component;