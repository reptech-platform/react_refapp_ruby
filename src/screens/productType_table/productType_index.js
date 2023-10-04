import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, Divider, IconButton, useTheme } from '@mui/material';
import { Add as AddBoxIcon } from '@mui/icons-material';
import Container from "screens/container";
import { SearchInput, CustomDialog, TextInput } from "components";
import { GetProductTypesApi, SetProductTypesApi, GetProductTypesCount } from "shared/services";
import Helper from "shared/helper";
import { DataTable } from '../childs';
import { ValidatorForm } from 'react-material-ui-form-validator';

const columns = [
    { headerName: "Code", field: "ProductTypeCode", flex: 1, editable: false },
    { headerName: "Description", field: "ProductTypeDescription", flex: 1, editable: true }
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
    const [product, setProduct] = useState({ ProductTypeCode: null, ProductTypeDescription: null });
    const form = React.useRef(null);

    const LoadData = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(ProductTypeDescription, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetProductTypesCount(query)
            .then(async (res) => {
                if (res) setRowsCount(parseInt(res));
            })
            .catch((err) => console.log(err));

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

        const productTypes = await GetProductTypesApi(query);
        const { value } = productTypes || { value: [] };

        let _rows = value || [];
        for (let i = 0; i < _rows.length; i++) {
            _rows[i].id = Helper.GetGUID();
        }

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
            const { ProductTypeCode, ProductTypeDescription } = rows.find((x) => x.ProductTypeCode === id);
            setProduct({ ProductTypeCode, ProductTypeDescription });
        }
    }

    const ClearSettings = () => {
        setActions({ id: 0, action: null });
        setProduct({ ProductTypeCode: null, ProductTypeDescription: null });
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
            const { status } = await SetProductTypesApi(params.httpMethod, params.ProductTypeDescription, params.ProductTypeCode);
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
                    <DataTable keyId={'ProductTypeCode'} columns={columns} rowsCount={rowsCount} rows={rows} noView={true}
                        sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                </Box>

                <CustomDialog open={actions.action == 'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'add'} title={"Add Product Type"} onCloseClicked={OnCloseClicked}>
                    <Box sx={{
                        width: "50%", display: "flex", flexDirection: "column",
                        justifyContent: "center", alignContent: "center",
                        justifyItems: "center", alignItems: "center"
                    }}>
                        <Typography noWrap gutterBottom>
                            Enter Product Description
                        </Typography>
                    </Box>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <TextInput id={"ProductTypeDescription"} name={"ProductTypeDescription"} value={product.ProductTypeDescription} validators={['required']}
                            validationMessages={['Description is required']} OnInputChange={OnInputChange} />
                    </ValidatorForm>

                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'edit'} title={"Edit Product Type"} onCloseClicked={OnCloseClicked}>
                    <Box sx={{
                        width: "50%", display: "flex", flexDirection: "column",
                        justifyContent: "center", alignContent: "center",
                        justifyItems: "center", alignItems: "center"
                    }}>
                        <Typography noWrap gutterBottom>
                            Enter Product Description
                        </Typography>
                    </Box>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <TextInput id={"ProductTypeDescription"} name={"ProductTypeDescription"} value={product.ProductTypeDescription} validators={['required']}
                            validationMessages={['Description is required']} OnInputChange={OnInputChange} />
                    </ValidatorForm>
                </CustomDialog>

            </Container>
        </>
    )

}

export default Component;
