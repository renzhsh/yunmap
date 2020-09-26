/**
* 使用Canvas绘制Image
* By 木遥原创（QQ：346819890） https://github.com/muyao1987
*/
L.ImageCanvasOverlay = L.Path.extend({
    options: {
        draggable: false,
        fill: false,
        stroke: false
    },
    initialize: function (url, bounds, options) {
        this._url = url;

        this._image = new Image();
        this._image.src = this._url;
  
        this._bounds = L.latLngBounds(bounds);

        L.Util.setOptions(this, options);
    },
    setUrl: function (url) {
        this._url = url;

        this._image = new Image();
        this._image.src = this._url;

        if (this._map) {
            this._reset();
        }
        return this;
    },

    setBounds: function (bounds) {
        this._bounds = L.latLngBounds(bounds); 
        if (this._map) {
            this._reset();
        }
        return this;
    },
    getBounds: function () {
        return this._bounds;
    },
    _project: function () {
        this._point_topleft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
        this._point_bottonright = this._map.latLngToLayerPoint(this._bounds.getSouthEast());
        this._updateBounds();
    },
    _updateBounds: function () {
        this._pxBounds = new L.Bounds(this._point_topleft, this._point_bottonright);
    },
    _update: function () {
        if (this._map) {
            this._updatePath();
        }
    },
    _updatePath: function () {
        this._renderer._updateImageOverlay(this);
    },
    _empty: function () {
        return this._url && !this._renderer._bounds.intersects(this._pxBounds);
    },
    _containsPoint: function (p) {
        var tolerance = this._clickTolerance();
        return (p.x <= this._point_bottonright.x + tolerance) &&
                (p.x >= this._point_topleft.x - tolerance) &&
                (p.y <= this._point_bottonright.y + tolerance) &&
                (p.y >= this._point_topleft.y - tolerance);
    },

    //获取指定坐标的颜色值
    getRgba: function (latnlg) {
        var _ctx = this._renderer._ctx;

        var postion = this._map.latLngToLayerPoint(latnlg);
        var min = this._renderer._bounds.min;
        postion.x -= min.x;
        postion.y -= min.y;
        if (L.Browser.retina) {
            postion.x = postion.x * 2;
            postion.y = postion.y * 2;
        }

        var rgba = _ctx.getImageData(postion.x - 1, postion.y - 1, 1, 1).data;

        var rgba = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
        return rgba;
    },

});

L.imageCanvasOverlay = function (url, bounds, options) {
    return new L.ImageCanvasOverlay(url, bounds, options);
};


L.Canvas.include({
    _updateImageOverlay: function (layer) {
        if (layer._empty()) { return; }

        var p_topleft = layer._point_topleft,
            p_bottonright = layer._point_bottonright,
            ctx = this._ctx;

        this._drawnLayers[layer._leaflet_id] = layer;
 
        var width = (p_bottonright.x - p_topleft.x);
        var height = (p_bottonright.y - p_topleft.y);
        ctx.drawImage(layer._image, p_topleft.x, p_topleft.y, width, height);

        this._fillStroke(ctx, layer);
    }
});
