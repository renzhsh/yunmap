<template>
  <div class="yungis-loader dialog-loader" v-drag="config.dragable">
    <div class="dialog-title" style="cursor:move" v-if="config.title">
      {{config.title}}
      <span class="dialog-btns" v-if="config.closable">
        <a class="close" href="javascript:;" @click="$emit('close')"></a>
      </span>
    </div>
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
        return {
          title: "",
          dragable: true, // 可拖动
          closable: true
        };
      }
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-loader {
  min-width: 250px;
  min-height: 300px;
  background-color: #fff;
  -webkit-background-clip: content;
  border-radius: 2px;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 1px 1px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 1px 1px 30px rgba(0, 0, 0, 0.1);
  -webkit-animation-name: fade;
  -o-animation-name: fade;
  animation-name: fade;
  -webkit-animation-duration: 0.8s;
  -o-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-timing-function: linear;
  -o-animation-timing-function: linear;
  animation-timing-function: linear;
  .dialog-title {
    background-color: #1e9fff;
    color: #fff;
    padding: 0 80px 0 15px;
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    overflow: hidden;
    border-radius: 2px 2px 0 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    .dialog-btns {
      position: absolute;
      right: 12px;
      top: 12px;
      font-size: 0;
      line-height: initial;

      a {
        position: relative;
        width: 16px;
        height: 16px;
        margin-left: 10px;
        font-size: 12px;
        display: block;

        &.close {
          background-image: url(./images/close.png);
          background-size: 18px;
        }
      }
    }
  }
}
</style>

