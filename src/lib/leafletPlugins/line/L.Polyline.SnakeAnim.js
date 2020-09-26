
L.Polyline.include({
    //是否播放完成
    _snaking: false,
    //已经访问过的多少路径和顶点
    _snakingRings: 0,
    _snakingVertices: 0,
    //从最后一个顶点绘制（屏幕像素）的距离
    _snakingDistance: 0,
    snakeIn: function () {
        if (this._snaking) { return; }

        if (!('performance' in window) ||
		     !('now' in window.performance) ||
		     !this._map) {
            return;
        }

        this._snaking = true;
        this._zt_sate = false;
        this._snakingTime = performance.now();
        this._snakingVertices = this._snakingRings = this._snakingDistance = 0;

        if (!this._snakeLatLngs) {
            this._snakeLatLngs = L.Polyline._flat(this._latlngs) ?
				[this._latlngs] :
				this._latlngs;
        }

        // Init with just the first (0th) vertex in a new ring
        // Twice because the first thing that this._snake is is chop the head.
        this._latlngs = [[this._snakeLatLngs[0][0], this._snakeLatLngs[0][0]]];

        this.options.color_defaule = this.options.color;

        this._update();
        this._snake();
        this.fire('snakestart');
        return this;
    },
    _zt_sate: false,
    snakeZT: function () {
        this._zt_sate = true;
    },
    //继续
    snakeJX: function () {
        if (!this._zt_sate) return;
        this._zt_sate = false;

        this._snakingTime = performance.now();
        this._snake();
    },
    snakeOut: function () {
        this._snakeEnd();
    },
    _snake: function () {
        if (!this._snaking || this._zt_sate) return;

        var now = performance.now();
        var diff = now - this._snakingTime;	// In milliseconds
        var forward = diff * this.options.snakingSpeed / 1000;	// In pixels
        this._snakingTime = now;

        // Chop the head from the previous frame
        this._latlngs[this._snakingRings].pop();

        return this._snakeForward(forward);
    },

    _snakeForward: function (forward) {
        if (!this._snaking || this._zt_sate) return;

        // Calculate distance from current vertex to next vertex
        var currPoint = this._map.latLngToContainerPoint(
			this._snakeLatLngs[this._snakingRings][this._snakingVertices]);
        var nextPoint = this._map.latLngToContainerPoint(
			this._snakeLatLngs[this._snakingRings][this._snakingVertices + 1]);

        var distance = currPoint.distanceTo(nextPoint);

        //console.log('Distance to next point:', distance, '; Now at: ', this._snakingDistance, '; Must travel forward:', forward);
        //console.log('Vertices: ', this._latlngs);

        if (this._snakingDistance + forward > distance) {
            // Jump to next vertex
            this._snakingVertices++;
            this._latlngs[this._snakingRings].push(this._snakeLatLngs[this._snakingRings][this._snakingVertices]);

            if (this._snakingVertices >= this._snakeLatLngs[this._snakingRings].length - 1) {
                if (this._snakingRings >= this._snakeLatLngs.length - 1) {
                    return this._snakeEnd();
                } else {
                    this._snakingVertices = 0;
                    this._snakingRings++;
                    this._latlngs[this._snakingRings] = [
						this._snakeLatLngs[this._snakingRings][this._snakingVertices]
                    ];
                }
            }

            this._snakingDistance -= distance;
            return this._snakeForward(forward);
        }

        this._snakingDistance += forward;

        var percent = this._snakingDistance / distance;

        var headPoint = nextPoint.multiplyBy(percent).add(
			currPoint.multiplyBy(1 - percent)
		);

        // Put a new head in place.
        var headLatLng = this._map.containerPointToLatLng(headPoint);
        this._latlngs[this._snakingRings].push(headLatLng);


        this.setStyle({ color: this.options.color_snake || '#ff0000' });

        this.setLatLngs(this._latlngs);
        this.fire('snake', {
            latlng: headLatLng,
            point: currPoint,
            nextPoint: nextPoint,
        });
        L.Util.requestAnimFrame(this._snake, this);
    },

    _snakeEnd: function () {
        if (!this._snaking) return;

        this.setLatLngs(this._snakeLatLngs);
        this.setStyle({ color: this.options.color_defaule });

        this._snaking = false;
        this._zt_sate = false;
        this.fire('snakeend', {
            latlng: this._snakeLatLngs[this._snakeLatLngs.length-1], 
        });
    }

});


L.Polyline.mergeOptions({
    snakingSpeed: 300	// In pixels/sec
});





L.LayerGroup.include({

    _snakingLayers: [],
    _snakingLayersDone: 0,
    _snaking: false,
    snakeIn: function () {
        if (!('performance' in window) ||
		     !('now' in window.performance) ||
		     !this._map ||
		     this._snaking) {
            return;
        }
        this._snaking = true;
        this._snakingLayers = [];
        this._snakingLayersDone = 0;
        var keys = Object.keys(this._layers);
        for (var i in keys) {
            var key = keys[i];
            this._snakingLayers.push(this._layers[key]);
        }
        this.clearLayers();

        this.fire('snakestart');
        return this._snakeNext();
    },
    //停止
    snakeOut: function () {
        this._snaking = false;
        this._zt_sate = false;
        if (this.intervalID != -1)
            clearTimeout(this.intervalID);

        for (var i = 0; i < this._snakingLayers.length; i++) {
            var layer = this._snakingLayers[i];
            if (layer == null) continue;

            if (layer.hasOwnProperty('snakeOut'))
                layer.snakeOut();
            this.addLayer(layer);
        }
        this.fire('snakeend');
    },
    //暂停
    intervalID: -1,
    _zt_sate: false,
    snakeZT: function () {
        this._zt_sate = true;

        if (this.intervalID != -1)
            clearTimeout(this.intervalID);
    },
    //继续
    snakeJX: function () {
        if (!this._zt_sate) return;

        this._zt_sate = false;
        this._snakeNext();
    },
    getLastLayer: function () {
        if (this._snakingLayersDone >= this._snakingLayers.length) {
            return this._snakingLayers[this._snakingLayers.length - 1];
        }

        var currentLayer = this._snakingLayers[this._snakingLayersDone];
        if (currentLayer == null) {
            return this._snakingLayers[this._snakingLayers.length - 1];
        }
        return currentLayer;
    },
    _snakeNext: function () {
        if (this._zt_sate) {
            return;
        }

        if (this._snakingLayersDone >= this._snakingLayers.length) {
            this.fire('snakeend');
            this._snaking = false;
            this._zt_sate = false;
            return;
        }

        var currentLayer = this._snakingLayers[this._snakingLayersDone];
        if (currentLayer == null) {
            this.fire('snakeend');
            this._snaking = false;
            this._zt_sate = false;
            return;
        }

        this._snakingLayersDone++;

        this.addLayer(currentLayer);
        if ('snakeIn' in currentLayer) {
            currentLayer.once('snakeend', function () {
                if (!this._snaking) return;
                this.intervalID = setTimeout(this._snakeNext.bind(this), this.options.snakingPause);
            }, this);
            currentLayer.snakeIn();
        } else {
            this.intervalID = setTimeout(this._snakeNext.bind(this), this.options.snakingPause);
        }


        this.fire('snake');
        return this;
    }

});


L.LayerGroup.mergeOptions({
    snakingPause: 200
});







