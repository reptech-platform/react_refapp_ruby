
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataTable } from '../childs';
import * as Api from "shared/services";

import { SearchInput, CustomDialog } from "components";
import Helper from "shared/helper";
import { Add as AddBoxIcon } from '@mui/icons-material';
import Support from "shared/support";

const dateFields = ["Date", "StartDateOfValidity", "EndDateOfValidity"];

const columns = [
    { headerName: "OrderId", field: "OrderId", sortField: "OrderId", flex: 0.5 },
    { headerName: "Date", field: "Date", sortField: "Date", flex: 0.6 },
    { headerName: "Company Code", field: "CompanyCode", sortField: "CompanyCode", flex: 0.6 },
    { headerName: "Vendor Account Number", field: "VendorAccountNumber", sortField: "VendorAccountNumber", flex: 1 },
    { headerName: "PoCategory", field: "PoCategory", sortField: "PoCategory", flex: 0.5 },
    { headerName: "Start Date Of Validity", field: "StartDateOfValidity", sortField: "StartDateOfValidity", flex: 0.6 },
    { headerName: "End Date Of Validity", field: "EndDateOfValidity", sortField: "EndDateOfValidity", flex: 0.6 },
    { headerName: "Destination City Code", field: "DestinationCityCode", sortField: "DestinationCityCode", flex: 0.6 },
    { headerName: "Shipping Type", field: "ShippingType", sortField: "ShippingType", flex: 0.6 },
    { headerName: "Shipping Address", field: "ShippingAddress", sortField: "ShippingAddress", flex: 1 },
    { headerName: "IsApproved", field: "IsApproved", sortField: "IsApproved", flex: 0.5 }

];

const defaultError = "Something went wroing while creating record!";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);

    const NavigateTo = useNavigate();

    const ExtractShippingAddress = (x) => {

        let tmp = [];

        for (let p in x) {
            tmp.push(x[p]);
        }

        return tmp.join(" ");
    }

    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(VendorAccountNumber, '${searchStr}') or contains(Name, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetOrdersCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        if (!Helper.IsJSONEmpty(sortBy)) {
            const sortByField = columns.find(x => x.field == sortBy.field)?.sortField || sortBy.field;
            filters.push(`$orderby=${sortByField} ${sortBy.sort}`);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];
        await Api.GetOrders(query)
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    if (_rows.length > 0) {
                        _rows.forEach(x => {
                            x.id = Helper.GetGUID();
                            x.ShippingAddress = ExtractShippingAddress(x.ShippingAddress);
                        });
                        dateFields.forEach(m => {
                            _rows.forEach(x => {
                                x[m] = Helper.ToDate(x[m], "YYYY-MM-DD");
                            });
                        })
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
        return _rows;
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await Support.DeleteOrder(deletedId);
            if (rslt.status) {
                setDeletedId(0);
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
            }
        } else {
            setDeletedId(0);
            setShowConfirm(false);
        }
    }

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/order/edit/${id}`;
        if (type === 'view') _route = `/order/view/${id}`;
        if (type === 'delete') setDeletedId(id);
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                    <Stack direction="row">
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: theme.borderBottom
                                }}
                                onClick={() => NavigateTo("/order/new")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataTable keyId={'OrderId'} columns={columns} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                </Box>
                <CustomDialog open={showConfirm} title={"Confirmation"} action="delete" onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;