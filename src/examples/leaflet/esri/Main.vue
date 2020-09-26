<template>
    <l-map
        :mapOptions="mapOptions"
        :plugins="plugins"
        :basemaps="basemaps"
        :overlays="overlays"
        :controls="controls"
        @mapSetup="onSetup"
    >
    </l-map>
</template>
<script>
export default {
    data() {
        return {
            mapOptions: {
                minZoom: 3,
                maxZoom: 18,
                center: [118.557356, 31.697076],
                zoom: 10
            },
            plugins: ["esri"],
            controls: ["scale", "location", "fishbone", "layers", "toolbar"],
            basemaps: [
                {
                    type: "esri_dynamic",
                    name: "dynamicMapLayer 马鞍山矢量底图",
                    url:
                        "http://tdtmap.mas.gov.cn/arcgis/rest/services/MASELE/MapServer"
                },
                {
                    type: "tdt_vecd"
                },
                {
                    type: "esri_tile",
                    name: "tiledMapLayer USA_Topo_Maps",
                    url:
                        "https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"
                },
                {
                    type: "esri_masvec"
                },
                {
                    type: "esri_masvecd"
                },
                {
                    type: "esri_masvecz"
                },
                {
                    type: "esri_masimg"
                },
                {
                    type: "esri_masimgd"
                },
                {
                    type: "esri_masimgz"
                }
            ],
            overlays: [
                {
                    type: "esri_maspoi"
                },
                {
                    type: "esri_masroad"
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
