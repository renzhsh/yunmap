/**********************第三方插件*************************/

import Antd from "@/components/antd";
import SpringX from "rzs-spring";

/**********************自定义插件*************************/

import Leaflet4Vue from "leaflet4vue";

/**********************功能模块配置**********************/

import App from "@/App.vue";
import Examples from "@/examples";

const spring = new SpringX();

spring
    .use([Antd, Leaflet4Vue])
    .use(Examples)
    .setup({
        el: "#app",
        render: h => h(App)
    });
