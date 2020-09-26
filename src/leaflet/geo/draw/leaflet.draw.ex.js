/* 2017-12-5 10:47:33 | 修改 木遥（QQ：346819890） */

// 工具栏汉化
L.drawLocal.draw.toolbar.actions = { title: '取消绘制', text: '取消' };
L.drawLocal.draw.toolbar.finish = { title: '完成绘制', text: '完成' };
L.drawLocal.draw.toolbar.undo = { title: '删除最后一个绘制的点', text: '删除最后的点' };
L.drawLocal.draw.toolbar.buttons = { polyline: '绘制折线', polygon: '绘制多边形', rectangle: '绘制矩形', circle: '绘制圆', marker: '标点' };

L.drawLocal.edit.toolbar.actions.save = { title: '保存修改.', text: '保存' };
L.drawLocal.edit.toolbar.actions.cancel = { title: '取消编辑，丢弃所有的修改', text: '取消' };
L.drawLocal.edit.toolbar.actions.clearAll = { title: '刪除所有要素', text: '刪除所有' };
L.drawLocal.edit.toolbar.buttons = { edit: '编辑要素', editDisabled: '没有需要编辑的要素', remove: '删除要素', removeDisabled: '没有需要删除的要素' };


L.drawLocal.draw.handlers.circle = { tooltip: { start: '单击并拖动到绘制圆' }, radius: '半径' };
L.drawLocal.draw.handlers.marker = { tooltip: { start: '单击地图标记点' } };
L.drawLocal.draw.handlers.polygon = { tooltip: { start: '单击开始绘制形状', cont: '单击继续绘制形状', end: '单击继续绘制，双击完成绘制' } };
L.drawLocal.draw.handlers.polyline = { error: '<strong>错误:</strong> 面积边缘不可交叉!', tooltip: { start: '单击开始画线', cont: '单击继续画线', end: '单击继续画线,双击完成绘制' } };
L.drawLocal.draw.handlers.rectangle = { tooltip: { start: '单击并拖动绘制矩形' } };
L.drawLocal.draw.handlers.simpleshape = { tooltip: { end: '释放鼠标完成绘图' } };
L.drawLocal.edit.handlers.edit = { tooltip: { text: '拖动标记或白色小框进行编辑修改', subtext: '' } };
L.drawLocal.edit.handlers.remove = { tooltip: { text: '单击目标进行删除' } };


//不要Marker注记的选中状态效果
L.Edit.Marker.prototype._toggleMarkerHighlight = function () { };

//文字注记
L.Draw.Text = L.Draw.Marker.extend({
    statics: {
        TYPE: 'text'
    },
    options: {
        repeatMode: false
    },
    initialize: function (map, options) {
        options = options || {};
        options.icon = this.getIcon();

        this.type = L.Draw.Text.TYPE;
        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },

    updateIcon: function (attr) {
        this.options.icon = this.getIcon(attr);
    },

    defaultIconAttr: {
        text: "文字",
        color: '#0081c2',
        font_size: 25,
        font_family: '黑体',
        font_style: 'normal',
        font_weight: 'normal',
        background: false,
        border: false
    },
    getIcon: function (attr) {
        attr = attr || this.defaultIconAttr;
        attr.text = attr.text || this.defaultIconAttr.text;

        var size = this.getTextSize(attr);
        var style = this.getTextCSS(attr);

        return L.divIcon({
            className: 'leaflet-text-marker',
            iconSize: [size.width, size.height],
            iconAnchor: [size.width / 2, size.height / 2],
            html: '<div style="' + style + '">' + attr.text + '</div>'
        });
    },
    getTextSize: function (attr) {
        var arr = attr.text.split("<br />");
        var maxWidth = -1;
        for (var i = 0; i < arr.length; i++) {
            var len = arr[i].replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
            if (len > maxWidth)
                maxWidth = len;
        }
        var width = (maxWidth * (attr.font_size || this.defaultIconAttr.font_size)) / 2 + 10;
        var height = arr.length * (attr.font_size || this.defaultIconAttr.font_size) * 1.5 + 10;
        return { width: width, height: height };
    },
    getTextCSS: function (attr) {
        var css = "display:table; padding:5px; color:" + (attr.color || this.defaultIconAttr.color)
			+ ";    font-size:" + (attr.font_size || this.defaultIconAttr.font_size)
			+ "px;  font-family:'" + (attr.font_family || this.defaultIconAttr.font_family)
			+ "';   font-style:" + (attr.font_style || this.defaultIconAttr.font_style)
			+ ";    font-weight:" + (attr.font_weight || this.defaultIconAttr.font_weight)
			+ ";";
        if (attr.background) {
            css += "background-color: " + attr.background_color + ";  ";
        }
        if (attr.border) {
            css += "border: " + attr.border_width + "px  " + attr.border_style + " " + attr.border_color + " ;  ";
        }
        return css;
    },
    //////////////////////////////
    _createMarker: function (latlng) {
        return new L.Marker(latlng, {
            draggable:true,
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset
        });
    },
    
    _onMouseMove: function (e) {
        var latlng = e.latlng;

        //this._tooltip.updatePosition(latlng);
        if (this._mouseMarker)
            this._mouseMarker.setLatLng(latlng);

        if (!this._marker) {
            this._marker = this._createMarker(latlng);
            // Bind to both marker and map to make sure we get the click event.
            this._marker.on('click', this._onClick, this);
            this._map
				.on('click', this._onClick, this)
				.addLayer(this._marker);
        }
        else {
            if (this._mouseMarker)
                latlng = this._mouseMarker.getLatLng();
            this._marker.setLatLng(latlng);
        }
    },

});





//FontMarker注记
L.Draw.FontMarker = L.Draw.Marker.extend({
    statics: {
        TYPE: 'font-marker'
    },
    initialize: function (map, options) {
        options = options || {};
        options.icon = this.getIcon();

        this.type = L.Draw.FontMarker.TYPE;
        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },


    updateIcon: function (attr) {
        this.options.icon = this.getIcon(attr);
    },

    defaultIconAttr: {
        size: 50,
        color: '#0081c2',
        iconClass: 'fa fa-crosshairs'
    },
    getIcon: function (attr) {
        attr = attr || this.defaultIconAttr;
        attr.size = attr.size || this.defaultIconAttr.size;
        attr.color = attr.color || this.defaultIconAttr.color;
        attr.iconClass = attr.iconClass || this.defaultIconAttr.iconClass;

        return L.divIcon({
            className: "",
            html: '<i class="' + attr.iconClass + '" style="color:' + attr.color + ';font-size:' + attr.size + 'px;"></i> ',
            iconSize: [attr.size + 2, attr.size + 2]
        });
    }

});



//ImageOverlay注记
L.ImageOverlay = L.ImageOverlay.extend({
    getLatLngs: function () {
        return this._boundsToLatLngs(this.getBounds());
    },
    _boundsToLatLngs: function (latLngBounds) {
        latLngBounds = L.latLngBounds(latLngBounds);
        return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
        ];
    },
    toGeoJSON: function () {
        var _latlngs = this.getLatLngs();

        var holes = !L.LineUtil.isFlat(_latlngs), multi = holes && !L.LineUtil.isFlat(_latlngs[0]);
        var coords = L.json.latLngsToCoords(_latlngs, multi ? 2 : holes ? 1 : 0, true);

        if (!holes) {
            coords = [coords];
        }

        return L.json.getFeature(this, {
            type: (multi ? 'Multi' : '') + 'Polygon',
            coordinates: coords
        });
    }
});


L.Draw.Image = L.Draw.Rectangle.extend({
    statics: {
        TYPE: 'image'
    },
    _defstyle: {
        weight: 1, fill: true, fillOpacity: 0.1, color: '#ffffff',
        showArea: false,
        clickable: true
    },
    options: {
        iconUrl: "",
        opacity: 1,
        metric: true
    },
    initialize: function (map, options) {
        this.type = L.Draw.Image.TYPE;

        this._initialLabelText = L.drawLocal.draw.handlers.rectangle.tooltip.start;
        L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
    },

    _drawShape: function (latlng) {
        if (!this._shape) {
            //this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this._defstyle);
            this._shape = new L.ImageOverlay(this.options.iconUrl, new L.LatLngBounds(this._startLatLng, latlng), { opacity: this.options.opacity });

            this._map.addLayer(this._shape);
        } else {
            this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
        }
    },

    _fireCreatedEvent: function () {
        var rectangle = new L.Rectangle(this._shape.getBounds(), this._defstyle);
        imageOverlay = new L.ImageOverlay(this.options.iconUrl, this._shape.getBounds(), { opacity: this.options.opacity });
        rectangle._imageOverlay = imageOverlay;

        L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, rectangle);
    }
});


/** 自由绘制线   */
L.Draw.Polylinefree = L.Draw.SimpleShape.extend({
    statics: {
        TYPE: 'polylinefree'
    },
    options: {
        allowIntersection: true,
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 4,
            opacity: 0.5,
            fill: false,
            clickable: true
        },
        nautic: false, // When not metric, not feet use nautic mile for display
    },

    // @method initialize(): void
    initialize: function (map, options) {

        // Merge default drawError options with custom options
        if (options && options.drawError) {
            options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
        }

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.Polylinefree.TYPE;

        L.Draw.Feature.prototype.initialize.call(this, map, options);
    },

    _onMouseMove: function (e) {
        if (this._isDrawing) {
            this._drawShape(e.latlng);
        }
    },

    _drawShape: function (latlng) {
        if (!this._shape) {
            this._shape = new L.Polyline([], this.options.shapeOptions);
            this._map.addLayer(this._shape);
        } else {
            this._shape.addLatLng(latlng);
        }
    },

    _fireCreatedEvent: function () {
        var poly = new L.Polyline(this._shape.getLatLngs(), this.options.shapeOptions);
        L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
    }
});
