
import ProductJsonConfig from "config/product_many_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";

const MapItems = [
    { navpropname: "", uicomponent: "product", expand: "OtherImages,MainImage,PComponents", exclude: ['MainImage', 'OtherImages'], func: Support.AddOrUpdateProduct },
    { navpropname: "PType", uicomponent: "producttype", expand: "PType", exclude: [], func: Support.AddOrUpdateProductType },
    { navpropname: "ODetails", uicomponent: "otherdetails", expand: "ODetails", exclude: [], func: Support.AddOrUpdateOtherDetails },
    { navpropname: "SellingPrice", uicomponent: "productsellingprice", expand: "SellingPrice", exclude: [], func: Support.AddOrUpdatePrice },
    { navpropname: "BuyingPrice", uicomponent: "productbuyingprice", expand: "BuyingPrice", exclude: [], func: Support.AddOrUpdatePrice },
    { navpropname: "ProductVendor", uicomponent: "productvendor", expand: "ProductVendor", exclude: [], func: Support.AddOrUpdateProductVendor },
    { navpropname: "PComponents", uicomponent: "pcomponent", expand: "PComponents", exclude: [], parent: "product", child: true },
    { navpropname: "VendorAddress", uicomponent: "vendoraddress", parent: "product" }

];

const FetchProductInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(ProductJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });
        return resolve(item);
    });
}

const FetchProductDetails = async (productId, enums) => {

    return new Promise(async (resolve) => {

        let item = {}, rslt, backItem = {}, tmp, productPComponents = [];

        const keyItems = Object.keys(ProductJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (productId) {
            global.Busy(true);

            rslt = await Api.GetProductPComponents(productId);
            if (rslt.status) productPComponents = rslt.values;

            // Get Product Details
            let $expand = [];
            let $expandItems = MapItems.filter(z => z.expand).map(x => x.expand);
            $expandItems.forEach(x => {
                if (x.indexOf(",") > -1) {
                    $expand.push(...x.split(","));
                } else {
                    $expand.push(x);
                }
            })

            $expand = Helper.RemoveDuplicatesFromArray($expand);

            rslt = await Api.GetProduct(productId, `$expand=${$expand}`);
            if (rslt.status) {

                const product = rslt.values;

                for (let i = 0; i < MapItems.length; i++) {

                    const source = MapItems[i].navpropname;
                    const target = MapItems[i].uicomponent;
                    const parent = MapItems[i].parent;
                    const child = MapItems[i].child;

                    const sourceObj = Helper.IsNullValue(source) ? product : product[source];
                    if (parent && child) {
                        let _tmpItems = [];
                        let _fItem = item[target];//.filter(z => z.type !== 'keyid');
                        for (let xx = 0; xx < sourceObj.length; xx++) {
                            let x = sourceObj[xx];
                            let _tmpItem = {};
                            _tmpItem['id'] = Helper.GetGUID();

                            for (let mm = 0; mm < _fItem.length; mm++) {

                                let m = _fItem[mm];

                                if (m.type === 'keyid' && !Helper.IsNullValue(x[m.key])) {
                                    _tmpItem['id'] = x[m.key];
                                }
                                let _nValue = x[m.key];
                                if (m.type === 'dropdown') {
                                    const { Values } = enums.find((z) => z.Name === m.source);
                                    const _value = Values.find((z) => z[m.valueId] === _nValue || z[m.contentId] === _nValue) || {};
                                    _nValue = _value[m.contentId];

                                } else if (m.type === 'date') {
                                    let tmpDate = _nValue.indexOf("T") > 0 ? _nValue.split('T') : [_nValue];
                                    _nValue = tmpDate[0];
                                } else if (m.type === 'doc') {
                                    if (parseInt(_nValue, 0) > 0) {
                                        let trslt = await Api.GetDocument(parseInt(_nValue));
                                        if (trslt.status) {
                                            _tmpItem[`${m.key}_Image`] = _nValue;
                                            let docRslt = trslt.values;
                                            _nValue = `${docRslt.DocName}.${docRslt.DocExt}`;
                                        }
                                    }
                                }

                                _tmpItem[m.key] = _nValue;
                            }

                            _tmpItems.push(_tmpItem);
                        }

                        item[target].find((x) => x.type === "keyid").values = _tmpItems;
                    } else {
                        for (let prop in sourceObj) {
                            const tItem = item[target]?.find((x) => x.key === prop);
                            if (tItem && !Helper.IsNullValue(sourceObj[prop])) {

                                let _nValue = null;
                                if (tItem.type === 'dropdown') {
                                    const { Values } = enums.find((z) => z.Name === tItem.source);
                                    const _value = Values.find((m) => m[tItem.contentId] === sourceObj[prop] || m[tItem.valueId] === sourceObj[prop]) || {};
                                    _nValue = _value[tItem.valueId];

                                    if (!Helper.IsNullValue(_nValue) && item[tItem.mapitem]) {
                                        item[tItem.mapitem].forEach(x => x.editable = false);
                                    }

                                } else if (tItem.type === 'date') {
                                    let tmpDate = sourceObj[prop].indexOf("T") > 0 ? sourceObj[prop].split('T') : [sourceObj[prop]];
                                    _nValue = tmpDate[0];
                                } else {
                                    _nValue = sourceObj[prop];
                                }

                                item[target].find((x) => x.key === prop).value = _nValue;

                            }
                        }
                    }

                }

                // Main Image
                if (product.MainImage) {
                    tmp = {};
                    ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                        tmp[x] = product.MainImage[x]
                    });

                    if (tmp.DocId > 0) {
                        rslt = await Api.GetDocument(tmp.DocId, true);
                        if (rslt.status) tmp['DocData'] = rslt.values;
                    }
                    if (item['product'].find((x) => x.key === "MainImage")) item['product'].find((x) => x.key === "MainImage").value = tmp;
                }

                // Get Product Other Images
                if (!Helper.IsJSONEmpty(product.OtherImages) && product.OtherImages.length > 0) {
                    let _document = [];

                    for (let i = 0; i < product.OtherImages.length; i++) {
                        let docItem = product.OtherImages[i];
                        let tmp = {};

                        ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => { tmp[x] = docItem[x] });

                        if (parseInt(tmp.DocId) > 0) {
                            rslt = await Api.GetDocument(tmp.DocId, true);
                            if (rslt.status) tmp['DocData'] = rslt.values;
                        }

                        tmp['index'] = i;
                        _document.push(tmp);
                    }

                    if (item['product'].find((x) => x.key === "OtherImages")) {
                        item['product'].find((x) => x.key === "OtherImages").value = _document;
                    }

                }

            }

            let bItem = {};
            keyItems.forEach(elm => {
                let bItems = [];
                let tmp = MapItems.find(x => x.uicomponent === elm);
                if (!tmp.child) {
                    for (let prop of item[elm]) {
                        bItems.push({ key: prop.key, value: prop.value });
                    }
                } else {
                    bItems = item[elm].find(z => z.type === 'keyid').values;
                }
                bItem[elm] = bItems;
            });

            backItem = Helper.CloneObject(bItem);

            global.Busy(false);
        }

        return resolve({ row: item, backRow: backItem, mapitems: productPComponents });
    });
}

