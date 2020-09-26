<template>
    <div
        class="leaflet-control leaflet-control-toolbar leaflet-bar"
        :class="{
            'leaflet-fullscreen-on': isFullscreen,
            'leaflet-locate-loading': isLocating
        }"
    >
        <a
            class="leaflet-control-toolbar-home"
            href="#"
            title="回到默认视图区域"
            @click="goHome"
        >
        </a>
        <a
            class="leaflet-control-toolbar-locate"
            href="#"
            title="定位至当前所在位置"
            @click="goLocate"
        ></a>
        <a
            class="leaflet-control-toolbar-fullscreen"
            href="#"
            :title="isFullscreen ? '退出全屏' : '进入全屏'"
            @click="toggleFullscreen"
        ></a>
    </div>
</template>
<script>
export default {
    inject: ["map"],
    props: {
        position: {
            type: String,
            default: "bottomright"
        }
    },
    data() {
        return {
            center: null,
            zoom: null,
            isFullscreen: false,
            isLocating: false
        };
    },
    mounted() {
        if (!this.map) return;

        this.center = this.map.getCenter();
        this.zoom = this.map.getZoom();

        this.map.on("locationerror", e => {
            this.isLocating = false;
            alert("获取地理位置失败");
            L.logger.error(
                "获取地理位置失败：" +
                    (e.message || "").replace("Geolocation error: ", "")
            );
        });
        this.map.on("locationfound", e => {
            this.isLocating = false;
        });

        document.addEventListener("fullscreenchange", e => {
            this.isFullscreen = document.fullscreen;
        });
    },
    methods: {
        goHome() {
            this.map.setView(this.center, this.zoom);
        },
        goLocate() {
            this.isLocating = true;
            this.map.locate({ setView: true });
        },
        toggleFullscreen() {
            var container = this.map._container;
            if (this.isFullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen(
                        Element.ALLOW_KEYBOARD_INPUT
                    );
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.leaflet-control-toolbar {
    bottom: 0px;
}

.leaflet-control-toolbar-home {
    background-image: url("img/home.png");
}

.leaflet-control-toolbar-locate {
    background-image: url(img/location.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.leaflet-locate-loading .leaflet-control-toolbar-locate {
    background: url(img/location-loading.gif) center no-repeat #fff;
    background-size: 80% 80%;
}

.leaflet-control-toolbar-fullscreen {
    background-image: url("img/fullscreen.png");
    background-size: 26px 26px;
}

.leaflet-fullscreen-on .leaflet-control-toolbar-fullscreen {
    background-image: url("img/fullscreen-on.png");
}
</style>
