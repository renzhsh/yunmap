<template>
    <a-layout class="components-layout-demo" :style="{ height: height + 'px' }">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed">
            <div class="logo" />
            <NavMenu />
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="() => (collapsed = !collapsed)"
                />
            </a-layout-header>
            <a-layout-content
                :style="{
                    margin: '24px 16px',
                    background: '#fff'
                }"
            >
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
import NavMenu from "./navMenu";
export default {
    components: { NavMenu },
    mounted() {
        window.onresize = () => {
            this.height = document.body.clientHeight;
        };
    },
    data() {
        return {
            collapsed: false,
            height: document.body.clientHeight
        };
    }
};
</script>
<style lang="less">
html,
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.components-layout-demo {
    .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
            color: #1890ff;
        }
    }

    .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }
}
</style>
