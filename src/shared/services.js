
const GetProductTypesApi = async (query) => {
    let url = `http://52.15.220.173:8081/ecom/ProductTypes`;
    if (query) url = `http://52.15.220.173:8081/ecom/ProductTypes?${query}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.json();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const GetProductTypesCount = async (query) => {
    let url = `http://52.15.220.173:8081/ecom/ProductTypes/$count`;
    if (query) url = `http://52.15.220.173:8081/ecom/ProductTypes/$count?${query}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.json();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const GetProductsCount = async (query) => {

    let url = `http://52.15.220.173:8081/ecom/Products/$count`;
    if (query) url = `http://52.15.220.173:8081/ecom/Products/$count?${query}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.json();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const GetProducts = async (query) => {

    let url = `http://52.15.220.173:8081/ecom/Products`;
    if (query) url = `http://52.15.220.173:8081/ecom/Products?${query}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.json();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const SetProducts = async (data) => {

    let url = `http://52.15.220.173:8081/ecom/Products`;

    try {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 201) {
            const data = await res.json();
            return { status: res.ok, data };
        }

        return { status: false };

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}

const PatchProducts = async (id, data) => {

    let url = `http://52.15.220.173:8081/ecom/Products(${id})`;

    try {
        const res = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return { status: res.ok };
        }

        return { status: false };

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}

const GetProduct = async (id) => {

    let url = `http://52.15.220.173:8081/ecom/Products(${id})?$expand=ProductImage`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.json();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const DeleteProduct = async (id) => {

    let url = `http://52.15.220.173:8081/ecom/Products(${id})`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 204) {
            return { status: res.ok };
        }
        return { status: false };

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}

const GetProductImage = async (id) => {

    let url = `http://52.15.220.173:8081/ecom/Documents(${id})/$value`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        if (res.status === 200) {
            return await res.text();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const DeleteProductImage = async (id) => {

    let url = `http://52.15.220.173:8081/ecom/Documents(${id})/$value`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 200) {
            return await res.text();
        }
        return null;

    } catch (err) {
        return err;
    }
}

const SetProductImage = async (body, headers) => {

    let url = `http://52.15.220.173:8081/ecom/Documents`;

    try {
        const res = await fetch(url, {
            method: "POST",
            body,
            headers: {
                "Content-type": "application/json",
                ...headers
            }
        });
        if (res.status === 201) {
            const { Doc_Id } = await res.json();
            return { status: res.ok, Doc_Id };
        }

        return { status: false };

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}

const SetProductTypesApi = async (httpMethod, description, productType) => {
    let url = `http://52.15.220.173:8081/ecom/ProductTypes`;
    if (productType) url = `http://52.15.220.173:8081/ecom/ProductTypes(${productType})`;
    try {
        const res = await fetch(url, {
            method: httpMethod,
            body: JSON.stringify({ ProductTypeDescription: description }),
            headers: {
                "Content-type": "application/json"
            }
        });

        if (res.status === 200 || res.status === 201 || res.status === 204) {
            return { status: res.ok };
        }

        return { status: false };

    } catch (err) {
        console.log(err);
        return { status: false };
    }
}


export {
    GetProducts, SetProducts, PatchProducts, GetProduct, GetProductsCount, GetProductTypesApi, GetProductTypesCount,
    DeleteProductImage, GetProductImage, SetProductImage, DeleteProduct, SetProductTypesApi
};