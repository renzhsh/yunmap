<template>
    <div class="yungis-debug-bar">
        <span class="item">
            <a href="javascript:;" @click="activate('layers')">图层管理</a>
        </span>
        <span class="item">
            <a href="javascript:;" @click="dispose()">dispose</a>
        </span>
    </div>
</template>
<script>
export default {
    inject: ["map"],
    methods: {
        activate(name) {
            this.map.iBus.$emit("widget:activate", { name });
        },
        dispose(name) {
            this.map.iBus.$emit("widget:dispose", name);
        }
    }
};
</script>
<style lang="less" scoped>
.yungis-debug-bar {
    background-color: darkgray;
    padding: 10px;
    .item {
        + .item {
            margin-left: 10px;
        }
    }
}
</style>
