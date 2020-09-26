const names = {
    vec: "百度在线-电子地图+注记",
    imgd: "百度在线-卫星底图",
    imgz: "百度在线-卫星注记",
    img: "百度在线-卫星底图+注记",
    time: "百度在线-实时路况"
    // custom: "百度在线"
};

/**
 * bigfont: 大字体
 *
 * custom: 自定义样式，style可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
 */

/**
 * 百度在线，需设置百度坐标系
 */
L.TileLayer.Baidu = L.TileLayer.extend({
    options: {
        subdomains: "0123456789",
        tms: true
    },
    initialize: function(options) {
        if (!options.layer) options.layer = "vec";

        if (options.layer == "custom") {
            if (!options.style) options.style = "midnight";
            options.name = options.name || `百度在线-${options.style}`;
        }

        options.name = options.name || names[options.layer] || `百度在线`;

        let url = "";

        switch (options.layer) {
            case "imgd":
                url =
                    "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46";
                break;
            case "imgz":
                url =
                    "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles={style}&v=020";
                options.style = options.bigfont ? "sh" : "sl";
                break;
            case "custom":
                url =
                    "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}";
                options.subdomains = "012";
                break;
            case "time":
                url =
                    "http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time={time}&label=web2D&v=017";
                options.time = new Date().getTime();
                break;
            case "vec":
            default:
                url =
                    "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles={style}&scaler=1&p=1";
                options.style = options.bigfont ? "ph" : "pl";
                break;
        }

        L.setOptions(this, Object.assign(this.options, options));

        L.TileLayer.prototype.initialize.call(this, url, this.options);
    }
});

L.tileLayer.baidu = function(option) {
    option = option || {};

    switch (option.layer) {
        case "img":
            return L.basemapGroup(
                new L.TileLayer.Baidu({
                    layer: "imgd",
                    bigfont: option.bigfont
                }),
                new L.TileLayer.Baidu({
                    layer: "imgz",
                    bigfont: option.bigfont
                }),
                Object.assign({ name: names["img"] }, option)
            );
        default:
            return new L.TileLayer.Baidu(option);
    }
};
