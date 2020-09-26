/**
 * 类型与非空判断
 */
class IsUtil {
    isArray(obj) {
        return typeof obj == "object" && obj.constructor == Array;
    }

    isString(str) {
        return typeof str == "string" && str.constructor == String;
    }

    isNumber(obj) {
        return typeof obj == "number" && obj.constructor == Number;
    }

    isDate(obj) {
        return typeof obj == "object" && obj.constructor == Date;
    }

    isFunction(obj) {
        return typeof obj == "function" && obj.constructor == Function;
    }

    isObject(obj) {
        return typeof obj == "object" && obj.constructor == Object;
    }

    isNull(value) {
        if (value == null) return true;
        if (this.isString(value) && value === "") return true;
        if (this.isNumber(value) && isNaN(value)) return true;

        return false;
    }

    isNotNull(value) {
        return !this.isNull(value);
    }
}

export const isUtil = new IsUtil();
