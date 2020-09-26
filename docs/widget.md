# Widget

1. 组件响应式布局, 控制显示的位置和区域大小
2. 组件管理器统一调度组件的激活和销毁

## 开发计划

-   [✔] 采用绝对定位
-   [✔] ~~响应式布局~~
-   [✔] 组件管理器统一调度组件的激活和销毁
-   [✔] dispose, 控制组件的互斥显示
-   [✔] keep-alive
-   [ ] loader
-   [ ] dragable
-   [ ] 组件获得焦点、失去焦点、鼠标移入移出时的样式变化

## 组件注册

```js
{
    "name":'widgetname',// 如果重名，则后面将前面覆盖
    // 组件的显示区域
    "position": {
        "top": "100px",
        "left": "20px"
    },
    "width": "100px",
    "height": "200px",
    "loader": "div", // 组件加载器，window, modal, div
    "title": "",
    "iframeUrl": "",
    "maxmin": true, // 最大最小化按钮(window, modal时有效)
    "closable": true,
    "disposable": false, //可释放的组件
    "disposeOther": true, // 激活时释放其他可释放的组件
    "keepalive": true, // 是否缓存其状态
    "dragable": true, //可拖动
    "allowPointer": true, // 是否处理鼠标事件
    "component":Component, // 可异步加载， resolve => require(["./xxx"], resolve)
    "props":{}, // 注入到widget的数据
}
```

### 基本用法

```js
{
    "name":'widgetname', // [必填项]
    "component":Component, // [必填项] 可异步加载， resolve => require(["./xxx"], resolve)
    "options":{}, //  [可选] 注入到widget的数据
}
```

### loader

```js
{
    "loader": "div", // 组件加载器：dialog, div, 自定义
    "title": "",
    "dragable": true, // 可拖动
    "closable": true,
}
```

### dispose

```js
{
    "disposable": false, //可释放的组件
    "disposeOther": true, // 激活时释放其他可释放的组件
}
```

### 其他

```js
{
    "keepalive": true, // 是否缓存其状态
}
```
