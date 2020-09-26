/* 2017-11-25 14:28:12 | 修改 木遥（QQ：346819890） */
var MeasureTool = L.Class.extend({
    map: null, 
    initialize: function (options) {
        options = options || {};

        this.map = options.map;
        this._create();

        if (!options.hasOwnProperty('isactivate') || options.options)
            this.activate();
    },
    layerDraw: null,
    layerResult:null,
    polylineControl: null,
    polygonControl: null, 
    //iconDot:null,
    //初始化[仅执行1次]
    _create: function () {
        this.layerDraw = L.featureGroup().addTo(this.map);
        this.layerResult = L.featureGroup().addTo(this.map);

        var style = { color: '#0000ff', weight: 2 };
        //var iconDot = L.divIcon({
        //    className: "",
        //    html: '<div style="background: #ffffff;border-radius: 50%;border: #0000ff 2px solid;width:100%;height:100%;"></div>',
        //    iconSize: [10, 10]
        //});

        this.polylineControl = new L.Draw.Polyline(this.map, {
            shapeOptions: style,
            //icon: iconDot, touchIcon: iconDot
        });
        this.polygonControl = new L.Draw.Polygon(this.map, {
            allowIntersection: false,
            showArea: true,
            metric: ['km', 'm'],
            //icon: iconDot, touchIcon: iconDot,
            shapeOptions: style
        }); 
    },
    isActivate: false,
    //激活插件
    activate: function () {
        if (this.isActivate) {
            return;
        }
        this.isActivate = true;
        
        this.map.addLayer(this.layerResult);
        this.map.addLayer(this.layerDraw);
        
        this.layerDraw.on('click', this._layerDraw_clickHndler, this);
        this.map.on('click', this._map_clickHndler, this);
        this.map.on('dblclick', this._map_dblclickHndler, this);
        this.map.on('draw:created', this._map_draw_createdHndler, this);
        this.map.on("draw:drawvertex", this._map_draw_drawvertexHandler, this);

        this.map.on("draw:drawing", this._map_draw_drawing, this);
      
        this.map.on("draw:editvertex", this._map_draw_changeHandler, this);
        this.map.on("draw:editmove", this._map_draw_changeHandler, this);
        this.map.on("draw:editresize", this._map_draw_changeHandler, this);
    },
    //释放插件
    disable: function () {
        this.isActivate = false;

        this.clear();
        this.map.removeLayer(this.layerDraw);
        this.map.removeLayer(this.layerResult);
        
        this.layerDraw.off('click', this._layerDraw_clickHndler, this);
        this.map.off('click', this._map_clickHndler, this);
        this.map.off('dblclick', this._map_dblclickHndler, this);
        this.map.off('draw:created', this._map_draw_createdHndler, this);
        this.map.off("draw:drawvertex", this._map_draw_drawvertexHandler, this);
        this.map.off("draw:drawing", this._map_draw_drawing, this);
     
        this.map.off("draw:editvertex", this._map_draw_changeHandler, this);
        this.map.off("draw:editmove", this._map_draw_changeHandler, this);
        this.map.off("draw:editresize", this._map_draw_changeHandler, this);
    },
    //=============编辑处理================
    currEditFeature: null,      //当前编辑的要素  
    startEditing: function (layer) {
        if (layer == null) return
        layer.editing.enable();
        this.currEditFeature = layer; 
    },
    stopEditing: function () {
        if (this.currEditFeature&& this.currEditFeature.editing &&  this.currEditFeature.editing.disable) {
            this.currEditFeature.editing.disable(); 
        }
        this.currEditFeature = null;
    },
    _map_clickHndler: function (e) {
        this.stopEditing();
    }, 
    _layerDraw_clickHndler: function (e) {
        if (e.layer != this.currEditFeature)
            this.stopEditing();

        this.startEditing(e.layer);
        L.DomEvent.stopPropagation(e); //停止冒泡
    },
    _map_draw_changeHandler: function (event) {
        var layer = this.currEditFeature;
   
        if(layer.type=="polyline"){
            if(layer.tipMarker){
                for (var j = 0; j < layer.tipMarker.length; j++) {
                    var tipMarker = layer.tipMarker[j];
                    tipMarker.remove();
                }
            }
            layer.tipMarker =[];

            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) { 
                var tipMarker = this._showLengthTipMarker(latlngs.slice(0,i+1)); 
                if (i == latlngs.length - 1) {
                    tipMarker._isend = true;
                    tipMarker._icon.innerHTML = "总长：" + tipMarker._icon.innerHTML;
                }
                layer.tipMarker.push(tipMarker);
            }
            this._showResultLength(latlngs); 
        }
        else{
            if(layer.tipMarker){
                layer.tipMarker.remove();
            }
            var latlngs = layer.getLatLngs()[0]; 
            this._showResultArea(latlngs);
             
            this._showAreaTipMarker(layer); 
        } 
    },
    //=============================
    clear: function () {
        this._stopDraw();
        this._last_length_val = 0;
        this._last_area_val = 0;
        this._length_tipmarker = []; 

        this.layerDraw.clearLayers();
        this.layerResult.clearLayers();
        return this;
    },
    _stopDraw: function () {
        this._length_tipmarker = []; 
        this.polylineControl.disable();
        this.polygonControl.disable();
    },
    _drawType: "",
    _drawParams: null,
    measureLength: function (param) {
        this._drawType = "length";
        this._drawParams = param;

        this._stopDraw();
        this.polylineControl.enable();
        return this;
    },
    measureArea: function (param) {
        this._drawType = "area";
        this._drawParams = param;

        this._stopDraw();
        this.polygonControl.enable();
        return this;
    },
    _map_draw_drawvertexHandler: function (event) {
        var dots = event.layers.getLayers();
 
        var result = {};
        if (this._drawType == "length") {
            var latlngs = [];
            for (var i = 0; i < dots.length; i++) {
                var dot = dots[i];
                var latlng = dot.getLatLng();
                latlngs.push(latlng);

                if (!dot.tipMarker) {
                    var tipMarker = this._showLengthTipMarker(latlngs);
                    this._length_tipmarker.push(tipMarker);
                    dot.tipMarker =tipMarker;
                }
            }
            this._showResultLength(latlngs);
        }
        else if (this._drawType == "area") {
            var latlngs = [];
            for (var i = 0; i < dots.length; i++) {
                var dot = dots[i];
                var latlng = dot.getLatLng();
                latlngs.push(latlng);
            }
            this._showResultArea(latlngs);
        }
    },
    _map_draw_createdHndler: function (event) {
        var layer = event.layer;
        layer.type =event.layerType;
        this.layerDraw.addLayer(layer);

        if (event.layerType == "polyline") {
            var latlngs = layer.getLatLngs(); 
            this._showResultLength(latlngs);

            var tipMarker = this._length_tipmarker[this._length_tipmarker.length - 1];
            tipMarker._isend = true;
            tipMarker._icon.innerHTML = "总长：" + tipMarker._icon.innerHTML;
            layer.tipMarker =this._length_tipmarker;
        }
        else if (event.layerType == "polygon") {
            var latlngs = layer.getLatLngs()[0]; 
            this._showResultArea(latlngs);
             
            this._showAreaTipMarker(layer);
        }

        if (this._drawParams && this._drawParams.drawend) {
            this._drawParams.drawend();
        }
        
        //this.stopEditing();
        //this.startEditing(layer);
    },
    _map_dblclickHndler: function (e) {
        L.DomEvent.stopPropagation(e); //停止冒泡
        if (this.polygonControl._enabled && this.polygonControl._finishShape) {
            this.polygonControl._finishShape();
        }
    },

    //
    _map_draw_drawing: function (e) {
        var layer = e.layer;
        var latlng = e.latlng;

        if (layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs().concat([latlng]);
            if (latlngs.length < 2) return;

            if (this._drawType == "length")
                this._showResultLength(latlngs);
            else
                this._showResultArea(latlngs);
        }

    },
    //长度测量结果
    _formatLength: function (val, danwei) {
        var valstr = "";
            
        if (danwei == null) {
            if (this._drawParams && this._drawParams.unit) {
                if (typeof (this._drawParams.unit) == "function")
                    danwei = this._drawParams.unit();
                else
                    danwei = this._drawParams.unit;
            }
            else {
                if (val < 1000)
                    danwei = "m";
                else
                    danwei = "km";
            }
        }
             
        if (danwei == "auto") {
            if (val < 1000)
                danwei = "m";
            else
                danwei = "km";
        }
        switch (danwei) { 
            default: 
            case "m":
                valstr = val.toFixed(0) + ' 米';
                break;
            case "km":
                valstr = (val * 0.001).toFixed(2) + ' 公里';
                break;
            case "mile":
                valstr = (val * 0.00054).toFixed(2) + ' 海里';
                break; 
            case "zhang":
                valstr = (val * 0.3).toFixed(2) + ' 丈';
                break;
        }
        return valstr;
    },
    _length_tipmarker: [],
    _showLengthTipMarker: function (latlngs) {
        //显示每个线段提示
        var text;
        var length;
        var length2D;
        if (latlngs.length == 1) { 
            text = "起点";
        }
        else {
            length = L.mars.measure.length(latlngs);
            text = this._formatLength(length);//总长
                 
            if (latlngs.length > 2) {
                length2D = L.mars.measure.length([latlngs[latlngs.length - 1], latlngs[latlngs.length - 2]]); 
                text += "<br>(+" + this._formatLength(length2D) + ")";//当前线段长 
            }
        }

        var tipMarker = L.marker(latlngs[latlngs.length - 1], {
            icon: L.divIcon({
                className: "leaflet-measuretool-result",
                html: text,
                iconSize: [null, null],
                iconAnchor: [-20, 12]
            })
        }).addTo(this.layerResult);
        tipMarker._length = length;
        tipMarker._length2D = length2D;
      
        return tipMarker;
    },
    updateLengthUnit: function (danwei) {
        var layers =this.layerDraw.getLayers();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if(layer.type!="polyline") continue;
             
            for (var j = 0; j < layer.tipMarker.length; j++) {
                var tipMarker = layer.tipMarker[j];
                if(tipMarker._length==null)continue;

                var text = this._formatLength(tipMarker._length, danwei);//总长
                if (tipMarker._length2D) {
                    text += "<br>(+" + this._formatLength(tipMarker._length2D, danwei)+")";//当前线段长 
                }

                if (tipMarker._isend)
                    tipMarker._icon.innerHTML = "总长：" + text;
                else
                    tipMarker._icon.innerHTML = text;
            }
        }   
    },
    _last_length_val: 0,
    _showResultLength: function (latlngs) {
        this._last_length_val = L.mars.measure.length(latlngs);
        var text = this._formatLength(this._last_length_val);

        if (this._drawParams && this._drawParams.showResult && typeof (this._drawParams.showResult) == "function")
            this._drawParams.showResult(text, this._last_length_val);
    }, 
    //面积测量结果
    _formatArea: function (val, danwei) {
        var valstr = "";

        if (danwei == null) {
            if (this._drawParams && this._drawParams.unit) {
                if (typeof (this._drawParams.unit) == "function")
                    danwei = this._drawParams.unit();
                else
                    danwei = this._drawParams.unit;
            }
            else {
                if (val < 1000000)
                    danwei = "m";
                else
                    danwei = "km";
            }
        }
        if (danwei == "auto") {
            if (val < 1000000)
                danwei = "m";
            else
                danwei = "km";
        }

        switch (danwei) { 
            default: 
            case "m":
                valstr = val.toFixed(0) + ' 平方米';
                break;
            case "km":
                valstr = (val / 1000000).toFixed(2) + ' 平方公里';
                break; 
            case "mu":
                valstr = (val * 0.0015).toFixed(2) + ' 亩';
                break; 
            case "ha":
                valstr = (val * 0.0001).toFixed(2) + ' 公顷';
                break;
        }
        return valstr;
    },
    _showAreaTipMarker: function (layer) {
        var latlng = layer.getCenter();
        var text = this._formatArea(this._last_area_val);

        var tipMarker = L.marker(latlng, {
            icon: L.divIcon({
                className: "leaflet-measuretool-result",
                html: text,
                iconSize: [null, 25],
                iconAnchor: [(text.length * 10) / 2, 12]
            })
        }).addTo(this.layerResult);
        tipMarker._area = this._last_area_val;

        layer.tipMarker = tipMarker; 

        return tipMarker;
    },
    updateAreaUnit: function (danwei) {
        var layers =this.layerDraw.getLayers();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if(layer.type!="polygon") continue;

            var tipMarker =layer.tipMarker;
            var text = this._formatArea(tipMarker._area,danwei);
            tipMarker._icon.innerHTML = text;
        } 
    },
    _last_area_val: 0,
    _showResultArea: function (latlngs) {

        this._last_area_val = L.mars.measure.area(latlngs);
        var text = this._formatArea(this._last_area_val);

        if (this._drawParams && this._drawParams.showResult && typeof (this._drawParams.showResult) == "function")
            this._drawParams.showResult(text, this._last_area_val);
    },
 



});




export default MeasureTool;