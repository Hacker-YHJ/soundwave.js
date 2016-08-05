/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);

	window.Soundwave = __webpack_require__(1);
	

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ease, Func, Soundwave, _, ref,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	ref = __webpack_require__(4), Func = ref.Func, Ease = ref.Ease;

	_ = __webpack_require__(5);

	Soundwave = (function() {
	  var EaseFunc;

	  EaseFunc = 'Sine3InOut';

	  function Soundwave(canvas) {
	    this.canvas = canvas;
	    this.onResize = bind(this.onResize, this);
	    this.start = bind(this.start, this);
	    this.paint = bind(this.paint, this);
	    this.connect = bind(this.connect, this);
	    this.calc = bind(this.calc, this);
	    this.addWave = bind(this.addWave, this);
	    this.tick = 0;
	    this.analyserNode = null;
	    this.funcs = [];
	    this.ctx = this.canvas.getContext('2d');
	    if (typeof window !== "undefined" && window !== null) {
	      window.addEventListener('resize', this.onResize);
	    }
	    this.onResize();
	  }

	  Soundwave.prototype.addWave = function(obj) {
	    if (Func[obj != null ? obj.type : void 0] == null) {
	      throw TypeError("no such type: " + (obj != null ? obj.type : void 0));
	    }
	    if (!Number.isFinite(obj.speed)) {
	      throw TypeError("speed should be a number but got " + obj.speed);
	    }
	    if (!Number.isFinite(obj.waveLength)) {
	      throw TypeError("waveLength should be a number but got " + obj.waveLength);
	    }
	    if (!Number.isFinite(obj.amplitude)) {
	      throw TypeError("amplitude should be a number but got " + obj.amplitude);
	    }
	    if (!Number.isFinite(obj.shift)) {
	      throw TypeError("shift should be a number but got " + obj.shift);
	    }
	    return this.funcs.push(Func[obj.type](obj.speed, obj.waveLength, obj.amplitude, obj.shift));
	  };

	  Soundwave.prototype.calc = function() {
	    ++this.tick;
	    return window.requestAnimationFrame(this.paint);
	  };

	  Soundwave.prototype.connect = function(analyserNode) {
	    this.analyserNode = analyserNode;
	    return this.analyserDataArray = new Uint8Array(1 << 10);
	  };

	  Soundwave.prototype.paint = function() {
	    var easing;
	    if (this.analyserNode != null) {
	      this.analyserNode.getByteFrequencyData(this.analyserDataArray);
	      easing = Ease.fromFrequencyArray(this.canvas.width, this.analyserDataArray);
	    } else {
	      easing = this.ease;
	    }
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.funcs.forEach((function(_this) {
	      return function(func, i) {
	        var j;
	        _this.ctx.beginPath();
	        j = 0;
	        _this.ctx.moveTo(j, _this.projector(easing(j, func(j, _this.tick))));
	        while (++j < _this.canvas.width) {
	          _this.ctx.lineTo(j, _this.projector(easing(j, func(j, _this.tick))));
	        }
	        return _this.ctx.stroke();
	      };
	    })(this));
	    return nextTick(this.calc);
	  };

	  Soundwave.prototype.start = function() {
	    return this.calc();
	  };

	  Soundwave.prototype.onResize = function() {
	    var rect;
	    rect = this.canvas.getBoundingClientRect();
	    this.canvas.width = rect.width;
	    this.canvas.height = rect.height;
	    this.ctx.lineWidth = 1;
	    this.ctx.strokeStyle = 'rgba(0, 0, 0, .4)';
	    this.projector = _.createProjectToCanvas(this.canvas.height);
	    return this.ease = Ease[EaseFunc](this.canvas.width);
	  };

	  return Soundwave;

	})();

	module.exports = Soundwave;
	

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	window.nextTick = (function() {
	  var handler, queue;
	  if (typeof window !== "undefined" && window !== null ? window.setImmediate : void 0) {
	    return window.setImmediate;
	  } else if (((typeof window !== "undefined" && window !== null ? window.postMessage : void 0) != null) && ((typeof window !== "undefined" && window !== null ? window.addEventListener : void 0) != null)) {
	    queue = [];
	    handler = function(ev) {
	      var fn, source;
	      source = ev.source;
	      if ((source === window || source === null) && ev.data === 'next tick') {
	        ev.stopPropagation();
	        if (queue.length > 0) {
	          fn = queue.shift();
	          return fn();
	        }
	      }
	    };
	    window.addEventListener('message', handler, true);
	    return function(fn) {
	      queue.push(fn);
	      return window.postMessage('next tick', '*');
	    };
	  } else {
	    return function(f) {
	      return setTimeout(fn, 0);
	    };
	  }
	})();
	

