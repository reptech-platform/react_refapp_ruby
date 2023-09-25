var fn = {};

/* Session Start */
fn.Store = (key, value, json) => {
    if (json) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    else {
        sessionStorage.setItem(key, value);
    }
};

fn.StoreAsync = async (key, value, json) => {
    return new Promise(async (resolve) => {
        fn.Store(key, value, json);
        return resolve(true);
    });
};

fn.Retrieve = (key, parse) => {
    if (parse) {
        return JSON.parse(sessionStorage.getItem(key));
    }
    else {
        return sessionStorage.getItem(key);
    }
};


fn.RetrieveAsync = async (key, parse) => {
    return new Promise(async (resolve) => {
        return resolve(fn.Retrieve(key, parse));
    });
};

export default fn;
