import Leaflet from './leaflet';
import Yungis from "./yungis";

const ErrorPage={
    route: {
        routeConfig: [
            {
                name: "*",
                path: "*",
                hidden: true,
                component: resolve => {
                    require(["@/components/404"], resolve);
                }
            }
        ]
    }
};

export default [...Leaflet, Yungis, ErrorPage];
