<template>
    <div class="leaflet-control-view">
        <LCtrlFactory :controls="vueCtrls"></LCtrlFactory>
        <slot></slot>
    </div>
</template>
<script>
import LCtrlFactory from "./ctrlFactory";
import { ControlHandler } from "../handler";
export default {
    components: { LCtrlFactory },
    props: {
        map: {
            type: Object,
            required: true
        },
        controls: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            vueCtrls: []
        };
    },
    provide() {
        return {
            map: this.map
        };
    },
    created() {
        const _ctrlHd = new ControlHandler(this.map, this.controls);

        Object.defineProperties(this.map, {
            ctrlHandler: {
                get() {
                    return _ctrlHd;
                }
            }
        });
    },
    mounted() {
        const handle = this.map.ctrlHandler;
        this.vueCtrls = handle.ctrlOptions.filter(item => !item._isLeafletCtrl);

        this.addLfCtrls();
        this.addSlotCtrls();

        this.$emit('setup');
    },
    methods: {
        /**
         * 添加内置leaflet control
         */
        addLfCtrls(ctrls) {
            const handle = this.map.ctrlHandler;

            handle.ctrlOptions
                .filter(item => item._isLeafletCtrl)
                .map(item => handle.createCtrl(item))
                .forEach(ctrl => {
                    ctrl && ctrl.addTo(this.map);
                });
        },
        addSlotCtrls() {
            var uiDom = this.map._controlCorners;

            this.$slots.default &&
                this.$slots.default
                    .map(cm => cm.componentInstance)
                    .forEach(vm => {
                        let tag = vm.$vnode.componentOptions.tag;
                        let pos = vm.position;

                        if (!vm.position) {
                            L.logger.warn(
                                `Control [${tag}] Missing prop: position`
                            );
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
        }
    }
};
</script>
