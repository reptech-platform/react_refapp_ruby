import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
    palette: {
        /* mode: "dark", */
        success: {
            main: "#922c88"
        },
        primary: {
            main: "#ffffff",
        },
        secondary: {
            main: "#922c88",
            dark: "#73236b",
            100: "#e1bee7",
            200: "#ce93d8",
            300: "#ba68c8",
            400: "#ab47bc",
            500: "#9c27b0",
        },
        text: {
            secondary: "#878787",
        },
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
        caption: {
            fontSize: "0.8rem",
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
        }
    },
    select: {
        fontSize: "0.8rem",
        height: 21
    },
    selected: {
        backgroundColor: "#E0E0E0"
    },
    components: {
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
        }
    }
});

export default theme;
