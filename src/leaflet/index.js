/**************************Leaflet4Vue Core*****************************/
import L from "@leaflet/core";

import Layer from "@leaflet/layer";
import Map from "@leaflet/map";
import Controls from "@/leaflet/controls";

L.use(Layer);

export default {
    install(Vue) {
        L.use(Map, { Vue });
        L.use(Controls, { Vue });
    }
};

/**********************************扩展包******************************/

//Esri
L.useAsync("esri", () =>
    import(/* webpackChunkName: "esri" */ "@leaflet/esri")
);

// Widget
L.useAsync("widgets", () =>
    import(/* webpackChunkName: "widget" */ "@leaflet/widgets")
);
