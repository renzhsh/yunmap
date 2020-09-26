# leaflet 类关系图

不是继承关系，是按照类的功能划分的组织关系

## 官方类

 - L.Map
 - L.Control
    - L.Control.Attribution
    - L.Control.Layers
    - L.Control.Scale
    - L.Control.Zoom
 - L.Layer
    - L.ImageOverlay
    - L.DivOverlay
        - L.Popup
        - L.Tooltip
    - L.Marker
        - L.Icon
            - L.Icon.Default
            - L.DivIcon
    - L.GridLayer
        - L.TileLayer
            - L.TileLayer.WMS
    - L.Path
        - L.Renderer
            - L.SVG
            - L.Canvas
        - L.Polyline
        - L.Polygon
        - L.Rectangle
        - L.CircleMarker
        - L.Circle
    - L.LayerGroup
        - L.FeatureGroup
        - L.GeoJSON
 - L.CRS
    - L.CRS.Simple
    - L.CRS.Earth
        - L.CRS.EPSG3395
        - L.CRS.EPSG3857
        - L.CRS.EPSG4326
 - L.Projection
    - L.Projection.LonLat
    - L.Projection.Mercator
    - L.Projection.SphercalMercator
 - L.Handler
    - L.Map.BoxZoom
    - L.Map.DoubleClickZoom
    - L.Map.Drag
    - L.Map.Keyboard
    - L.Map.ScrollWheelZoom
    - L.Map.Tap
    - L.Map.TouchZoom
 - L.Point
 - L.LatLng
 - L.Bounds
 - L.LatLngBounds
 - L.Browser
 - L.DomEvent
 - L.DomUtil
 - L.Util

 ## Leaflet 扩展
  - L.AsyncLoader
  - L.Draw
  - L.Esri
  - L.Widget
  - L.Control
    - xxx
    - xxx

## Yungis 扩展
 - L.Visual
 - L.Widgets
    - xxx
    - xxx
    - xxx


