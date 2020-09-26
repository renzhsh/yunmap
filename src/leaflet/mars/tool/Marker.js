/* 2017-11-24 14:04:22 | 修改 木遥（QQ：346819890） */
//通用点标记
var marker = (function (opt) {
    var that = {
        map: null,
        layerBase: null,
        layerPoint: null,
        layerText: null,
        textShowZoom: -1,	//在大于此级别时，显示文字，并且不聚合
        minZoom: -1,
        maxZoom: 99,
        init: function () {
            that.map = opt.map;
            that.minZoom = opt.minZoom || -1;
            that.maxZoom = opt.maxZoom || 99;
            that.textShowZoom = opt.textShowZoom || 15;
            that._visible = opt.hasOwnProperty('visible') ? opt.visible : true;

            that.layerBase = L.layerGroup([]);
            if (that._visible)
                that.map.addLayer(that.layerBase);

            that.layerText = L.featureGroup([]).addTo(that.layerBase);
            if (opt.isCluster)
                that.layerPoint = L.markerClusterGroup({
                    chunkedLoading: true,       //间隔添加数据，以便页面不冻结。
                    showCoverageOnHover: false, //是否显示聚合标记的边界。 
                    disableClusteringAtZoom:  that.textShowZoom //此级别下不聚合
                }).addTo(that.layerBase);
            else
                that.layerPoint = L.featureGroup([]).addTo(that.layerBase);


            that.map.on("zoomend", that.map_zoomendHandler);
            that.map_zoomendHandler();

            if (opt.click) {
                that.layerText.on('click', function (evt) {
                    opt.click(evt.layer.attribute,evt.layer);
                });
                that.layerPoint.on('click', function (evt) {
                    opt.click(evt.layer.attribute,evt.layer);
                });
            }

            if (opt.dblclick) {
                that.layerText.on('dblclick', function (evt) {
                    opt.dblclick(evt.layer.attribute,evt.layer);
                });
                that.layerPoint.on('dblclick', function (evt) {
                    opt.dblclick(evt.layer.attribute,evt.layer);
                });
            }
        },
        getLayer: function () {
            return this.layerBase;
        },
        map_zoomendHandler: function (e) { 
            if (!that._visible) return;

            var thisZoom = that.map.getZoom();

            if (that.minZoom <= thisZoom && thisZoom <= that.maxZoom) {
                that.map.addLayer(that.layerBase);
                that.updatePointSize(thisZoom);

                if (thisZoom >= that.textShowZoom) {
                    that.layerBase.addLayer(that.layerText);
                }
                else {
                    that.layerBase.removeLayer(that.layerText);
                }
            }
            else {
                that.map.removeLayer(that.layerBase);
            }
        },
        updatePointSize: function (zoom) {
            if (!opt.isAutoZoomSize) return;

            var levelBz =16;		 
            var ratio = map.getZoomScale(zoom, levelBz); 
            var scaleFactor = Math.pow(0.55, (zoom - levelBz));
            var size = ratio * scaleFactor;

            if (size > 1) size = 1;
             
            var arrmark = this.layerPoint.getLayers();
            for (var index = 0; index < arrmark.length; index++) {
                var marker = arrmark[index];

                var iconOptions = marker.options.icon.options;
                if (iconOptions.iconSize) {
                    if (!iconOptions.iconSizeDef)
                        iconOptions.iconSizeDef = [iconOptions.iconSize[0], iconOptions.iconSize[1]];
                    iconOptions.iconSize[0] = iconOptions.iconSizeDef[0] * size;
                    iconOptions.iconSize[1] = iconOptions.iconSizeDef[1] * size;
                }
                if (iconOptions.iconAnchor) {
                    if (!iconOptions.iconAnchorDef)
                        iconOptions.iconAnchorDef = [iconOptions.iconAnchor[0], iconOptions.iconAnchor[1]];
                    iconOptions.iconAnchor[0] = iconOptions.iconAnchorDef[0] * size;
                    iconOptions.iconAnchor[1] = iconOptions.iconAnchorDef[1] * size;
                }

                if (marker.options.icon instanceof L.DivIcon) {
                    marker.setIcon(L.divIcon(iconOptions));

                }
                else if (marker.options.icon instanceof L.Icon) {
                    marker.setIcon(L.icon(iconOptions)); 
                } 
            }
        },
        _visible: true,
        visible: function (val) {
            that._visible = val;
            if (val) {
                that.map.addLayer(that.layerBase);
                that.map_zoomendHandler();
            } else {
                that.map.removeLayer(that.layerBase);
            }
        },
        clear: function () {
            that.layerPoint.clearLayers();
            that.layerText.clearLayers();
        },
        _isBindPopup: false,
        _isBindTooltip: false,
        arrData: null,
        showData: function (arrdata, opt) {
            that.arrData = arrdata;
            that.clear();

            if (arrdata == null || arrdata.length == 0)
                return;

            opt = opt || {};
            opt.name = opt.name || {};

            var jdname = opt.name.jd || 'jd';
            var wdname = opt.name.wd || 'wd';
            var mcname = opt.name.mc || 'mc';


            $.each(arrdata, function (index, item) {
                var jd = item[jdname];
                var wd = item[wdname];
                var mc = item[mcname];

                if (isNaN(jd) || isNaN(wd) || jd == 0 || wd == 0) return;


                //图标点
                var icon;
                if (typeof (opt.icon) == "function") {
                    icon = opt.icon(item);
                }
                else {
                    icon = opt.icon;
                }


                var marker = L.marker([wd, jd], {
                    icon: icon
                });
                if (opt.bindPopup) {
                    that._isBindPopup = true;
                    var inhtml = opt.bindPopup(item);
                    marker.bindPopup(inhtml);
                }
                if (opt.bindTooltip) {
                    that._isBindTooltip = true;
                    var inhtml = opt.bindTooltip(item);
                    marker.bindTooltip(inhtml);
                }
                marker.attribute = item;
                that.layerPoint.addLayer(marker);

                item._marker_point = marker;

                //文字
                var fontsize = opt.fontsize || 13;
                var len = mc.replace(/[\u0391-\uFFE5]/g, "aa").length;
                var width = len * fontsize / 2;

                var top = 5;
                if (icon.options.iconSize && icon.options.iconSize.length > 1) {
                    top += (icon.options.iconSize[1] || 10);

                    if (icon.options.iconAnchor && icon.options.iconAnchor.length > 1) {
                        top -= (icon.options.iconAnchor[1] || 0);
                    }
                }

                marker = L.marker([wd, jd], {
                    icon: L.divIcon({
                        iconSize: [width, fontsize],
                        iconAnchor: [width / 2, -top],
                        className: 'leaflet-text-marker',
                        html: mc,
                    })
                });
                marker.attribute = item;
                that.layerText.addLayer(marker);

                item._marker_text = marker;

            });

            if (!opt.hasOwnProperty("isCenter"))
                opt.isCenter = true;

            if (opt.isCenter)
                map.fitBounds(that.layerPoint.getBounds());

            that.updatePointSize(map.getZoom());

            return that.layerPoint.getLayers();
        },
        getData:function(){
            return arrData;
        },
        //根据id主键获取指定的arrdata数组中的对象
        getItemById: function (id,idname) {
            idname =idname||"id";
            var arrdata = that.arrData;

            for (var index = 0; index < arrdata.length; index++) {
                var item = arrdata[index];
                if (item[idname] == id) {
                    return item;
                }
            }
            return null;
        },
        //根据id主键获取指定的图层中的Marker点标记对象
        getMarkerById: function (id, idname) {
            idname =idname||"id";

            var arrmark = that.layerPoint.getLayers();
            for (var index = 0; index < arrmark.length; index++) {
                var layer = arrmark[index];
                if (layer.attribute[idname] == id) {
                    return layer;
                }
            }
            return null;
        },
        lastCenter: null,
        lastCenterAnimation: null,
        centerAt: function (id, idname,hasAnimation) {
            that.clearCenter();

            var layer = that.getMarkerById(id, idname);
            if (layer == null) return false;

            var latlng = layer.getLatLng();
            that.map.centerAt(latlng);


            if (that._isBindTooltip)
                layer.openTooltip(latlng);
            if (that._isBindPopup)
                layer.openPopup(latlng);

            that.lastCenter = layer;

            //动画marker
            if(hasAnimation){
                var marker = L.marker(latlng, {
                    icon: L.divIcon({
                        className: '',
                        iconSize: [10, 10],
                        iconAnchor: [5, 5],
                        popupAnchor: [5, -5],
                        tooltipAnchor: [5, -5],
                        html: '<div class="centerat_animation" style="color:#0f89f5;"><p></p></div>'
                    })
                });
                that.map.addLayer(marker);
                that.lastCenterAnimation = marker;
                setTimeout(function () {
                    if (that.lastCenterAnimation != null) {
                        that.lastCenterAnimation.remove();
                        that.lastCenterAnimation = null;
                    }
                }, 6000); 
            } 
            return true;
        },
        clearCenter: function () {
            if (that.lastCenter != null) {
                if (that._isBindTooltip)
                    that.lastCenter.closeTooltip();
                if (that._isBindPopup)
                    that.lastCenter.closePopup();
                that.lastCenter = null;
            }
            if (that.lastCenterAnimation != null) {
                that.lastCenterAnimation.remove();
                that.lastCenterAnimation = null;
            }
        }

    };
    that.init();
    return that;
});
export default marker;