import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

var fn = {};

fn.IsNull = (e) => {
    if (e === undefined || e === null) return true;
    return false;
};

fn.IsNullValue = (e) => {
    if (e === undefined || e === null || e === "") return true;
    return false;
};

fn.IsJSONEmpty = (e) => {
    if (fn.IsNull(e)) return true;
    for (var key in e) {
        if (Object.prototype.hasOwnProperty.call(e, key)) {
            return false;
        }
    }
    return true;
};

fn.ToDate = (e, format, utc) => {
    let dt = e;
    if (fn.IsNullValue(e)) dt = new Date();
    if (fn.IsNullValue(format)) return moment(new Date(dt));
    if (utc) return moment(dt).utc().format(format);
    return moment(new Date(dt)).format(format);
};

fn.GetGUID = () => {
    return uuidv4().replace(/-/g, '');
}

fn.CopyObject = (source) => {
    let items = [];
    for (let prop of source) {
        let item = {};
        for (let keys in prop) {
            item[keys] = prop[keys];
        }
        items.push(item);
    }
    return items;
}

export default fn;