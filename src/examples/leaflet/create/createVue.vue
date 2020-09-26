<template>
    <l-map
        :mapOptions="mapOptions"
        :basemaps="basemaps"
        :overlays="overlays"
        :controls="controls"
        @mapSetup="onSetup"
    ></l-map>
</template>
<script>
export default {
    data() {
        return {
            mapOptions: {
                minZoom: 3,
                maxZoom: 18,
                center: [117.220102, 31.834912],
                zoom: 12
            },
            controls: ["scale", "location", "zoom", "layers"],
            basemaps: [
                {
                    type: "tdt_vec"
                },
                {
                    type: "tdt_vecd"
                },
                {
                    type: "tdt_vecz"
                },
                {
                    type: "tdt_img"
                },
                {
                    type: "tdt_imgd"
                },
                {
                    type: "tdt_imgz"
                },
                {
                    type: "tdt_ter"
                },
                {
                    type: "tdt_terd"
                },
                {
                    type: "tdt_terz"
                },
                {
                    type: "tdt_ibo"
                },
                {
                    type: "google_vec"
                },
                {
                    type: "google_img"
                },
                {
                    type: "google_imgd"
                },
                {
                    type: "google_ter"
                },
                {
                    type: "google_road"
                },
                {
                    type: "osm"
                },
                {
                    type: "baidu_custom",
                    style: "light"
                },
                {
                    type: "baidu_vec"
                },
                {
                    type: "baidu_imgd"
                },
                {
                    type: "baidu_imgz"
                },
                {
                    type: "baidu_img"
                },
                {
                    type: "baidu_time"
                },
                {
                    name: "高德-矢量-大字体",
                    type: "gaode_vec"
                },
                {
                    type: "gaode_vec"
                },
                {
                    type: "gaode_vecd"
                },
                {
                    type: "gaode_imgd"
                },
                {
                    type: "gaode_imgz"
                },
                {
                    type: "gaode_img"
                },
                {
                    type: "gaode_road"
                },
                {
                    type: "gaode_time"
                }
            ],
            overlays: [
                { name: "经纬网", type: "graticule" },
                {
                    name: "日照",
                    type: "lighting"
                }
            ]
        };
    },
    methods: {
        onSetup(map) {
            // 业务逻辑
        }
    }
};
</script>
<style lang="less" scoped>
.map-wrapper {
    width: 100%;
    height: 100%;
}
</style>
