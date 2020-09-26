<template>
    <div id="mapContainer">
        <div id="map"></div>
        <widgetContainer></widgetContainer>
    </div>
</template>
<script>
import Vue from "vue";
import Yungis from "yungis";
import { uriLoader, widgetContainer } from "yungis";

Vue.use(Yungis);

export default {
    components: { widgetContainer },
    methods: {
        async init() {
            await uriLoader(["font-awesome", "leaflet-mars"]);
            this.initMap();
        },
        initMap() {
            var map = L.map("map", {
                //crs: L.CRS.EPSG3857,
                zoom: 7,
                center: [31.834912, 117.220102],

                zoomControl: false, //不用默认的
                attributionControl: false,
                minZoom: 1,
                maxZoom: 18
            });

            //添加控件
            L.control.zoom({ position: "topleft" }).addTo(map);
            L.control.scale({ metric: true, imperial: false }).addTo(map);
            L.control
                .toolbar({
                    item: ["home", "location", "fullscreen"],
                    position: "bottomright"
                })
                .addTo(map);

            L.mars.layer.createLayer({ type: "www_osm" }).addTo(map);
        }
    },
    mounted() {
        this.init();
        this.$iBus.emit("widget:activate", "debugbar");
    }
};
</script>
<style>
html,
body,
#mapContainer,
#map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>
