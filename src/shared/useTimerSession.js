import React from "react";

function getSessionStorageOrDefault(key, doParse, defaultValue) {
    let stored = sessionStorage.getItem(key);
    if (stored === 'undefined') stored = undefined;
    if (!stored) {
        return defaultValue;
    }
    return doParse ? JSON.parse(stored) : stored;
}

export default function useTimerSession(key, doParse, defaultValue) {
    const [value, setValue] = React.useState(getSessionStorageOrDefault(key, doParse, defaultValue));

    React.useEffect(() => {
        const interval = setInterval(() => {
            let _val = getSessionStorageOrDefault(key, doParse, defaultValue);
            if (value !== _val) setValue(_val);
        }, 500);
        return () => clearInterval(interval);
    }, [value, setValue, doParse, key, defaultValue]);


    return [value, setValue];
}