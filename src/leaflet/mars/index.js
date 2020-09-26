//===========模块对外公开的属性及方法=========
// exports.measure = require("./measure.js").default;

// //需要new的类
// exports.Marker = require("./tool/Marker.js").default;
// exports.Draw = require("./tool/Draw.js").default;
// exports.MeasureTool = require("./tool/MeasureTool.js").default;

import { createMap } from "./mapUtil";
import "./map.css";

// import { pointconvert } from "@leaflet/geo/proj";
// import { old_util as _util } from "@leaflet/core";
import layerUtil from "./layerUtil";

import "./map.ex.js";

export default {
    name: "Leaflet二维地图框架",
    author: "ahygis",
    version: "1.5",
    createMap: createMap,
    // pointconvert: pointconvert,
    // util: _util,
    layer: layerUtil
};
