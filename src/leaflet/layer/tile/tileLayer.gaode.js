const names = {
    vec: "高德-矢量底图+注记",
    vecd: "高德-矢量底图",
    img: "高德-影像底图+注记",
    imgd: "高德-影像底图",
    imgz: "高德-影像注记",
    road: "高德-影像路网",
    time: "高德-实时路况"
};

/**
目前通过高德地图官方网站的影像切换，可以看到高德的瓦片地址有如下两种：

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7和

http://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}

前者是高德的新版地址，后者是老版地址。

前者lang可以通过zh_cn设置中文，en设置英文，
size基本无作用，
scl设置标注，scl=1代表含注记，scl=2代表不含标注，影像无标注
style设置影像和路网，style=6为影像图，style=7为矢量路网，style=8为影像路网

总结之：

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7 为矢量图（含路网、含注记）

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=7 为矢量图（含路网，不含注记）

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6 为影像底图（不含路网，不含注记）

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6 为影像底图（不含路网、不含注记）

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8 为影像路图（含路网，含注记）

http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8 为影像路网（含路网，不含注记）
 */

/**
 * 高德
 */
L.TileLayer.GaoDe = L.TileLayer.extend({
    options: {
        size: 1,
        lang: "zh_cn",
        host: "wprd",
        subdomains: "1234"
    },
    initialize: function(options) {
        if (!options.layer) options.layer = "vec";

        options.name = options.name || names[options.layer] || `高德`;

        let url =
            "http://{host}0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang={lang}&size={size}&scl={scl}&style={style}";

        switch (options.layer) {
            case "time":
                url =
                    "http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t={time}";
                options.time = new Date().getTime();
                break;
            case "img":
            case "imgd":
                Object.assign(options, {
                    host: "wprd",
                    scl: 1,
                    style: 6
                });
                break;
            case "imgz":
                Object.assign(options, {
                    scl: 1,
                    style: 8,
                    host: "wprd"
                });
                break;
            case "road":
                Object.assign(options, {
                    host: "wprd",
                    scl: 2,
                    style: 8
                });
                break;
            case "vecd":
                Object.assign(options, {
                    host: "wprd",
                    scl: 2,
                    style: 7
                });
                break;
            case "vec":
            default:
                Object.assign(options, {
                    scl: 1,
                    style: options.bigfont ? 7 : 8,
                    host: options.bigfont ? "wprd" : "webrd"
                });
                break;
        }

        L.setOptions(this, Object.assign(this.options, options));

        L.TileLayer.prototype.initialize.call(this, url, this.options);
    }
});

L.tileLayer.gaode = function(option) {
    option = option || {};

    switch (option.layer) {
        case "img":
            return L.basemapGroup(
                new L.TileLayer.GaoDe(
                    Object.assign({}, option, { layer: "imgd" })
                ),
                new L.TileLayer.GaoDe(
                    Object.assign({}, option, { layer: "imgz" })
                ),
                Object.assign({ name: names["img"] }, option)
            );
        default:
            return new L.TileLayer.GaoDe(option);
    }
};
