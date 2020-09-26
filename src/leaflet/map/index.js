import LMap from "./LMap";
import LDirectives from "./directives";

export default {
    install(L, { Vue }) {
        Vue.use(LDirectives);
        Vue.component("LMap", LMap);
    }
};
