export default function createLayer(item) {
    if (!item || !item.type || L.Util.isNullOrEmpty(item.type)) return null;

    item.type = item.type.toLowerCase();
    const arrs = item.type.split("_");
    const provider = arrs[0];

    //===============地图数组====================
    //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
    if ("group" === provider) {
        var list = [];
        if (item.layers && item.layers.length) {
            for (var layer of item.layers) {
                if (item.crs) {
                    layer.crs = item.crs;
                }

                list.push(createLayer(layer));
            }
        }

        return L.layerGroup(list);
    }

    // =================leaflet 内置===================
    switch (provider) {
        case "image":
            return L.imageOverlay(
                item.url,
                item.bounds || [
                    [0, 0],
                    [1000, 1000]
                ]
            );
        case "tile":
            return L.tileLayer(item.url, item);
        case "wms":
            return L.tileLayer.wms(item.url, item);
        case "wmts":
            return L.tileLayer.wmts(item.url, item);
        case "osm":
            return L.tileLayer.osm(item);
        case "graticule": // 经纬网
            return L.simpleGraticule(item);
        case "lighting": // 昼夜区域
            return L.terminator(item);
    }

    // ======================互联网地图======================
    if (["baidu", "gaode", "google", "tdt"].indexOf(provider) > -1) {
        const layer = arrs.length > 1 ? arrs[1] : "vec";
        return L.tileLayer[provider](Object.assign({ layer }, item));
    }

    // ======================esri======================
    if ("esri" === provider) {
        if (!L.esri || !L.esri.createLayer) {
            throw "请先加载esri插件";
        }

        return L.esri.createLayer(item);
    }

    return null;
}
