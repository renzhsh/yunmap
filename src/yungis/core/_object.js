import { iBus, logger } from "../utils";

/**
 * 基类
 */
export class _Object {
    /**
     * 消息总线
     */
    get iBus() {
        return iBus;
    }

    /**
     * 日志
     */
    get logger() {
        return logger;
    }
}
