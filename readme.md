# Leaflet 集成化开发框架

分为`leaflet4vue`和`yungis`两部分。

`leaflet4vue`负责地图底层功能的集成，包括 Layer、Control、Marker、Draw、esri 支持、CRS 和 Projection 等。

`yungis`负责业务功能的集成，偏重于业务交互，包括图层管理、打印、测量、分屏、可视化等。

## 特性

-   `es6`模块化
-   去除`jquery`依赖
-   支持`vue`
-   可配置
-   高度集成

## 1+N 架构

**1** , 消息总线`iBus`。负责消息传递和方法调用。

**N** , `handlers`。

`handler`负责初始化配置，提供当前的状态信息，提供集成化的 API，保证负责模块的独立和稳定， 但 **不处理具体的功能逻辑** 。

-   `MapHandler`
    -   初始化配置
    -   状态信息，包括 center, zoom 等
    -   API， setView, ZoomIn, ZoomOut
-   `ControlHandler`
    -   初始化配置
    -   状态信息，包括当前加载了哪些控件，控件的配置和状态
    -   API, 添加和移除控件，调度控件
    -   稳定性，通过不同途径添加同一控件、不同控件展示在相同位置等情况的处理。
-   `LayerHandler`
    -   初始化配置
    -   状态信息，包括当前加载了哪些图层，图层的配置和状态
    -   API, 添加和移除图层
    -   稳定性，保证图层的正确分层，使底图、注记、覆盖物都正常可见。
-   `widgetHandler`
    -   初始化配置
    -   状态信息
    -   API
    -   稳定性

## 开发计划

-   [1+N](./docs/plan/1+N.md)
-   [Leaflet4vue](./docs/plan/leaflet.md)
-   [Yungis](./docs/plan/yungis.md)
