//将百度mapv类库引入leaflet http://mapv.baidu.com/
//木遥原创 QQ：346819890

(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
        //module.exports = factory(require('jquery'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.mapVLayer = factory(L);
    }
}(function (L) { 
    if (window["mapv"] == null) { 
        return;
    }

    L.Map.include({
        /**
         * 获取精确的像素坐标.
         * 当需要绘制比较平滑的曲线的时候可调用此方法代替latLngToContainerPoint
         * @param latlng
         */
        latLngToAccurateContainerPoint: function (latlng) {
            var projectedPoint = this.project(L.latLng(latlng));
            var layerPoint = projectedPoint._subtract(this.getPixelOrigin());
            return L.point(layerPoint).add(this._getMapPanePos());
        },
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var BaseLayer = mapv.baiduMapLayer ? mapv.baiduMapLayer.__proto__ : Function;

    var MapVRenderer = function (_BaseLayer) {
        _inherits(MapVRenderer, _BaseLayer);

        function MapVRenderer(map, layer, dataSet, options) {
            _classCallCheck(this, MapVRenderer);

            if (!BaseLayer) {
                return _possibleConstructorReturn(_this);
            }

            var _this = _possibleConstructorReturn(this, (MapVRenderer.__proto__ || Object.getPrototypeOf(MapVRenderer)).call(this, map, dataSet, options));

            var self = _this;
            options = options || {};

            self.init(options);
            self.argCheck(options);
            _this.canvasLayer = layer;
            _this.clickEvent = _this.clickEvent.bind(_this);
            _this.mousemoveEvent = _this.mousemoveEvent.bind(_this);

            var movestart = _this.moveStartEvent.bind(_this);
            var moveend = _this.moveEndEvent.bind(_this);
            var zoomstart = _this.zoomStartEvent.bind(_this);

            _this.map.on('movestart', movestart);
            _this.map.on('moveend', moveend);
            _this.map.on('zoomstart', zoomstart);

            _this._dispose = false;
            _this.unbindMapEvent = function () {
                _this.map.off('movestart', movestart);
                _this.map.off('moveend', moveend);
                _this.map.off('zoomstart', zoomstart);
            };

            _this.bindEvent();
            return _this;
        }

        _createClass(MapVRenderer, [{
            key: 'dispose',
            value: function clickEvent(e) {
                this._dispose = true;
                this.unbindEvent();
                this.unbindMapEvent();
                this.clear();
            }
        }, {
            key: 'clickEvent',
            value: function clickEvent(e) {
                var pixel = e.layerPoint;
                _get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), 'clickEvent', this).call(this, pixel, e);
            }
        }, {
            key: 'mousemoveEvent',
            value: function mousemoveEvent(e) {
                var pixel = e.layerPoint;
                _get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), 'mousemoveEvent', this).call(this, pixel, e);
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent(e) {
                var map = this.map;

                if (this.options.methods) {
                    if (this.options.methods.click) {
                        map.on('click', this.clickEvent);
                    }
                    if (this.options.methods.mousemove) {
                        map.on('mousemove', this.mousemoveEvent);
                    }
                }
            }
        }, {
            key: 'unbindEvent',
            value: function unbindEvent(e) {
                var map = this.map;

                if (this.options.methods) {
                    if (this.options.methods.click) {
                        map.off('click', this.clickEvent);
                    }
                    if (this.options.methods.mousemove) {
                        map.off('mousemove', this.mousemoveEvent);
                    }
                }
            }
        }, {
            key: 'getContext',
            value: function getContext() {
                return this.canvasLayer.getCanvas().getContext(this.context);
            }
        }, {
            key: 'addData',
            value: function addData(data, options) {
                var _data = data;
                if (data && data.get) {
                    _data = data.get();
                }
                this.dataSet.add(_data);
                this.update({ options: options });
            }
        }, {
            key: 'updateData',
            value: function updateData(data, options) {
                var _data = data;
                if (data && data.get) {
                    _data = data.get();
                }
                this.dataSet.set(_data);
                this.update({ options: options });
            }
        }, {
            key: 'getData',
            value: function getData() {
                return this.dataSet;
            }
        }, {
            key: 'removeData',
            value: function removeData(filter) {
                if (!this.dataSet) {
                    return;
                }
                var newData = this.dataSet.get(filter);
                this.dataSet.set(newData);
                this.update({ options: null });
            }
        }, {
            key: 'clearData',
            value: function clearData() {
                this.dataSet && this.dataSet.clear();
                this.update({ options: null });
            }
        }, {
            key: '_canvasUpdate',
            value: function _canvasUpdate(time) {
                if (this._dispose || !this.canvasLayer) {
                    return;
                }

                var self = this;

                var animationOptions = self.options.animation;

                var context = this.getContext();
                var map = this.map;
                if (self.isEnabledTime()) {
                    if (time === undefined) {
                        this.clear(context);
                        return;
                    }
                    if (this.context === '2d') {
                        context.save();
                        context.globalCompositeOperation = 'destination-out';
                        context.fillStyle = 'rgba(0, 0, 0, .1)';
                        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                        context.restore();
                    }
                } else {
                    this.clear(context);
                }

                if (this.context === '2d') {
                    for (var key in self.options) {
                        context[key] = self.options[key];
                    }
                } else {
                    context.clear(context.COLOR_BUFFER_BIT);
                }

                if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
                    return;
                }

                var offset = map.latLngToAccurateContainerPoint(this.canvasLayer.getTopLeft());
                var dataGetOptions = {
                    transferCoordinate: function transferCoordinate(coordinate) {
                        var worldPoint = map.latLngToAccurateContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                        var pixel = {
                            x: worldPoint.x - offset.x,
                            y: worldPoint.y - offset.y
                        };
                        return [pixel.x, pixel.y];
                    }
                };

                if (time !== undefined) {
                    dataGetOptions.filter = function (item) {
                        var trails = animationOptions.trails || 10;
                        return time && item.time > time - trails && item.time < time;
                    };
                }

                var data = self.dataSet.get(dataGetOptions);

                this.processData(data);

                self.options._size = self.options.size;

                var worldPoint = map.latLngToContainerPoint(L.latLng(0, 0));
                var pixel = {
                    x: worldPoint.x - offset.x,
                    y: worldPoint.y - offset.y
                };
                this.drawContext(context, new mapv.DataSet(data), self.options, pixel);

                self.options.updateCallback && self.options.updateCallback(time);
            }
        }, {
            key: 'init',
            value: function init(options) {

                var self = this;

                self.options = options;

                this.initDataRange(options);

                this.context = self.options.context || '2d';

                if (self.options.zIndex) {
                    this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
                }

                this.initAnimator();
            }
        }, {
            key: 'addAnimatorEvent',
            value: function addAnimatorEvent() { }
        }, {
            key: 'moveStartEvent',
            value: function moveStartEvent() {
                var animationOptions = this.options.animation;
                if (this.isEnabledTime() && this.animator) {
                    this.steps.step = animationOptions.stepsRange.start;
                    this._hide();
                }
            }
        }, {
            key: 'moveEndEvent',
            value: function moveEndEvent() {
                this.canvasLayer.draw();
                this._show();
            }
        }, {
            key: 'zoomStartEvent',
            value: function zoomStartEvent() {
                this._hide();
            }
        }, {
            key: 'clear',
            value: function clear(context) {
                context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            }
        }, {
            key: '_hide',
            value: function _hide() {
                this.canvasLayer.canvas.style.display = 'none';
            }
        }, {
            key: '_show',
            value: function _show() {
                this.canvasLayer.canvas.style.display = 'block';
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.canvasLayer.draw();
            }
        }]);

        return MapVRenderer;
    }(BaseLayer);

    L.MapVLayer = L.Layer.extend({
        initialize: function (dataSet, mapVOptions, options) {
            options = options || {};
            this.dataSet = dataSet || {};
            this.mapVOptions = mapVOptions || {};
            this.render = this.render.bind(this);
            L.Util.setOptions(this, options);

            this.canvas = this._createCanvas();
            L.stamp(this);
        },


        onAdd: function (map) {
            this._map = map;
            var overlayPane = this.getPane();
            var container = this.container = L.DomUtil.create("div", "leaflet-layer leaflet-zoom-animated", overlayPane);
            container.appendChild(this.canvas);
            var size = map.getSize();
            container.style.width = size.x + "px";
            container.style.height = size.y + "px";
            this.renderer = new MapVRenderer(map, this, this.dataSet, this.mapVOptions);
            this.draw();
            this.fire("loaded");
        },

        _hide: function () {
            this.canvas.style.display = 'none';
        },

        _show: function () {
            this.canvas.style.display = 'block';
        },
        onRemove: function (map) {
            L.DomUtil.remove(this.container);

            this.renderer.dispose();

            map.off({
                moveend: this.draw,
                zoomstart: this._hide,
                zoomend: this._show
            }, this);
        },


        addData: function (data, options) {
            this.renderer.addData(data, options);
        },

        update: function (data, options) {
            this.renderer.updateData(data, options);
        },

        getData: function () {
            if (this.renderer) {
                this.dataSet = this.renderer.getData();
            }
            return this.dataSet;
        },

        /**
         * 按照过滤条件移除数据
         * @param filter
         * eg: filter=function(data){
         *         if(data.id="1"){
         *            return true
         *         }
         *         return false;
         *     }
         */
        removeData: function (filter) {
            this.renderer && this.renderer.removeData(filter);
        },

        clearData: function () {
            this.renderer.clearData();
        },

        draw: function () {
            return this._reset();
        },

        setZIndex: function (zIndex) {
            this.canvas.style.zIndex = zIndex;
        },

        render: function () {
            this.renderer._canvasUpdate();
        },

        getCanvas: function () {
            return this.canvas;
        },

        getContainer: function () {
            return this.container;
        },

        getTopLeft: function () {
            var map = this._map;
            var topLeft;
            if (map) {
                var bounds = map.getBounds();
                topLeft = bounds.getNorthWest();
            }
            return topLeft;

        },

        _createCanvas: function () {
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = 0 + "px";
            canvas.style.left = 0 + "px";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = this.options.zIndex || 600;
            return canvas;
        },


        _resize: function () {
            var canvas = this.canvas;
            if (!canvas) {
                return;
            }

            var map = this._map;
            var size = map.getSize();
            canvas.width = size.x;
            canvas.height = size.y;
            canvas.style.width = size.x + 'px';
            canvas.style.height = size.y + 'px';
            var bounds = map.getBounds();
            var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
            L.DomUtil.setPosition(canvas, topLeft);

        },

        _reset: function () {
            this._resize();
            this._render()
        },
        redraw: function () {
            this._resize();
            this._render()
        },
        _render: function () {
            this.render();
        },

    });

    L.mapVLayer = function (dataSet, mapVOptions, options) {
        return new L.MapVLayer(dataSet, mapVOptions, options);
    };


    return L.mapVLayer;

}, window));

