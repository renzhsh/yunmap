<template>
  <div class="yungis-widget-region" :style="[layoutStyle, otherStyle]">
    <component :is="loaderX" :config="loaderConfig" @close="$emit('close')">
      <slot></slot>
    </component>
  </div>
</template>
<script>
/**
 * 组件基类
 */
import { deviceMixin } from "@yungis/core/mixins";
import { layoutMixin } from "./layoutMixin";
import { DivLoader, DialogLoader } from "./loader";
export default {
  components: { DivLoader, DialogLoader },
  mixins: [deviceMixin, layoutMixin],
  props: {
    zIndex: {
      type: Number,
      default: 200001
    },
    allowPointer: {
      type: Boolean,
      default: true
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    loaderConfig: {
      type: Object,
      default: function() {
        return {
          loader: "div"
        };
      }
    }
  },
  computed: {
    otherStyle() {
      return {
        "z-index": this.zIndex,
        "pointer-events": this.allowPointer ? "all" : "none"
      };
    },
    loaderX() {
      let _loader = this.loaderConfig.loader;
      switch (_loader) {
        case "dialog":
          return "DialogLoader";
        case "div":
          return "DivLoader";
        default:
          return _loader; // 允许自定义loader
      }
    }
  }
};
</script>

