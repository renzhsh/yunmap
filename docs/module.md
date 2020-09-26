# Leaflet 说明文档

## 模块化

### 定义模块

```js
// add.js
function add(a, b) {
  return a + b;
}

export default {
  install(L, options) {}
};
```

### 加载模块

#### 同步加载

```js
// index.js
import Add from "./add";

L.use(Add);
```

#### 异步加载

为了减小应用打包后的体积，可以把模块打包在一个异步块 (chunk) 中。

```js
L.use(() => import(/* webpackChunkName: "add" */ "./add"));
```

但是，所有的模块都是在应用启动之前加载完成的。为了优化应用的启动速度，可以更近一步，
采用懒加载的模式，在模块调用之前异步加载。

#### 懒加载

```js
//
L.useAsync("moduleName", () => import(/* webpackChunkName: "add" */ "./add"));
```

在调用之前确保模块已加载

```js
await L.plugins.moduleName.ensured();
```

批量指定依赖的模块

```js
await L.plugins.loadAsync(["esri", "leaflet"]);
```
