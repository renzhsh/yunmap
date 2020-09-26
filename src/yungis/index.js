export * from "./utils";
export * from "./core";

import { widgetRegister, drag } from "./core";
import { iBus, logger } from "./utils";
import widgets from "./widgets";

export default {
    install(Vue, options) {
        widgetRegister.register(widgets);

        Vue.directive('drag', drag);

        Object.defineProperties(Vue.prototype, {
            $iBus: {
                get: function() {
                    return iBus;
                }
            },
            $logger: {
                get: function() {
                    return logger;
                }
            }
        });
    }
};
