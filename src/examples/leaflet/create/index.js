export default {
    route: {
        layout: "/leaflet",
        routeConfig: [
            {
                name: "create-vue",
                path: "/leaflet/create-vue",
                meta: {
                    title: "创建地图Vue"
                },
                component: resolve => {
                    require(["./createVue"], resolve);
                }
            },
            {
                name: "create-native",
                path: "/leaflet/create-native",
                meta: {
                    title: "创建地图Native"
                },
                component: resolve => {
                    require(["./createNative"], resolve);
                }
            },
            {
                name: "control",
                path: "/leaflet/control",
                meta: {
                    title: "控件"
                },
                component: resolve => {
                    require(["./control"], resolve);
                }
            }
        ]
    }
};
