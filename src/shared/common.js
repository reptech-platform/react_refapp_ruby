import { GetAppInfoApi, GetDocumentsApi } from "./services";

const ParseValue = (e) => {
    if (!isNaN(e)) return parseInt(e);
    if (e.toLowerCase() === 'true') return true;
    if (e.toLowerCase() === 'false') return false;
    return e;

}

const GetQueryParams = () => {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) params[key] = ParseValue(value);
    return params;
}

const GetPropertyRef = (type) => {
    const childrens = Object.values(type.children) || [];
    const keyItem = childrens.find((x) => x.nodeName === 'Key') || null;
    if (keyItem) {
        const propertyRef = keyItem.getElementsByTagName('PropertyRef') || [];
        if (propertyRef.length > 0) {
            return propertyRef[0].getAttribute('Name');
        }
    }
    return null;
}

const ExtractNavPropery = (x) => {
    let value = x.attributes.Type?.nodeValue.replace(/(^.*\(|\).*$)/g, '') || undefined;
    if (value) value = value.substring(value.indexOf(".") + 1);
    return value;
}

const ExtractXml = async (xml) => {
    return new Promise(async (resolve) => {
        const entityTypes = xml.getElementsByTagName("EntityType");
        let obj = [];
        for (let type of entityTypes) {
            const entity = { Name: type.getAttribute("Name"), Properties: [], HasStream: type.getAttribute("HasStream") === 'false' ? false : true };
            entity.PropertyRef = GetPropertyRef(type);
            let props = [];
            const childrens = Object.values(type.children);
            let index = -1;
            for (let prop of ['Property', 'NavigationProperty']) {
                const properties = childrens.filter((x) => x.nodeName === prop);
                const propList = [];
                for (let cIndex in properties) {
                    index++;
                    propList.push({
                        Index: index,
                        Name: properties[cIndex].attributes.Name.nodeValue,
                        Type: ExtractNavPropery(properties[cIndex]),
                        IsNavigate: prop === 'NavigationProperty'
                    });
                }

                props = [...props, ...propList];

            }
            entity.Properties = props;
            obj.push(entity);
        }
        return resolve(obj);
    });
}

const GetEntities = async (appId) => {
    return new Promise(async (resolve) => {
        await GetAppInfoApi(appId)
            .then(async (res) => {
                if (res && res.AppConfigurationXMLModel) {
                    await GetDocumentsApi(res.AppConfigurationXMLModel)
                        .then(async (doc) => {
                            if (doc) {
                                const xmlPattern = /<\?xml.*?\?>[\s\S]*?<edmx:Edmx.*?>[\s\S]*?<\/edmx:Edmx>/;
                                const xmlMatch = doc.match(xmlPattern);
                                const xmlContent = xmlMatch[0];
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
                                const entities = await ExtractXml(xmlDoc);
                                return resolve(entities);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            return resolve([]);
                        })
                }
            })
            .catch((err) => {
                console.log(err);
                return resolve([]);
            })
    });
}

export { GetQueryParams, GetEntities };