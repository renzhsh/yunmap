<template>
    <div class="yungis-loader div-loader">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        title: String,
        dragable: {
            type: Boolean,
            default: true
        },
        closable: {
            type: Boolean,
            default: true
        }
    }
};
</script>
<style lang="less" scoped>
.div-loader {
    padding: 10px;
}
</style>
