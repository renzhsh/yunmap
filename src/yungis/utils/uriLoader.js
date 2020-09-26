import { isUtil, logger } from "./index";
import { version } from "../version";
/**
 * 默认本地资源
 */
const libpath = "/lib/";
const libMap = {
    "font-awesome": [libpath + "fonts/font-awesome/css/font-awesome.min.css"],
    "web-icons": [libpath + "fonts/web-icons/web-icons.css"],
    echarts: [libpath + "echarts/echarts.min.js", libpath + "echarts/dark.js"],
    "echarts-gl": [libpath + "echarts/echarts-gl.min.js"],
    "echarts-forleaflet": [libpath + "echarts/forleaflet/echarts-3.4.min.js"],
    mapV: [libpath + "mapV/mapv.min.js"],
    "esri-leaflet": [libpath + "leafletPlugins/esri/esri-leaflet.js"],
    "leaflet-wfs": [libpath + "leafletPlugins/wfs/leaflet-wfs.js"],
    "leaflet-mars": [
        libpath + "leaflet-mars/leaflet.css",
        libpath + "leaflet-mars/leaflet.js"
    ],
    turf: [libpath + "turf/turf.min.js"]
};

/**
 * 在线资源加载器
 */
class UriResourceLoader {
    constructor() {
        // 已加载的资源
        this.loaded = [];
    }

    /**
     * 通过插入link or script标签的形式加载资源
     * @param {} url
     */
    inputUri(url) {
        return new Promise((resolve, reject) => {
            // cssExpr 用于判断资源是否是css
            const cssExpr = new RegExp("\\.css");

            let headDOM = document.getElementsByTagName("head")[0],
                _dom;
            if (cssExpr.test(url)) {
                _dom = document.createElement("link");
                _dom.rel = "stylesheet";
                _dom.type = "text/css";
                _dom.href = `${url}?version=${version}`;
            } else {
                _dom = document.createElement("script");
                _dom.type = "text/javascript";
                _dom.src = `${url}?version=${version}`;
            }

            // 资源加载完成
            _dom.onload = e => {
                logger.debug("uriLoader: loaded", e.target);
                resolve();
            };
            headDOM.appendChild(_dom);
        });
    }

    /**
     * 加载单一资源
     */
    loadItem(item) {
        const cssExpr = new RegExp("\\.css");
        const jsExpr = new RegExp("\\.js");
        let name, url;
        if (isUtil.isString(item)) {
            name = item;
            if (isUtil.isNull(libMap[item])) {
                logger.warning("uriLoader: 不存在的资源", item);
                return Promise.resolve();
            } else {
                url = libMap[item];
            }
        } else if (isUtil.isObject(item)) {
            if (isUtil.isNull(item.name) || isUtil.isNull(item.url)) {
                logger.warning("uriLoader: 未定义的属性name 或 url", item);
                return Promise.resolve();
            }
            name = item.name;
            url = item.url;

            if (!isUtil.isArray(url)) {
                url = [url];
            }

            const otherUrl = url.filter(
                u => !cssExpr.test(u) && !jsExpr.test(u)
            );
            if (otherUrl.length > 0) {
                logger.warning("uriLoader: 无法加载以下资源", otherUrl);
            }
        } else {
            logger.warning("uriLoader: 不支持的参数", item);
        }

        if (this.loaded.indexOf(name) > -1) {
            logger.debug("uriLoader: 重复加载的资源", item);
            return Promise.resolve();
        }

        this.loaded.push(name);

        url = url.filter(u => cssExpr.test(u) || jsExpr.test(u));

        return Promise.all(url.map(uri => this.inputUri(uri)));
    }

    /**
     * 加载入口
     * @param {*} list
     */
    load(list) {
        let arr = [];
        if (isUtil.isArray(list)) {
            arr = [...list];
        } else {
            if (isUtil.isNotNull(list)) {
                arr = [list];
            }
        }

        return Promise.all(arr.map(item => this.loadItem(item)));
    }
}

const _loader = new UriResourceLoader();

export const uriLoader = list => _loader.load(list);
