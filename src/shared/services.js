import Helper from "shared/helper";
import { apiUrl as serverApi } from "config";
import Session from "shared/session";

// const serverApi = apiUrl;
// const serverApi = "http:/34.238.241.129:8081/ecom/";
// const serverApi = "http://52.15.220.173:8081/ecom/";

const GetEntityInfo = async (name) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}`;

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

const GetEntityInfoCount = async (name) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}`;

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
    });
}

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

const GetProductType = async (id) => {
    return new Promise(async (resolve) => {

        let url = `${serverApi}ProductTypes(${id})`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || [] });
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

const SetProductVendor = async (input) => {
    return new Promise(async (resolve) => {
        let id = input.PtId;
        let method = "POST";
        let url = `${serverApi}Suppliers`;
        if (input.PtId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Suppliers(${input.PtId})`;
        } else if (input.PtId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Suppliers(${input.PtId})`;
        }

        delete input['SId'];
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
                return resolve({ status: res.ok, id: json.SId });
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

const GetProducts = async (query, expands) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Products`;
        if (query) url = `${serverApi}Products?${query}`;
        if (!Helper.IsNullValue(expands)) url = `${url}&$expand=${expands}`;

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

const GetProductStatus = async (productId) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings?$filter=ProductId eq ${productId}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                let _tmp = { Status: '' };
                if (json.value && json.value.length > 0) {
                    _tmp = json.value[0];
                }
                return resolve({ status: res.ok, values: _tmp });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetProduct = async (id, params, expands) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Products(${id})`;
        if (params) {
            url = `${serverApi}Products(${id})?${params}`;
        }
        if (!Helper.IsNullValue(expands)) url = params ? `${url}&$expand=${expands}` : `${url}?&$expand=${expands}`;

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
        /* if (headers.DocId && !input.Deleted) {
            method = "PATCH";
            url = `${serverApi}Documents(${headers.DocId})`;
        } else if (headers.DocId && input.Deleted) {
            method = "DELETE";
            url = `${serverApi}Documents(${headers.DocId})`;
        } */
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

const GetDocument = async (id, value) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}Documents(${id})`;
        if (value) {
            url = `${serverApi}Documents(${id})/$value`;
        }

        try {
            const res = await fetch(url, { method: "GET" });

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

/* Prodict List View Details */
const GetProductOnBoardings = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductOnBoardings`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json.value });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    });
}

const GetProductPComponents = async (productId) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}ProductPComponentss?$filter=Product_id eq ${productId}`;

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

const SetProductPComponents = async (input) => {
    return new Promise(async (resolve) => {

        const { Id, CompId, ProductId, Deleted } = input;

        let method = "POST";
        let url = `${serverApi}ProductPComponentss`;
        let data = { CompId, Product_id: ProductId };

        if (Id && !Deleted) {
            method = "PATCH";
            url = `${serverApi}ProductPComponentss(${Id})`;
        } else if (Id && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}ProductPComponentss(${Id})`;
        }

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.Id });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, Id });
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

const SetPComponent = async (input) => {
    return new Promise(async (resolve) => {

        const { CompId, Deleted } = input;

        let method = "POST";
        let url = `${serverApi}PComponents`;
        let data = input;

        if (CompId && !Deleted) {
            method = "PATCH";
            url = `${serverApi}PComponents(${CompId})`;
            delete data['CompId'];
        } else if (CompId && Deleted) {
            method = "DELETE";
            data = {};
            url = `${serverApi}PComponents(${CompId})`;
        }

        try {
            const res = await fetch(url, {
                method, body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (res.status === 201) {
                const json = await res.json();
                return resolve({ status: res.ok, id: json.CompId });
            } else if (res.status === 200 || res.status === 204) {
                return resolve({ status: res.ok, id: CompId });
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

const GetUsers = async () => {

    return new Promise(async (resolve) => {

        let url = `${serverApi}Users`;
        const headersItems = await Session.GetHeader();

        try {
            const res = await fetch(url, {
                method: "GET",
                mode: 'cors',
                headers: { ...headersItems }
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

const GetChilds = async () => {

    return new Promise(async (resolve) => {

        let url = `${serverApi}Childs`;
        const headersItems = await Session.GetHeader();

        try {
            const res = await fetch(url, {
                method: "GET",
                mode: 'cors',
                headers: { ...headersItems }
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

export {
    GetMetaData, GetEntityInfo, GetEntityInfoCount,
    GetProductTypesCount, GetProductTypes, SetProductTypes, GetProductStatus,
    GetDocument, SetDocument, GetProductType,
    GetProductsCount, GetProducts, GetProduct, SetProduct, SetProductVendor,
    GetOtherDetails, SetOtherDetails,
    GetProductOtherImages, SetProductOtherImages,
    GetProductPrice, SetProductPrice, GetProductOnBoardings,
    GetProductPComponents, SetPComponent, SetProductPComponents,
    GetUsers, GetChilds
};