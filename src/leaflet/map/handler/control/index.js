export default class ControlHandler {
    constructor(map, options) {
        this.map = map;

        this.defOptions = {
            layers: { _isLeafletCtrl: true },
            zoom: { _isLeafletCtrl: true },
            minimap: { _isLeafletCtrl: true },
            scale: {
                metric: true,
                imperial: false,
                _isLeafletCtrl: true
            },
            attribution: {
                prefix: '<a href="javascript:;">YunGIS</a>',
                _isLeafletCtrl: true
            },
            fishbone: { tag: "LFishbone" },
            mapswich: { tag: "LMapswich" },
            toolbar: { tag: "LToolbar" },
            location: { tag: "LLocation" }
        };

        this.ctrlOptions = this._mergeOptions(options);
    }

    /**
     * 合并默认配置
     * @param {string[]} options
     */
    _mergeOptions(options) {
        const defs = this.defOptions;

        return options.map(item => {
            if (L.Util.isString(item)) {
                return Object.assign({ type: item }, defs[item]);
            } else {
                return Object.assign({}, defs[item.type], item);
            }
        });
    }

    /**
     *
     * @param {*} option
     */
    createCtrl(option) {
        switch (option.type) {
            case "layers":
                return this._createLayers(option);
            case "zoom":
                return L.control.zoom(option);
            case "scale":
                return L.control.scale(option);
            case "attribution":
                return this._createAttribution(option);
            case "minimap":
                return this._createMinimap(option);
            default:
                L.logger.warn(`未识别的组件类型：${option.type}`);
                return null;
        }
    }

    _createLayers(option) {
        const handle = this.map.layerHandler;

        let idx = 0;
        const baseLayers = Object.assign(
            {},
            ...handle.baseLayers.map(lyr => {
                return {
                    [lyr.options.name || idx++]: lyr
                };
            })
        );

        const overLayers = Object.assign(
            {},
            ...handle.overLayers.map(lyr => {
                return {
                    [lyr.options.name || idx++]: lyr
                };
            })
        );

        return L.control.layers(baseLayers, overLayers, option);
    }

    _createAttribution(option) {
        const _control = L.control.attribution(option);

        if (option.attributes) {
            var attrs = [];
            if (L.Util.isString(option.attributes)) {
                attrs = [item.attributes];
            } else if (L.Util.isArray(option.attributes)) {
                attrs = option.attributes;
            }

            for (var item of attrs) {
                _control.addAttribution(item);
            }
        }
        return _control;
    }

    /**
     * 创建鹰眼
     * @param {*} option
     */
    _createMinimap(option) {
        const createLyr = this.map.layerHandler.createLayer;

        const lyrClone = function(lyr) {
            let option = Object.assign({}, lyr.options);
            delete option["layer"]; // 避免 createLayer 失败

            return createLyr(option);
        };

        /**
         * 如果指定图层， 则不随着底图的变更而变更
         */
        if (option.layer) {
            const layer =
                option.layer instanceof L.Layer
                    ? option.layer
                    : createLyr(option.layer);
            return L.control.minimap(layer, option);
        }
        if (this.map.basemap) {
            const control = L.control.minimap(
                lyrClone(this.map.basemap),
                option
            );

            this.map.on("baselayerchange", ({ layer }) => {
                control.changeLayer(lyrClone(layer));
            });

            return control;
        }
    }
}
