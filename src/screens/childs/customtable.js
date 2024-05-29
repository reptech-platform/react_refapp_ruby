import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, Divider, IconButton, useTheme } from '@mui/material';
import { Add as AddBoxIcon } from '@mui/icons-material';
import { SearchInput, CustomDialog } from "components";
import { GetEntityInfoCount, GetEntityInfo, SetEntityInfo } from "shared/services";
import Helper from "shared/helper";
import { DataTable } from '../childs';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";

const httpMethods = { add: 'POST', edit: 'PATCH', delete: 'DELETE' };

const httpMethodResponse = {
    POST: { success: 'created', failed: 'creating' },
    PATCH: { success: 'updated', failed: 'updating' },
    DELETE: { success: 'deleted', failed: 'deleting' }
};

const Component = (props) => {
    const { title, configFile } = props;
    const theme = useTheme();

    const [initialize, setInitialize] = useState(false);
    const [initializeRows, setInitializeRows] = useState(false);

    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [actions, setActions] = useState({ id: 0, action: null });

    const [configInfo, setConfigInfo] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [entityName, setEntityName] = useState(null);
    const [columns, setColumns] = useState([]);
    const [keyIdName, setKeyIdName] = useState(null);
    const [newItem, setNewItem] = useState(null);

    const form = React.useRef(null);

    const FetchProductInfo = async () => {
        let items = [];
        return new Promise(async (resolve) => {
            const fileInfo = require(`config/${configFile}`);
            const keyItems = Object.keys(fileInfo);
            keyItems.forEach(elm => { items.push({ ...fileInfo[elm], value: null }); });
            return resolve(items);
        });
    }

    const InitializeConfig = async () => {
        await FetchProductInfo().then(async rslt => {
            let _columns = rslt.filter(x => x.type !== 'keyid').map(z => {
                return { headerName: z.label, field: z.key, flex: 1 };
            });
            const _keyItem = rslt.find(x => x.type === 'keyid');
            setKeyIdName(_keyItem.key);
            setEntityName(_keyItem.entityName);
            setSortField(_keyItem.sortField);
            setColumns(_columns);
            setConfigInfo(rslt);
            setInitializeRows(true);
        });
    }

    const LoadData = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        let url = `${entityName}s/$count`;

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(${sortField}, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        if (!Helper.IsNullValue(query)) {
            url = `${entityName}s/$count?${query}`;
        }

        await GetEntityInfoCount(url)
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

        url = `${entityName}s`;
        if (!Helper.IsNullValue(query)) {
            url = `${entityName}s?${query}`;
        }

        let _rows = [];
        await GetEntityInfo(url)
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
    const OnInputChange = (e) => { setNewItem((prev) => ({ ...prev, [e.name]: e.value })); }

    const OnActionClicked = (id, type) => {

        ClearSettings();
        if (type === 'edit' || type === 'delete') {
            const selectedRow = rows.find((x) => x[keyIdName] === id);
            configInfo.forEach(x => x.value = selectedRow[x.key]);
            setNewItem(selectedRow);
        }
        setActions({ id, action: type });
    }

    const ClearSettings = () => {
        configInfo.forEach(x => x.Value = null);
        setActions({ id: 0, action: null });
        setNewItem(null);
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
        await DoAction({ httpMethod, ...newItem })
            .then((status) => {
                ClearSettings();
                if (status) {
                    setInitializeRows(true);
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
            const { status } = await SetEntityInfo(entityName, keyIdName, data);
            if (status) {
                global.AlertPopup("success", `Record is ${success} successful!`);
            } else {
                global.AlertPopup("error", `Something went wroing while ${failed} record!`);
            }
            global.Busy(false);
            return resolve(status);
        });
    }

    if (initialize) { setInitialize(false); InitializeConfig(); }
    if (initializeRows) { setInitializeRows(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);
    useEffect(() => { setInitialize(true); }, []);

    return (
        <>
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
                <DataTable keyId={keyIdName} columns={columns} rowsCount={rowsCount} rows={rows} noView={true}
                    sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                    onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
            </Box>

            <CustomDialog open={actions.action == 'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                <Typography gutterBottom>
                    Are you sure? You want to delete?
                </Typography>
            </CustomDialog>

            <CustomDialog sxContent={{ padding: "16px 24px !important" }} width="auto" open={actions.action == 'add'} title={`Add ${title}`} onCloseClicked={OnCloseClicked}>
                <ValidatorForm ref={form} onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <RenderFormContols shadow={true} location="newItem" mode={null} onInputChange={OnInputChange}
                            controls={configInfo} options={props.options} />
                    </Grid>
                </ValidatorForm>
            </CustomDialog>

            <CustomDialog sxContent={{ padding: "16px 24px !important" }} width="auto" open={actions.action == 'edit'} title={`Edit ${title}`} onCloseClicked={OnCloseClicked}>
                <ValidatorForm ref={form} onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <RenderFormContols shadow={true} location="newItem" mode={'edit'} onInputChange={OnInputChange}
                            controls={configInfo} options={props.options} />
                    </Grid>
                </ValidatorForm>
            </CustomDialog>
        </>
    )

}

export default Component;
