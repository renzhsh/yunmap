import { isUtil } from "./isUtil";

export const LogLevel = {
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

    set Level(val) {
        this.level = val;
    }

    debug(newProblems) {
        if (LogLevel.Debug >= this.Level) {
            if (isUtil.isArray(newProblems)) {
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
        if (LogLevel.Info >= this.Level) {
            if (isUtil.isArray(newProblems)) {
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

    warning(newProblems) {
        if (LogLevel.Warn >= this.Level) {
            if (isUtil.isArray(newProblems)) {
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
        if (LogLevel.Error >= this.Level) {
            if (isUtil.isArray(newProblems)) {
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

export const logger = new Logger();
