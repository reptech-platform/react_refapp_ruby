import React from 'react';
import RenderFormContols from "./formcontrols";
import ProductJsonConfig from "config/stepper_config.json";
import {
    GetProductTypes, GetProduct, GetOtherDetails, GetProductPrice,
    GetProductOtherImages, GetDocument, GetProductType
} from "shared/services";
import { GetMetaDataInfo } from "shared/common";

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

        ['producttype', 'product', 'otherdetails', 'productprice'].forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        global.Busy(true);
        // Get Product Details
        let rslt = await GetProduct(productId, "$expand=MainImage");
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
            rslt = await GetProductType(product.ProductProductType);
            if (rslt.status) {
                for (let prop in rslt.values) {
                    const tItem = item['producttype'].find((x) => x.key === prop);
                    if (tItem) {
                        item['producttype'].find((x) => x.key === prop).value = rslt.values[prop];
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
                    rslt = await GetDocument(tmp.DocId, true, tmp.DocType);
                    if (rslt.status) tmp['DocData'] = rslt.values;
                }
                item['product'].find((x) => x.key === "MainImage").value = tmp;
            }

            // Other Images
            rslt = await GetProductOtherImages(null, `Product_id eq ${product.Product_id}`);
            if (rslt.status && rslt.values && rslt.values.length > 0) {
                let docIdList = rslt.values.map((x) => x.DocId);
                let _document = [];
                for (let i = 0; i < docIdList.length; i++) {
                    rslt = await GetDocument(docIdList[i]);
                    if (rslt.status) {
                        tmp = {};
                        ['DocData', 'DocId', 'DocName', 'DocType', 'DocExt'].forEach((x) => {
                            tmp[x] = rslt.values[x]
                        });

                        if (tmp.DocId > 0) {
                            rslt = await GetDocument(tmp.DocId, true, tmp.DocType);
                            if (rslt.status) tmp['DocData'] = rslt.values;
                        }
                        tmp['index'] = i;
                        _document.push(tmp);
                    }
                }

                item['product'].find((x) => x.key === "OtherImages").value = _document;
            }

            // Get Product Other Details
            if (product.ProductOtherDetails) {
                rslt = await GetOtherDetails(product.ProductOtherDetails);
                if (rslt.status) {
                    tmp = rslt.values;
                    for (let prop in tmp) {
                        const tItem = item['otherdetails'].find((x) => x.key === prop);
                        if (tItem) {
                            if (prop === 'UnitOfMeasurement') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === tmp[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'AvailabilityStatus') {
                                const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                                const _value = dpItems.find((m) => m.Name === tmp[prop]).Value;
                                item['otherdetails'].find((x) => x.key === prop).value = parseInt(_value);
                            } else if (prop === 'ManufacturingDate') {
                                let tmpDate = tmp[prop].split('T');
                                item['otherdetails'].find((x) => x.key === prop).value = tmpDate[0];
                            } else {
                                item['otherdetails'].find((x) => x.key === prop).value = tmp[prop];
                            }
                        }
                    }
                }
            }

            // Get Product Price Details
            if (product.ProductProductPrice) {
                rslt = await GetProductPrice(product.ProductProductPrice);
                if (rslt.status) {
                    tmp = rslt.values;
                    for (let prop in tmp) {
                        const tItem = item['productprice'].find((x) => x.key === prop);
                        if (tItem) {
                            item['productprice'].find((x) => x.key === prop).value = tmp[prop];
                        }
                    }
                }
            }

        }

        setRow(item);
        global.Busy(false);
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const productTypes = await GetProductTypes();
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