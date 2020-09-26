import enquireJs from "enquire.js";
import { logger } from "@yungis/utils";

export const deviceMixin = {
    mounted() {
        this.deviceEnquire();
        window.addEventListener("resize", () => {
            this.deviceEnquire();
        });
    },
    data() {
        return {
            device: ""
        };
    },
    computed: {
        // <576px
        isXS() {
            return this.device == "xs";
        },
        // ≥576px
        isSM() {
            return this.device == "sm";
        },
        // ≥768px
        isMD() {
            return this.device == "md";
        },
        // ≥992px
        isLG() {
            return this.device == "lg";
        },
        // ≥1200px
        isXL() {
            return this.device == "xl";
        },
        // ≥1600px
        isXXL() {
            return this.device == "xxl";
        }
    },
    methods: {
        deviceEnquire() {
            enquireJs
                .register("screen and (max-width: 576px)", {
                    match: () => {
                        this.device = "xs";
                        logger.debug("device: deviceEnquire", this.device);
                    }
                })
                .register(
                    "screen and (min-width: 576px) and (max-width: 767px)",
                    {
                        match: () => {
                            this.device = "sm";
                            logger.debug("device: deviceEnquire", this.device);
                        }
                    }
                )
                .register(
                    "screen and (min-width: 768px) and (max-width: 991px)",
                    {
                        match: () => {
                            this.device = "md";
                            logger.debug("device: deviceEnquire", this.device);
                        }
                    }
                )
                .register(
                    "screen and (min-width: 992px) and (max-width: 1199px)",
                    {
                        match: () => {
                            this.device = "lg";
                            logger.debug("device: deviceEnquire", this.device);
                        }
                    }
                )
                .register(
                    "screen and (min-width: 1200px) and (max-width: 1599px)",
                    {
                        match: () => {
                            this.device = "xl";
                            logger.debug("device: deviceEnquire", this.device);
                        }
                    }
                )
                .register("screen and (min-width: 1600px)", {
                    match: () => {
                        this.device = "xxl";
                        logger.debug("device: deviceEnquire", this.device);
                    }
                });
        }
    }
};
