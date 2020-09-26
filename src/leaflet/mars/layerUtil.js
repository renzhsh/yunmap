/* 2017-12-7 08:51:42 | 修改 木遥（QQ：346819890） */

//创建地图底图
function createLayer(item, serverURL, layerToMap) {
    var layer;

    if (item.url) {
        if (serverURL) {
            item.url = item.url.replace("$serverURL$", serverURL);
        }
        item.url = item.url
            .replace("$hostname$", location.hostname)
            .replace("$host$", location.host);
    }
    if (item.crs) {
        item._crs = item.crs;
        item.crs = null;
    }

    switch (item.type) {
        //===============地图数组====================
        // case "group":
        //     //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
        //     if (item.layers && item.layers.length > 0) {
        //         var arrVec = [];
        //         for (var index = 0; index < item.layers.length; index++) {
        //             var temp = item.layers[index];
        //             if (!temp.crs && item._crs) temp.crs = item._crs;

        //             var layer = createLayer(temp, serverURL, layerToMap);
        //             if (layer == null) continue;
        //             if (temp.hasOwnProperty("visible") && !temp.visible)
        //                 continue;

        //             arrVec.push(layer);
        //         }
        //         layer = L.layerGroup(arrVec);
        //     }

        //     break;
        //===============地图底图====================
        // case "image":
        //     layer = L.imageOverlay(
        //         item.url,
        //         item.bounds || [
        //             [0, 0],
        //             [1000, 1000]
        //         ]
        //     );
        //     break;
        // case "tile":
        //     layer = L.tileLayer(item.url, item);
        //     break;
        // case "wms":
        //     layer = L.tileLayer.wms(item.url, item);
        //     break;
        // case "wmts":
        //     layer = L.tileLayer.wmts(item.url, item);
        //     break;
        case "arcgis_cache": //arcgis http 切片
            //示例：{ "type": "arcgis_cache", "url": "http://127.0.0.1:8888/mapcache/china_mercator_vec", "name": "矢量" }
            layer = L.tileLayer.arcGISTile(item.url, item);
            break;
        case "arcgis_tile": //arcgis
            //layer = L.tileLayer(item.url + '/tile/{z}/{y}/{x}', item);
            layer = L.esri.tiledMapLayer(item);
            break;
        case "arcgis_image": //arcgis
            layer = L.esri.imageMapLayer(item);
            break;

        case "arcgis_dynamic": //arcgis
            var newopts = {};
            for (var key in item) {
                if (key == "popup" || key == "columns" || key == "symbol")
                    continue;
                newopts[key] = item[key];
            }
            layer = L.esri.dynamicMapLayer(newopts);

            if (item.popup || item.columns) {
                if (
                    item.popup &&
                    typeof item.popup === "string" &&
                    item.popup.endsWith(".html")
                ) {
                    $.ajax({
                        url: item.popup,
                        type: "GET",
                        dataType: "html",
                        success: function(data) {
                            item.popup = data;
                        }
                    });
                }
                layer.bindPopup(
                    function(error, featureCollection, response) {
                        if (layer.hasOwnProperty("isPopup") && !layer.isPopup)
                            return;

                        if (error != null && error.code > 0) {
                            L.logger.error(error.message);
                            return false;
                        }
                        if (featureCollection.features.length == 0)
                            return false;

                        if (_calbackClickFeature) {
                            var layers = L.geoJSON(
                                featureCollection
                            ).getLayers();
                            _calbackClickFeature(
                                "arcgis_dynamic",
                                layers[layers.length - 1]
                            );
                        }

                        var attr =
                            featureCollection.features[
                                featureCollection.features.length - 1
                            ].properties;
                        return getPopupByConfig(item, attr);
                    },
                    { maxWidth: 600 }
                );
            }

            break;
        case "arcgis_feature": //arcgis
            layer = L.esri.featureLayer(processArcgisFeatureConfig(item));
            if (item.popup || item.columns) {
                if (
                    item.popup &&
                    typeof item.popup === "string" &&
                    item.popup.endsWith(".html")
                ) {
                    $.ajax({
                        url: item.popup,
                        type: "GET",
                        dataType: "html",
                        success: function(data) {
                            item.popup = data;
                        }
                    });
                }

                layer.bindPopup(
                    function(evt) {
                        if (layer.hasOwnProperty("isPopup") && !layer.isPopup)
                            return;

                        if (_calbackClickFeature)
                            _calbackClickFeature("arcgis_feature", evt);

                        var attr = evt.feature.properties;
                        return getPopupByConfig(item, attr);
                    },
                    { maxWidth: 600 }
                );
            }
            if (item.tooltip) {
                layer.bindTooltip(
                    function(evt) {
                        var attr = evt.feature.properties;
                        return getTooltipByConfig(item, attr);
                    },
                    { className: "leafletlayer-tooltip", direction: "top" }
                );
            }
            break;

        case "geojson":
            layer = L.geoJSON(null, processArcgisFeatureConfig(item));
            if (item.popup || item.columns) {
                if (
                    item.popup &&
                    typeof item.popup === "string" &&
                    item.popup.endsWith(".html")
                ) {
                    $.ajax({
                        url: item.popup,
                        type: "GET",
                        dataType: "html",
                        success: function(data) {
                            item.popup = data;
                        }
                    });
                }

                layer.bindPopup(
                    function(evt) {
                        if (layer.hasOwnProperty("isPopup") && !layer.isPopup)
                            return;

                        if (_calbackClickFeature)
                            _calbackClickFeature("arcgis_feature", evt);

                        var attr = evt.feature.properties;
                        return getPopupByConfig(item, attr);
                    },
                    { maxWidth: 600 }
                );
            }
            if (item.tooltip) {
                layer.bindTooltip(
                    function(evt) {
                        var attr = evt.feature.properties;
                        return getTooltipByConfig(item, attr);
                    },
                    { className: "leafletlayer-tooltip", direction: "top" }
                );
            }

            if (item.data) {
                layer.addData(item.data);
            } else if (item.url) {
                $.ajax({
                    url: item.url,
                    data: item.filter || {},
                    type: item.ajaxType || "get",
                    dataType: "json",
                    success: function(data) {
                        layer.addData(data);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("Json文件" + item.url + "加载失败！");
                    }
                });
            }

            break;
        //===============互联网常用地图====================
        // 示例：{ "name": "天地图电子", "type": "www_tdt", "layer": "vec" }
    }

    if (layerToMap) {
        var _temp = layerToMap(item, layer);
        if (_temp) layer = _temp;
    }

    if (layer == null) {
        if (item.type != "group")
            console.log("配置中的图层未处理：" + (item.name ? item.name : ""));
    } else {
        layer.config = item;
        layer.name = item.name;

        //这句话，vue或部分架构中要注释，会造成内存溢出。
        item._layer = layer;
    }

    if (item._crs) {
        item.crs = item._crs;
        delete item._crs;
    }

    return layer;
}

