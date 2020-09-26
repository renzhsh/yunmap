const names = {
    vec: "天地图-矢量底图+注记",
    vecd: "天地图-矢量底图",
    vecz: "天地图-矢量注记",
    img: "天地图-影像底图+注记",
    imgd: "天地图-影像底图",
    imgz: "天地图-影像注记",
    ter: "天地图-地形底图+注记",
    terd: "天地图-地形底图",
    terz: "天地图-地形注记",
    ibo: "天地图-全球境界"
};
/**
 *  天地图
 *  @param {string} subdomains "01234567"
 *  @param {string} layer 可选值：vec，cva，img，cia，ter，cta，ibo
 *  @param {Boolean} mercator 是否为莫卡托投影 true_默认_莫卡托，false_经纬度
 *  @param {string} token '7e0ae407dd22e2d8496af3bbf9926cf5'
 */
L.TileLayer.TDT = L.TileLayer.WMTS.extend({
    options: {
        subdomains: "01234567",
        format: "tiles",
        mercator: true,
        tilematrixSet: "w",
        token: "7e0ae407dd22e2d8496af3bbf9926cf5"
    },
    initialize: function(url, options) {
        this.url =
            url ||
            "http://t{s}.tianditu.gov.cn/{layer}_{tilematrixSet}/wmts?tk={token}";

        const name =
            options.name || names[options.layer] || `天地图-${options.layer}`;

        switch (options.layer) {
            case "vec":
            case "vecd":
            default:
                options.layer = "vec";
                break;
            case "vecz":
                options.layer = "cva";
                break;
            case "img":
            case "imgd":
                options.layer = "img";
                break;
            case "imgz":
                options.layer = "cia";
                break;
            case "ter":
            case "terd":
                options.layer = "ter";
                break;
            case "terz":
                options.layer = "cta";
                break;
            case "ibo":
                break;
        }

        L.setOptions(
            this,
            Object.assign(
                { name },
                L.TileLayer.WMTS.prototype.options,
                this.options,
                options
            )
        );
        this.options.tilematrixSet = this.options.mercator ? "w" : "c"; // 莫卡托 or 经纬度

        this.getCapabilities();
    }
});

L.tileLayer.tdt = function(options) {
    switch (options.layer) {
        case "vec":
            return L.basemapGroup(
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "vecd" })
                ),
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "vecz" })
                ),
                Object.assign({ name: names["vec"] }, options)
            );
        case "img":
            return L.basemapGroup(
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "imgd" })
                ),
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "imgz" })
                ),
                Object.assign({ name: names["img"] }, options)
            );
        case "ter":
            return L.basemapGroup(
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "terd" })
                ),
                new L.TileLayer.TDT(
                    "",
                    Object.assign(options, { layer: "terz" })
                ),
                Object.assign({ name: names["ter"] }, options)
            );
        default:
            return new L.TileLayer.TDT("", options);
    }
};
