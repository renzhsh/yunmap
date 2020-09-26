import Create from "./create";
import Esri from "./esri";
import Widget from "./widget";

const Layout = {
    route: {
        routeConfig: [
            {
                name: "leaflet",
                path: "/leaflet",
                meta: {
                    title: "leaflet"
                },
                component: resolve => {
                    require(["./leaflet"], resolve);
                }
            }
        ]
    }
};

export default [Layout, Create, Esri, Widget];
