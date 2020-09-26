<template>
  <div class="yungis-loader div-loader">
    <slot></slot>
  </div>
</template>
<script>
import "./loader.less";
export default {
  props: {
    config: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>
