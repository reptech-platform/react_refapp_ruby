
import React, { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { LineChart } from "components/charts";
import Helper from "shared/helper";
import { DataTable } from 'screens/childs';

const columns = [
    { headerName: "Name", field: "Name", flex: 1, sortable: false },
    { headerName: "Date Of Birth", field: "DateOfBirth", flex: 1, sortable: false },
    { headerName: "Profile Name", field: "ProfileName", flex: 1, sortable: false },
    {
        headerName: "Interests", field: "Interests", flex: 1, sortable: false,
        renderCell: (index) => { return index.row.Interests?.join(",") }
    }
];

const Component = (props) => {
    const { rows, state } = props;
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [chartdata, setChartData] = useState([]);

    useEffect(() => {

        let items = rows.filter(m => !Helper.IsNullValue(m.CreatedDate)).map(x => Helper.FormatDate(x.CreatedDate, 'YYYY-MM-DD'));
        items = Helper.RemoveDuplicatesFromArray(items).sort();
        let collections = [];
        items.forEach(x => {
            let count = rows.filter(m => Helper.FormatDate(m.CreatedDate, 'YYYY-MM-DD') === x).length;
            collections.push({ label: Helper.FormatDate(x, 'YY-MMM-DD'), value: count });
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
                backgroundColor: "#FFFFFF",
                boxShadow: "6px 6px 54px 0px #0000000D",
                borderRadius: 1,
                p: 2
            }}>
                <LineChart data={chartdata} />
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
                    columns={columns} keyId={'UserId'} rowsCount={rows.length} onPageClicked={(e) => setPageInfo(e)}
                    rows={rows} pageInfo={pageInfo} noActions={true} pageMode={"client"} />
            </Box>
        </>

    );

};

export default Component;