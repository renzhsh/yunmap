<template>
    <l-map
        :plugins="plugins"
        :mapOptions="mapOptions"
        :basemaps="basemaps"
        :controls="controls"
        :widgets="widgets"
        @mapSetup="onSetup"
    >
    </l-map>
</template>
<script>
export default {
    data() {
        return {
            plugins: ["widgets"],
            widgets: ["debugbar"],
            mapOptions: {
                minZoom: 3,
                maxZoom: 18,
                center: [118.557356, 31.697076],
                zoom: 10
            },
            controls: ["scale", "location", "fishbone", "layers", "toolbar"],
            basemaps: [
                {
                    type: "tdt_vecd"
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
