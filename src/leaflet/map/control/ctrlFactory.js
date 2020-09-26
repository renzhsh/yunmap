export default {
    name: "LCtrlFactory",
    inject: ["map"],
    props: {
        controls: Array
    },
    updated() {
        var uiDom = this.map._controlCorners;

        this.$children &&
            this.$children.forEach(vm => {
                let tag = vm.$vnode.componentOptions.tag;
                let pos = vm.position;

                if (!vm.position) {
                    L.logger.warn(`Control [${tag}] Missing prop: position`);
                }
                switch (vm.position) {
                    case "topleft":
                    case "topright":
                    case "bottomleft":
                    case "bottomright":
                        pos = vm.position;
                        break;
                    default:
                        L.logger.warn(
                            `Control [${tag}] prop 'position' has a invalid value: ${vm.position}`
                        );
                        pos = "topleft";
                }

                uiDom[pos].appendChild(vm.$el);
            });
    },
    render(h) {
        let children = (this.controls || []).map(option => {
            switch (option.tag) {
                case "LMapswich":
                    return this.rdMapswich(h, option);
            }

            return h(option.tag, {
                props: option
            });
        });
        return h("div", {}, children);
    },
    methods: {
        rdMapswich(h, option) {
            const switchmap = type => {
                const handle = this.map.layerHandler;
                const targets = handle.baseLayers.filter(
                    lyr => lyr.options.mapswich && lyr.options.mapswich === type
                );
                if (targets && targets.length > 0) {
                    handle.changeBasemap(targets[0]);
                }

                this.map.iBus.$emit("mapswich:change", type);
            };

            return h(option.tag, {
                props: option,
                on: {
                    change: switchmap
                }
            });
        }
    }
};
