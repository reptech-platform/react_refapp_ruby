import * as React from 'react';
import { InputBase, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import Helper from "shared/helper";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 2,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    marginRight: 10,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(3)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                borderBottom: "1px solid rgba(0, 0, 0, 0.87)",
            },
        },
    },
}));

const Component = ({ searchStr, onSearchChanged }) => {

    const [value, setValue] = React.useState("");

    const OnKeyPressed = (e) => {
        if (e.keyCode === 13 || e.charCode === 13 || e.which === 13) {
            if (onSearchChanged) onSearchChanged(value);
        }
    }

    const OnInputChanged = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    const OnClearInput = (e) => {
        e.preventDefault();
        if (onSearchChanged) onSearchChanged("");
    }

    React.useEffect(() => {
        setValue(searchStr);
    }, [searchStr])

    return (
        <>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    onChange={(e) => OnInputChanged(e)}
                    onKeyPress={(e) => OnKeyPressed(e)}
                    placeholder="Search…"
                    value={value}
                    inputprops={{ 'aria-label': 'search' }} />
                {!Helper.IsNullValue(value) && (
                    <IconButton
                        size="medium"
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={(e) => OnClearInput(e)}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Search>
        </>
    );
}

export default Component;