//处理argis或geojson等图层popup和tooltip
function getPopupByConfig(cfg, attr) {
    var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;

    if (cfg.popup) {
        return getPopup(cfg.popup, attr, _title);
    } else if (cfg.columns) {
        return getPopup(cfg.columns, attr, _title);
    }
    return false;
}
function getTooltipByConfig(cfg, attr) {
    var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;

    if (cfg.tooltip) {
        return getPopup(cfg.tooltip, attr, _title);
    }
    return false;
}

//获取Popup或Tooltip格式化字符串
function getPopup(cfg, attr, title) {
    title = title || "";

    if (L.Util.isArray(cfg)) {
        //数组
        var countsok = 0;
        var inhtml =
            '<div class="mars-popup-titile">' +
            title +
            '</div><div class="mars-popup-content" >';
        for (var i = 0; i < cfg.length; i++) {
            var thisfield = cfg[i];

            if (thisfield.type == "details") {
                //详情按钮
                var showval = $.trim(attr[thisfield.field || "OBJECTID"]);
                if (
                    showval == null ||
                    showval == "" ||
                    showval == "Null" ||
                    showval == "Unknown"
                )
                    continue;

                inhtml +=
                    '<div style="text-align: center;padding: 10px 0;"><button type="button" onclick="' +
                    thisfield.calback +
                    "('" +
                    showval +
                    '\');" " class="btn btn-info  btn-sm">' +
                    (thisfield.name || "查看详情") +
                    "</button></div>";
                continue;
            }

            var showval = $.trim(attr[thisfield.field]);
            if (!thisfield.hasOwnProperty("show") || !thisfield.show) {
                if (
                    showval == null ||
                    showval == "" ||
                    showval == "Null" ||
                    showval == "Unknown" ||
                    showval == "0" ||
                    showval.length == 0
                )
                    continue;
            }

            if (thisfield.format) {
                //格式化
                try {
                    showval = eval(thisfield.format + "('" + showval + "')");
                } catch (e) {
                    console.log("getPopupByConfig error:" + thisfield.format);
                }
            }
            if (thisfield.unit) {
                showval += thisfield.unit;
            }

            inhtml +=
                "<div><label>" +
                thisfield.name +
                "</label>" +
                (showval || "") +
                "</div>";
            countsok++;
        }
        inhtml += "</div>";

        if (countsok == 0) return false;
        return inhtml;
    } else if (typeof cfg === "object") {
        //对象,type区分逻辑
        switch (cfg.type) {
            case "iframe":
                var _url = L.Util.template(cfg.url, attr);

                var inhtml =
                    '<iframe id="ifarm" src="' +
                    _url +
                    '"  style="width:' +
                    (cfg.width || "300") +
                    "px;height:" +
                    (cfg.height || "300") +
                    'px;overflow:hidden;margin:0;" scrolling="no" frameborder="0" ></iframe>';
                return inhtml;
                break;
            case "javascript":
                //回调方法
                return eval(cfg.calback + "(" + JSON.stringify(attr) + ")");
                break;
        }
    } else if (cfg == "all") {
        //全部显示
        var countsok = 0;
        var inhtml =
            '<div class="mars-popup-titile">' +
            title +
            '</div><div class="mars-popup-content" >';
        for (var col in attr) {
            if (col == "Shape" || col == "FID" || col == "OBJECTID") continue; //不显示的字段

            var showval = $.trim(attr[col]);
            if (
                showval == null ||
                showval == "" ||
                showval == "Null" ||
                showval == "Unknown" ||
                showval == "0" ||
                showval.length == 0
            )
                continue; //不显示空值，更美观友好

            inhtml += "<div><label>" + col + "</label>" + showval + "</div>";
            countsok++;
        }
        inhtml += "</div>";

        if (countsok == 0) return false;
        return inhtml;
    } else {
        //格式化字符串
        return L.Util.template(cfg, attr);
    }

    return false;
}

