export default {
    route: {
        layout: "/leaflet",
        routeConfig: [
            {
                name: "esri-layer",
                path: "/esri/layer",
                meta: {
                    title: "Esri图层"
                },
                component: resolve => {
                    require(["./Main"], resolve);
                }
            }
        ]
    }
};
