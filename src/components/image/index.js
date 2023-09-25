import React from 'react';
import { Box, Tooltip } from '@mui/material';


const Component = ({ src, alt, sx, onClick, ...rest }) => {

    return (
        <Tooltip title={alt} followCursor>
            <Box
                {...rest}
                component="img"
                sx={{ ...sx }}
                alt={alt}
                src={src}
                onClick={() => onClick && onClick()}
            />
        </Tooltip>
    );

};

export default Component;