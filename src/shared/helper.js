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

fn.IsArrayNull = (e) => {
    if (fn.IsNull(e)) return true;
    if (e.length > 0) {
        return false;
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

fn.FormatDate = (e, format, utc) => {
    let dt = e;
    if (fn.IsNullValue(e)) return null;
    if (fn.IsNullValue(format)) return moment(new Date(dt));
    if (utc) return moment(dt).utc().format(format);
    return moment(new Date(dt)).format(format);
};

fn.GetGUID = () => {
    return uuidv4().replace(/-/g, '');
}

fn.CloneObject = (x) => {
    return JSON.parse(JSON.stringify(x));
}

fn.RemoveDuplicatesFromArray = (input) => {
    return [...new Set(input)];
};

fn.ToFirstCharCapital = (e) => {
    if (fn.IsNullValue(e)) return "";
    return e.charAt(0).toUpperCase() + e.slice(1);
}

fn.INRCurrencyFormat = (e, nodecimals, nocurrency) => {
    if (fn.IsNullValue(e)) return "";
    let formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    if (nocurrency) {
        formatter = new Intl.NumberFormat("en-IN", {
            currency: "INR"
        });
    }
    let tmp = formatter.format(e);
    if (nodecimals) tmp = tmp.substring(0, tmp.indexOf("."));
    return tmp;
};

fn.AlterDate = (date, type, num) => {
    let tDate = new Date();
    if (!fn.IsNullValue(date)) tDate = new Date(date);

    let newDate = moment(tDate);
    let rtn = newDate;

    switch (type) {
        case 'd': rtn = newDate.add(num, 'day'); break;
        case 'm': rtn = newDate.add(num, 'month'); break;
        case 'y': rtn = newDate.add(num, 'year'); break;
        case 'w': rtn = newDate.add(num, 'week'); break;
        default: rtn = newDate;
    }

    return rtn.toISOString();
}

fn.IsDateEqual = (date1, date2) => {
    let dDate1 = moment(date1).format("YYYY-MM-DD");
    let dDate2 = moment(date2).format("YYYY-MM-DD");
    return dDate1 === dDate2;
}

export default fn;