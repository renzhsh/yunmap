<template>
  <div class="yungis-debug-bar">
    <span class="item">
      <a href="javascript:;" @click="activate('hello')">hello</a>
    </span>
    <span class="item">
      <a href="javascript:;" @click="dispose('hello')">dispose</a>
    </span>
  </div>
</template>
<script>
export default {
  methods: {
    activate(name) {
      this.$iBus.emit("widget:activate", name);
    },
    dispose(name){
      this.$iBus.emit("widget:dispose", name);
    }
  }
};
</script>
<style lang="less" scoped>
.yungis-debug-bar {
  background-color: darkgray;
  padding: 10px;
  .item {
    + .item {
      margin-left: 10px;
    }
  }
}
</style>
