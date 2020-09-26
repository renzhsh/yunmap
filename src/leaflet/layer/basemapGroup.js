/**
 * 将底图和注记打包成一个层，一起添加和移除，并保证注记的正确显示。
 */
L.BasemapGroup = L.Layer.extend({
    initialize: function(tiles, annos, options) {
        this.tileLayers = L.Util.isArray(tiles) ? tiles : [tiles];
        this.annoLayers = L.Util.isArray(annos) ? annos : [annos];

        L.setOptions(this, Object.assign({}, options));
    },

    onAdd(map) {
        this.tileLayers.forEach(tile => {
            map.addLayer(tile);
        });

        this.annoLayers.forEach(anno => {
            anno.options.pane = "anno";
            map.addLayer(anno);
        });

        return this;
    },
    onRemove(map) {
        this.tileLayers.forEach(tile => {
            map.removeLayer(tile);
        });

        this.annoLayers.forEach(anno => {
            map.removeLayer(anno);
        });

        return this;
    },
    getAttribution() {
        return this.options.attribution;
    }
});

L.basemapGroup = function(tiles, annos, options) {
    return new L.BasemapGroup(tiles, annos, options);
};
