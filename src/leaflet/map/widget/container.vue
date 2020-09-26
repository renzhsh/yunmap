<template>
    <keep-alive-x class="leaflet-widget-container">
        <template v-for="item in widgetOptions">
            <l-wdiget-factory
                :key="item.name"
                :option="item"
            ></l-wdiget-factory>
        </template>
    </keep-alive-x>
</template>
<script>
/**
 * 组件容器
 */
import widgetRegister from "./register";
import keepAliveX from "./keepalive";
import LWdigetFactory from "./wdFactory";
export default {
    name: "widgetView",
    components: { keepAliveX, LWdigetFactory },
    props: {
        map: {
            type: Object,
            required: true
        },
        widgets: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            cache: {}, // 配置缓存
            widgetOptions: [],
            currentZIndex: 1000 // widget z-index
        };
    },
    provide() {
        return {
            map: this.map
        };
    },
    created() {
        this.widgets.forEach(widget => {
            if (L.Util.isString(widget)) {
                this.activate(widget);
            }
            if (L.Util.isObject(widget) && widget.name) {
                this.activate(widget.name, widget);
            }
        });
        this.map.iBus.$on("widget:activate", ({ name, config }) => {
            this.activate(name, config);
        });
        this.map.iBus.$on("widget:dispose", name => {
            this.dispose(name);
        });

        this.$emit("setup");
    },
    methods: {
        activate(name, config = {}) {
            // 已激活
            if (
                this.widgetOptions.filter(item => item.name === name).length > 0
            ) {
                return;
            }

            let widget = null;
            if (this.cache[name]) {
                widget = this.cache[name];
            } else {
                widget = widgetRegister.getConfig(name);
                if (!widget) return;
            }

            widget = Object.assign(
                widget,
                {
                    zIndex: this.currentZIndex++
                },
                config
            );

            this.cache[name] = widget;

            if (widget.disposeOther) {
                // dispose所有可释放的组件
                this.widgetOptions = this.widgetOptions.filter(
                    item => item.disposable == false
                );
            }

            this.widgetOptions.push(widget);
        },
        /**
         * 释放组件
         * @param {String} name 组件名称
         */
        dispose(name) {
            if (name) {
                this.widgetOptions = this.widgetOptions.filter(
                    item => item.name !== name
                );
            } else {
                // 如果没指定组件，则释放全部
                this.widgetOptions = this.widgetOptions.filter(
                    item => item.disposable == false
                );
            }
        }
    }
};
</script>
