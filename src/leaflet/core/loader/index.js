import { Plugin, Plugins } from "./async";

/**
 * leaflet 模块加载系统
 */
L.use = async (plugin, options = null) => {
    if (typeof plugin == "function") {
        plugin = await plugin();
    }

    if (typeof plugin == "object") {
        // es6 Module
        if (plugin.__esModule && plugin.default) {
            plugin = plugin.default;
        }

        plugin.install && plugin.install(L, options);
    }
};

L.plugins = new Plugins();

L.useAsync = async (name, fn, options = null) => {
    if (typeof name != "string") {
        throw "name must be string";
    }
    if (typeof fn != "function") {
        throw "fn must by Promise";
    }
    L.plugins[name] = new Plugin(name, fn, options);
};

export default L;