function processArcgisFeatureConfig(item) {
    var newopts = {};
    for (var key in item) {
        if (key == "popup" || key == "columns" || key == "symbol") continue;
        newopts[key] = item[key];
    }

    if (item.symbol && item.symbol.iconOptions) {
        //点图层
        newopts.pointToLayer = function(geojson, latlng) {
            var attr = geojson.properties;
            var markopt = getMarkerOptionsByConfig(item, attr);
            return L.marker(latlng, markopt);
        };
    }

    if (item.symbol && item.symbol.styleOptions) {
        //线面图层
        newopts.style = function(geojson) {
            var attr = geojson.properties;
            var styleOpt = getPolyOptionsByConfig(item, attr);
            return styleOpt;
        };
    }

    //坐标系转换
    newopts.coordsToLatLng = function(coords) {
        if (window.map && window.map.convert2map) {
            var point = map.convert2map({ lat: coords[1], lng: coords[0] });
            return new L.LatLng(point[0], point[1], coords[2]);
        } else {
            return new L.LatLng(coords[1], coords[0], coords[2]);
        }
    };

    return newopts;
}

function getMarkerOptionsByConfig(item, attr, isselected) {
    var markopt = item.symbol;
    var icoOpt = $.extend({}, item.symbol.iconOptions);
    if (markopt.iconField) {
        //存在多个symbol，按iconField进行分类
        var iconFieldVal = attr[markopt.iconField];
        var icoOptField = item.symbol.iconFieldOptions[iconFieldVal];
        if (icoOptField != null) {
            icoOpt = $.extend({}, icoOpt);
            icoOpt = $.extend(icoOpt, icoOptField);
        }
    }
    if (isselected && icoOpt.iconUrlForSelect) {
        icoOpt.iconUrl = icoOpt.iconUrlForSelect;
    }

    if (icoOpt.hasOwnProperty("iconUrl")) {
        markopt.icon = L.icon(icoOpt);
    } else if (icoOpt.hasOwnProperty("iconFont")) {
        var fontsize = 20;
        if (icoOpt.hasOwnProperty("iconSize")) fontsize = icoOpt.iconSize[0];
        var color = icoOpt.color || "#000000";

        icoOpt.className = "";
        icoOpt.html =
            '<i class="' +
            icoOpt.iconFont +
            '" style="color:' +
            color +
            ";font-size:" +
            fontsize +
            'px;"></i> ';
        markopt.icon = L.divIcon(icoOpt);
    } else {
        var color = icoOpt.color || "#0f89f5";
        var inhtml =
            '<div class="centerat_animation" style="color:' +
            color +
            ';"><p></p></div>';
        if (markopt.nameField) {
            var name = attr[markopt.nameField];
            inhtml +=
                ' <div class="layer_divicon_name" style="top: 2px;left: 25px;" >' +
                name +
                "</div>";
        }

        markopt.icon = L.divIcon({
            className: "",
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            popupAnchor: [5, -5],
            tooltipAnchor: [5, -5],
            html: inhtml
        });
    }

    return markopt;
}
function getPolyOptionsByConfig(item, attr) {
    var polyopt = item.symbol;
    var styleOpt = item.symbol.styleOptions;

    if (polyopt.styleField) {
        //存在多个symbol，按styleField进行分类
        var styleFieldVal = attr[polyopt.styleField];
        var styleOptField = item.symbol.styleFieldOptions[styleFieldVal];
        if (styleOptField != null) {
            styleOpt = Object.assign({}, styleOpt);
            styleOpt = $.extend(styleOpt, styleOptField);
        }
    }

    return styleOpt;
}

