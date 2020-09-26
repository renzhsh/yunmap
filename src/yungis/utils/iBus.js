import Vue from "vue";

const _vue = new Vue();

/**
 * 消息总线, 提供基本的消息机制
 */
class IBus {
    emit(event, payload) {
        _vue.$emit(event, payload);
    }

    on(event, fn) {
        _vue.$on(event, fn);
    }
}

export const iBus = new IBus();
