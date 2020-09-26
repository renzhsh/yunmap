## L.Draw.Polyline 类

``addHooks``方法中，增加了线面创建的双击结束完成绘制
```js
.on('dblclick', this._onDblclickHndler, this);
```


## L.Draw.Polyline类
``_onMouseMove``方法中，创建线面增加事件 ``draw:drawing``
```js
this._map.fire("draw:drawing", { layer: this._poly, latlng: latlng });
```

## L.Edit.PolyVerticesEdit类
``_onMarkerDrag`` 方法中，增加编辑线面的拖动事件``draw:editing``
```js
if (this._map) {
    this._map.fire('draw:editing', { layer: this._poly });
}
```