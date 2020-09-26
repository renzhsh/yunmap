import Vue from "vue";
/**
 * 组件注册器
 */
class WidgetRegister {
    constructor() {
        this.configMap = new Map();
    }

    registerItem(item) {
        if (!L.Util.isObject(item)) {
            L.logger.warn("WidgetRegister: 无效的组件配置", item);
            return;
        }

        if (L.Util.isNull(item.name) || L.Util.isNull(item.component)) {
            L.logger.warn("WidgetRegister: 未定义name 或 component属性", item);
            return;
        }

        if (this.configMap.has(item.name)) {
            L.logger.warn(
                "WidgetRegister: 重复注册的组件，旧组件将会被覆盖",
                item
            );

            this.configMap.delete(item.name);
        }

        let config = Object.assign(
            {},
            {
                componentTag: `leaflet-${item.name}`,
                // 组件的显示区域
                position: {
                    top: "10px",
                    right: "10px"
                },
                width: "auto",
                height: "auto",
                loader: "div", // 组件加载器，window, modal, div
                closable: true,
                disposable: true, //可释放的组件
                disposeOther: false, // 激活时释放其他可释放的组件
                allowPointer: true, // 是否处理鼠标事件
                keepalive: true, // 是否缓存其状态
                dragable: true, //可拖动
                props: {} // 注入到widget的数据
            },
            item
        );

        Vue.component(config.componentTag, config.component);

        this.configMap.set(config.name, config);
    }

    register(list) {
        let arr = [];
        if (L.Util.isArray(list)) {
            arr = list;
        } else {
            arr = [list];
        }

        for (let item of arr) {
            this.registerItem(item);
        }
    }

    getConfig(name) {
        if (!this.configMap.has(name)) {
            L.logger.warn("WidgetRegister: 不存在的组件", name);
            return null;
        }

        return this.configMap.get(name);
    }
}

export default new WidgetRegister();
