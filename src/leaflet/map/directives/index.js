import drag from "./drag";
import hover from "./hover";

//自定义hover指令
export default {
    install(Vue) {
        Vue.directive("drag", drag);
        Vue.directive("hover", hover);
    }
};
