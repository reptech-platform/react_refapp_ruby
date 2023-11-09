import Helper from "shared/helper";
//const serverApi = "http:/34.238.241.129:8081/";
const serverApi = "http://3.136.86.6:8081/ecom/";

/* Product Types */
const GetProductTypesCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductTypes/$count`;
        if (query) url = `${serverApi}ProductTypes/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetProductTypes = async (query) => {
    return new Promise(async (resolve) => {

        let url = `${serverApi}ProductTypes`;
        if (query) url = `${serverApi}ProductTypes?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetProductTypes = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.PtId;
        let method = "POST";
        let url = `${serverApi}ProductTypes`;
        if (input.PtId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}ProductTypes(${input.PtId})`;
        } else if (input.PtId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}ProductTypes(${input.PtId})`;
        }

        delete input['PtId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PtId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Product */
const GetProductsCount = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Products/$count`;
        if (query) url = `${serverApi}Products/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
}

const GetProducts = async (query) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Products`;
        if (query) url = `${serverApi}Products?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetProduct = async (id, params) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Products(${id})`;
        if (params) {
            url = `${serverApi}Products(${id})?${params}`;
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || {} });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const SetProduct = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.Product_id;
        let method = "POST";
        let url = `${serverApi}Products`;
        if (input.Product_id && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Products(${input.Product_id})`;
        } else if (input.Product_id && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}ProductTypes(${input.Product_id})`;
        }

        delete input['Product_id'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Product_id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Document */
const SetDocument = async (input, headers) => {
    return new Promise(async (resolve) => {
        let id = headers.DocId;
        let method = "POST";
        let url = `${serverApi}Documents`;
        if (headers.DocId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Documents(${headers.DocId})`;

            method = "POST";
            url = `${serverApi}Documents`;
        } else if (headers.DocId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Documents(${headers.DocId})`;
        }
        delete headers['DocId'];
        delete headers['Deleted'];

        const formData = new FormData();
        formData.append('file', input);

        try {
            const res = await fetch(url, {
                method, body: formData,
                headers: {
                    ...headers
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.DocId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetDocument = async (id, value, type) => {
    return new Promise(async (resolve) => {
        let headers = { "Content-type": "application/json" };
        let url = `${serverApi}Documents(${id})`;
        if (value) {
            url = `${serverApi}Documents(${id})/$value`;
            headers = null;
            if (type) {
                headers = { "Content-type": type };
            }
        }

        try {
            const res = await fetch(url, {
                method: "GET", headers
            });

            if (res.status === 200) {
                let data = null;
                if (value) {
                    data = await res.text();
                    if (!Helper.IsNullValue(data)) {
                        if (data.startsWith("data:")) {
                            data = data.substring(data.indexOf('data:'));
                        } else {
                            let tmp = data.split('\r\n');
                            for (let img of tmp) {
                                if (img.startsWith("data:")) data = img;
                            }
                        }
                    }
                    return resolve({ status: res.ok, values: data });
                }
                data = await res.json();
                return resolve({ status: res.ok, values: data });
            }
            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Other Details */
const SetOtherDetails = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.OtherDetailsId;
        let method = "POST";
        let url = `${serverApi}OtherDetailss`;
        if (input.OtherDetailsId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}OtherDetailss(${input.OtherDetailsId})`;
        } else if (input.OtherDetailsId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}OtherDetailss(${input.OtherDetailsId})`;
        }

        delete input['OtherDetailsId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.OtherDetailsId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetOtherDetails = async (id) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}OtherDetailss(${id})`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || {} });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Product Other Images */
const SetProductOtherImages = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.Id;
        let method = "POST";
        let url = `${serverApi}ProductOtherImagess`;
        if (input.Id && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}ProductOtherImagess(${input.Id})`;
        } else if (input.Id && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}ProductOtherImagess(${input.Id})`;
        }

        delete input['Id'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetProductOtherImages = async (id, filter) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOtherImagess(${id})`;
        if (filter) {
            url = `${serverApi}ProductOtherImagess?$filter=${filter}`;
        }

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json?.value || [] });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

/* Product Price */
const SetProductPrice = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.PpId;
        let method = "POST";
        let url = `${serverApi}ProductPrices`;
        if (input.PpId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}ProductPrices(${input.PpId})`;
        } else if (input.PpId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}ProductPrices(${input.PpId})`;
        }

        delete input['PpId'];
        delete input['Deleted'];

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(input),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.PpId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id });
            } else {
                const json = await res.json();
                return resolve({ status: false, statusText: json.error.message });
            }

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetProductPrice = async (id) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductPrices(${id})`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || {} });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetMetaData = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}$metadata`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });
            if (res.status === 200) {
                const values = await res.text();
                return resolve({ status: res.ok, values });
            }

            return resolve({ status: false, statusText: "Failed fetching data" });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

export {
    GetMetaData,
    GetProductTypesCount, GetProductTypes, SetProductTypes,
    GetDocument, SetDocument,
    GetProductsCount, GetProducts, GetProduct, SetProduct,
    GetOtherDetails, SetOtherDetails,
    GetProductOtherImages, SetProductOtherImages,
    GetProductPrice, SetProductPrice
};