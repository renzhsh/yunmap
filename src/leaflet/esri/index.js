import * as esri from "esri-leaflet";
import { FeatureLayer, featureLayer, VERSION } from "esri-leaflet-cluster";
import _createLayer from "./createLayer";

export default {
    install(L) {
        Object.defineProperties(esri, {
            createLayer: {
                get() {
                    return _createLayer;
                }
            },
            Cluster: {
                get() {
                    return {
                        FeatureLayer,
                        featureLayer,
                        VERSION
                    };
                }
            }
        });
        L.esri = esri;
    }
};
