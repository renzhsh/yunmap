import L from "leaflet";

/**
 * 坐标系定义参考 https://www.cnblogs.com/tuboshu/p/10752287.html
 *
 * EPSG查询： https://epsg.io/
 * 
 * Proj4leaflet https://github.com/kartena/Proj4Leaflet
 */

import Baidu from "./crs.baidu";
import EPSG4490 from "./crs.4490";

import crsProvider from "./crs.provider";

L.CRS.EPSG4490 = EPSG4490; // 大地2000坐标系
L.CRS.Baidu = Baidu;
L.CRS.Provider = crsProvider;

export default L.CRS;
