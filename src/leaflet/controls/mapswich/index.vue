<template>
    <div
        class="leaflet-control leaflet-control-mapswich pnui-maptype"
        :class="{ expand: hover }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <template v-for="(item, index) in renderType">
            <div
                @click="select(item.type)"
                :class="[
                    'pnui-mapli',
                    item.class,
                    activeType == item.type ? 'active' : ''
                ]"
                :key="item.type"
                :style="{
                    zIndex: index + 1,
                    right: paddingRight(hover, index) + 'px'
                }"
            >
                <span>{{ item.text }}</span>
            </div>
        </template>
    </div>
</template>
<script>
/**
 * 底图切换
 * 
 * TODO:// 未完待续
 *
 * 1. 对于 earth, pano 如何处理
 * 2. 在其他地方切换后，mapswich状态自动更新
 * 3. 是否要添加其他的底图样式，比如tdt、google、osm等
 * 
 * 组件渲染见 /map/handler/control/ctrlFactory
 */
export default {
    props: {
        position: {
            type: String,
            default: "bottomright"
        },
        /**
         * 排在第一个的选中， 这里并不会影响显示顺序
         */
        types: {
            type: Array,
            default: _ => ["vec", "img", "earth", "pano"],
            validator: function(value) {
                let notfound = value.filter(
                    item => ["vec", "img", "earth", "pano"].indexOf(item) == -1
                );
                return notfound.length == 0;
            }
        }
    },
    computed: {
        renderType() {
            return this.mapLi.filter(li => this.types.indexOf(li.type) > -1);
        }
    },
    data() {
        return {
            hover: false,
            activeType: "vec",
            mapLi: [
                {
                    type: "vec",
                    class: "pnui-mapvec",
                    text: "地图"
                },
                {
                    type: "img",
                    class: "pnui-mapimg",
                    text: "卫星"
                },
                {
                    type: "earth",
                    class: "pnui-mapearth",
                    text: "三维"
                },
                {
                    type: "pano",
                    class: "pnui-mappano",
                    text: "全景"
                }
            ]
        };
    },
    mounted() {
        if (this.types.length > 0) {
            this.activeType = this.types[0];
        }
    },
    methods: {
        paddingRight(hover, index) {
            return (this.types.length - index - 1) * (hover ? 96 : 5) + 10;
        },
        select(type) {
            this.$emit("change", type);
            this.activeType = type;
        }
    }
};
</script>
<style lang="less" scoped>
/*地图底图切换工具*/
.pnui-maptype {
    height: 80px;
    cursor: pointer;
    transition-property: width, background-color;
    transition-duration: 0.4s;
    background-color: rgba(255, 255, 255, 0);
    margin: 0;

    .pnui-mapli {
        position: absolute;
        top: 10px;
        height: 60px;
        width: 86px;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid transparent;
        border: 1px solid rgba(153, 153, 153, 0.42);
        background: url(img/shadow.png) no-repeat 0 0;
        background-size: 86px 240px;
        transition-property: right, background-image;
        transition-duration: 0.4s;

        &:last-child {
            background-image: url(img/maptype.png);
        }

        span {
            position: absolute;
            bottom: 0;
            right: 0;
            display: inline-block;
            padding: 0 3px 0 5px;
            font-size: 12px;
            height: 22px;
            line-height: 22px;
            color: #fff;
            border-top-left-radius: 2px;
        }

        &.active span,
        &:hover span {
            background-color: #3385ff;
        }
    }

    .pnui-mapvec {
        background-position: 0 0;
    }

    .pnui-mapimg {
        background-position: 0 -61px;
    }

    .pnui-mapearth {
        background-position: 0 -181px;
    }

    .pnui-mappano {
        background-position: 0 -121px;
    }

    &.expand {
        width: 298px;
        background-color: #fff;
        background-color: rgba(255, 255, 255, 0.6);

        .pnui-mapli {
            border: 1px solid rgba(255, 255, 255, 0);
            background-image: url(img/maptype.png);

            &.active,
            &:hover {
                border: 1px solid #3385ff !important;
            }
        }
    }
}
</style>
