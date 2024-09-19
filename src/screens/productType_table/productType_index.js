import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, Divider, IconButton, useTheme } from '@mui/material';
import { Add as AddBoxIcon } from '@mui/icons-material';
import Container from "screens/container";
import { SearchInput, CustomDialog, TextInput } from "components";
import { GetProductTypes, GetProductTypesCount, SetProductTypes } from "shared/services";
import Support from "shared/support";
import Helper from "shared/helper";
import { DataTable } from '../childs';
import { ValidatorForm } from 'react-material-ui-form-validator';

const columns = [
    { headerName: "Name", field: "ProductTypeName", flex: 1, editable: false },
    { headerName: "Description", field: "ProductTypeDesc", flex: 1, editable: true }
];

const dataColumns = [
    { key: "PtId", type: "keyid" },
    { key: "ProductTypeName", label: "Type", type: "text", value: null },
    { key: "ProductTypeDesc", label: "Type", type: "text", value: null }
];


const httpMethods = { add: 'POST', edit: 'PATCH', delete: 'DELETE' };
const httpMethodResponse = {
    POST: { success: 'created', failed: 'creating' },
    PATCH: { success: 'updated', failed: 'updating' },
    DELETE: { success: 'deleted', failed: 'deleting' }
};

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [actions, setActions] = useState({ id: 0, action: null });
    const [product, setProduct] = useState({ PtId: null, ProductTypeName: null, ProductTypeDesc: null });
    const form = React.useRef(null);

    const LoadData = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(ProductTypeDesc, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetProductTypesCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        if (!Helper.IsJSONEmpty(sortBy)) {
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];
        await GetProductTypes(query)
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    for (let i = 0; i < _rows.length; i++) {
                        _rows[i].id = Helper.GetGUID();
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
    }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }
    const OnSortClicked = (e) => { setSortBy(e); }
    const OnSearchChanged = (e) => { setSearchStr(e); }
    const OnInputChange = (e) => { setProduct((prev) => ({ ...prev, [e.name]: e.value })); }

    const OnActionClicked = (id, type) => {
        ClearSettings();
        setActions({ id, action: type });
        if (type === 'edit' || type === 'delete') {
            const { PtId, ProductTypeName, ProductTypeDesc } = rows.find((x) => x.PtId === id);
            setProduct({ PtId, ProductTypeName, ProductTypeDesc });
        }
    }

    const ClearSettings = () => {
        setActions({ id: 0, action: null });
        setProduct({ PtId: null, ProductTypeName: null, ProductTypeDesc: null });
    }

    const OnCloseClicked = (e) => {
        if (!e) {
            ClearSettings();
            return;
        }
        if (actions.action === 'add' || actions.action === 'edit') {
            if (form) form.current.submit();
        } else if (actions.action === 'delete') {
            handleSubmit();
        }
    }

    const handleSubmit = async () => {
        const httpMethod = httpMethods[actions.action] || null;
        await DoAction({ httpMethod, ...product })
            .then((status) => {
                if (status) {
                    setInitialize(true);
                    ClearSettings();
                    setPageInfo({ page: 0, pageSize: 5 });
                }
            });
    }

    const DoAction = async (params) => {
        return new Promise(async (resolve) => {
            const { success, failed } = httpMethodResponse[params.httpMethod];
            global.Busy(true);
            let data = { ...params, Deleted: params.httpMethod === 'DELETE' };
            delete data["httpMethod"];

            let dataItems = Helper.CloneObject(dataColumns);
            dataItems.forEach(e => {
                e.value = data[e.key];
            });

            let numfields = Helper.GetAllNumberFields(dataItems);
            if (numfields.length > 0) Helper.UpdateNumberFields(dataItems, numfields)

            const { status } = await Support.AddOrUpdateProductType(dataItems);
            if (status) {
                global.AlertPopup("success", `Record is ${success} successful!`);
            } else {
                global.AlertPopup("error", `Something went wroing while ${failed} record!`);
            }
            global.Busy(false);
            return resolve(status);
        });
    }

    if (initialize) { setInitialize(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);
    useEffect(() => { setInitialize(true); }, []);

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
                                onClick={() => OnActionClicked(undefined, 'add')}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <Box style={{ width: '100%' }}>
                    <DataTable keyId={'PtId'} columns={columns} rowsCount={rowsCount} rows={rows} noView={true}
                        sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                </Box>

                <CustomDialog open={actions.action == 'delete'} action={actions.action} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'add'} action={actions.action} title={"Add Product Type"} onCloseClicked={OnCloseClicked}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Product Name</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"ProductTypeName"} name={"ProductTypeName"} value={product.ProductTypeName} validators={['required']}
                                    validationMessages={['Name is required']} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Product Description</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"ProductTypeDesc"} name={"ProductTypeDesc"} value={product.ProductTypeDesc} validators={['required']}
                                    validationMessages={['Description is required']} OnInputChange={OnInputChange} />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'edit'} action={actions.action} title={"Edit Product Type"} onCloseClicked={OnCloseClicked}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Product Name</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"ProductTypeName"} name={"ProductTypeName"} value={product.ProductTypeName} validators={['required']}
                                    validationMessages={['Name is required']} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Product Description</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"ProductTypeDesc"} name={"ProductTypeDesc"} value={product.ProductTypeDesc} validators={['required']}
                                    validationMessages={['Description is required']} OnInputChange={OnInputChange} />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </CustomDialog>

            </Container>
        </>
    )

}

export default Component;
