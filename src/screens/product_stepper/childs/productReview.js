import React from 'react';
import RenderFormContols from "./formcontrols";
import ProductJsonConfig from "config/stepper_config.json";
import * as Api from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";

const screenItems = ['product', 'producttype', 'otherdetails', 'productprice'];

const Component = React.forwardRef((props, ref) => {

    const { setIsSubmitted, onEditClicked } = props;
    const [form, setForm] = React.useState(null);
    const [dropDownOptions, setDropDownOptions] = React.useState([]);
    const [row, setRow] = React.useState({});

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        setIsSubmitted(true);
    }

    const OnEditClicked = (e) => {
        if (onEditClicked) OnEditClicked(e);
    }

    const productId = props.row['product'].find((x) => x.key === 'Product_id').value || 0;

    const FetchProductDetails = async (enums) => {

        let item = {}, tmp;

        screenItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        global.Busy(true);
        // Get Product Details
        let rslt = await Api.GetProduct(productId, "$expand=MainImage,PType,SellingPrice,ODetails,OtherImages");
        if (rslt.status) {

            const product = rslt.values;

            for (let prop in product) {
                const tItem = item['product'].find((x) => x.key === prop);
                if (tItem) {
                    if (prop === 'UnitOfMeasurement') {
                        const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                        const _value = dpItems.find((m) => m.Name === product[prop]).Value;
                        item['product'].find((x) => x.key === prop).value = parseInt(_value);
                    } else {
                        item['product'].find((x) => x.key === prop).value = product[prop];
                    }
                }
            }

            // Product Type
            if (product.PType) {
                Object.keys(product.PType).forEach(x => {
                    item['producttype'].find(z => z.key === x).value = product.PType[x];
                })
            }

            // Get Product Other Details
            if (product.ODetails) {
                Object.keys(product.ODetails).forEach(prop => {
                    const tItem = item['otherdetails'].find((x) => x.key === prop);
                    if (tItem) {
                        if (prop === 'UnitOfMeasurement') {
                            const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                            const _value = dpItems.find((m) => m.Name === product.ODetails[prop]).Value;
                            item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                        } else if (prop === 'AvailabilityStatus') {
                            const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                            const _value = dpItems.find((m) => m.Name === product.ODetails[prop]).Value;
                            item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                        } else if (prop === 'ManufacturingDate') {
                            let tmpDate = product.ODetails[prop].split('T');
                            item['otherdetails'].find((x) => x.key === prop).value = tmpDate[0];
                        } else {
                            item['otherdetails'].find((x) => x.key === prop).value = product.ODetails[prop];
                        }
                    }
                })
            }

            // Product Price
            if (product.SellingPrice) {
                Object.keys(product.SellingPrice).forEach(x => {
                    item['productprice'].find(z => z.key === x).value = product.SellingPrice[x];
                })
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
                item['product'].find((x) => x.key === "MainImage").value = tmp;
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

                item['product'].find((x) => x.key === "OtherImages").value = _document;
            }
        }

        setRow(item);
        global.Busy(false);
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const productTypes = await Api.GetProductTypes();
            const { values } = productTypes || { values: [] };
            const pValues = values.map((x) => { return { Name: x.ProductTypeName, Value: x.PtId } });
            const rlst = await GetMetaDataInfo();
            const enums = rlst.filter((x) => x.Type === 'Enum') || [];
            enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
            setDropDownOptions(enums);
            global.Busy(false);
            return resolve(enums);
        });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            if (productId) {
                await FetchProductTypes().then(async (enums) => {
                    await FetchProductDetails(enums);
                });
            }
        };
        fetchData();
    }, [productId]);

    return (
        <>
            <RenderFormContols {...props} row={row} excludestepper={true} shadow={true} review={true}
                onEditClicked={OnEditClicked} setForm={setForm} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;