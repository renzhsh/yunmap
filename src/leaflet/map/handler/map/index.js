import IBus from "./iBus";
import L from "leaflet";

export default class MapHandler {
    constructor(options) {
        this.mapOptions = this._mergeOption(options);
    }

    /**
     * 合并配置信息
     * @param {*} options
     */
    _mergeOption(options) {
        const mapOptions = Object.assign(options, {
            // 控件统一由 ctrlHandler 添加
            zoomControl: false,
            attributionControl: false
        });

        if (mapOptions.center) {
            let center = mapOptions.center;
            if (center.x && center.y) {
                mapOptions.center = [center.y, center.x];
            }
            if (center.lat && center.lng) {
                mapOptions.center = [center.lat, center.lng];
            }
            if (center.constructor == Array) {
                let [x, y] = center;
                mapOptions.center = [y, x];
            }
        }

        mapOptions.crs = L.CRS.Provider(mapOptions.crs);

        return mapOptions;
    }

    createMap(el) {
        const map = L.map(el, this.mapOptions);

        const _iBus = new IBus();
        const _that = this;

        Object.defineProperties(map, {
            iBus: {
                get() {
                    return _iBus;
                }
            },
            mapHandler: {
                get() {
                    return _that;
                }
            }
        });

        this._map = map;
        this.bindEvent();

        return map;
    }

    get map() {
        return this._map;
    }

    bindEvent() {}
}
