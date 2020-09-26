export default {
    bind: function(el, binding) {
        let oDiv = el; //当前元素
        let self = this; //上下文
        oDiv.onmousedown = e => {
            if (binding.value === undefined || binding.value === true) {
                if (e.target.style.cursor != "move") return;
                //鼠标按下，计算当前元素距离可视区的距离
                let disX = e.clientX - oDiv.offsetLeft;
                let disY = e.clientY - oDiv.offsetTop;

                document.onmousemove = e => {
                    //通过事件委托，计算移动的距离
                    let l = e.clientX - disX;
                    let t = e.clientY - disY;
                    //移动当前元素
                    oDiv.style.left = l + "px";
                    oDiv.style.top = t + "px";
                };
                document.onmouseup = e => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        };
    }
};
