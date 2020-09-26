/* 2017-12-7 17:26:01 | 修改 木遥（QQ：346819890） */

import { old_util as _util, Utils, http } from "@leaflet/core";
import _layer from "./layerUtil";

var createMap = function(opt) {
    if (opt.url) {
        http.get(opt.url)
            .then(config => {
                //map初始化
                var configdata = config.map;
                if (config.serverURL) configdata.serverURL = config.serverURL;
                if (opt.serverURL) configdata.serverURL = opt.serverURL;

                createMapByData(opt, configdata, config);
            })
            .catch(_ => {
                console.log(_)
                console.error("Json文件" + opt.url + "加载失败！");
            });
        return null;
    } else {
        if (opt.serverURL && opt.data) opt.data.serverURL = opt.serverURL;
        return createMapByData(opt, opt.data);
    }
};

function createMapByData(opt, configdata, jsondata) {
    if (configdata == null) {
        console.log("配置信息不能为空！");
        return;
    }

    //定位至地图上点标注时，当地图级别小于此值时自动放大至该级别
    configdata.centerAutoLevel = configdata.centerAutoLevel || 15;

    //中心点
    var center;
    if (configdata.extent) {
        var _x = (configdata.extent.xmin + configdata.extent.xmax) / 2;
        var _y = (configdata.extent.ymin + configdata.extent.ymax) / 2;
        center = [_y, _x];
    } else if (configdata.center && configdata.center.x) {
        center = [configdata.center.y, configdata.center.x];
    } else {
        center = configdata.center;
    }
    configdata.center = center;

    var cfg = _map(opt.id, configdata, opt);
    var map = cfg.map;

    if (!configdata.zoom) configdata.zoom = map.getZoom();

    //记录到全局变量，其他地方使用
    var gisdata = {};
    gisdata.config = configdata;
    gisdata.baselayers = cfg.baselayers;
    gisdata.overlayers = cfg.overlayers;
    gisdata.controls = cfg.controls;

    map.gisdata = gisdata;

    if (opt.success) opt.success(map, gisdata, jsondata);

    return map;
}

