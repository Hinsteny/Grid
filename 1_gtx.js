(function(){
	var Gtx = function(arg) {
		var ctx = arg;
		if (arg.jquery) {
			arg = arg.get(0);
		}

		if ($.isFunction(arg.getContext)) {
			ctx = arg.getContext('2d');
		}

		if (!(this instanceof Gtx)) {
			return new Gtx(ctx);
		}

		this.context = this.ctx = ctx;

		if (!this.beginPath) {
			setupPrototype();
		}
	}
	
	Gtx.version = "0.5.0-SNAPSHOT";

	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
			module.exports = exports = Gtx;
	} else if ( typeof define === "function" && define.amd ) {
			define( "Gtx", [], function () { return Gtx; } );
	} else {
			window.Gtx = Gtx;
	}

	Gtx.prototype.fitParent = function() {
		var canvas = this.canvas();
		if (canvas) {
			var canvas = this.canvas();
			var $parent = $(canvas).parent();
			// we might want to use innerWidth/Height here.
			canvas.width = $parent.width();
			canvas.height = $parent.height();
		}


		return this;
	}

	Gtx.prototype.clear = function() {
		if (this.canvas()) {
			this.canvas().width = this.canvas().width;
		}

		return this;
	}

	Gtx.prototype.createLinearGradient = function(x0, y0, x1, y1) {
		var ctxGradient = this.ctx.createLinearGradient(x0, y0, x1, y1);
		var gtxGradient = new Gradient(ctxGradient);
		return gtxGradient;
	}

	Gtx.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
		var ctxGradient = this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		var gtxGradient = new Gradient(ctxGradient);
		return gtxGradient;
	}

	Gtx.prototype.setFillStyle = function(arg) {
		return setStyle(this, "fillStyle", arg);
	}

	Gtx.prototype.setStrokeStyle = function(arg) {
		return setStyle(this, "strokeStyle", arg);
	}

	function setStyle(g, type, arg) {
		if (!arg) {
			return g.ctx[type];
		}

		if (arg.ctxGradient) {
			arg = arg.ctxGradient;
		}

		g.ctx[type] = arg;
		return g;
	}

	function Gradient(ctxGradient) {
		this.ctxGradient = ctxGradient;
	}

	Gradient.prototype.addColorStop = function() {
		this.ctxGradient.addColorStop.apply(this.ctxGradient, arguments);
		return this;
	}

	Gradient.prototype.addColorStops = function() {
		for ( var i = 0; (i + 1) < arguments.length; i += 2) {
			this.ctxGradient.addColorStop(arguments[i], arguments[i + 1]);
		}

		return this;
	}

	function setupPrototype() {
		var methods = [ 'beginPath', 'clip', 'closePath', 'drawImage', 'fill', 'fillText', 
						 'arc','arcTo', 'lineTo', 'moveTo', 'bezierCurveTo', 'quadraticCurveTo', 'rect',
						 'clearRect','fillRect','strokeRect','translate', 'rotate', 'save', 
						 'scale', 'setTransform', 'stroke', 'strokeText', 'transform', 'setLineDash' ];

		var getterMethods = [ 'createPattern', 'drawFocusRing', 'isPointInPath', 'measureText', 'getLineDash',
							  'createImageData', 'getImageData', 'putImageData' 
		];

		var props = [ 'canvas',
			'font', 'globalAlpha', 'globalCompositeOperation', 'lineCap', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'textAlign', 'textBaseline' ];

		var gmethl, propl;
		for ( var i = 0, methl = methods.length; i < methl; i++) {
			var m = methods[i];
			Gtx.prototype[m] = (function(m) {
				return function() {
					this.ctx[m].apply(this.ctx, arguments);
					return this;
				};
			}(m));
		}

		for (i = 0, gmethl = getterMethods.length; i < gmethl; i++) {
			var gm = getterMethods[i];
			Gtx.prototype[gm] = (function(gm) {
				return function() {
					return this.ctx[gm].apply(this.ctx, arguments);
				};
			}(gm));
		}

		for (i = 0, propl = props.length; i < propl; i++) {
			var p = props[i];
			Gtx.prototype[p] = (function(p) {
				return function(value) {
					if (typeof value === 'undefined') {
						return this.ctx[p];
					}
					this.ctx[p] = value;
					return this;
				};
			}(p));
		}
	}

})();