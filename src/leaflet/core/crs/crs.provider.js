import { TypeUtil } from "../util";
import Proj4 from "../proj";

/**
 * CRS Provider
 * @param {string | Object} crs string|Object|CRS
 */
export default function(crs) {
    crs = crs || "";

    if (TypeUtil.isString(crs)) {
        let name = "";
        // code, 4326
        if (!name && /^[0-9]{4,6}$/g.test(crs)) {
            name = `EPSG${crs}`;
        }

        let _crs = crs.toUpperCase();

        // EPSG3857
        if (!name && /^EPSG[0-9]{4}/g.test(_crs)) {
            name = _crs;
        }
        if (!name) {
            switch (_crs) {
                case "BD09":
                case "BAIDU": //百度
                    name = "Baidu";
                    break;
                case "GCJ":
                case "GCJ02": //国测局坐标系(如高德、谷歌)，主要标识需要纠偏
                default:
                    //球形墨卡托投影
                    name = "EPSG3857";
                    break;
            }
        }

        if (!L.CRS[name]) {
            L.logger.warn("不存在的坐标：" + name);
        }

        return L.CRS[name];
    }

    // CRS 实例
    if (
        crs.project &&
        crs.unproject &&
        typeof crs.project === "function" &&
        typeof crs.unproject === "function"
    ) {
        return crs;
    }

    // crs 定义
    if (crs.code && crs.proj4def && crs.options) {
        return new new Proj4.CRS(crs.code, crs.proj4def, crs.options)();
    }

    return null;
}
