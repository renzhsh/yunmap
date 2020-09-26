import { TypeUtil } from "./util";

const LogLevel = {
    Debug: 0,
    Info: 1,
    Warn: 2,
    Error: 3
};

class Logger {
    constructor() {
        this.level = LogLevel.Error;
    }

    get Level() {
        return this.level;
    }

    /**
     * @param {number} val 0_Debug, 1_Info, 2_Warn, 3_Error
     */
    set Level(val) {
        this.level = val;
    }

    debug(newProblems) {
        if (this.Level >= LogLevel.Debug) {
            if (TypeUtil.isArray(newProblems)) {
                console.group("%c" + "Debug!", "color: #999933;");
                for (let item of newProblems) {
                    console.log(item);
                }
                console.groupEnd();
            } else {
                console.log(...arguments);
            }
        }
    }

    info(newProblems) {
        if (this.Level >= LogLevel.Info) {
            if (TypeUtil.isArray(newProblems)) {
                console.group("%c" + "Info!", "color: #999933;");
                for (let item of newProblems) {
                    console.log(item);
                }
                console.groupEnd();
            } else {
                console.log(...arguments);
            }
        }
    }

    warn(newProblems) {
        if (this.Level >= LogLevel.Warn) {
            if (TypeUtil.isArray(newProblems)) {
                console.group("%c" + "Warning!", "color: #999933;");
                for (let item of newProblems) {
                    console.warn(item);
                }
                console.groupEnd();
            } else {
                console.warn(...arguments);
            }
        }
    }

    error(newProblems) {
        if (this.Level >= LogLevel.Error) {
            if (TypeUtil.isArray(newProblems)) {
                console.group("%c" + "Error!", "color: #999933;");
                for (let item of newProblems) {
                    console.error(item);
                }
                console.groupEnd();
            } else {
                console.error(...arguments);
            }
        }
    }
}

L.logger = new Logger();

export default L.logger;
