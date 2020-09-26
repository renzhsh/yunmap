import _createLayer from "./createLayer";

/**
 *
 */
export default class Layerhandler {
    constructor(map, basemaps = [], overlays = []) {
        this.map = map;
        this.layerOptions = {
            basemaps,
            overlays
        };

        this.initialize();

        this.bindEvent();

        this.baseLayers = basemaps.map(lyr =>
            this.createLayer(Object.assign({ pane: "tilePane" }, lyr))
        );
        this.overLayers = overlays.map(lyr =>
            this.createLayer(Object.assign({ pane: "overlayPane" }, lyr))
        );
    }

    /**
     * 图层初始化
     */
    initialize() {
        // 创建 注记 pane
        const pane = this.map.createPane("anno");
        pane.style.zIndex = 650;
        pane.style.pointerEvents = "none"; // 不处理鼠标点击事件
    }

    bindEvent() {}

    createLayer(option) {
        return _createLayer(option);
    }

    /**
     * 添加 初始 图层
     */
    addInitLayers() {
        let basemap = null;
        var visibleLayers = this.baseLayers.filter(
            lyr => lyr.options && lyr.options.visible
        );
        if (visibleLayers.length > 0) {
            basemap = visibleLayers[0];
        }
        if (!basemap) {
            basemap = this.baseLayers[0];
        }
        if (basemap) {
            basemap.addTo(this.map);
            this.map.basemap = basemap;
        }

        this.overLayers
            .filter(lyr => lyr.options && lyr.options.visible)
            .forEach(lyr => {
                lyr.addTo(this.map);
            });

        this.map.on("baselayerchange", ({ layer }) => {
            this.map.basemap = layer;
        });
    }

    /**
     * 切换底图
     * @param {*} layer
     */
    changeBasemap(layer) {
        this.map.removeLayer(this.map.basemap);
        this.map.addLayer(layer);

        this.map.fire("baselayerchange", { event: "baselayerchange", layer });
    }
}
