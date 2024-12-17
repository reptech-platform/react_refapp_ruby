import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, IconButton, useTheme } from '@mui/material';
import { Add as AddBoxIcon } from '@mui/icons-material';
import { SearchInput, CustomDialog } from "components";
import { DataTable } from '../../childs';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import Helper from "shared/helper";

/* getRowId={(row) => row.statId} */

const Component = (props) => {
    const { title, configData, rows, onTableRowUpdated, mode } = props;
    const theme = useTheme();

    const [initialize, setInitialize] = useState(false);
    const [state, setState] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [searchStr, setSearchStr] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [actions, setActions] = useState({ id: 0, action: null });

    const [configInfo, setConfigInfo] = useState(null);
    const [columns, setColumns] = useState([]);
    const [keyIdName, setKeyIdName] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const [configBackInfo, setConfigBackInfo] = useState(null);

    const form = React.useRef(null);

    const InitializeConfig = async () => {
        let _columns = configData.filter(x => x.type !== 'keyid').map(z => {
            return { headerName: z.label, field: z.key, flex: 1, flexGrow: 1, flexShrink: 1 };
        });

        const _keyItem = configData.find(x => x.type === 'keyid');
        setKeyIdName(_keyItem.key);
        setColumns(_columns);
        setConfigBackInfo(Helper.CloneObject(configData));
        setConfigInfo(configData);
    }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }
    const OnSortClicked = (e) => { setSortBy(e); }
    const OnSearchChanged = (e) => { setSearchStr(e); }
    const OnInputChange = (e) => { setNewItem((prev) => ({ ...prev, [e.name]: e.value })); }

    const OnActionClicked = (id, type) => {

        ClearSettings();
        if (type === 'edit' || type === 'view' || type === 'delete') {
            const selectedRow = rows.find((x) => x[keyIdName] === id);
            let tmpInfo = configInfo;
            tmpInfo.forEach(x => x.value = selectedRow[x.key]);
            setConfigInfo(tmpInfo);
            setNewItem(selectedRow);
            setState(!state);
        }
        setActions({ id, action: type });
    }

    const ClearSettings = () => {
        setConfigInfo(Helper.CloneObject(configBackInfo));
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
        if (onTableRowUpdated) {
            onTableRowUpdated({ ...actions, keyIdName, data: newItem });
            ClearSettings();
        }
    }

    if (initialize) { setInitialize(false); InitializeConfig(); }
    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);
    useEffect(() => { setInitialize(true); }, []);

    return (
        <>
            <Box style={{
                width: '100%', paddingBottom: 5, backgroundColor: "#F9F9F9",
                borderTop: "1px solid rgba(0,0,0,.15)",
                borderLeft: "1px solid rgba(0,0,0,.15)",
                borderRight: "1px solid rgba(0,0,0,.15)",
                borderRadius: "3px !important"
            }}>
                <Stack direction="row" sx={{ padding: "5px" }}>
                    <Typography noWrap variant="subheader" component="div"
                        sx={{
                            display: "flex", alignSelf: "center",
                            paddingLeft: "5px", width: "100%"

                        }}>
                        {title}
                    </Typography>
                    <Grid container sx={{ justifyContent: 'flex-end' }}>
                        <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                        {mode !== 'view' && (
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
                        )}
                    </Grid>
                </Stack>
            </Box>
            <Box style={{ width: '100%' }}>
                <DataTable keyId={keyIdName} columns={columns} rowsCount={rows ? rows.length : 0} rows={rows || []} noActions={mode === 'view'}
                    sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked} localPaginationMode={true} localSorting={true}
                    onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
            </Box>

            <CustomDialog open={actions.action === 'delete'} title={"Confirmation"} action={actions.action} onCloseClicked={OnCloseClicked}>
                <Typography gutterBottom>
                    Are you sure? You want to delete?
                </Typography>
            </CustomDialog>

            {!Helper.IsNullValue(actions.action) && actions.action !== 'delete' && (
                <CustomDialog sxContent={{ padding: "16px 24px !important" }} width="auto" action={actions.action}
                    open={!Helper.IsNullValue(actions.action)} title={`${Helper.ToFirstCharCapital(actions.action)} ${title}`} onCloseClicked={OnCloseClicked}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <RenderFormContols shadow={true} location="newItem" mode={actions.action} onInputChange={OnInputChange}
                                controls={configInfo} options={props.options} />
                        </Grid>
                    </ValidatorForm>
                </CustomDialog>
            )}
        </>
    )

}

export default Component;
