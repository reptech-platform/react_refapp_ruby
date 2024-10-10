

import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { BarChart } from "components/charts";
import Helper from "shared/helper";
import { DataTable } from 'screens/childs';

const columns = [
    { headerName: "First Name", field: "FirstName", flex: 1, sortable: false },
    { headerName: "Last Name", field: "LastName", flex: 1, sortable: false },
    { headerName: "Mobile Number", field: "MobileNumber", flex: 1, sortable: false },
    { headerName: "Pincode", field: "Pincode", flex: 1, sortable: false },
    { headerName: "Email", field: "EmailId", flex: 1, sortable: false },
    {
        headerName: "Created Date", field: "CreatedDate", flex: 1, sortable: false,
        renderCell: (index) => { return Helper.FormatDate(index.row.CreatedDate, 'YYYY-MM-DD') }
    }
];

const Component = (props) => {
    const { rows, state } = props;
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [chartdata, setChartData] = useState([]);

    useEffect(() => {
        let items = rows.filter(m => !Helper.IsNullValue(m.Pincode)).map(x => x.Pincode);
        items = Helper.RemoveDuplicatesFromArray(items).sort();
        let collections = [];
        items.forEach(x => {
            let count = rows.filter(m => m.Pincode === x).length;
            collections.push({ label: x, value: count });
        });
        collections = collections.splice(collections.length - 7);
        setChartData(collections);

    }, [state, rows]);

    return (

        <>
            <Box sx={{
                width: "100%",
                height: "100%",
                border: "1px solid #E7E7E7",
                boxShadow: "6px 6px 54px 0px #0000000D",
                borderRadius: 1,
                p: 2
            }}>
                <BarChart data={chartdata} />
            </Box>

            <Box sx={{
                width: "100%",
                border: "1px solid #E7E7E7",
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
                            //backgroundColor: "#F1F4F9 !important"
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: "700",
                            lineHeight: "21px"
                        },
                        border: "0px !important"
                    }}
                    columns={columns} keyId={'UserId'} rowsCount={rows.length} onPageClicked={(e) => setPageInfo(e)}
                    state={state} rows={rows} pageInfo={pageInfo} noActions={true} pageMode={"client"} />
            </Box>
        </>

    );

};

export default Component;