import React from "react";
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar, Stack } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const Component = (props) => {

    const { id, selected, count, trendingValue, trendingLabel, title, onItemSeleted } = props;

    let trendingUp = !trendingValue.toString().startsWith("-");

    const trendingColor = trendingUp ? "#00B69B" : "#F93C65";
    const borderColor = selected === id ? 'green' : '#E7E7E7';

    const trendingIcon = trendingUp ? <TrendingUpIcon sx={{ color: trendingColor }} /> : <TrendingDownIcon sx={{ color: trendingColor }} />;

    const OnItemSelected = (e) => {
        e.preventDefault();
        if (onItemSeleted) onItemSeleted(id);
    }

    return (

        <>
            <Box sx={{
                width: 280,
                height: 160,
                //backgroundColor: "#ffffff",
                border: "1px solid",
                borderColor,
                boxShadow: "6px 6px 54px 0px #0000000D",
                borderRadius: 5,
                cursor: "pointer"
            }} onClick={OnItemSelected}>
                <List sx={{ width: '100%', maxWidth: 360 }}>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Typography
                                        sx={{
                                            display: 'inline',
                                            opacity: "70%",
                                            fontFamily: "Poppins",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            lineHeight: "24px",
                                            textAlign: "left"
                                        }}
                                        component="span"
                                    >
                                        {title}
                                    </Typography>
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{
                                            display: 'inline',
                                            fontFamily: "Poppins",
                                            fontSize: "28px",
                                            fontWeight: "700",
                                            lineHeight: "42px",
                                            textAlign: "left",
                                            letterSpacing: "1px"
                                        }}
                                        component="span"
                                    >
                                        {count}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp">
                                <PermIdentityIcon />
                            </Avatar>
                        </ListItemAvatar>
                    </ListItem>
                    <ListItem alignItems="flex-start">
                        <ListItemText>
                            <Stack sx={{
                                display: "flex",
                                alignItems: "center",
                                fontFamily: "Poppins",
                                fontSize: "16px",
                                fontWeight: "600",
                                lineHeight: "24px"

                            }} direction={"row"} spacing={1}>
                                {trendingIcon}
                                <Typography
                                    sx={{
                                        display: 'inline',
                                        color: trendingColor
                                    }}
                                >
                                    {trendingValue}%
                                </Typography>
                                <Typography
                                    sx={{
                                        display: 'inline',
                                        opacity: "70%",
                                        fontFamily: "Poppins",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        lineHeight: "24px",
                                        textAlign: "left"
                                    }}
                                >
                                    {trendingLabel}
                                </Typography>
                            </Stack>
                        </ListItemText>
                    </ListItem>
                </List>
            </Box>
        </>

    );

};

export default Component;