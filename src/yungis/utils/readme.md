```js
document.onreadystatechange = () => {
    console.dir(document.readyState);
};
```
Document.readyState属性描述了文档的加载状况，一个文档的readyState可能是以下的其中一个：

__loading__ 文档仍然在加载

__interactive__ 文档已经加载完毕而且已经被解析，但是一些子资源，例如图像，样式表和框架还在加载。这个状态表明DOMContentLoaded事件已经被触发

__complete__ 文档和全部的子资源已经加载完毕。这个状态表明load事件已经被触发。
 

当readyState属性值改变的时候，document对象的readystatechange事件被触发。

```js
var head= document.getElementsByTagName('head')[0]; 
var script= document.createElement('script'); 
script.type= 'text/javascript'; 
script.onload = script.onreadystatechange = function() { 
if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) { 
help(); 
// Handle memory leak in IE 
script.onload = script.onreadystatechange = null; 
} }; 
script.src= 'helper.js'; 
head.appendChild(script); 
```
