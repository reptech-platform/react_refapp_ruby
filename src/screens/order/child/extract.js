
import OrderJsonConfig from "config/order_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";
import Support from "shared/support";


const FetchOrderInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(OrderJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of OrderJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });
        return resolve(item);
    });
}

const FetchDropdownItems = async (items) => {
    return new Promise(async (resolve) => {

        if (items.length === 0) return resolve([]);

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

const ExtractObject = async (item, values, enums) => {
    return new Promise(async (resolve) => {

        let items = [];

        values.forEach(sourceObj => {
            let newItem = Helper.CloneObject(item);
            for (let prop in sourceObj) {
                const tItem = newItem.find((x) => x.key === prop);
                if (tItem && !Helper.IsNullValue(sourceObj[prop])) {

                    let _nValue = null;
                    if (tItem.type === 'dropdown') {
                        const { Values } = enums.find((z) => z.Name === tItem.source);
                        const _value = Values.find((m) => m[tItem.contentId] === sourceObj[prop] || m[tItem.valueId] === sourceObj[prop]) || {};
                        _nValue = _value[tItem.valueId];

                        if (!Helper.IsNullValue(_nValue) && newItem[tItem.mapitem]) {
                            newItem[tItem.mapitem].forEach(x => x.editable = false);
                        }

                    } else if (tItem.type === 'date') {
                        let tmpDate = sourceObj[prop].split('T');
                        _nValue = tmpDate[0];
                    } else {
                        _nValue = sourceObj[prop];
                    }

                    newItem.find((x) => x.key === prop).value = _nValue;

                }
            }
            items.push(newItem);
        })

        return resolve(items);

    });
}

const FetchOrderDetails = async (orderId, enums) => {

    return new Promise(async (resolve) => {
        let item = {}, backItem = {}, tmpItem = { order: {}, shippingaddress: {}, orderitem: {} };
        let orderitems = [], orderItemMap = [];

        const keyItems = Object.keys(OrderJsonConfig);

        keyItems.forEach(elm => {
            let items = [];
            for (let prop of OrderJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        if (orderId) {
            global.Busy(true);
            // Get Order and OrderItems mapping list
            let rslt = await Api.GetMapOrderItems(orderId);
            if (rslt.status) orderItemMap = rslt.values;

            // Get Order Details
            rslt = await Api.GetOrder(orderId, null, "Items");
            if (rslt.status) {

                const order = rslt.values;

                let _object = await ExtractObject(Helper.CloneObject(item['order']), [order], enums);
                tmpItem.order = _object[0];

                _object = await ExtractObject(Helper.CloneObject(item['shippingaddress']), [order.ShippingAddress], enums);
                tmpItem.shippingaddress = _object[0];

                _object = await ExtractObject(Helper.CloneObject(item['orderitem']), order.Items, enums);
                tmpItem.orderitem = item['orderitem'];

                let tmpOrderItem = [];
                let props = item['orderitem'].map(x => x.key).filter(m => m !== 'keyid');

                _object.map(x => {
                    let tItem = {};
                    props.map(p => {
                        let _value = x.filter(m => m.key === p)[0].value;
                        tItem[p] = _value;
                        if (p === 'Order_item_id') {
                            tItem['id'] = _value;
                        }
                    })
                    tmpOrderItem.push(tItem);
                })

                orderitems = tmpOrderItem;

            }

            let bItem = {};
            keyItems.filter(x => x !== 'orderitem').forEach(elm => {
                let bItems = [];
                if (tmpItem[elm]) {
                    for (let prop of tmpItem[elm]) {
                        bItems.push({ key: prop.key, value: prop.value });
                    }
                }
                bItem[elm] = bItems;
            });

            backItem = Helper.CloneObject(bItem);

            global.Busy(false);
        }

        return resolve({ row: tmpItem, items: orderitems, backRow: backItem, orderItemMap });
    });
}

const Extract = async (orderId) => {

    return new Promise(async (resolve) => {

        let rtnObj = { collections: [], row: {}, options: [] };

        await FetchOrderInfo().then(async (item) => {

            rtnObj.row = Helper.CloneObject(item);

            let oKeys = Object.keys(item);

            rtnObj.collections = [];
            Object.values(oKeys).forEach(elm => {
                const { entityName, key, child, title } = item[elm].find(x => x.type === 'keyid');
                rtnObj.collections.push({ name: elm, title, entityName, key, child });
            });

            let items = [];
            Object.values(item).forEach(elm => {
                items = [...items, ...elm];
            });
            items = Helper.RemoveDuplicatesFromArray(items.filter(x => x.type === "dropdown").map(z => z.source));

            await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
                if (!Helper.IsNullValue(orderId)) {
                    await FetchOrderDetails(orderId, enums).then(({ row, items, backRow, orderItemMap }) => {
                        rtnObj.row = Helper.CloneObject(row);
                        rtnObj.backRow = Helper.CloneObject(backRow);
                        rtnObj.items = Helper.CloneObject(items);
                        rtnObj.mapitems = Helper.CloneObject(orderItemMap);
                    })
                }
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract };

