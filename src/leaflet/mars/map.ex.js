/* 2017-11-25 17:39:44 | 修改 木遥（QQ：346819890） */
import { old_util as _util } from "@leaflet/core";

import { Proj } from "@leaflet/core";
var pointconvert = Proj;
L.Map.include({
    setConvertType: function(type) {
        this.options.pointconvertType = type;
    },
    getConvertType: function() {
        return this.options.pointconvertType;
    },
    hasConvert: function() {
        var pointconvertType = this.options.pointconvertType;
        return pointconvertType == "gcj" || pointconvertType == "bd";
    },

    //在不同坐标系情况下，转换“目标坐标值”至“地图坐标系”一致
    convert2map: function(latlng) {
        var jd;
        var wd;
        if (latlng.lng && latlng.lat) {
            jd = latlng.lng;
            wd = latlng.lat;
        } else {
            jd = latlng[1];
            wd = latlng[0];
        }

        if (this.options.pointconvertType == "gcj") {
            var coordinate = pointconvert.wgs2gcj([jd, wd]);
            jd = coordinate[0];
            wd = coordinate[1];
        } else if (this.options.pointconvertType == "bd") {
            var coordinate = pointconvert.wgs2bd([jd, wd]);
            jd = coordinate[0];
            wd = coordinate[1];
        }

        return [wd, jd];
    },

    //在不同坐标系情况下 ，获取地图上的坐标后，转为wgs标准坐标系坐标值
    convert2wgs: function(latlng) {
        var jd;
        var wd;
        if (latlng.lng && latlng.lat) {
            jd = latlng.lng;
            wd = latlng.lat;
        } else {
            jd = latlng[1];
            wd = latlng[0];
        }

        if (this.options.pointconvertType == "gcj") {
            var coordinate = pointconvert.gcj2wgs([jd, wd]);
            jd = coordinate[0];
            wd = coordinate[1];
        } else if (this.options.pointconvertType == "bd") {
            var coordinate = pointconvert.bd2wgs([jd, wd]);
            jd = coordinate[0];
            wd = coordinate[1];
        }

        return [wd, jd];
    },

    //定位地图至目标点（传入值为地图相同坐标系）
    centerAt: function(center, options) {
        var level = this.getZoom();
        if (
            this.gisdata &&
            this.gisdata.config &&
            this.gisdata.config.centerAutoLevel
        ) {
            var autolevel = this.gisdata.config.centerAutoLevel;
            if (level < autolevel && this.getMaxZoom() >= autolevel) {
                level = autolevel;
            }
        }

        this.stop();
        this.setView(center, level, options);

        return this;
    },

    centerAtLayer: function(layer) {
        if (layer instanceof L.Marker) {
            this.centerAt(layer.getLatLng());
        } else if (layer instanceof L.CircleMarker) {
            this.centerAt(layer.getLatLng());
        } else if (layer instanceof L.Circle) {
            this.fitBounds(layer.getBounds());
        } else if (layer instanceof L.Rectangle) {
            this.fitBounds(layer.getBounds());
        } else if (layer instanceof L.Polygon) {
            this.fitBounds(layer.getBounds());
        } else if (layer instanceof L.Polyline) {
            this.fitBounds(layer.getBounds());
        } else if (layer instanceof L.LayerGroup) {
            this.fitBounds(layer.getBounds());
        } else if (layer instanceof L.FeatureGroup) {
            this.fitBounds(layer.getBounds());
        } else {
            if (layer.getLatLng) this.centerAt(layer.getLatLng());
            else if (layer.getBounds) this.fitBounds(layer.getBounds());
        }
        return this;
    },
    //回到默认区域
    goHomeExtent: function() {
        if (
            this.gisdata == null ||
            this.gisdata.config == null ||
            this.gisdata.config.center == null
        )
            return;
        this.setView(this.gisdata.config.center, this.gisdata.config.zoom);
        return this;
    },

    //修改地图底图
    changeBaseMap: function(nameorindex) {
        if (
            this.gisdata == null ||
            this.gisdata.config == null ||
            this.gisdata.config.basemaps == null
        )
            return;

        var layer;
        var deflayer; //容错处理，参数传入有误时，显示第1个底图
        for (var i = 0; i < this.gisdata.config.basemaps.length; i++) {
            var item = this.gisdata.config.basemaps[i];

            if (item.name == null || item.name == "" || item._layer == null)
                continue;
            if (deflayer == null) deflayer = item._layer;

            if (nameorindex == i || item.name == nameorindex)
                layer = item._layer;

            if (this.hasLayer(item._layer)) {
                this.removeLayer(item._layer);
            }
        }

        return this;
    },

    //获取指定图层 keyname默认为名称
    getLayer: function(key, keyname) {
        var arr = this.getLayers(key, keyname);
        if (arr.length == 0) return null;
        return arr[0];
    },
    getLayers: function(key, keyname) {
        var arr = [];
        if (keyname == null) keyname = "name";

        var layersCfg = this.gisdata.config.basemaps;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item == null || item[keyname] != key) continue;
                arr.push(item._layer);
            }
        }

        layersCfg = this.gisdata.config.operationallayers;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item == null || item[keyname] != key) continue;
                arr.push(item._layer);
            }
        }
        return arr;
    },

    getConfig: function() {
        return Object.assign({}, this.gisdata.config);
    }
});

//修改leaft原生比例尺控件
//L.Control.Scale.prototype._updateScale = function (scale, text, ratio) {
//    scale.style.width = Math.round(this.options.maxWidth) + 'px';
//    scale.innerHTML = " 1cm : " + text;
//};
