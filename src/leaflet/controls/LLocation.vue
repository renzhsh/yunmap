<template>
    <div class="leaflet-control leaflet-control-location" :style="{ left: marginLeft + 'px' }">
        <span>经度:{{ x }}</span>
        <span>纬度:{{ y }}</span>
    </div>
</template>
<script>
export default {
    inject: ["map"],
    props: {
        position: {
            type: String,
            default: "bottomleft"
        }
    },
    data() {
        return {
            x: 0,
            y: 0,
            marginLeft: 0
        };
    },
    mounted() {
        this.map.on("mousemove", e => {
            this.computeLocation(e.latlng);
        });
        this.map.on("zoomend", e => {
            this.refLeft();
            this.computeLocation(this.map.getCenter());
        });
        this.$nextTick(() => {
            this.refLeft();
            this.computeLocation(this.map.getCenter());
        });
    },
    methods: {
        computeLocation(latlng) {
            this.x = latlng.lng.toFixed(6);
            this.y = latlng.lat.toFixed(6);
        },
        // 判断左侧控件leaflet-control-scale的宽度
        refLeft() {
            var uiDom = document.querySelector(
                `#${this.map._container.id}` +
                    " .leaflet-control-container .leaflet-control-scale-line"
            );
            if (!uiDom) {
                this.marginLeft = 0;
            } else {
                this.marginLeft = uiDom.offsetWidth + 20;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.leaflet-control-location {
    position: absolute;
    z-index: 999;
    bottom: 0px;
    font-size: 14px;
    margin-bottom: 5px;
    margin-left: 0px;
    white-space: nowrap;
    color: #333;
    text-shadow: #edeaea 1px 0 0, #edeaea 0 1px 0, #edeaea -1px 0 0,
        #edeaea 0 -1px 0;

    span {
        margin-right: 15px;
    }
}
</style>
