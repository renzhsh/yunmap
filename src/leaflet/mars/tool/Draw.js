/* 2017-12-5 10:35:41 | 修改 木遥（QQ：346819890） */
//draw控件[此功能需要引用 leaflet.draw 插件]

var draw = (function (opt) {

    var that = {
        map: null,
        layerDraw: null,
        options: opt,
        control: {},
        init: function () {
            this.map = this.options.map;
            if (this.options.layer)
                this.layerDraw = this.options.layer;
            else
                this.layerDraw = L.featureGroup().addTo(this.map, { editing: true });

            this.options.style = this.options.style || { color: '#0000ff', weight: 2 };
            var style = this.options.style;

            //编辑工具初始化
            this.control['marker'] = new L.Draw.Marker(this.map, { icon: new L.Icon.Default() });
            this.control['text'] = new L.Draw.Text(this.map);
            this.control['font-marker'] = new L.Draw.FontMarker(this.map);

            this.control['polyline'] = new L.Draw.Polyline(this.map, { shapeOptions: style });
            this.control['polylinefree'] = new L.Draw.Polylinefree(this.map, { shapeOptions: style }); 
            this.control['rectangle'] = new L.Draw.Rectangle(this.map, { shapeOptions: style });
            this.control['circle'] = new L.Draw.Circle(this.map, { shapeOptions: style });
            this.control['polygon'] = new L.Draw.Polygon(this.map, { allowIntersection: true, showArea: true, metric: ['km', 'm'], shapeOptions: style });

            this.control['image'] = new L.Draw.Image(this.map);

            if (!this.options.hasOwnProperty("onEvnet") || this.options.onEvnet) {
                this.onEvnet();
            }
             
        },
        onEvnet: function () {
            //绑定事件
            this.layerDraw.on('click', this._layerDraw_clickHndler, this);
            this.map.on('click', this._map_clickHndler, this);
            this.map.on('dblclick', this._map_dblclickHndler, this);
            this.map.on('draw:created', this._map_draw_createdHndler, this);

            if (this.options.onChange && typeof (this.options.onChange) == "function") {
                this.map.on("draw:editvertex", this._map_draw_changeHandler, this);
                this.map.on("draw:editmove", this._map_draw_changeHandler, this);
                this.map.on("draw:editresize", this._map_draw_changeHandler, this);
            }
            return this;
        },
        offEvent: function () {
            //解除绑定事件
            this.layerDraw.off('click', this._layerDraw_clickHndler, this);
            this.map.off('click', this._map_clickHndler, this);
            this.map.off('dblclick', this._map_dblclickHndler, this);
            this.map.off('draw:created', this._map_draw_createdHndler, this);

            if (this.options.onChange && typeof (this.options.onChange) == "function") {
                this.map.off("draw:editvertex", this._map_draw_changeHandler, this);
                this.map.off("draw:editmove", this._map_draw_changeHandler, this);
                this.map.off("draw:editresize", this._map_draw_changeHandler, this);
            }
            return this;
        },
        destroy: function (noclear) {
            this.stopDraw();
            if (!noclear)
                this.clearDraw();
            this.offEvent();
            return this;
        },
        //开始绘制
        _drawtype: null,
        _defval: null,
        startDraw: function (type, defval) { 
            if (this.control[type] == null) {
                throw '不能进行type为【' + type + '】的绘制，无该类型！';
                return;
            }
            defval= defval || this.configDefval[type];
            defval.type =defval.type||type;

            this._drawtype = type;
            this._defval  = defval;
              
            if (this.options.isOnly) this.clearDraw();

            this.stopDraw();
            if (defval) {
                switch (type) {
                    default:
                        this.control[type].setOptions({ shapeOptions: defval.style });
                        break;
                    case "image":
                        this.control[type].setOptions(defval.style);
                        break;
                    case "marker":
                        var _icon;
                        if (defval.style.hasOwnProperty('iconUrl') && defval.style.iconUrl != null && defval.style.iconUrl != "") { 
                            if(defval.style.iconSize0 &&  defval.style.iconSize1)
                                defval.style.iconSize =   [defval.style.iconSize0, defval.style.iconSize1]; 
                            if(defval.style.iconAnchor0 && defval.style.iconAnchor1)
                                defval.style.iconAnchor =   [defval.style.iconAnchor0, defval.style.iconAnchor1];  
                            _icon = L.icon(defval.style);
                        } else {
                            _icon = new L.Icon.Default();
                        }
                        this.control[type].setOptions({ icon: _icon });
                        break;
                    case "text":
                    case "font-marker":
                        this.control[type].updateIcon(defval.style);
                        break;
                }
            }
            this.control[type].enable();
        },
        stopDraw: function () {
            for (var type in this.control) {
                this.control[type].disable();
            }
            this.stopEditing();
            return this;
        },
        clearDraw: function () {
            this.layerDraw.clearLayers();
        },


        //==========编辑要素==========
        _hasEdit: true,
        hasEdit: function (val) {
            this._hasEdit = val;
            if (val) {
            }
            else {
                this.stopEditing();
            }
        },
        currEditFeature: null,      //当前编辑的要素  
        startEditing: function (layer) {
            if (layer == null || !this._hasEdit) return
            if(layer.editing)
                layer.editing.enable();
            this.currEditFeature = layer;

            if (this.options.hasOwnProperty("onStartEditing") && this.options.onStartEditing) {
                this.options.onStartEditing(this.currEditFeature);
            }
        },
        stopEditing: function () {
            if (this.currEditFeature&& this.currEditFeature.editing &&  this.currEditFeature.editing.disable) {
                this.currEditFeature.editing.disable();

                if (this.options.hasOwnProperty("onStopEditing") && this.options.onStopEditing) {
                    this.options.onStopEditing(this.currEditFeature);
                }
            }
            this.currEditFeature = null;
        },
        updateProperties: function (layer, attr) {
            layer = layer || this.currEditFeature;
            if (layer == null) return;

            var oldattr = layer.properties;
            if (attr) {
                layer.properties = attr;
            }
            else {
                attr = oldattr;
            }

            switch (attr.type) {
                default:
                    break;
                case "marker":
                    var _icon;
                    if (attr.style.hasOwnProperty('iconUrl') && attr.style.iconUrl != null && attr.style.iconUrl != "") {
                        var param = {
                            iconUrl: attr.style.iconUrl,
                            iconSize: [attr.style.iconSize0, attr.style.iconSize1],
                            iconAnchor: [attr.style.iconAnchor0, attr.style.iconAnchor1],
                        };
                        _icon = L.icon(param);
                    } else {
                        _icon = new L.Icon.Default()
                    }
                    layer.setIcon(_icon);
                    layer.setOpacity(attr.style.opacity);
                    break;
                case "text":
                case "font-marker":
                    layer.setOpacity(attr.style.opacity);
                    var icon = this.control[attr.type].getIcon(attr.style);
                    layer.setIcon(icon);
                    break;
                case "polyline":
                case "polylinefree":
                case "polygon":
                case "rectangle":
                    layer.setStyle(attr.style);
                    break;
                case "image":
                    if (layer._imageOverlay == null) {
                        var imageOverlay = new L.ImageOverlay(attr.style.iconUrl, layer.getBounds(), { opacity: attr.style.opacity });
                        layer._imageOverlay = imageOverlay;
                        layer._imageOverlay._nosave = true;
                        this.layerDraw.addLayer(layer._imageOverlay);
                    }
                    layer._imageOverlay.setOpacity(attr.style.opacity);
                    break;
                case "circle":
                    if (!attr.isSemicircle) {
                        attr.startAngle = null;
                        attr.stopAngle = null;
                    }
                    layer.setRadius(attr.style.radius);
                    layer.setStyle(attr.style);
                    layer.redraw();
                    break;
            }
            return layer;
        },
        deleteFeature: function (layer) {
            this.layerDraw.removeLayer(layer);
        },
        //=============事件==============
        _map_clickHndler: function (e) {
            this.stopEditing();
        },
        _map_dblclickHndler: function (e) {
            L.DomEvent.stopPropagation(e); //停止冒泡
            for (var type in this.control) {
                if (this.control[type]._enabled && this.control[type]._finishShape) {
                    this.control[type]._finishShape();
                }
            }
        },
        _layerDraw_clickHndler: function (e) {
            if (e.layer != this.currEditFeature)
                this.stopEditing();

            this.startEditing(e.layer);
            L.DomEvent.stopPropagation(e); //停止冒泡
        },
        _map_draw_createdHndler: function (event) {
            var layer = event.layer;
            layer.properties = this._defval;

            this._updateFeatureForEdit(layer);
            this.layerDraw.addLayer(layer);

            if (this.options.hasDel)
                this.bindDeleteContextmenu(layer);

            this.stopEditing();
            if(!L.Browser.ie)
                this.startEditing(layer);

            if (this.options.onCreate && typeof (this.options.onCreate) == "function") {
                this.options.onCreate(event);
            }
        },
        _map_draw_changeHandler: function (event) {
            var layer = this.currEditFeature;
            event.layer = layer;

            this._updateFeatureForEdit(layer);
            this.options.onChange(event);
        },
        _updateFeatureForEdit: function (layer) {
            if (layer.properties == null || layer.properties.type == null) return;

            switch (layer.properties.type) {
                case "circle":
                    layer.properties.style.radius = parseInt(layer.getRadius());
                    break;
                case "image":
                    this.layerDraw.addLayer(layer._imageOverlay);

                    layer._imageOverlay._nosave = true;
                    layer._imageOverlay.setBounds(layer.getBounds());
                    break;
                case "polylinefree":
                    if(window.turf){  
                        var options = { tolerance: 0.0001, highQuality: false };
                        var json = turf.simplify(layer.toGeoJSON(), options); //简化json
                        var latlngs =L.geoJSON(json).getLayers()[0].getLatLngs();
                        if(latlngs && latlngs.length>0)
                            layer.setLatLngs(latlngs);
                    }
                    break;
            }
        },


        hasDraw: function () {
            if (this.layerDraw == null) return false;
            var layers = this.layerDraw.getLayers();
            return (layers.length > 0)
        },
        getLayer: function () {
            return this.layerDraw;
        },
        getFeatures: function () {
            if (this.hasDraw()) {
                var layers = this.layerDraw.getLayers();
                if (this.options.isOnly)
                    return layers[0];
                else
                    return layers;
                return layers;
            }
            else {
                return null;
            }
        },
        bindDeleteContextmenu: function (layer) {
            var that = this;

            if (layer.bindContextMenu) {
                layer.bindContextMenu({
                    contextmenu: true,
                    contextmenuInheritItems: false,
                    contextmenuItems: [{
                        text: '删除',
                        iconCls: 'fa fa-trash',
                        context: layer,
                        callback: function (e) {
                            var layer = this;
                            that.deleteFeature(layer);
                        }
                    }]
                });
            }
        },






        //文件处理
        toJson: function (isJsonObj) {
            var layers = this.layerDraw.getLayers();
            if (layers.length == 0) {
                return isJsonObj?{}:"";
            }

            var features = [];
            for (var index = 0; index < layers.length; index++) {
                var layer = layers[index];
                if (layer._nosave) continue;

                var geojson = layer.toGeoJSON();
                geojson.properties = { type: layer.properties.type };  //layer.properties || {};

                var def = this.configDefval[layer.properties.type];
                for (var i in layer.properties.style) {
                    var val = layer.properties.style[i];
                    if (val == null || val == "") continue;

                    var valDef = def.style[i];
                    if (valDef == val) continue;

                    if (geojson.properties.style == null)
                        geojson.properties.style = {};
                    geojson.properties.style[i] = val;
                }
                for (var i in layer.properties.attr) {
                    var val = layer.properties.attr[i];
                    if (val == null || val == "") continue;

                    var valDef = def.attr[i];
                    if (valDef == val) continue;

                    if (geojson.properties.attr == null)
                        geojson.properties.attr = {};
                    geojson.properties.attr[i] = val;
                }

                features.push(geojson);
            }
            var featureCollection = { type: "FeatureCollection", features: features }

            var json = isJsonObj?featureCollection: JSON.stringify(featureCollection);
            return json;
        },
        jsonToLayer: function (json, isClear,isCenter) {
            this.stopDraw();
            if (this.options.isOnly) this.clearDraw();

            var jsonObjs = json;
            try {
                if ((typeof json == 'string') && json.constructor == String)
                    jsonObjs = JSON.parse(json);
            } catch (e) {
                console.error(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }

            var layerResult = L.geoJSON(jsonObjs);
            var layers = layerResult.getLayers();
            if (layers.length == 0) {
                return 0;
            }

            if (isClear)
                this.layerDraw.clearLayers();

            for (var index = 0; index < layers.length; index++) {
                var item = layers[index];
                item.feature.properties=item.feature.properties||{};

                var attr = item.feature.properties;
                if (attr.style == null) attr.style = {};
                if (attr.attr == null) attr.attr = {};
                if(attr.type==null){
                    switch(item.feature.geometry.type){
                        default:
                        case 'Point':
                        case 'MultiPoint':
                            attr.type="marker";
                            break;
                        case 'LineString':
                        case 'MultiLineString':
                            attr.type="polyline";
                            break;
                        case 'Polygon':
                        case 'MultiPolygon':
                            attr.type="polygon";
                            break;
                    } 
                }

                //赋默认值
                var def = this.configDefval[attr.type];
                for (var i in def.style) {
                    var val = attr.style[i];
                    if (val != null) continue;

                    attr.style[i] = def.style[i];
                }
                for (var i in def.attr) {
                    var val = attr.attr[i];
                    if (val != null) continue;

                    attr.attr[i] = def.attr[i];
                }

                switch (attr.type) {
                    case "circle":
                        var layer = L.circle(item.getLatLng(), { radius: attr.style.radius });
                        item = layer;
                        break;
                    case "rectangle":
                        var layer = L.rectangle(item.getBounds());
                        item = layer;
                        break;
                    case "image":
                        var layer = L.rectangle(item.getBounds(), this.control['image']._defstyle);
                        item = layer;
                        break;
                }

                item.properties = attr;
                item.feature = null;
                this.layerDraw.addLayer(item);

                this.updateProperties(item);//更新样式

                layers[index] = item;
            }

            if(isCenter)
                map.fitBounds( this.layerDraw.getBounds());

            return layers;
        },
         
        //从plot的 标号默认值F12打印 拷贝，方便读取
        configDefval: {"text":{"type":"text","name":"文字","style":{"text":"文字","opacity":1,"color":"#0081c2","font_size":30,"font_family":"黑体","font_style":"normal","font_weight":"normal","background":false,"background_color":"#ccc","border":false,"border_color":"#5928de","border_width":3,"border_style":"solid"},"attr":{"name":"","remark":""}},"font-marker":{"type":"font-marker","name":"字体图标点","style":{"opacity":1,"size":50,"color":"#000000","iconClass":"fa fa-crosshairs"},"attr":{"name":"","remark":""}},"marker":{"type":"marker","name":"点标记","style":{"opacity":1,"iconUrl":"","iconSize0":25,"iconSize1":41,"iconAnchor0":12,"iconAnchor1":41},"attr":{"name":"","remark":""}},"polyline":{"type":"polyline","name":"线","style":{"color":"#3388ff","weight":3,"opacity":1,"dashArray":""},"attr":{"name":"","remark":""}},"polylinefree":{"type":"polylinefree","name":"自由线","style":{"color":"#3388ff","weight":3,"opacity":1,"dashArray":""},"attr":{"name":"","remark":""}},"polygon":{"type":"polygon","name":"面","style":{"stroke":true,"color":"#3388ff","weight":2,"opacity":1,"dashArray":"","fill":true,"fillColor":"#3388ff","fillOpacity":0.3},"attr":{"name":"","remark":""}},"rectangle":{"type":"rectangle","name":"矩形","style":{"stroke":true,"color":"#3388ff","weight":2,"opacity":1,"dashArray":"","fill":true,"fillColor":"#3388ff","fillOpacity":0.3},"attr":{"name":"","remark":""}},"circle":{"type":"circle","name":"圆","style":{"radius":0,"stroke":true,"color":"#3388ff","weight":2,"opacity":1,"dashArray":"","fill":true,"fillColor":"#3388ff","fillOpacity":0.3,"isSemicircle":false,"startAngle":0,"stopAngle":0},"attr":{"name":"","remark":""}},"image":{"type":"image","name":"图片","style":{"iconUrl":"","opacity":1},"attr":{"name":"","remark":""}}},

   
 

    };
    that.init();

    return that;
});


export default draw;