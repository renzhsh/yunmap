// vue.config.js
module.exports = {
    chainWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            config.externals({
                axios: "axios",
                "enquire.js": "enquire.js",
                jquery: "$",
                leaflet: "L",
                proj4: "proj4",
                vue: "Vue"
            });
        }

        /**
         * svg
         */
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();
        svgRule.use("vue-svg-loader").loader("vue-svg-loader");

        config.resolve.alias
            .set("@leaflet", "@/leaflet") // leaflet内部访问
            .set("@yungis", "@/yungis") // yungis内部访问
            .set("leaflet4vue", "@leaflet") // 外部调用
            .set("yungis", "@/yungis"); // 外部调用
    }
};
