//WMTS标准介绍 https://blog.csdn.net/supermapsupport/article/details/50423782

/**
 *  WMTS标准
 *  @param {string} version '1.0.0'
 *  @param {string} style 'default'
 *  @param {string} tilematrixSet 切片类型
 *  @param {string} format 瓦片格式
 *  @param {number} width 瓦片宽度 256
 *  @param {number} height 瓦片高度 256
 *  @param {string} layer 图层
 *  @param {string} subdomains
 */
L.TileLayer.WMTS = L.TileLayer.extend({
    options: {
        version: "1.0.0",
        style: "default",
        tilematrixSet: "",
        format: "image/png",
        width: 256,
        height: 256,
        layer: ""
    },
    /**
     *
     * @param {string} url
     * @param {Object} options
     */
    initialize: function(url, options) {
        this.url = url;
        L.setOptions(this, Object.assign({}, this.options, options));

        this.getCapabilities();
    },
    getCapabilities() {
        const capParams = {
            service: "WMTS",
            request: "GetCapabilities",
            format: "json"
        };

        const url = this.getUrlWithParam(this.url, capParams);
        const params = Object.assign(
            {
                s: this._getSubdomain({
                    x: 0,
                    y: 0,
                    z: 0
                })
            },
            capParams,
            this.options
        );

        L.http.get(L.Util.template(url, params)).then(resp => {
            var jsonObj = L.Util.x2js.xml_str2json(resp);

            let bbox = jsonObj.Capabilities.Contents.Layer.BoundingBox;
            let lowerCorner = bbox.LowerCorner.__text.split(" ");
            let upperCorner = bbox.UpperCorner.__text.split(" ");
            let crs = bbox.crs;

            this.extent = {
                ymin: parseFloat(lowerCorner[0]),
                xmin: parseFloat(lowerCorner[1]),
                ymax: parseFloat(upperCorner[0]),
                xmax: parseFloat(upperCorner[1]),
                crs: crs || "EPSG:3857"
            };
        });
    },
    /**
     * 构建url模板
     * @param {*} url 原有url
     * @param {*} paramObj 拼接的参数对象
     * @param {*} uppercase 参数是否大写
     */
    getUrlWithParam: function(url, paramObj, uppercase) {
        let params = [];
        for (var key in paramObj) {
            params.push((uppercase ? key.toUpperCase() : key) + `={${key}}`);
        }
        return (
            url +
            (!url || url.indexOf("?") === -1 ? "?" : "&") +
            params.join("&")
        );
    },
    getTileUrl: function(coords) {
        var zoom = this._getZoomForUrl();
        if (this.options.zOffset) zoom = zoom + this.options.zOffset;

        var ident;
        if (this.options.matrixIds) ident = this.options.matrixIds[zoom];
        else if (this.options.tilematrixBefore)
            ident = this.options.tilematrixBefore + zoom;
        else ident = zoom;

        this.options = Object.assign(this.options, {
            tilematrix: ident,
            tilerow: coords.y,
            tilecol: coords.x
        });

        const wmtsParams = {
            service: "WMTS",
            request: "GetTile",
            version: "",
            style: "",
            tilematrixSet: "",
            format: "",
            width: "",
            height: "",
            layer: "",
            tilematrix: "",
            tilerow: "",
            tilecol: ""
        };

        let url = this.getUrlWithParam(
            this.url,
            wmtsParams,
            this.options.uppercase
        );

        return L.Util.template(
            url,
            Object.assign(
                {
                    s: this._getSubdomain(coords)
                },
                wmtsParams,
                this.options
            )
        );
    }
});

L.tileLayer.wmts = function(url, options) {
    return new L.TileLayer.WMTS(url, options);
};
