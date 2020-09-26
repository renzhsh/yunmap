/**
 * Open Street Map
 */
L.TileLayer.OSM = L.TileLayer.extend({
    options: {
        name: "Open Street Map",
        subdomains: "abc"
    },
    initialize: function(url, options) {
        this.url = url || "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        L.setOptions(this, Object.assign({}, this.options, options));
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
            s: this._getSubdomain(coords),
            z: ident,
            y: coords.y,
            x: coords.x
        });

        return L.Util.template(this.url, this.options);
    }
});

L.tileLayer.osm = function(options) {
    return new L.TileLayer.OSM("", options);
};
