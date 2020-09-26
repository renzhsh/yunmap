import { isUtil } from "@yungis/utils";
export const layoutMixin = {
    props: {
        region: {
            type: Object,
            required: false,
            default: function() {
                return {
                    position: {
                        top: "10px",
                        right: "10px"
                    },
                    width: "auto",
                    height: "auto"
                };
            }
        }
    },
    data() {
        return {
            layoutStyle: {}
        };
    },
    created() {
        this.layoutStyle = this.makeStyle(this.region);
    },
    methods: {
        makeStyle(config) {
            let posStyle = {},
                sizeStyle = {};
            if (isUtil.isNull(config)) {
                return {
                    display: "none"
                };
            }
            if (isUtil.isNotNull(config.position)) {
                posStyle = Object.assign(
                    {},
                    {
                        position: "absolute"
                    },
                    config.position
                );
            } else {
                posStyle = Object.assign(
                    {},
                    {
                        display: "none"
                    }
                );
            }

            if (isUtil.isNotNull(config.width)) {
                sizeStyle.width = config.width;
            }
            if (isUtil.isNotNull(config.height)) {
                sizeStyle.height = config.height;
            }

            return {
                ...posStyle,
                ...sizeStyle
            };
        }
    }
};
