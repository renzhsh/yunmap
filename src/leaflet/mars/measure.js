/* 2017-11-22 16:34:48 | 修改 木遥（QQ：346819890） */


var measure = {
    //计算长度
    length: function (coords) {
        if (typeof coords.getLatLngs == 'function') {
            coords = coords.getLatLngs();
        }
        if (coords.length === 0) return 0;

        var total = 0;
        for (var i = 0, n = coords.length - 1; i < n; i++) {
            total += coords[i].distanceTo(coords[i + 1]);
        }
        return total;
    },
    lengthstr: function (coords) {
        return this.lengthFormat(this.length(coords));
    },
    lengthFormat: function (len) {
        if (len > 1000)
            return (len / 1000).toFixed(2) + "公里";
        else
            return len.toFixed(0) + "米";
    },
    geodesicArea: function (coords) {
        return this.area(coords);
    },
    //计算面积
    area: function (coords) {
        if (typeof coords.getLatLngs == 'function') {
            coords = coords.getLatLngs();
        }

        var len = coords.length;
        if (len == 1) {
            coords = coords[0];
            len = coords.length;
        }
        if (len == undefined || len < 3) return 0;

        var area = 0.0, p1, p2;
        var x1 = coords[len - 1].lng;
        var y1 = coords[len - 1].lat;

        for (var i = 0; i < len; i++) {
            var x2 = coords[i].lng, y2 = coords[i].lat;

            area += this.toRadians(x2 - x1) *
                (2 + Math.sin(this.toRadians(y1)) +
                Math.sin(this.toRadians(y2)));
            x1 = x2;
            y1 = y2;
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;

        return Math.abs(area);
    },
    toRadians: function (angleInDegrees) {
        return angleInDegrees * Math.PI / 180;
    },
    areastr: function (coords) {
        return this.areaFormat(this.area(coords));
    },
    areaFormat: function (area) {
        if (area >= 1000000) {
            return (area / 1000000).toFixed(2) + '平方公里';
        }
        else {
            return area.toFixed(0) + '平方米';
        }
    },

    //计算角度【像素坐标，latlng通过map.latLngToContainerPoint 转换下】
    getAngle: function (pt1, pt2) {
        if (!pt1 || !pt2) return 0;

        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;

        //特殊
        if (dx == 0) {
            if (dy == 0) return 0;
            if (dy > 0) return 90;
            if (dy < 0) return 270;
        }

        var arc = Math.atan(dy / dx);
        var a = (arc / Math.PI) * 180;

        //第二、三象限
        if (dx <= 0) {
            a = a + 180;
        }

        //第四象限
        if (dx > 0 && dy < 0) {
            a = a + 360;
        }

        return Number(a.toFixed(0));
    },

     

};


export default measure;