const FetchDropdownItems = async (items) => {
    return new Promise(async (resolve) => {

        global.Busy(true);

        // Default get all enums list items
        let res = await GetMetaDataInfo();

        const enums = res.filter((x) => x.Type === 'Enum') || [];
        const otherItems = items.filter(x => enums.findIndex(z => z.Name === x) === -1);

        // Extract the required entities as enums
        for (let i = 0; i < otherItems.length; i++) {
            const item = otherItems[i];
            await Api.GetEntityInfo(item + 's').then(rslt => {
                if (rslt.status) {
                    enums.push({ Name: item, Type: 'Entity', Values: rslt.values });
                }
            });
        }

        global.Busy(false);
        return resolve(enums);
    });
};

const Extract = async (productId) => {

    return new Promise(async (resolve) => {

        let rtnObj = { row: {}, options: [], backRow: {} };

        await FetchProductInfo().then(async (item) => {

            rtnObj.row = Helper.CloneObject(item);

            let oKeys = Object.keys(item);

            rtnObj.collections = [];
            Object.values(oKeys).forEach(elm => {
                const { parent, child, property } = item[elm].find(x => x.type === 'keyid');
                if (!Helper.IsNullValue(parent)) {
                    rtnObj.collections.push({ name: elm, parent, child, property });
                }
            });

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(productId)) {
                    await FetchProductDetails(productId, enums).then(({ row, backRow, mapitems }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.mapitems = Helper.CloneObject(mapitems);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract, MapItems };