//克隆图层
function cloneLayer(layer) {
    var options = cloneOptions(layer.options);

    // we need to test for the most specific class first, i.e.
    // Circle before CircleMarker

    // Renderers
    if (layer instanceof L.SVG) {
        return L.svg(options);
    }
    if (layer instanceof L.Canvas) {
        return L.canvas(options);
    }

    //mars layer
    if (layer.config && layer.config.type) {
        var config = {};
        for (var i in layer.config) {
            if (i == "_layer") continue;
            config[i] = layer.config[i];
        }
        return createLayer(config);
    }

    // Tile layers
    if (
        options.type == "arcgis_cache" ||
        layer instanceof L.TileLayer.ArcGISTile
    ) {
        return L.tileLayer.arcGISTile(options.url, options);
    }
    if (options.type == "wmts" || layer instanceof L.TileLayer.WMTS) {
        return L.tileLayer.wmts(layer._url, options);
    }
    if (options.type == "wms" || layer instanceof L.TileLayer.WMTS) {
        return L.tileLayer.wmts(layer._url, options);
    }
    if (layer instanceof L.TileLayer) {
        return L.tileLayer(layer._url, options);
    }

    if (layer instanceof L.ImageOverlay) {
        return L.imageOverlay(layer._url, layer._bounds, options);
    }

    // Marker layers
    if (layer instanceof L.Marker) {
        return L.marker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Circle) {
        return L.circle(layer.getLatLng(), layer.getRadius(), options);
    }
    if (layer instanceof L.CircleMarker) {
        return L.circleMarker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Rectangle) {
        return L.rectangle(layer.getBounds(), options);
    }
    if (layer instanceof L.Polygon) {
        return L.polygon(layer.getLatLngs(), options);
    }
    if (layer instanceof L.Polyline) {
        return L.polyline(layer.getLatLngs(), options);
    }

    if (layer instanceof L.GeoJSON) {
        return L.geoJson(layer.toGeoJSON(), options);
    }

    if (layer instanceof L.LayerGroup) {
        return L.layerGroup(cloneInnerLayers(layer));
    }
    if (layer instanceof L.FeatureGroup) {
        return L.FeatureGroup(cloneInnerLayers(layer));
    }

    throw "Unknown layer, cannot clone this layer. Leaflet-version: " +
        L.version;
}
function cloneOptions(options) {
    var ret = {};
    for (var i in options) {
        var item = options[i];
        if (item && item.clone) {
            ret[i] = item.clone();
        } else if (item instanceof L.Layer) {
            ret[i] = cloneLayer(item);
        } else {
            ret[i] = item;
        }
    }
    return ret;
}
function cloneInnerLayers(layer) {
    var layers = [];
    layer.eachLayer(function(inner) {
        layers.push(cloneLayer(inner));
    });
    return layers;
}

