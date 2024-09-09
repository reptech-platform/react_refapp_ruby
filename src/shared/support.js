import {
    SetProduct, SetProductPrice, SetProductOtherImages, SetProductVendor,
    SetOtherDetails, SetDocument, SetProductTypes,
    SetPComponent, SetProductPComponents
} from "./services";
import Helper from "shared/helper";
var fn = {};

const defaultError = "Something went wrong while processing request!";

fn.AddOrUpdateProductType = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let status = false, id = null, data = {};
        let excludes = excludesItems || [];

        const tmp = Object.values(input);
        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
            }
        });

        window.Busy(true);
        let rslt = await SetProductTypes(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

fn.AddOrUpdateProductVendor = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let status = false, id = null, data = {};
        let excludes = excludesItems || [];

        const tmp = Object.values(input);
        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
            }
        });

        window.Busy(true);
        let rslt = await SetProductVendor(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

fn.AddOrUpdateProduct = async (input, enums, excludesItems) => {
    return new Promise(async (resolve) => {
        let status = false, id = null, data = {};
        let excludes = excludesItems || [];
        const tmp = Object.values(input);
        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
                if (x.type === 'dropdown') {
                    data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } else {
                    data[x.key] = x.value;
                }
            }
        });

        window.Busy(true);
        let rslt = await SetProduct(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

fn.AddOrUpdatePrice = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let status = false, id = null, data = {};
        let excludes = excludesItems || [];

        const tmp = Object.values(input);
        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
            }
        });

        window.Busy(true);
        let rslt = await SetProductPrice(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

fn.AddOrUpdateOtherDetails = async (input, enums, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    if (x.type === 'dropdown') {
                        data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                    } else if (x.key === 'ManufacturingDate') {
                        if (x.value) data[x.key] = `${x.value}T00:00:00+00:00`;
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        window.Busy(true);
        let rslt = await SetOtherDetails(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}

fn.AddOrUpdateDocument = async (input) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;
        const { DocName, DocType, DocData, DocExt, DocId } = input.value;
        window.Busy(true);
        let rslt = await SetDocument(DocData, { DocType, DocExt, DocName, DocId: DocId });
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            if (msg.indexOf('ERROR: update or delete on table') === -1) {
                window.AlertPopup("error", msg);
            }
        }

        return resolve({ status, id });
    });
};

fn.AddOrUpdateProductOtherImages = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        window.Busy(true);
        let excludes = excludesItems || [];

        const tmp = Object.values(input);
        tmp.filter((x) => x.value).map((x) => {
            if (excludes.indexOf(x.key) === -1) {
                data[x.key] = x.value;
            }
        });

        let rslt = await SetProductOtherImages(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}

fn.AddOrUpdateProductComponent = async (compProductMapId, ProductId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        window.Busy(true);

        if (input.Deleted) {
            data = { Id: compProductMapId, Deleted: input.Deleted };
            rslt = await SetProductPComponents(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, CompId: input.CompId });
            }

            data = { CompId: input.CompId, Deleted: input.Deleted };

            rslt = await SetPComponent(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, CompId: input.CompId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPComponent(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: compProductMapId, CompId: id, ProductId };
                rslt = await SetProductPComponents(data);
                if (!rslt.status) {
                    window.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    window.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }
        window.Busy(false);

        return resolve({ status, id });
    });
}

fn.DeleteOrder = async (OrderId) => {
    return new Promise(async (resolve) => {
        let status = false, rslt, id = null;
        window.Busy(true);

        rslt = await GetMapOrderItems(OrderId);
        if (rslt.status) {
            let data = rslt.values;

            for (let i = 0; i < data.length; i++) {
                let tmp = { Id: data[i].Id, Deleted: true };
                rslt = await SetMapOrderItem(tmp);
            }

        }

        rslt = await SetOrders({ OrderId: OrderId, Deleted: true });
        if (!rslt.status) {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        } else {
            status = true;
        }
        window.Busy(false);

        return resolve({ status });
    });
}

export default fn;