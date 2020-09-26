const names = {
    vec: "谷歌-矢量底图+注记",
    imgd: "谷歌-影像底图",
    img: "谷歌-影像底图+注记",
    ter: "谷歌-地形地图+注记",
    road: "谷歌-街道"
};

/**
 * Google, 
lyr可选值：
h 街道图
m 矢量含标注
p 地形含标注

s 影像无标注
y 影像含标注

r 街道图
t 地形图
 */
L.TileLayer.Google = L.TileLayer.extend({
    options: {
        subdomains: "0123"
    },
    initialize: function(url, options) {
        this.url =
            url ||
            "http://mt{s}.google.cn/vt/lyrs={lyr}&scale=2&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}";

        const name = options.name || names[options.layer];

        L.setOptions(this, Object.assign({ name }, this.options, options));
    },
    getTileUrl: function(coords) {
        var zoom = this._getZoomForUrl();
        if (this.options.zOffset) zoom = zoom + this.options.zOffset;

        var ident;
        if (this.options.matrixIds) ident = this.options.matrixIds[zoom];
        else if (this.options.tilematrixBefore)
            ident = this.options.tilematrixBefore + zoom;
        else ident = zoom;

        var lyr;
        switch (this.options.layer) {
            case "road":
                lyr = "h";
                break;
            case "imgd":
                lyr = "s";
                break;
            case "img":
                lyr = "y";
                break;
            case "ter":
                lyr = "p";
                break;
            case "vec":
            default:
                lyr = "m";
                break;
        }

        this.options = Object.assign(this.options, {
            lyr,
            s: this._getSubdomain(coords),
            z: ident,
            y: coords.y,
            x: coords.x
        });

        return L.Util.template(this.url, this.options);
    }
});

L.tileLayer.google = function(options) {
    return new L.TileLayer.Google("", options);
};
