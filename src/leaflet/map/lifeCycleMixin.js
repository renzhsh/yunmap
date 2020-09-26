import { MapHandler, LayerHandler } from "./handler";

export default {
    props: {
        mapOptions: Object,
        plugins: {
            type: Array,
            default: _ => []
        },
        basemaps: {
            type: Array,
            default: _ => []
        },
        overlays: {
            type: Array,
            default: _ => []
        },
        controls: {
            type: Array,
            default: _ => []
        },
        widgets: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            map: null,
            ctrlSetup: false,
            widgetSetup: false
        };
    },
    mounted() {
        this.lifeCycle();
    },
    methods: {
        /**
         * loadPlugins ==> createMap ==> createLayer ==> createControl ==> 初始化设置(center/zoom/url参数)
         */
        async lifeCycle() {
            await L.plugins.loadAsync(this.plugins);

            this.map = this.createMap();

            this.map.layerHandler.addInitLayers();

            this.adjustLayout();

            this.mapReady = true;
        },
        onSetup(name) {
            if ("ctrl" === name) {
                this.ctrlSetup = true;
            }
            if ("widget" === name) {
                this.widgetSetup = true;
            }
            if (this.ctrlSetup && this.widgetSetup) {
                this.$emit("mapSetup", this.map);
            }
        },
        createMap() {
            const handler = new MapHandler(this.mapOptions);
            const map = handler.createMap(this.mapId);

            const _layerHd = new LayerHandler(
                map,
                this.basemaps,
                this.overlays
            );

            Object.defineProperties(map, {
                layerHandler: {
                    get() {
                        return _layerHd;
                    }
                }
            });

            return map;
        },
        /**
         * 调整布局
         */
        adjustLayout() {
            let mapDom = document.querySelector(`#${this.mapId}`);
            let ctrlDom = document.querySelector(
                `#${this.mapId}` + " .leaflet-control-container"
            );

            mapDom.after(ctrlDom);
        }
    }
};
