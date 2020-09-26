# 图层说明

## 配置格式

```js
// 所有参数会复制到options属性中
{
    name:'', //名称
    type:'', //类型
    visible: true, // 是否可见
    url:'',
    layers:[] // 子图层，用于type=='group'时
}
```

### type 定义格式

```
[provider]_[layer]
```

### layer 说明

 - vec  矢量底图+注记
 - vecd 矢量底图
 - vecz 矢量注记
 - img  影像底图+注记
 - imgd 影像底图
 - imgz 影像注记
 - ter  地形图+注记
 - terd 地形底图
 - terz 地形注记
 - road 街道
 - time 实时路况

### 1. Leaflet 内置

> type 为空

provider 取值

-   group
-   image
-   tile
-   wms
-   wmts

## 2. 天地图

坐标系为`crs=3857`

> provider = tdt

type 取值

-   vec 矢量底图
-   cva 矢量注记
-   img 影像底图
-   cia 影像注记
-   ter 地形地图
-   cta 地形注记
-   ibo 全球境界

```js
const names = {
    vec: "天地图-矢量底图+注记",
    vecd: "天地图-矢量底图",
    vecz: "天地图-矢量注记",
    img: "天地图-影像底图+注记",
    imgd: "天地图-影像底图",
    imgz: "天地图-影像注记",
    ter: "天地图-地形底图+注记",
    terd: "天地图-地形底图",
    terz: "天地图-地形注记",
    ibo: "天地图-全球境界"
};
```

## 百度

```js
const names = {
    vec: "百度在线-电子地图+注记",
    imgd: "百度在线-卫星底图",
    imgz: "百度在线-卫星注记",
    img: "百度在线-卫星底图+注记",
    time: "百度在线-实时路况"
    // custom: "百度在线"
};

/**
 * bigfont: 大字体
 *
 * style: 自定义样式，可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
 */
 ```

 ## 高德

 ```js
 const names = {
    vec: "高德-电子地图+注记",
    imgd: "高德-卫星底图",
    imgz: "高德-卫星注记",
    img: "高德-卫星底图+注记",
    time: "高德-实时路况"
};

/**
 * bigfont: 大字体
 */
```

## Google

```js
const names = {
    vec: "谷歌-矢量底图",
    imgd: "谷歌-影像底图",
    img: "谷歌-影像底图(注记)",
    ter: "谷歌-地形地图",
    road: "谷歌-街道"
};
```