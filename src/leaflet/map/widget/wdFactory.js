import { DivLoader, DialogLoader } from "./loader";

/**
 * widget Factory
 */
export default {
    name: "LWidgetFactory",
    components: { DivLoader, DialogLoader },
    inject: ["map"],
    props: {
        option: Object
    },
    render(h) {
        let _loader = "";
        switch (this.option.loader) {
            case "dialog":
                _loader = "DialogLoader";
                break;
            case "div":
                _loader = "DivLoader";
                break;
            default:
                _loader = this.option.loader; // 允许自定义loader
                break;
        }

        return h(
            _loader,
            {
                props: Object.assign({ title: this.option.name }, this.option),
                style: this.layoutStyle(this.option),
                on: {
                    close: () => {
                        this.map.iBus.$emit("widget:dispose", this.option.name);
                    }
                }
            },
            [
                h(this.option.componentTag, {
                    props: this.option.props
                })
            ]
        );
    },
    methods: {
        layoutStyle(config) {
            return Object.assign(
                {
                    position: "absolute",
                    width: config.width || "auto",
                    height: config.height || "auto",
                    "z-index": config.zIndex,
                    "pointer-events": config.allowPointer ? "auto" : "none"
                },
                config.position
            );
        }
    }
};
