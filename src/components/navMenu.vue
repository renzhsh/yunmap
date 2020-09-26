<template>
    <a-menu theme="dark" mode="inline" @select="onSelect">
        <template v-for="item in list">
            <a-sub-menu v-if="item.children" :key="item.name">
                <span slot="title">
                    <a-icon :type="item.icon" />
                    <span>{{ item.title }}</span>
                </span>
                <a-menu-item v-for="ch in item.children" :key="ch.path">
                    <a-icon :type="ch.icon" />
                    <span>{{ ch.title }}</span>
                </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.path">
                <a-icon :type="item.icon" />
                <span>{{ item.title }}</span>
            </a-menu-item>
        </template>
    </a-menu>
</template>
<script>
export default {
    data() {
        return {
            list: []
        };
    },
    mounted() {
        var mapper = _ => {
            return Object.assign(
                {
                    icon: "user",
                    title: "未定义"
                },
                {
                    name: _.name,
                    path: _.path
                },
                _.meta
            );
        };
        this.list = this.$auth2.AccessMenu.filter(item => !item.hidden).map(
            item => {
                var menu = mapper(item);

                if (item.children && item.children.length) {
                    menu.children = item.children.map(item => mapper(item));
                }

                return menu;
            }
        );
    },
    methods: {
        onSelect({ item, key, selectedKeys }) {
            this.$router.push({ path: key });
        }
    }
};
</script>
