
import ProductJsonConfig from "config/product_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";

const MapItems = [
    { navpropname: "", uicomponent: "product", expand: "OtherImages,MainImage", exclude: ['MainImage', 'OtherImages'], func: Support.AddOrUpdateProduct },
    { navpropname: "PType", uicomponent: "producttype", expand: "PType", exclude: [], func: Support.AddOrUpdateProductType },
    { navpropname: "ODetails", uicomponent: "otherdetails", expand: "ODetails", exclude: [], func: Support.AddOrUpdateOtherDetails },
    { navpropname: "SellingPrice", uicomponent: "productsellingprice", expand: "SellingPrice", exclude: [], func: Support.AddOrUpdatePrice },
    { navpropname: "BuyingPrice", uicomponent: "productbuyingprice", expand: "BuyingPrice", exclude: [], func: Support.AddOrUpdatePrice },
    { navpropname: "ProductVendor", uicomponent: "productvendor", expand: "ProductVendor", exclude: [], func: Support.AddOrUpdateProductVendor }
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
        let item = {}, backItem = {}, tmp;

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

            let rslt = await Api.GetProduct(productId, `$expand=${$expand}`);
            if (rslt.status) {

                const product = rslt.values;

                for (let i = 0; i < MapItems.length; i++) {

                    const source = MapItems[i].navpropname;
                    const target = MapItems[i].uicomponent;

                    const sourceObj = Helper.IsNullValue(source) ? product : product[source];

                    for (let prop in sourceObj) {
                        const tItem = item[target].find((x) => x.key === prop);
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
                                let tmpDate = sourceObj[prop].split('T');
                                _nValue = tmpDate[0];
                            } else {
                                _nValue = sourceObj[prop];
                            }

                            item[target].find((x) => x.key === prop).value = _nValue;

                        }
                    }

                }

                // Main Image
                if (product.MainImage) {

                    let mainImage = item['product'].find((x) => x.key === "MainImage");
                    let entityTypeKeyName = mainImage?.entityTypeKeyName;
                    let entityTypeName = mainImage?.entityTypeName;
                    if (!Helper.IsNullValue(entityTypeKeyName)) {
                        let docId = product.MainImage[entityTypeKeyName];
                        let DocData = null;
                        let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                        if (docId > 0) {
                            rslt = await docFuns.getFun(docId, true);
                            if (rslt.status) DocData = rslt.values;
                        }
                        item['product'].find((x) => x.key === "MainImage").value = DocData;
                    }

                }

                // Get Product Other Images
                if (!Helper.IsJSONEmpty(product.OtherImages) && product.OtherImages.length > 0) {
                    let otherImages = item['product'].find((x) => x.key === "OtherImages");
                    let entityTypeKeyName = otherImages?.entityTypeKeyName;
                    let entityTypeName = otherImages?.entityTypeName;
                    if (!Helper.IsNullValue(entityTypeKeyName)) {
                        let _document = [];
                        for (let i = 0; i < product.OtherImages.length; i++) {
                            let docId = product.OtherImages[i][entityTypeKeyName];
                            let DocData = null;
                            let docFuns = Support.DocFunctions.find(x => x.entityTypeName === entityTypeName);
                            if (docId > 0) {
                                rslt = await docFuns.getFun(docId, true);
                                if (rslt.status) DocData = rslt.values;
                            }

                            let tmp = { index: i, docId, DocData };
                            _document.push(tmp);
                        }

                        if (item['product'].find((x) => x.key === "OtherImages")) {
                            item['product'].find((x) => x.key === "OtherImages").value = _document;
                        }
                    }
                }
            }

            let bItem = {};
            keyItems.forEach(elm => {
                let bItems = [];
                for (let prop of item[elm]) {
                    bItems.push({ key: prop.key, value: prop.value });
                }
                bItem[elm] = bItems;
            });

            backItem = Helper.CloneObject(bItem);

            global.Busy(false);
        }

        return resolve({ row: item, backRow: backItem });
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

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(productId)) {
                    await FetchProductDetails(productId, enums).then(({ row, backRow }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract, MapItems };

