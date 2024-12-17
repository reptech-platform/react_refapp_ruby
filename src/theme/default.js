import { grey } from '@mui/material/colors';
import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: grey[500] },
        secondary: { main: "#ffffff" }
    },
    stepper: {
        contentColor: "#ffffff"
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        color: undefined,
        caption: {
            fontSize: "0.8rem",
        },
        colorcaption: {
            fontSize: "0.8rem",
            color: "grey"
        },
        avatar: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        header: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        subheader: {
            fontSize: "1rem",
            fontWeight: 'bold',
            margin: "5px 0px 5px 0px"
        },
        subheadercenter: {
            fontSize: "1rem",
            fontWeight: 'bold',
            padding: "5px",
            backgroundColor: "#F9F9F9",
            display: "block",
            borderBottom: "1px solid rgba(0,0,0,.05)",
            borderTopLeftRadius: "3px",
            borderTopRightRadius: "3px"
        },
        cardheader: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        labelheader: {
            fontSize: "1rem",
            fontWeight: "bold",
            width: "100%",
            textAlign: "right"
        },
        h6: {
            fontSize: "1.15rem",
        },
        mandatory: {
            marginLeft: 1,
            color: "rgb(211, 47, 47)"
        },
        notstarted: {
            backgroundColor: "#5E696E",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        started: {
            backgroundColor: "#E78C07",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        pending: {
            backgroundColor: "#BB0000",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        completed: {
            backgroundColor: "#2B7D2B",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        }
    },
    select: {
        fontSize: "0.8rem",
        height: 21
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: undefined
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                            borderWidth: "1px",
                            // borderColor: "rgba(0, 0, 0, 0.23)" // default color
                            borderColor: "rgba(0, 0, 0, 0.87)"
                        },
                        "&.Mui-error fieldset": {
                            borderWidth: "1px",
                            borderColor: "rgb(211, 47, 47)",
                        }
                    },
                    "& .MuiFormHelperText-root": {
                        marginLeft: "2px"
                    }
                }
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF"
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "#FFFFFF"
                }
            }
        }
    },
    borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
    borderBottomFocus: "1px solid rgba(0, 0, 0, 0.87)",
    customBorder: "1px solid rgba(0, 0, 0, 0.23)",
    customBackColor: "#ffffff",
    workspaceBackColor: "#F7F9FD"
});

export default theme;
