

import React, { useState, useEffect } from "react";
import Container from "screens/container";
import { Grid, Stack } from '@mui/material';
import { CounterContainer } from "components";
import Helper from "shared/helper";
import * as Api from "shared/services";
import UserView from "./childs/users";
import LocationView from "./childs/locations";
import ChildView from "./childs/childview";
import { useTheme } from "@emotion/react";

const Component = (props) => {

    const [initialize, setInitialize] = useState(false);
    const [selectedItem, setSelectedItem] = useState(0);
    const [rows, setRows] = useState([]);
    const [counts, setCounts] = useState({
        usersCount: 0, usersGrowth: 0,
        locationsCount: 0, locationsGrowth: 0,
        hobbiesCount: 0, hobbiesGrowth: 0
    });
    const [state, setState] = useState(false);
    const theme = useTheme();

    const UpdateCounts = (name, value) => {
        setCounts((prev) => ({ ...prev, [name]: value }));
    }

    const GetDayPercentage = (list, field, type) => {
        const prevDate = Helper.AlterDate(null, type, -1);
        const curDate = Helper.AlterDate(null, 't');
        const getCreatedDateList = list.filter((x) => !Helper.IsNullValue(x[field]));
        const prevDayCount = getCreatedDateList.filter((x) => Helper.IsDateEqual(x[field], prevDate)).length;
        const curDayCount = getCreatedDateList.filter((x) => Helper.IsDateEqual(x[field], curDate)).length;
        if (parseInt(curDayCount) === 0 || parseInt(prevDayCount) === 0) return 0;
        const diffCount = parseInt(curDayCount) - parseInt(prevDayCount);
        return (parseInt(diffCount) / parseInt(prevDayCount)) * 100;
    }

    const FetchUserResults = async () => {
        //setRows([]);
        global.Busy(true);
        let rslt = await Api.GetUsers();
        global.Busy(false);
        if (rslt.status) {
            let usersList = rslt.values || [];
            usersList.forEach(x => x.id = x.UserId);

            const usersGrowth = GetDayPercentage(usersList, 'CreatedDate', 'd');

            UpdateCounts('usersCount', usersList.length);
            UpdateCounts('usersGrowth', usersGrowth);

            const locationGrowth = GetDayPercentage(usersList, 'Pincode', 'w');
            UpdateCounts('locationsCount', usersList.length);
            UpdateCounts('locationsGrowth', locationGrowth);

            if (selectedItem === 1 || selectedItem === 2) setRows(usersList);

        } else {
            console.log(rslt.statusText);
        }

        setState(!state);
    }

    const FetchChildResults = async () => {
        //setRows([]);
        global.Busy(true);
        let rslt = await Api.GetChilds();
        global.Busy(false);

        if (rslt.status) {
            let childsList = rslt.values || [];
            childsList.forEach(x => x.id = x.ChildId);

            // Alter data until have actual data. 
            childsList.forEach((x, index) => x.CreatedDate = (index % 3) === 0 ? Helper.AlterDate(null, 'd', -1) : Helper.AlterDate(null, 'd', -index));
            let hobbiesList = childsList.filter(x => !Helper.IsArrayNull(x.Interests));

            const hobbiesGrowth = GetDayPercentage(childsList, 'CreatedDate', 'd');
            UpdateCounts('hobbiesGrowth', hobbiesGrowth);
            UpdateCounts('hobbiesCount', hobbiesList.length);

            if (selectedItem === 3) setRows(childsList);

        } else {
            console.log(rslt.statusText);
        }
        setState(!state);
    }

    const FetchResults = async () => {
        setRows([]);
        await FetchUserResults();
        await FetchChildResults();
    }

    if (initialize) { setInitialize(false); setSelectedItem(1); }
    useEffect(() => { setInitialize(true); }, []);
    useEffect(() => { FetchResults(); }, [selectedItem]);

    return (

        <>
            <Container {...props}>
                <Grid container rowGap={6} sx={{ p: 2 }} >
                    <Stack direction={"row"} columnGap={5}>
                        <CounterContainer id={1} selected={selectedItem} title="Users" count={counts.usersCount} onItemSeleted={(e) => setSelectedItem(e)}
                            trendingUp={counts.usersGrowth} trendingValue={counts.usersGrowth} trendingLabel={"Up from yesterday"} />
                        <CounterContainer id={2} selected={selectedItem} title="Locations" count={counts.locationsCount} onItemSeleted={(e) => setSelectedItem(e)}
                            trendingValue={counts.locationsGrowth} trendingLabel={"Up from past week"} />
                        <CounterContainer id={3} selected={selectedItem} title="Hobbies" count={counts.hobbiesCount} onItemSeleted={(e) => setSelectedItem(e)}
                            trendingValue={counts.hobbiesGrowth} trendingLabel={"Down from yesterday"} />
                    </Stack>
                    {selectedItem === 1 ? <UserView state={state} rows={rows} /> : null}
                    {selectedItem === 2 ? <LocationView state={state} rows={rows} /> : null}
                    {selectedItem === 3 ? <ChildView state={state} rows={rows} /> : null}
                </Grid>
            </Container>
        </>

    );

};

export default Component;