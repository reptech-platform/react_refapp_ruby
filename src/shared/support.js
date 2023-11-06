import {
    SetProduct, SetProductPrice, SetProductOtherImages,
    SetOtherDetails, SetDocument, GetDocument, SetProductTypes
} from "./services";

var fn = {};

const numberItems = ['Price', 'Size', 'ProductOtherDetails', 'ProductProductType', 'Weight',
    'ProductProductPrice', 'Product_id', 'ProductMainImage'];
const defaultError = "Something went wroing while processing request!";


/* fn.AddDocumentw = async (input, tagName) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;


        return resolve({ status, id });
    });
};

*/

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

        global.Busy(true);
        let rslt = await SetProductTypes(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
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
                if (x.key === 'UnitOfMeasurement') {
                    data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m.Value) === parseInt(x.value)).Name;
                } else if (numberItems.indexOf(x.key) > -1) {
                    if (x.value) data[x.key] = parseFloat(x.value);
                } else {
                    data[x.key] = x.value;
                }
            }
        });

        global.Busy(true);
        let rslt = await SetProduct(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
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
                if (numberItems.indexOf(x.key) > -1) {
                    if (x.value) data[x.key] = parseFloat(x.value);
                } else {
                    data[x.key] = x.value;
                }
            }
        });

        global.Busy(true);
        let rslt = await SetProductPrice(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
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
                    if (x.key === 'UnitOfMeasurement' || x.key === 'AvailabilityStatus') {
                        data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m.Value) === parseInt(x.value)).Name;
                    } else if (x.key === 'ManufacturingDate') {
                        if (x.value) data[x.key] = `${x.value}T00:00:00+00:00`;
                    } else if (numberItems.indexOf(x.key) > -1) {
                        if (x.value) data[x.key] = parseFloat(x.value);
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        global.Busy(true);
        let rslt = await SetOtherDetails(data);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}

fn.AddOrUpdateDocument = async (input) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;
        const { DocName, DocType, DocData, DocExt, docId } = input.value;
        global.Busy(true);
        let rslt = await SetDocument(DocData, { DocType, DocExt, DocName, DocId: null });
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

fn.ExtractDocument = async (input, docId) => {
    return new Promise(async (resolve) => {
        let rslt;

        if (docId) input = await GetDocument(docId);
        rslt = {
            DocData: null, DocId: input.DocId, DocName: input.DocName,
            DocType: input.DocType, DocExt: input.DocExt
        };

        if (rslt.DocId > 0) {
            global.Busy(true);
            rslt.DocData = await GetDocument(rslt.id, true, rslt.DocType);
            global.Busy(false);
        }

        return resolve(rslt);
    });
};

fn.AddOrUpdateProductOtherImages = async (input) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;
        global.Busy(true);
        let rslt = await SetProductOtherImages(input);
        global.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            global.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}

export default fn;