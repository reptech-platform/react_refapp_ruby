import * as React from "react";
import { Box, TableContainer, Table, TableBody, TableCell, TableRow, Paper, Typography, IconButton, TableHead } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formControls/RenderFormContols";
import { Edit as EditIcon } from "@mui/icons-material";
import DataTable from './datatable';

const RenderTableStructure = (props) => {
    const { shadow, review, parentKey } = props;
    const headerVariant = shadow ? "subheadercenter" : "subheader";
    const childInfo = props.controls && props.controls.child?.find(x => x.type === 'keyid');
    const rowsCount = 1;
    const rows = [];

    const [columns, setColumns] = React.useState([]);

    const OnEditClicked = (e) => { }


    React.useEffect(() => {

        setColumns([]);

        if (props.controls.child) {
            const collections = props.controls.child.filter(x => x.type !== 'keyid')
                .map(z => { return { field: z.field, headerName: z.headerName, flex: 1, editable: true } });
            setColumns(collections);
        }


    }, [props]);

    return (
        <>
            <Typography variant={headerVariant}>
                {review && (
                    <>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="Edit"
                            sx={{ width: 18, height: 18, margin: 0, padding: 0 }}
                            onClick={(e) => OnEditClicked(e)}
                        >
                            <EditIcon color="primary" sx={{ width: 18, height: 18 }} />
                        </IconButton>
                        &nbsp;
                    </>
                )}
                {childInfo?.entitylabel}
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table sx={{ display: 'table', width: '100%', border: 0, }}>
                    <thead>

                        <TableHead sx={{
                            display: 'th', width: '100%',
                            "& .MuiTableCell-head": {
                                color: "white",
                                backgroundColor: "blue"
                            }
                        }}>
                            {columns && columns.map((x, i) => (
                                <TableCell key={i} sx={{ border: 0 }}>{x.headerName}</TableCell>

                            ))}
                        </TableHead>


                    </thead>
                </Table>
            </TableContainer>
        </>
    )
}

const Component = (props) => {

    const { onInputChange, onSubmit, shadow } = props;
    const form = React.useRef(null);

    const boxShadow = shadow ? "0 1px 5px rgba(0,0,0,.15) !important" : null;
    const borderRadius = shadow ? "3px !important" : null;
    const parentInfo = props.controls && props.controls.parent?.find(x => x.type === 'keyid');

    const handleSubmit = () => {
        if (onSubmit) onSubmit();
    }

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange(e);
    }

    React.useEffect(() => {
        if (props.setForm) props.setForm(form);
    }, [props, form]);

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderFormContols shadow={true} location={parentInfo?.entityName} mode={props.mode} title={parentInfo?.entitylabel}
                            controls={props.controls.parent} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ width: "100%", margin: 2, boxShadow, borderRadius }}>
                        <RenderTableStructure {...props} />
                    </Box>
                </Box>

            </ValidatorForm>
        </Box>
    );

}

export default Component;