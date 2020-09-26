/**
 * 类型与非空判断
 */
export const TypeUtil = {
    isArray(obj) {
        return typeof obj == "object" && obj.constructor == Array;
    },

    isString(str) {
        return typeof str == "string" && str.constructor == String;
    },

    isNumber(obj) {
        return typeof obj == "number" && obj.constructor == Number;
    },

    isDate(obj) {
        return typeof obj == "object" && obj.constructor == Date;
    },

    isFunction(obj) {
        return typeof obj == "function" && obj.constructor == Function;
    },

    isObject(obj) {
        return typeof obj == "object" && obj.constructor == Object;
    },

    isNull(value) {
        // 0 not null
        if (value === 0) return false;
        if (value === false) return false;
        if (!value) return true;
        return false;
    },
    isNullOrEmpty(value) {
        if (value === 0) return false;
        if (value === false) return false;
        if (!value) return true;
        // 空字符串
        if (/^[ ]+$/g.test(value)) return true;

        return false;
    }
};
