
import ProductJsonConfig from "config/onetomany_config.json";
import * as Api from "shared/services";
import Helper from "shared/helper";
import { GetMetaDataInfo } from "shared/common";

const FetchProductInfo = async () => {
    let item = {};
    return new Promise(async (resolve) => {
        const keyItems = Object.keys(ProductJsonConfig);
        keyItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                //items.push({ ...prop, value: null });
                items.push({ ...prop });
            }
            item[elm] = items;
        });
        return resolve(item);
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

const Extract = async () => {

    return new Promise(async (resolve) => {

        let rtnObj = { collections: [], row: {}, options: [] };

        await FetchProductInfo().then(async (item) => {

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

            items.length > 0 && await FetchDropdownItems(items).then(async (enums) => {
                rtnObj.options = Helper.CloneObject(enums);
            });
        });

        return resolve(rtnObj);
    });
}

export { Extract };

