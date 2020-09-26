<template>
    <div id="map"></div>
</template>
<script>
export default {
    mounted() {
        var map = new L.Map("map", {
            minZoom: 3,
            maxZoom: 18,
            center: [31.834912, 117.220102],
            zoom: 12
        });

        L.marker([31.841545, 117.18996])
            .addTo(map)
            .bindPopup("<b>Hello world!</b><br />I am a popup.")
            .openPopup();

        L.circle([31.834399, 117.243347], 500, {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5
        })
            .addTo(map)
            .bindPopup("I am a circle.");

        //控制地图底图
        var baseLayers = {
            高德地图: L.tileLayer(
                "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                { subdomains: "1234" }
            ).addTo(map),
            "高德地图-大字体": L.tileLayer(
                "http://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                { subdomains: "1234" }
            ),
            高德影像: L.layerGroup([
                L.tileLayer(
                    "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
                    { subdomains: "1234" }
                ),
                L.tileLayer(
                    "http://webst0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
                    { subdomains: "1234" }
                )
            ])
        };

        L.control.layers(baseLayers, {}, { position: "topright" }).addTo(map);

        L.control.scale({ imperial: false }).addTo(map);
    }
};
</script>

<style lang="less" scoped>
#map {
    height: 100%;
    width: 100%;
}
</style>
