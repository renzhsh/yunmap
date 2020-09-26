<template>
    <l-map
        :mapOptions="mapOptions"
        :basemaps="basemaps"
        :overlays="overlays"
        :controls="controls"
        @mapSetup="onSetup"
    >
        <template slot="controls">
            <l-toolbar position="topright" />
            <LLocation />
        </template>
    </l-map>
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
            controls: [
                "scale",
                "location",
                "zoom",
                "layers",
                "fishbone",
                "toolbar",
                "mapswich",
                "attribution",
                "minimap",
                {
                    type: "minimap",
                    layer: {
                        type: "tile",
                        url:
                            "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        subdomains: "abc"
                    }
                }
            ],
            basemaps: [
                {
                    type: "tdt_vec",
                    mapswich: "vec"
                },
                {
                    type: "tdt_img",
                    mapswich: "img"
                }
            ],
            overlays: [
                {
                    type: "tdt_terz"
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