//图层相关处理类
function _map(id, configdata, options) {
    var map;

    //url传入的参数
    var requestParam = Utils.getParams();

    //============初始化地图============
    //基础底图处理
    var layersCfg = configdata.basemaps;

    //如果basemaps为空，使用默认配置
    //if (layersCfg == null || layersCfg.length == 0) {
    //    configdata.basemaps = _layer.getDefaultBaseLayers();
    //    layersCfg = configdata.basemaps;
    //}

    //坐标系判断处理
    configdata.crs = configdata.crs || "EPSG3857";
    var firstlayer;
    for (var i = 0; i < layersCfg.length; i++) {
        var item = layersCfg[i];
        if (item.crs == null && configdata.crs != null)
            item.crs = configdata.crs;

        if (item.hasOwnProperty("visible") && item.visible) {
            firstlayer = item;
        }
    }
    if (!firstlayer && layersCfg.length > 0) {
        firstlayer = layersCfg[0];
        firstlayer.visible = true;
    }

    //存在url传入指定的底图
    if (requestParam && requestParam.baselayer) {
        for (var i = 0; i < layersCfg.length; i++) {
            var item = layersCfg[i];
            if (item.name == requestParam.baselayer) {
                if (firstlayer) firstlayer.visible = false;

                firstlayer = item;
                firstlayer.visible = true;
                break;
            }
        }
    }

    if (firstlayer && firstlayer.crs != configdata.crs) {
        configdata.crs = firstlayer.crs;
    }

    //坐标系
    var crs;
    var pointconvertType;

    if (typeof configdata.crs == "string") {
        var crsstr = (configdata.crs || "").toString().toUpperCase();
        switch (crsstr) {
            default:
                //球形墨卡托投影
                crs = L.CRS.EPSG3857;
                break;
            case "IMAGE":
            case "SIMPLE": //单张图片
                crs = L.CRS.Simple;
                break;
            case "4326":
            case "EPSG4326": //WGS84坐标系
                crs = L.CRS.EPSG4326;
                break;
            case "3395":
            case "EPSG3395": //椭圆形墨卡托投影[不常用]
                crs = L.CRS.EPSG3395;
                break;
            case "4490":
            case "EPSG4490": //大地2000，天地图等，请引用tileLayer.tdt.js
                crs = L.CRS.EPSG4490;
                break;
            case "BD09":
            case "BAIDU": //百度，请引用tileLayer.baidu.js
                pointconvertType = "bd";
                crs = L.CRS.Baidu;
                break;
            case "GCJ":
            case "GCJ02": //国测局坐标系(如高德、谷歌)，主要标识需要纠偏
                pointconvertType = "gcj";
                crs = L.CRS.EPSG3857;
                break;
        }
    } else if (typeof configdata.crs == "object") {
        var _temp = {};

        for (var i in configdata.crs) {
            if (i == "code" || i == "proj") continue;
            if (i == "bounds") {
                _temp.bounds = L.bounds(configdata.crs.bounds);
                continue;
            }
            _temp[i] = configdata.crs[i];
        }

        crs = new L.Proj.CRS(configdata.crs.code, configdata.crs.proj, _temp);
    }

    //如果options未设置时的默认参数
    var defoptions = {
        crs: crs,
        zoomControl: false, //不用默认的
        attributionControl: false,
        pointconvertType: pointconvertType,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [
            {
                text: "移动到此处",
                iconCls: "fa fa-hand-o-right",
                callback: function(e) {
                    map.panTo(e.latlng);
                }
            },
            {
                text: "显示此处经纬度",
                iconCls: "fa fa-map-marker",
                callback: function(e) {
                    var inhtml = "层级：" + map.getZoom();
                    inhtml +=
                        "<br/>经度：" +
                        e.latlng.lng.toFixed(6) +
                        " 纬度：" +
                        e.latlng.lat.toFixed(6);

                    if (map.hasConvert()) {
                        var latlng = map.convert2wgs(e.latlng);
                        inhtml +=
                            "<br/>经度：" +
                            latlng[1].toFixed(6) +
                            " 纬度：" +
                            latlng[0].toFixed(6) +
                            " (WGS84)";
                    }
                    alert(inhtml);
                }
            },
            "-",
            {
                text: "放大",
                iconCls: "fa fa-search-plus",
                callback: function(e) {
                    map.zoomIn();
                }
            },
            {
                text: "缩小",
                iconCls: "fa fa-search-minus",
                callback: function(e) {
                    map.zoomOut();
                }
            }
        ]
    };

    //config中可以配置map所有options
    for (var key in configdata) {
        if (
            key === "crs" ||
            key === "controls" ||
            key === "basemaps" ||
            key === "operationallayers"
        )
            continue;

        defoptions[key] = configdata[key];
    }

    //赋默认值至options（如果已存在设置值跳过）
    if (options == null) options = {};
    for (var i in defoptions) {
        if (!options.hasOwnProperty(i)) {
            options[i] = defoptions[i];
        }
    }
    map = L.map(id, options);

    //存在url传参
    if (
        requestParam &&
        requestParam.center &&
        requestParam.center.indexOf(",") != -1
    ) {
        var arr = requestParam.center.split(",");
        if (arr.length == 2) {
            var latlng = map.convert2map([arr[0], arr[1]]);
            map.panTo(latlng);
        } else if (arr.length == 3) {
            var latlng = map.convert2map([arr[0], arr[1]]);
            map.setView(latlng, arr[2]);
        }
    }

    var orderlayers = []; //用于计算order顺序

    //地图底图图层
    var ctl_layers_base = {}; //用于图层控制控件
    var layersCfg = configdata.basemaps;
    if (layersCfg) {
        for (var i = 0; i < layersCfg.length; i++) {
            var item = layersCfg[i];

            var layer = _layer.createLayer(
                item,
                configdata.serverURL,
                options.layerToMap
            );
            if (layer == null) continue;

            //是否显示
            if (item.hasOwnProperty("visible") && item.visible) {
                layer.addTo(map);

                if (item.maxBounds) map.setMaxBounds(item.maxBounds);
                if (item.background)
                    $(".leaflet-container").css({
                        background: item.background
                    });
            }

            ctl_layers_base[item.name] = layer;

            //用于计算order顺序
            orderlayers.push(item);
            if (item.type == "group" && item.layers) {
                for (var idx = 0; idx < item.layers.length; idx++) {
                    orderlayers.push(item.layers[idx]);
                }
            } else {
                if (
                    item._layer instanceof L.LayerGroup ||
                    item._layer instanceof L.FeatureGroup
                ) {
                    var children = item._layer.getLayers();
                    for (var idx = 0; idx < children.length; idx++) {
                        var childlayer = children[idx];
                        var childitem = {
                            name: childlayer.options.name,
                            _layer: childlayer
                        };
                        orderlayers.push(childitem);
                    }
                }
            }
        }
    }
    //地图叠加层图层
    var ctl_layers_over = {}; //用于图层控制控件
    var layersCfg = configdata.operationallayers;
    if (layersCfg) {
        for (var i = 0; i < layersCfg.length; i++) {
            var item = layersCfg[i];

            var layer = _layer.createLayer(
                item,
                configdata.serverURL,
                options.layerToMap
            );
            if (layer == null) continue;

            //是否显示
            if (item.hasOwnProperty("visible") && item.visible)
                layer.addTo(map);

            ctl_layers_over[item.name] = layer;

            //用于计算order顺序
            orderlayers.push(item);
            if (item.type == "group" && item.layers) {
                for (var idx = 0; idx < item.layers.length; idx++) {
                    orderlayers.push(item.layers[idx]);
                }
            } else {
                if (
                    item._layer instanceof L.LayerGroup ||
                    item._layer instanceof L.FeatureGroup
                ) {
                    var children = item._layer.getLayers();
                    for (var idx = 0; idx < children.length; idx++) {
                        var childlayer = children[idx];
                        var childitem = {
                            name: childlayer.options.name,
                            _layer: childlayer
                        };
                        orderlayers.push(childitem);
                    }
                }
            }
        }
    }

    //初始化顺序字段,
    for (var i = 0; i < orderlayers.length; i++) {
        var item = orderlayers[i];

        //计算层次顺序
        var order = Number(item.order);
        if (isNaN(order)) order = (i + 1) * 10;
        item.order = order;

        //图层的处理
        if (item._layer != null) {
            if (item._layer.setZIndex) item._layer.setZIndex(order);
        }
    }

    if (configdata.center) {
        map.setView(configdata.center, configdata.zoom);
    }
    if (configdata.extent) {
        map.fitBounds([
            [configdata.extent.ymin, configdata.extent.xmin],
            [configdata.extent.ymax, configdata.extent.xmax]
        ]);
    }

    //点选后高亮
    if (configdata.clickHighlight) {
        var _last_ClickFeature;
        var _last_type;
        function clearClickFeature() {
            if (_last_ClickFeature) {
                if (_last_type == "arcgis_dynamic") {
                    map.removeLayer(_last_ClickFeature);
                } else {
                    var oldstyle = layer.options;
                    oldstyle.weight = oldstyle._weight_old;
                    oldstyle.color = oldstyle._color_old;
                    _last_ClickFeature.setStyle(oldstyle);
                }
                _last_ClickFeature = null;
            }
        }
        map.on("click", clearClickFeature);
        _layer.bindClickFeature(function(type, layer) {
            clearClickFeature();

            if (!layer.setStyle) return;

            if (type == "arcgis_dynamic") {
                layer.setStyle({ color: "#3388ff", weight: 3 });
                map.addLayer(layer);
            } else {
                var oldstyle = layer.options;
                if (oldstyle._color_old == null)
                    oldstyle._color_old = oldstyle.color;
                if (oldstyle._weight_old == null)
                    oldstyle._weight_old = oldstyle.weight;

                oldstyle.color = "#3388ff";
                oldstyle.weight = 3;
                layer.setStyle(oldstyle);
            }
            _last_ClickFeature = layer;
            _last_type = type;
        });
    }

    //===========模块对外公开的属性及方法=========
    return {
        map: map,
        baselayers: ctl_layers_base,
        overlayers: ctl_layers_over,
    };
}

export { createMap };
