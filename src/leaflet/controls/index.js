import LFishbone from "./fishbone";
import LMapswich from "./mapswich";
import LToolbar from "./toolbar";
import LLocation from "./LLocation";

import "./minimap";

export { LFishbone, LMapswich, LToolbar, LLocation };

export default {
    install(L, { Vue }) {
        Vue.component("LFishbone", LFishbone);
        Vue.component("LMapswich", LMapswich);
        Vue.component("LToolbar", LToolbar);
        Vue.component("LLocation", LLocation);
    }
};
