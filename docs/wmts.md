# WMTS服务规范

## 简介
Web Map Tile Service（网络地图瓦片服务），简称WMTS，由开放地理信息联盟（Open GeoSpatial Consortium，OGC）制定，是和WMS并列的重要OGC规范之一。WMTS不同于WMS,它最重要的特征是采用缓存技术能够缓解WebGIS服务器端数据处理的压力，提高交互响应速度，大幅改善在线地图应用客户端的用户体验。WMTS是OGC主推的缓存技术规范，是目前各种缓存技术相互兼容的一种方法。

## 操作列表
WMTS服务支持RESTful访问，其接口包括`GetCapabilities`、`GetTile`和`GetFeatureInfo`3个操作，这些操作允许用户访问切片地图。

|操作|操作|描述|
|--|--|--|
|GetCapabilities|强制实现|获取WMTS的能力文档（即元数据文档），里面包含服务的所有信息|
|GetTile|强制实现|获取地图瓦片。该操作根据客户端发出的请求参数在服务端进行检索，服务器端返回地图瓦片图像。
|GetFeatureInfo|选择实现|通过在WMTS图层上指定一定的条件，返回指定的地图瓦片内容对应的要素信息|
||||

### `GetCapabilities`参数列表

|参数名称|参数个数|参数类型和值|
|--|--|--|
|service|1个(必选)|字符类型，服务类型值为“WMTS”|
|request|1个(必选)|字符类型，值为请求的WMTS的版本号|
|acceptVersions|0或1个(可选)|字符类型，值为请求的WMTS的版本号|
|sections|0或1个(可选)|字符类型，请求元数据文档0或多个节的名称，多个名称之间用“，”隔开，不须按顺序排列。值为空默认返回整个元数据文档|
|updateSequence|0或1个(可选)|字符类型，值为increased，为空时默认返回最新的元数据文档|
|acceptFormat|0或1个(可选)|MIME类型，值为服务元数据的输出格式|
||||

### `GetTile`参数列表
|参数名称|参数个数|参数类型和值|
|--|--|--|
|service|1个(必选)|字符类型，服务类型值为“WMTS”|
|request|1个(必选)|字符类型，请求的操作值为“GetTile”|
|version|1个(必选)|字符类型，值为请求的WMTS的版本号|
|layer|1个(必选)|字符类型，值为请求的图层名称|
|style|1个(必选)|字符类型，值为请求图层的渲染样式|
|format|1个(必选)|字符类型，值为瓦片地图的输出格式|
|tileMatrixSet|1个(必选)|字符类型，瓦片矩阵数据集，其值在服务的元数据文档中指定|
|tileMatrix|1个(必选)|字符类型，瓦片矩阵，其值在服务的元数据文档中指定|
|tileRow|1个(必选)|整型类型，值为大于0的整数，表示瓦片矩阵的行号|
|tileCol|1个(必选)|整型类型，值为大于0的整数，表示瓦片矩阵的列号|
|Other sample dimensions|0或1个(可选)|字符类型，其他允许的参数|
||||

### `GetFeatureInfo`参数列表
|参数名称|参数个数|参数类型和值|
|--|--|--|
|service|1个(必选)|字符类型，服务类型值为“WMTS”|
|request|1个(必选)|字符类型，请求的操作值为“GetTile”|
|version|1个(必选)|字符类型，值为请求的WMTS的版本号|
|J|1个(必选)|整型类型，值为大于0的整数，表示瓦片上一指定像素点的行号|
|I|1个(必选)|整型类型，值为大于0的整数，表示瓦片上一指定像素点的列号|
|info_format|1个(必选)|MIME类型，值为请求信息的返回类型|
|layer, style, format, Sample dimension, tileMatrixSet, tileMatrix, tileRow, tileCol|1个(必选)|这些参数的值应与请求GetTile的相应参数保持一致|

## 调用示例

|操作|示例|
|--|--|
|GetCapabilities操作|http://tdt.fuzhou.gov.cn/serviceaccess/wmts/Vector2012CGCS2000?service=WMTS&request=GetCapabilities|
|GetTile操作|http://tdt.fuzhou.gov.cn/serviceaccess/wmts/Vector2012CGCS2000?service=WMTS&request=GetTile&layer=0&style=default&tileMatrixSet=sss&tileMatrix=10&tileRow=93074&tileCol=435872&format=image/png|
|||