function getLatlngs(layer) {
    if (
        layer instanceof L.Marker ||
        layer instanceof L.Circle ||
        layer instanceof L.CircleMarker
    ) {
        var latlng = layer.getLatLng();
        return [latlng];
    }
    if (layer instanceof L.Rectangle) {
        //return layer.getLatLngs();
        var _bounds = layer.getBounds();
        return [_bounds.getNorthWest(), _bounds.getSouthEast()];
    }
    if (layer instanceof L.Polygon) {
        var arr = layer.getLatLngs();
        if (arr.length == 0) return arr;
        return arr[0];
    }
    if (layer instanceof L.Polyline) {
        var arr = layer.getLatLngs();
        return arr;
    }
    return [];
}

function getDefaultBaseLayers() {
    return [
        {
            name: "高德地图",
            type: "www_gaode",
            layer: "vec",
            icon: "bingmap.png",
            visible: true,
            crs: "gcj"
        },
        {
            name: "高德卫星",
            type: "www_gaode",
            layer: "img",
            icon: "bingimage.png",
            crs: "gcj"
        },
        {
            name: "谷歌地图",
            type: "www_google",
            layer: "vec",
            icon: "googlemap.png",
            crs: "gcj"
        },
        {
            name: "谷歌卫星",
            type: "www_google",
            layer: "img",
            icon: "googleimage.png",
            crs: "gcj"
        },
        {
            name: "天地图",
            type: "www_tdt",
            layer: "vec",
            icon: "tianditumap.png",
            crs: "EPSG3857"
        },
        {
            name: "天地图卫星",
            type: "www_tdt",
            layer: "img",
            icon: "tiandituimage.png",
            crs: "EPSG3857"
        }
    ];
}

function isInPoly(layer, latlng) {
    if (layer instanceof L.Circle) {
        return isInCircle(layer, latlng);
    }
    if (layer instanceof L.Rectangle) {
        return isInRect(layer, latlng);
    }
    if (layer instanceof L.Polygon) {
        return isInPolygon(layer, latlng);
    }
}

function isInCircle(circle, latlng) {
    var radius = circle.getRadius();
    var circleCenterPoint = circle.getLatLng();
    var isInCircleRadius =
        Math.abs(circleCenterPoint.distanceTo(latlng)) <= radius;
    return isInCircleRadius;
}

function isInRect(rect, latlng) {
    var bounds = rect.getBounds();
    return bounds.contains(latlng);
}

function testisInPoly(x, y, coords) {
    var inside = false;
    for (var i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        var xi = coords[i].lat,
            yi = coords[i].lng;
        var xj = coords[j].lat,
            yj = coords[j].lng;
        var intersect =
            yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

function isInPolygon(poly, latlng) {
    var coords = poly.getLatLngs();
    var insidePoly = false;
    for (var i = 0; i < coords.length; i++) {
        if (testisInPoly(latlng.lat, latlng.lng, coords[i])) {
            insidePoly = true;
        }
    }
    return insidePoly;
}

//内部使用，map.js调用
var _calbackClickFeature;
function bindClickFeature(calback) {
    _calbackClickFeature = calback;
}

//===========模块对外公开的属性及方法=========
export default {
    createLayer,
    cloneLayer,
    getDefaultBaseLayers,
    isInPoly,
    getLatlngs,
    getPopup,
    getPopupByConfig,
    getMarkerOptionsByConfig,
    getPolyOptionsByConfig,
    bindClickFeature
};
