import "ant-design-vue/dist/antd.css";
import {
    Button,
    Icon,
    Layout,
    Menu,
    Tree,
    Tooltip,
    Slider,
    Collapse
} from "ant-design-vue";

/**
 * https://github.com/vueComponent/ant-design-vue/blob/master/site/components.js
 */
export default {
    install(Vue) {
        Vue.use(Button);
        Vue.use(Icon);
        Vue.use(Layout);
        Vue.use(Menu);
        Vue.use(Tree);
        Vue.use(Tooltip);
        Vue.use(Slider);
        Vue.use(Collapse);
    }
};
