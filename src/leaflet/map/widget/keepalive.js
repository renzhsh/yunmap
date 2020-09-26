/* keep-alive组件 */
export default {
    name: "keep-alive-x",
    /* 抽象组件 */
    abstract: true,

    created() {
        /* 缓存对象 */
        this.cache = Object.create(null);
    },

    /* destroyed钩子中销毁所有cache中的组件实例 */
    destroyed() {
        for (const key in this.cache) {
            if (this.cache[key]) {
                this.cache[key].componentInstance.$destroy();
            }
        }
    },

    render(h) {
        if (!this.$slots.default) {
            return this.$slots.default;
        }

        let vNodes = new Array();
        for (let vnode of this.$slots.default) {
            const componentOptions = vnode && vnode.componentOptions;
            if (componentOptions) {
                const key =
                    vnode.key == null
                        ? // same constructor may get registered as different local components
                          // so cid alone is not enough (#3269)
                          componentOptions.Ctor.cid +
                          (componentOptions.tag
                              ? `::${componentOptions.tag}`
                              : "")
                        : vnode.key;

                let needKeepAlive =
                    componentOptions.propsData === undefined ||
                    componentOptions.propsData.option === undefined ||
                    componentOptions.propsData.option.keepAlive === undefined ||
                    componentOptions.propsData.option.keepAlive === true;

                if (needKeepAlive) {
                    /* 如果已经做过缓存了则直接从缓存中获取组件实例给vnode，还未缓存过则进行缓存 */
                    if (this.cache[key]) {
                        vnode.componentInstance = this.cache[
                            key
                        ].componentInstance;
                    } else {
                        this.cache[key] = vnode;
                    }
                    /* keepAlive标记位 */
                    vnode.data.keepAlive = true;
                }
            }

            vNodes.push(vnode);
        }

        return h(
            "div",
            {
                class: "leaflet-widget-container"
            },
            vNodes
        );
    }
};
