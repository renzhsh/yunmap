<template>
    <div
        class="leaflet-control leaflet-control-fishbone map-fish-bone-toolbar"
        v-hover="'show-marker'"
        @dblclick.stop="hell"
    >
        <div :class="['fish-bone-button', btnOver + '-over']">
            <div class="button-line">
                <div class="button-item"></div>
                <div
                    class="button-item button-top"
                    title="向上平移"
                    @mouseover="btnOver = 'top'"
                    @mouseout="btnOver = 'none'"
                    @click.stop="move('top')"
                ></div>
                <div class="button-item"></div>
            </div>
            <div class="button-line">
                <div
                    class="button-item button-left"
                    title="向左平移"
                    @mouseover="btnOver = 'left'"
                    @mouseout="btnOver = 'none'"
                    @click.stop="move('left')"
                ></div>
                <div
                    class="button-item button-center"
                    title="查看全图"
                    @click.stop="move('full')"
                ></div>
                <div
                    class="button-item button-right"
                    title="向右平移"
                    @mouseover="btnOver = 'right'"
                    @mouseout="btnOver = 'none'"
                    @click.stop="move('right')"
                ></div>
            </div>
            <div class="button-line">
                <div class="button-item"></div>
                <div
                    class="button-item button-down"
                    title="向下平移"
                    @mouseover="btnOver = 'down'"
                    @mouseout="btnOver = 'none'"
                    @click.stop="move('down')"
                ></div>
                <div class="button-item"></div>
            </div>
        </div>
        <div class="fish-bone-slider">
            <div class="slider-zoomIn" title="放大一级" @click="zoomIn"></div>
            <!-- 滑动条-标尺 -->
            <div
                class="slider-ticks"
                title="缩放到此级别"
                :style="{ height: sliderHeight }"
                @click="_ => moveTo(_) || moveEnd(_)"
            >
                <!-- 滑动条-已选中标尺 -->
                <div
                    class="slider-ticks-sel"
                    title="缩放到此级别"
                    :style="{ height: blockHeight }"
                ></div>
                <!-- 滑动条-滑块 -->
                <div
                    ref="block"
                    class="slider-ticks-block"
                    v-hover="'activated'"
                    title="拖动缩放"
                    :style="{ bottom: blockHeight }"
                    @mousedown="moving = true"
                    @mousemove="_ => moving && moveTo(_)"
                    @mouseup="_ => (moving = false)"
                    @mouseleave="_ => (moving = false)"
                ></div>
            </div>
            <div class="slider-zoomOut" title="缩小一级" @click="zoomOut"></div>
        </div>
        <div class="fish-bone-marker" :style="{ height: sliderHeight }">
            <div
                title="缩放到街道"
                class="marker mark-street"
                @click="setZoom(streetLevel)"
                v-if="markShow(streetLevel)"
                :style="{
                    bottom: markHeight(streetLevel)
                }"
            ></div>
            <div
                title="缩放到城市"
                class="marker mark-city"
                @click="setZoom(cityLevel)"
                v-if="markShow(cityLevel)"
                :style="{
                    bottom: markHeight(cityLevel)
                }"
            ></div>
            <div
                title="缩放到省"
                class="marker mark-province"
                @click="setZoom(provinceLevel)"
                v-if="markShow(provinceLevel)"
                :style="{
                    bottom: markHeight(provinceLevel)
                }"
            ></div>
            <div
                title="缩放到国家"
                class="marker mark-country"
                @click="setZoom(countryLevel)"
                v-if="markShow(countryLevel)"
                :style="{
                    bottom: markHeight(countryLevel)
                }"
            ></div>
        </div>
    </div>
</template>
<script>
import Mixin from "./mixin";
export default {
    mixins: [Mixin],
    props: {
        position: {
            type: String,
            default: "topleft"
        }
    },
    data() {
        return {
            btnOver: "none",
            moving: false,
            sliderBlockOffset: 0
        };
    }
};
</script>
<style lang="less" scoped>
@import url("style.less");
</style>
