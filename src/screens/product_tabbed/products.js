import React, { useState, useEffect } from "react";
import { Box, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataTable } from '../childs';
import * as Api from "shared/services";
import Helper from "shared/helper";

const columns = [
    { headerName: "Name", field: "Name", sortField: "Name", flex: 1 },
    { headerName: "Type", field: "ProductTypeDesc", sortField: "ProductPType", flex: 1 },
    { headerName: "Description", field: "Product_description", sortField: "Product_description", flex: 1 },
    { headerName: "Manufacturer", field: "Manufacturer", sortField: "Manufacturer", flex: 1 },
    { headerName: "UOM", field: "UnitOfMeasurement", sortField: "UnitOfMeasurement", flex: 1 },
    { headerName: "Weight", field: "Weight", sortField: "Weight", flex: 1 },
    { headerName: "Size", field: "Size", sortField: "Size", flex: 1 },
    { headerName: "Color", field: "Color", sortField: "Color", flex: 1 }
];

const defaultError = "Something went wroing while creating record!";

const Component = (props) => {
    const { noActions } = props;
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

    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Product_description, '${searchStr}') or contains(Name, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetProductsCount(query)
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
        await Api.GetProducts(query, "PType")
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    if (_rows.length > 0) {
                        _rows.forEach(x => {
                            x.id = Helper.GetGUID();
                            x.ProductTypeDesc = x.PType?.ProductTypeDesc || 'NA';
                        });
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
        return _rows;
    }

    const OnViewChanged = (e) => {
        let _route;
        if (e === 'DETAILS') _route = `/products`;
        if (e === 'TILES') _route = `/producttiles`;
        if (e === 'CONTENT') _route = `/productcontent`;
        if (e === 'LIST') _route = `/productlist`;
        if (_route) NavigateTo(_route);
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await Api.SetProduct({ Product_id: deletedId, Deleted: true });
            if (rslt.status) {
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
        if (type === 'edit') _route = `/products/edit/${id}`;
        if (type === 'view') _route = `/products/view/${id}`;
        if (type === 'delete') setDeletedId(id);;
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    return (

        <>
            <Box style={{ width: '100%' }}>
                <DataTable keyId={'Product_id'} columns={columns} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                    onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} noActions={noActions} />
            </Box>
        </>

    );

};

export default Component;