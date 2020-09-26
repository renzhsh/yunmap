export default {
    inject: ["map"],
    props: {
        /**国家 缩放级别*/
        countryLevel: {
            type: Number,
            default: 4
        },
        /**省 缩放级别*/
        provinceLevel: {
            type: Number,
            default: 7
        },
        /**城市 缩放级别*/
        cityLevel: {
            type: Number,
            default: 10
        },
        /**街道 缩放级别*/
        streetLevel: {
            type: Number,
            default: 14
        }
    },
    data() {
        return {
            mapOption: {
                minzoom: null,
                maxzoom: null,
                zoom: null,
                center: null,
                minValue: 0
            },
            current: null // 当前值
        };
    },
    computed: {
        /**
         * 滑动条 高度
         */
        sliderHeight() {
            return (
                (this.mapOption.maxzoom - this.mapOption.minzoom + 1) * 6 + "px"
            );
        },
        /**
         * 滑动条 滑块 高度
         */
        blockHeight() {
            return (this.current - this.mapOption.minzoom) * 6 - 4 + "px";
        }
    },
    created() {
        var minzoom = this.map.getMinZoom() || 0;
        var maxzoom = this.map.getMaxZoom() || 18;
        var zoom = this.map.getZoom();
        var center = this.map.getCenter();

        this.mapOption = Object.assign({}, this.mapOption, {
            minzoom,
            maxzoom,
            zoom,
            center
        });

        this.setZoom(zoom);

        this.map.on("zoomend", () => {
            let zoom = this.map.getZoom();
            if (zoom !== this.current) {
                this.setZoom(zoom);
            }
        });
    },
    methods: {
        hell() {
            //禁止无关事件冒泡
        },
        move(direct) {
            if (this.map) {
                switch (direct) {
                    case "top":
                        this.map.panBy([0, -100]);
                        break;
                    case "left":
                        this.map.panBy([-100, 0]);
                        break;
                    case "right":
                        this.map.panBy([100, 0]);
                        break;
                    case "down":
                        this.map.panBy([0, 100]);
                        break;
                    case "full":
                        this.map.setView(
                            this.mapOption.center,
                            this.mapOption.zoom
                        );
                        break;
                }
            }
        },
        zoomIn() {
            this.map.zoomIn();
        },
        zoomOut() {
            this.map.zoomOut();
        },
        setZoom(value) {
            if (this.mapOption.maxzoom < value) {
                value = this.mapOption.maxzoom;
            }
            if (this.mapOption.minzoom > value) {
                value = this.mapOption.minzoom;
            }

            this.current = value;

            this.map.setZoom(this.current);
        },
        /**
         * 判断marker是否显示
         * @param {*} level
         */
        markShow(level) {
            return (
                level >= this.mapOption.minzoom &&
                level <= this.mapOption.maxzoom
            );
        },
        /**
         * marker位置
         * @param {*} level
         */
        markHeight(level) {
            return (level - this.mapOption.minzoom) * 6 - 9 + "px";
        },
        moveTo(event) {
            let offset = Math.round(
                (this.blockClientY() + 4 - event.clientY) / 6
            );
            this.current += offset;
        },
        moveEnd() {
            this.setZoom(this.current);
        },
        /**
         * 滑块 屏幕坐标
         */
        blockClientY() {
            let target = this.$refs.block,
                top = target.offsetTop;
            while ((target = target.offsetParent)) {
                top += target.offsetTop;
            }

            return top;
        }
    }
};
