
const GetProductTypesApi = async (query) => {
    let url = `http://34.238.241.129:8082/generated_app/ProductTypes`;
    if (query) url = `http://34.238.241.129:8082/generated_app/ProductTypes?${query}`;

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
    let url = `http://34.238.241.129:8082/generated_app/ProductTypes/$count`;
    if (query) url = `http://34.238.241.129:8082/generated_app/ProductTypes/$count?${query}`;

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

    let url = `http://34.238.241.129:8082/generated_app/Products/$count`;
    if (query) url = `http://34.238.241.129:8082/generated_app/Products/$count?${query}`;

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

    let url = `http://34.238.241.129:8082/generated_app/Products`;
    if (query) url = `http://34.238.241.129:8082/generated_app/Products?${query}`;
    //console.log(url);

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

    let url = `http://34.238.241.129:8082/generated_app/Products`;

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

    let url = `http://34.238.241.129:8082/generated_app/Products(${id})`;

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

    let url = `http://34.238.241.129:8082/generated_app/Products(${id})?$expand=ProductImage`;

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

    let url = `http://34.238.241.129:8082/generated_app/Products(${id})`;

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

    let url = `http://34.238.241.129:8082/generated_app/Documents(${id})/$value`;
    // console.log(url);

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

    let url = `http://34.238.241.129:8082/generated_app/Documents(${id})/$value`;

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

    let url = `http://34.238.241.129:8082/generated_app/Documents`;

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
    let url = `http://34.238.241.129:8082/generated_app/ProductTypes`;
    if (productType) url = `http://34.238.241.129:8082/generated_app/ProductTypes(${productType})`;
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