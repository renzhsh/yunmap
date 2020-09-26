## Leaflet4vue 开发计划

### 基础功能

> `/leaflet/core`

-   [✔] 模块异步加载 `loader/`
-   [✔] 日志 `logger`
-   [✔] http
-   [✔] 类型检查 `util/type`

### 投影

> `/leaflet/core/proj`

-   [✔] 集成`proj4`
-   [✔] 点坐标转换
    -   `jwd` -- `mct`
    -   `bd` -- `gcj`
    -   `bd` -- `wgs`
    -   `wgs` -- `gcj`

### 坐标系

> `/leaflet/core/crs`

-   [✔] L.CRS.Baidu 百度坐标系
-   [✔] L.CRS.EPSG4490 大地 2000
-   [✔] L.CRS.Provider 根据 code 或名称获取坐标系实例

#### Issues

-   [ ] `project`、`unproject`是做什么用的
-   [ ] 集成点坐标转换函数，省去判断当前坐标系、目标坐标系的麻烦

### Layer

> `/leaflet/layer/`

-   [✔] TileLayer `/tile`
    -   [✔] TileLayer.WMTS
        -   [ ] 实现 GetCapabilities 接口
    -   [✔] TileLayer.tdt 天地图
    -   [✔] TileLayer.Baidu 百度
    -   [✔] TileLayer.GaoDe 高德
    -   [✔] TileLayer.Google 谷歌
    -   [✔] TileLayer.osm OpenStreetMap
-   [✔] 经纬网 `graticule`
-   [✔] 昼夜区域 `terminator`
-   [ ] GeoJSON

### Control

> `/leaflet/controls/`

-   [✔] 鱼骨导航 `fishbone`
-   [✔] 鹰眼 `minimap`
-   [✔] 底图切换 `mapswich`
-   [✔] 当前坐标 `LLocation`
-   [✔] 工具条 `toolbar`
    -   [✔] Home
    -   [✔] Locate
    -   [✔] FullScreen

#### Issues

-   [] `mapswich`未确定具体的使用方式

### Esri

[esri-leaflet 官网](https://esri.github.io/esri-leaflet/)

> `/leaflet/esri/`

-   [✔] Layer
-   [] Task

### Marker

-   [] Marker 点标记
-   [] Popup 弹窗
-   [] Tooltip 鼠标提示
