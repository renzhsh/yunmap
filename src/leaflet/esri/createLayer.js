const names = {
    masvec: { name: "马鞍山天地图-矢量底图+注记" },
    masvecd: { name: "马鞍山天地图-矢量底图", map: "MASELE" },
    masvecz: { name: "马鞍山天地图-矢量注记", map: "MASAnno" },
    masimg: { name: "马鞍山天地图-影像底图+注记" },
    masimgd: { name: "马鞍山天地图-影像底图", map: "MASDOM" },
    masimgz: { name: "马鞍山天地图-影像注记", map: "MASDOMAnno" },
    maspoi: { name: "马鞍山天地图-热点", map: "MasPOI" },
    masroad: { name: "马鞍山天地图-道路", map: "MasRoad" },
    masbound: { name: "马鞍山天地图-边界", map: "tdt_Bounding3" }
};

function createMasLayer(layer, option) {
    if (!names[layer]) {
        L.logger.error("不存在的图层类别：" + option.type);
        return null;
    }

    if ("masvec" === layer) {
        return L.basemapGroup(
            createMasLayer("masvecd", option),
            createMasLayer("masvecz", option),
            Object.assign({ name: names[layer].name }, option)
        );
    }

    if ("masimg" === layer) {
        return L.basemapGroup(
            createMasLayer("masimgd", option),
            createMasLayer("masimgz", option),
            Object.assign({ name: names[layer].name }, option)
        );
    }

    return L.esri.dynamicMapLayer(
        Object.assign({ name: names[layer].name }, option, {
            url: `http://tdtmap.mas.gov.cn/arcgis/rest/services/${names[layer].map}/MapServer`
        })
    );
}

/**
 * esri createLayer
 * @param {*} option
 */
export default function createLayer(option) {
    option.type = option.type.toLowerCase();
    const arrs = option.type.split("_");
    const layer = arrs.length > 1 ? arrs[1] : "dynamic";

    if (/^mas/g.test(layer)) {
        return createMasLayer(layer, option);
    }

    switch (layer) {
        case "dynamic":
            return L.esri.dynamicMapLayer(option);
        case "tile":
            return L.esri.tiledMapLayer(option);
        case "image":
            return L.esri.imageMapLayer(option);
        case "feature":
            return L.esri.featureLayer(option);
    }
}