/***/ },
/* 4 */
/***/ function(module, exports) {

	var HalfPi, PI2, easeSine3InOut, fromFrequencyArray, sine, square, triangle;

	HalfPi = Math.PI / 2;

	PI2 = Math.PI * 2;

	sine = function(speed, waveLength, amp, shift) {
	  var i, results, values;
	  values = (function() {
	    results = [];
	    for (var i = 0; 0 <= waveLength ? i < waveLength : i > waveLength; 0 <= waveLength ? i++ : i--){ results.push(i); }
	    return results;
	  }).apply(this).map(function(e) {
	    return amp * Math.sin(e * PI2 / waveLength + shift);
	  });
	  return function(x, tick) {
	    var idx;
	    idx = (x - tick * speed) % waveLength;
	    idx = (idx + waveLength) % waveLength;
	    return values[idx];
	  };
	};

	square = function(speed, waveLength, amp, shift) {
	  var i, results, values;
	  values = (function() {
	    results = [];
	    for (var i = 0; 0 <= waveLength ? i < waveLength : i > waveLength; 0 <= waveLength ? i++ : i--){ results.push(i); }
	    return results;
	  }).apply(this).map(function(e) {
	    return amp * (Math.floor((e / waveLength) * 2) * 2 - 1);
	  });
	  return function(x, tick) {
	    var idx;
	    idx = (x - tick * speed) % waveLength;
	    idx = (idx + waveLength) % waveLength;
	    return values[idx];
	  };
	};

	triangle = function(speed, waveLength, amp, shift) {
	  var i, results, values;
	  values = (function() {
	    results = [];
	    for (var i = 0; 0 <= waveLength ? i < waveLength : i > waveLength; 0 <= waveLength ? i++ : i--){ results.push(i); }
	    return results;
	  }).apply(this).map(function(e) {
	    var x;
	    x = e / waveLength;
	    if (x < 0.5) {
	      return amp * (-1 + x * 4);
	    } else {
	      return amp * (3 - x * 4);
	    }
	  });
	  return function(x, tick) {
	    var idx;
	    idx = (x - tick * speed) % waveLength;
	    idx = (idx + waveLength) % waveLength;
	    return values[idx];
	  };
	};

	easeSine3InOut = function(width) {
	  var i, results, value;
	  value = (function() {
	    results = [];
	    for (var i = 0; 0 <= width ? i <= width : i >= width; 0 <= width ? i++ : i--){ results.push(i); }
	    return results;
	  }).apply(this).map(function(e) {
	    var sinX;
	    sinX = Math.sin((e / width) * Math.PI);
	    return Math.pow(sinX, 3);
	  });
	  return function(x, y) {
	    return y * value[x];
	  };
	};

	fromFrequencyArray = function(width, arr) {
	  return function(x, y) {
	    return y * arr[~~(x * arr.length / width)] / 256;
	  };
	};

	module.exports = {
	  Func: {
	    sine: sine,
	    square: square,
	    triangle: triangle
	  },
	  Ease: {
	    Sine3InOut: easeSine3InOut,
	    fromFrequencyArray: fromFrequencyArray
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Util;

	Util = (function() {
	  function Util() {}

	  Util.createProjectToCanvas = function(height) {
	    return function(input) {
	      return height * .5 * (1 + input);
	    };
	  };

	  return Util;

	})();

	module.exports = Util;
	

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map