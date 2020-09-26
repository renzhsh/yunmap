export default {
    route: {
        layout: "/leaflet",
        routeConfig: [
            {
                name: "widget",
                path: "/widget/main",
                meta: {
                    title: "widget"
                },
                component: resolve => {
                    require(["./Main"], resolve);
                }
            }
        ]
    }
};
