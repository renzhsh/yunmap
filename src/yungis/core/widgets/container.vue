<template>
  <div class="yungis-widgets-container">
    <keep-alive-x>
      <template v-for="item in widgets">
        <Region
          :key="item.name"
          :keepAlive="item.keepalive"
          :region="item.region"
          :zIndex="item.zIndex"
          :loaderConfig="item"
          @close="dispose(item.name)"
        >
          <component :is="item.componentTag" :options="item.options"></component>
        </Region>
      </template>
    </keep-alive-x>
  </div>
</template>
<script>
/**
 * 组件容器
 */
import Region from "./region";
import { widgetRegister } from "./register";
import { isUtil } from "@yungis/utils";
import keepAliveX from "./keepalive";
export default {
  name: "widgetContainer",
  components: { Region, keepAliveX },
  data() {
    return {
      cache: {}, // 配置缓存
      widgets: [],
      currentZIndex: 200000 // widget z-index
    };
  },
  created() {
    this.$iBus.on("widget:activate", opt => {
      this.activate(opt);
    });
    this.$iBus.on("widget:dispose", name => {
      this.dispose(name);
    });
  },
  methods: {
    activate(opt) {
      let name = "",
        config = {};
      if (isUtil.isString(opt)) {
        name = opt;
      } else if (isUtil.isObject(opt)) {
        name = opt.name;
        config = opt;
      }

      // 已激活
      if (this.widgets.filter(item => item.name === name).length > 0) {
        return;
      }

      let widget = null;
      if (isUtil.isNotNull(this.cache[name])) {
        widget = this.cache[name];
      } else {
        widget = widgetRegister.getConfig(name);
      }

      widget = Object.assign(
        widget,
        {
          zIndex: this.currentZIndex++
        },
        config
      );

      this.cache[name] = widget;

      if (widget.disposeOther) {
        // dispose所有可释放的组件
        this.widgets = this.widgets.filter(item => item.disposable == false);
      }

      this.widgets.push(widget);
    },
    dispose(name) {
      this.widgets = this.widgets.filter(item => item.name !== name);
    }
  }
};
</script>
