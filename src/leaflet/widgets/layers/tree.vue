<template>
    <a-directory-tree class="leaflet-widget-tree" checkable>
        <a-tree-node title="parent 0" key="0-0">
            <a-tree-node title="leaf 0-0" key="0-0-0" isLeaf />
            <a-tree-node title="leaf 0-1" key="0-0-1" isLeaf />
        </a-tree-node>
        <a-tree-node title="parent 1" key="0-1">
            <a-tree-node key="0-1-0" isLeaf>
                <div class="ant-treenode-title-custom" slot="title">
                    <span class="ant-title-text">0-1-0</span>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <div class="ant-treenode-opacity">
                                <a-slider :min="0" :max="1" :step="0.1" />
                            </div>
                        </template>
                        <a-icon
                            class="ant-opacity-icon"
                            title="透明度调节"
                            :component="lightIcon"
                        />
                    </a-tooltip>
                </div>
            </a-tree-node>
            <a-tree-node title="leaf 1-1" key="0-1-1" isLeaf />
        </a-tree-node>
    </a-directory-tree>
</template>
<script>
import light from "./light.svg";
export default {
    data() {
        return {
            lightIcon: light
        };
    },
    methods: {
        onSelect(keys) {},
        onExpand() {}
    }
};
</script>
<style lang="less">
.leaflet-widget-tree {
    &.ant-tree {
        li {
            padding: 0px;

            &:first-child {
                padding-top: 0px;
            }

            &:last-child {
                padding-bottom: 0px;
            }

            .ant-tree-iconEle.ant-tree-icon__customize {
                display: none;
            }

            .ant-treenode-title-custom {
                .ant-title-text {
                    padding-right: 10px;
                }
            }
        }
    }
}
.ant-treenode-opacity {
    width: 150px;
    margin: -8px;
}
</style>
