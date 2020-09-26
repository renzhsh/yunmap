<template>
    <div class="ant-modal-content" v-drag="dragable">
        <button type="button" class="ant-modal-close" v-if="closable">
            <span class="ant-modal-close-x" @click="$emit('close')">
                <a-icon type="close" />
            </span>
        </button>
        <div class="ant-modal-header" style="cursor:move">
            <div class="ant-modal-title" style="cursor:move">
                {{ title }}
            </div>
        </div>
        <div class="ant-modal-body">
            <slot></slot>
        </div>
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
.ant-modal-content {
    min-width: 250px;
    .ant-modal-close {
        .ant-modal-close-x {
            width: 44px;
            height: 44px;
            line-height: 44px;
        }
    }
    .ant-modal-header {
        padding: 10px 24px;
        background-color: burlywood;
    }

    .ant-modal-body {
        padding: 10px;
    }
}
</style>
