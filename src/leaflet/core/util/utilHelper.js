/**
 *  工具集（内部使用）
 */
export const UtilHelper = {
    /**
     * 获取url中"?"符后的字串
     */
    getParams() {
        var url = location.search;
        var theParams = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theParams[strs[i].split("=")[0]] = decodeURI(
                    strs[i].split("=")[1]
                );
            }
        }
        return theParams;
    }
};
