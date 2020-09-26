# CRS

## leaflet 内置

 + L.CRS.Simple
 + L.CRS.Earth
 + L.CRS.EPSG4326 // WGS84坐标系
 + L.CRS.EPSG3857 // 球形墨卡托投影, 在线地图的最常见的CRS, 是地图crs option 中的默认值。
 + L.CRS.EPSG3395 // 椭圆形墨卡托投影

## 新建
 + L.CRS.EPSG4490 // 大地2000
 + L.CRS.Baidu // 百度

## 自定义

```js
L.Proj.CRS(code, proj4def, options)
```

## proj4leaflet 

[https://github.com/kartena/Proj4Leaflet](https://github.com/kartena/Proj4Leaflet)

## WGS-84 - 世界大地测量系统
WGS-84（World Geodetic System, WGS）是使用最广泛的坐标系，也是世界通用的坐标系，GPS设备得到的经纬度就是在WGS84坐标系下的经纬度。通常通过底层接口得到的定位信息都是WGS84坐标系。

## GCJ-02 - 国测局坐标
GCJ-02（G-Guojia国家，C-Cehui测绘，J-Ju局），又被称为火星坐标系，是一种基于WGS-84制定的大地测量系统，由中国国测局制定。此坐标系所采用的混淆算法会在经纬度中加入随机的偏移。

国家规定，中国大陆所有公开地理数据都需要至少用GCJ-02进行加密，也就是说我们从国内公司的产品中得到的数据，一定是经过了加密的。绝大部分国内互联网地图提供商都是使用GCJ-02坐标系，包括高德地图，腾讯地图,谷歌地图中国区等。

## BD-09 - 百度坐标系
BD-09（Baidu, BD）是百度地图使用的地理坐标系，其在GCJ-02上多增加了一次变换，用来保护用户隐私。从百度产品中得到的坐标都是BD-09坐标系。

