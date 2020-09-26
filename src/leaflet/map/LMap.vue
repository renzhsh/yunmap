<template>
    <div class="leaflet-layout">
        <div :id="mapId" class="leaflet-map"></div>
        <template v-if="mapReady">
            <ControlView
                :controls="controls"
                :map="map"
                @setup="onSetup('ctrl')"
            >
                <slot name="controls"></slot>
            </ControlView>
            <WidgetView
                :widgets="widgets"
                :map="map"
                @setup="onSetup('widget')"
            ></WidgetView>
        </template>
    </div>
</template>
<script>
import LifeCycleMixin from "./lifeCycleMixin";
import ControlView from "./control";
import WidgetView from "./widget";
export default {
    mixins: [LifeCycleMixin],
    components: { ControlView, WidgetView },
    data() {
        return {
            mapId: "map-" + Math.round(Math.random() * 1000000),
            mapReady: false //map 创建完成
        };
    }
};
</script>
<style lang="less">
.leaflet-layout {
    width: 100%;
    height: 100%;
    position: relative;

    .leaflet-map {
        height: 100%;
        width: 100%;
    }
}
</style>
