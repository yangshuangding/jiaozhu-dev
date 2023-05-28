'use strict';
var LeaderLine = function() {
  /**
   * @param {number} i
   * @return {?}
   */
  function t(i) {
    if (n[i]) {
      return n[i].exports;
    }
    var module = n[i] = {
      i : i,
      l : false,
      exports : {}
    };
    return filters[i].call(module.exports, module, module.exports, t), module.l = true, module.exports;
  }
  /**
   * @return {undefined}
   */
  function tick() {
    /** @type {number} */
    var x = Date.now();
    /** @type {boolean} */
    var o = false;
    if (result) {
      r.call(window, result);
      /** @type {null} */
      result = null;
    }
    results.forEach(function(config) {
      var width;
      var i;
      var r;
      if (config.framesStart) {
        if ((width = x - config.framesStart) >= config.duration && config.count && config.loopsLeft <= 1) {
          return r = config.frames[config.lastFrame = config.reverse ? 0 : config.frames.length - 1], config.frameCallback(r.value, true, r.timeRatio, r.outputRatio), void(config.framesStart = null);
        }
        if (width > config.duration) {
          if (i = Math.floor(width / config.duration), config.count) {
            if (i >= config.loopsLeft) {
              return r = config.frames[config.lastFrame = config.reverse ? 0 : config.frames.length - 1], config.frameCallback(r.value, true, r.timeRatio, r.outputRatio), void(config.framesStart = null);
            }
            config.loopsLeft -= i;
          }
          config.framesStart += config.duration * i;
          /** @type {number} */
          width = x - config.framesStart;
        }
        if (config.reverse) {
          /** @type {number} */
          width = config.duration - width;
        }
        r = config.frames[config.lastFrame = Math.round(width / len)];
        if (false !== config.frameCallback(r.value, false, r.timeRatio, r.outputRatio)) {
          /** @type {boolean} */
          o = true;
        } else {
          /** @type {null} */
          config.framesStart = null;
        }
      }
    });
    if (o) {
      result = scope.call(window, tick);
    }
  }
  /**
   * @param {!Object} data
   * @param {number} i
   * @return {undefined}
   */
  function getValue(data, i) {
    /** @type {number} */
    data.framesStart = Date.now();
    if (null != i) {
      data.framesStart -= data.duration * (data.reverse ? 1 - i : i);
    }
    data.loopsLeft = data.count;
    /** @type {null} */
    data.lastFrame = null;
    tick();
  }
  /**
   * @param {!Object} data
   * @param {!Object} obj
   * @return {?}
   */
  function extend(data, obj) {
    var undefined;
    var style;
    return typeof data != typeof obj || (undefined = isArray(data) ? "obj" : Array.isArray(data) ? "array" : "") != (isArray(obj) ? "obj" : Array.isArray(obj) ? "array" : "") || ("obj" === undefined ? extend(style = Object.keys(data).sort(), Object.keys(obj).sort()) || style.some(function(k) {
      return extend(data[k], obj[k]);
    }) : "array" === undefined ? data.length !== obj.length || data.some(function(args, key) {
      return extend(args, obj[key]);
    }) : data !== obj);
  }
  /**
   * @param {!Object} data
   * @return {?}
   */
  function normalize(data) {
    return data && (isArray(data) ? Object.keys(data).reduce(function(options, i) {
      return options[i] = normalize(data[i]), options;
    }, {}) : Array.isArray(data) ? data.map(normalize) : data);
  }
  /**
   * @param {string} value
   * @return {?}
   */
  function parse(value) {
    /**
     * @param {!Function} e
     * @return {?}
     */
    function validate(e) {
      /** @type {number} */
      var t = 1;
      /** @type {(Array<string>|null)} */
      e = m.exec(e);
      return e && (t = parseFloat(e[1]), e[2] ? t = 0 <= t && t <= 100 ? t / 100 : 1 : (t < 0 || 1 < t) && (t = 1)), t;
    }
    var parts;
    var okval;
    var func;
    /** @type {number} */
    var a = 1;
    /** @type {string} */
    var b = value = (value + "").trim();
    return (parts = /^(rgba|hsla|hwb|gray|device\-cmyk)\s*\(([\s\S]+)\)$/i.exec(value)) ? (okval = parts[1].toLowerCase(), func = parts[2].trim().split(/\s*,\s*/), "rgba" === okval && 4 === func.length ? (a = validate(func[3]), b = "rgb(" + func.slice(0, 3).join(", ") + ")") : "hsla" === okval && 4 === func.length ? (a = validate(func[3]), b = "hsl(" + func.slice(0, 3).join(", ") + ")") : "hwb" === okval && 4 === func.length ? (a = validate(func[3]), b = "hwb(" + func.slice(0, 3).join(", ") + ")") :
    "gray" === okval && 2 === func.length ? (a = validate(func[1]), b = "gray(" + func[0] + ")") : "device-cmyk" === okval && 5 <= func.length && (a = validate(func[4]), b = "device-cmyk(" + func.slice(0, 4).join(", ") + ")")) : (parts = /^#(?:([\da-f]{6})([\da-f]{2})|([\da-f]{3})([\da-f]))$/i.exec(value)) ? b = parts[1] ? (a = parseInt(parts[2], 16) / 255, "#" + parts[1]) : (a = parseInt(parts[4] + parts[4], 16) / 255, "#" + parts[3]) : "transparent" === value.toLocaleLowerCase() && (a = 0), [a,
    b];
  }
  /**
   * @param {!Object} elem
   * @return {?}
   */
  function handler(elem) {
    return !(!elem || elem.nodeType !== Node.ELEMENT_NODE || "function" != typeof elem.getBoundingClientRect);
  }
  /**
   * @param {!Object} el
   * @param {boolean} selectAll
   * @return {?}
   */
  function $(el, selectAll) {
    var myAt;
    var i;
    var node;
    var offset = {};
    if (!(node = el.ownerDocument)) {
      return console.error("Cannot get document that contains the element."), null;
    }
    if (el.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_DISCONNECTED) {
      return console.error("A disconnected element was passed."), null;
    }
    for (i in myAt = el.getBoundingClientRect()) {
      offset[i] = myAt[i];
    }
    if (!selectAll) {
      if (!(node = node.defaultView)) {
        return console.error("Cannot get window that contains the element."), null;
      }
      offset.left += node.pageXOffset;
      offset.right += node.pageXOffset;
      offset.top += node.pageYOffset;
      offset.bottom += node.pageYOffset;
    }
    return offset;
  }
  /**
   * @param {!Node} view
   * @param {!Object} el
   * @return {?}
   */
  function process(view, el) {
    var parent;
    /** @type {!Array} */
    var code = [];
    /** @type {!Node} */
    var node = view;
    el = el || window;
    for (;;) {
      if (!(parent = document)) {
        return console.error("Cannot get document that contains the element."), null;
      }
      if (!(parent = parent.defaultView)) {
        return console.error("Cannot get window that contains the element."), null;
      }
      if (parent === el) {
        break;
      }
      if (!(node = parent.frameElement)) {
        return console.error("`baseWindow` was not found."), null;
      }
      code.unshift(node);
    }
    return code;
  }
  /**
   * @param {undefined} id
   * @param {!Object} container
   * @return {?}
   */
  function create(id, container) {
    /** @type {number} */
    var x = 0;
    /** @type {number} */
    var offset = 0;
    return (container = process(id, container = container || window)) ? container.length ? (container.forEach(function(options, input) {
      var b = $(options, 0 < input);
      x = x + b.left;
      offset = offset + b.top;
      options = (input = options).ownerDocument.defaultView.getComputedStyle(input, "");
      b = {
        left : input.clientLeft + parseFloat(options.paddingLeft),
        top : input.clientTop + parseFloat(options.paddingTop)
      };
      x = x + b.left;
      offset = offset + b.top;
    }), (container = $(id, true)).left += x, container.right += x, container.top += offset, container.bottom += offset, container) : $(id) : null;
  }
  /**
   * @param {!Object} obj
   * @param {number} arg
   * @return {?}
   */
  function func(obj, arg) {
    /** @type {number} */
    var argR = obj.x - arg.x;
    /** @type {number} */
    arg = obj.y - arg.y;
    return Math.sqrt(argR * argR + arg * arg);
  }
  /**
   * @param {!Object} s
   * @param {number} r
   * @param {number} a
   * @return {?}
   */
  function transform(s, r, a) {
    /** @type {number} */
    var d = r.x - s.x;
    /** @type {number} */
    r = r.y - s.y;
    return {
      x : s.x + d * a,
      y : s.y + r * a,
      angle : Math.atan2(r, d) / (Math.PI / 180)
    };
  }
  /**
   * @param {number} t
   * @param {!Object} s
   * @param {number} v
   * @return {?}
   */
  function filter(t, s, v) {
    /** @type {number} */
    t = Math.atan2(t.y - s.y, s.x - t.x);
    return {
      x : s.x + Math.cos(t) * v,
      y : s.y + Math.sin(t) * v * -1
    };
  }
  /**
   * @param {number} s
   * @param {number} p
   * @param {!Object} q
   * @param {number} data
   * @param {number} i
   * @return {?}
   */
  function f(s, p, q, data, i) {
    /** @type {number} */
    var k = i * i;
    /** @type {number} */
    var pos = k * i;
    /** @type {number} */
    var r = 1 - i;
    /** @type {number} */
    var d = r * r;
    /** @type {number} */
    var y = d * r;
    /** @type {number} */
    var audioOffsetX = y * s.x + 3 * d * i * p.x + 3 * r * k * q.x + pos * data.x;
    /** @type {number} */
    var languageOffsetY = y * s.y + 3 * d * i * p.y + 3 * r * k * q.y + pos * data.y;
    var x = s.x + 2 * i * (p.x - s.x) + k * (q.x - 2 * p.x + s.x);
    y = s.y + 2 * i * (p.y - s.y) + k * (q.y - 2 * p.y + s.y);
    d = p.x + 2 * i * (q.x - p.x) + k * (data.x - 2 * q.x + p.x);
    pos = p.y + 2 * i * (q.y - p.y) + k * (data.y - 2 * q.y + p.y);
    /** @type {number} */
    k = r * s.x + i * p.x;
    /** @type {number} */
    s = r * s.y + i * p.y;
    /** @type {number} */
    p = r * q.x + i * data.x;
    /** @type {number} */
    i = r * q.y + i * data.y;
    /** @type {number} */
    data = 90 - 180 * Math.atan2(x - d, y - pos) / Math.PI;
    return {
      x : audioOffsetX,
      y : languageOffsetY,
      fromP2 : {
        x : x,
        y : y
      },
      toP1 : {
        x : d,
        y : pos
      },
      fromP1 : {
        x : k,
        y : s
      },
      toP2 : {
        x : p,
        y : i
      },
      angle : data = data + (180 < data ? -180 : 180)
    };
  }
  /**
   * @param {!Object} p
   * @param {!Object} data
   * @param {!Object} obj
   * @param {!Object} user
   * @param {number} count
   * @return {?}
   */
  function add(p, data, obj, user, count) {
    /**
     * @param {number} e
     * @param {number} f
     * @param {number} d
     * @param {number} a
     * @param {number} fx
     * @return {?}
     */
    function callback(e, f, d, a, fx) {
      return e * (e * (-3 * f + 9 * d - 9 * a + 3 * fx) + 6 * f - 12 * d + 6 * a) - 3 * f + 3 * d;
    }
    var argR;
    var arg;
    /** @type {!Array} */
    var subwikiListsCache = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472];
    /** @type {number} */
    var dmp = 0;
    /** @type {number} */
    var k = (count = null == count || 1 < count ? 1 : count < 0 ? 0 : count) / 2;
    return [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816].forEach(function(filterWidth, wikiId) {
      argR = callback(arg = k * filterWidth + k, p.x, data.x, obj.x, user.x);
      arg = callback(arg, p.y, data.y, obj.y, user.y);
      /** @type {number} */
      arg = argR * argR + arg * arg;
      dmp = dmp + subwikiListsCache[wikiId] * Math.sqrt(arg);
    }), k * dmp;
  }
  /**
   * @param {!Object} v
   * @param {undefined} x
   * @param {!Object} f
   * @param {!Object} n
   * @param {number} i
   * @return {?}
   */
  function set(v, x, f, n, i) {
    var y;
    /** @type {number} */
    var startPos = .5;
    /** @type {number} */
    var delta = 1 - startPos;
    for (; y = add(v, x, f, n, delta), !(Math.abs(y - i) <= .01);) {
      /** @type {number} */
      delta = delta + (y < i ? 1 : -1) * (startPos = startPos / 2);
    }
    return delta;
  }
  /**
   * @param {!Object} fn
   * @param {!Function} callback
   * @return {?}
   */
  function draw(fn, callback) {
    var toSplice;
    return fn.forEach(function(elements) {
      elements = callback ? elements.map(function(value) {
        value = {
          x : value.x,
          y : value.y
        };
        return callback(value), value;
      }) : elements;
      (toSplice = toSplice || [{
        type : "M",
        values : [elements[0].x, elements[0].y]
      }]).push(elements.length ? 2 === elements.length ? {
        type : "L",
        values : [elements[1].x, elements[1].y]
      } : {
        type : "C",
        values : [elements[1].x, elements[1].y, elements[2].x, elements[2].y, elements[3].x, elements[3].y]
      } : {
        type : "Z",
        values : []
      });
    }), toSplice;
  }
  /**
   * @param {?} q
   * @return {?}
   */
  function prompt(q) {
    /** @type {!Array} */
    var onSelectionCalls = [];
    /** @type {number} */
    var sChars = 0;
    return q.forEach(function(e) {
      e = (2 === e.length ? func : add).apply(null, e);
      onSelectionCalls.push(e);
      sChars = sChars + e;
    }), {
      segsLen : onSelectionCalls,
      lenAll : sChars
    };
  }
  /**
   * @param {!Object} val
   * @param {string} txt
   * @return {?}
   */
  function log(val, txt) {
    return null == val || null == txt || val.length !== txt.length || val.some(function(options, n) {
      var line = txt[n];
      return options.type !== line.type || options.values.some(function(node_part, i) {
        return node_part !== line.values[i];
      });
    });
  }
  /**
   * @param {!Object} obj
   * @param {string} i
   * @param {?} name
   * @return {undefined}
   */
  function get(obj, i, name) {
    if (obj.events[i]) {
      if (obj.events[i].indexOf(name) < 0) {
        obj.events[i].push(name);
      }
    } else {
      /** @type {!Array} */
      obj.events[i] = [name];
    }
  }
  /**
   * @param {!Object} o
   * @param {string} name
   * @param {?} value
   * @return {undefined}
   */
  function remove(o, name, value) {
    var stylePosition;
    if (o.events[name] && -1 < (stylePosition = o.events[name].indexOf(value))) {
      o.events[name].splice(stylePosition, 1);
    }
  }
  /**
   * @param {!Function} key
   * @return {undefined}
   */
  function execute(key) {
    if (_takingTooLongTimeout) {
      clearTimeout(_takingTooLongTimeout);
    }
    notesToRemove.push(key);
    /** @type {number} */
    _takingTooLongTimeout = setTimeout(function() {
      notesToRemove.forEach(function(saveNotifs) {
        saveNotifs();
      });
      /** @type {!Array} */
      notesToRemove = [];
    }, 0);
  }
  /**
   * @param {!Object} o
   * @param {?} condition
   * @return {undefined}
   */
  function debug(o, condition) {
    if (o.reflowTargets.indexOf(condition) < 0) {
      o.reflowTargets.push(condition);
    }
  }
  /**
   * @param {!Object} name
   * @return {undefined}
   */
  function fireComponentHook(name) {
    name.reflowTargets.forEach(function(maxB) {
      var b;
      /** @type {number} */
      b = maxB;
      setTimeout(function() {
        var e = b.parentNode;
        var d = b.nextSibling;
        e.insertBefore(e.removeChild(b), d);
      }, 0);
    });
    /** @type {!Array} */
    name.reflowTargets = [];
  }
  /**
   * @param {!Object} e
   * @param {!Object} me
   * @param {string} val
   * @param {!Object} state
   * @param {?} sep
   * @param {!Object} node
   * @param {?} l
   * @return {undefined}
   */
  function fn(e, me, val, state, sep, node, l) {
    var clearLogOnReloadUIString;
    if ("auto-start-reverse" === val) {
      if ("boolean" != typeof isShallow) {
        me.setAttribute("orient", "auto-start-reverse");
        /** @type {boolean} */
        isShallow = me.orientType.baseVal === SVGMarkerElement.SVG_MARKER_ORIENT_UNKNOWN;
      }
      if (isShallow) {
        me.setAttribute("orient", val);
      } else {
        (clearLogOnReloadUIString = sep.createSVGTransform()).setRotate(180, 0, 0);
        node.transform.baseVal.appendItem(clearLogOnReloadUIString);
        me.setAttribute("orient", "auto");
        /** @type {boolean} */
        clearLogOnReloadUIString = true;
      }
    } else {
      me.setAttribute("orient", val);
      if (false === isShallow) {
        node.transform.baseVal.clear();
      }
    }
    me = me.viewBox.baseVal;
    if (clearLogOnReloadUIString) {
      /** @type {number} */
      me.x = -state.right;
      /** @type {number} */
      me.y = -state.bottom;
    } else {
      me.x = state.left;
      me.y = state.top;
    }
    me.width = state.width;
    me.height = state.height;
    if (err) {
      debug(e, l);
    }
  }
  /**
   * @param {boolean} e
   * @param {boolean} window
   * @return {?}
   */
  function touchstart(e, window) {
    return {
      prop : e ? "markerEnd" : "markerStart",
      orient : window ? window.noRotate ? "0" : e ? "auto" : "auto-start-reverse" : null
    };
  }
  /**
   * @param {!Object} dst
   * @param {!Object} a
   * @return {undefined}
   */
  function resolve(dst, a) {
    Object.keys(a).forEach(function(i) {
      var win = a[i];
      dst[i] = null != win.iniValue ? win.hasSE ? [win.iniValue, win.iniValue] : win.iniValue : win.hasSE ? win.hasProps ? [{}, {}] : [] : win.hasProps ? {} : null;
    });
  }
  /**
   * @param {!Object} obj
   * @param {!Object} arr
   * @param {string} num
   * @param {?} x
   * @param {!Object} success
   * @return {?}
   */
  function callback(obj, arr, num, x, success) {
    return x !== arr[num] && (arr[num] = x, success && success.forEach(function(fn) {
      fn(obj, x, num);
    }), true);
  }
  /**
   * @param {!Object} node
   * @return {?}
   */
  function getSize(node) {
    /**
     * @param {number} n
     * @param {?} d
     * @return {?}
     */
    function n(n, d) {
      return n + parseFloat(d);
    }
    var data = node.document;
    var cs = node.getComputedStyle(data.documentElement, "");
    node = node.getComputedStyle(data.body, "");
    data = {
      x : 0,
      y : 0
    };
    return "static" !== node.position ? (data.x -= [cs.marginLeft, cs.borderLeftWidth, cs.paddingLeft, node.marginLeft, node.borderLeftWidth].reduce(n, 0), data.y -= [cs.marginTop, cs.borderTopWidth, cs.paddingTop, node.marginTop, node.borderTopWidth].reduce(n, 0)) : "static" !== cs.position && (data.x -= [cs.marginLeft, cs.borderLeftWidth].reduce(n, 0), data.y -= [cs.marginTop, cs.borderTopWidth].reduce(n, 0)), data;
  }
  /**
   * @param {!Window} win
   * @return {undefined}
   */
  function onLoad(win) {
    var container;
    var doc = win.document;
    if (!doc.getElementById(selectId)) {
      container = (new win.DOMParser).parseFromString(template, "image/svg+xml");
      doc.body.appendChild(container.documentElement);
      dateFormatProperties(win);
    }
  }
  /**
   * @param {?} context
   * @return {?}
   */
  function render(context) {
    /**
     * @param {!Object} data
     * @param {number} location
     * @return {?}
     */
    function draw(data, location) {
      /** @type {({x: ?, y: ?})} */
      data = location === top ? {
        x : data.left + data.width / 2,
        y : data.top
      } : location === undefined ? {
        x : data.right,
        y : data.top + data.height / 2
      } : location === el ? {
        x : data.left + data.width / 2,
        y : data.bottom
      } : {
        x : data.left,
        y : data.top + data.height / 2
      };
      return data.socketId = location, data;
    }
    /**
     * @param {!Object} opts
     * @return {?}
     */
    function traverse(opts) {
      return {
        x : opts.x,
        y : opts.y
      };
    }
    var data;
    var result;
    var array;
    var paneNodes;
    var i;
    var idx;
    var start;
    var _targetScrollPosition;
    var known_x;
    var xaList;
    var btnY;
    var f;
    var u;
    var d;
    var options = context.options;
    var node = context.curStats;
    var opts = context.aplStats;
    var args = node.position_socketXYSE;
    /** @type {boolean} */
    var output = false;
    if (node.position_path = options.path, node.position_lineStrokeWidth = node.line_strokeWidth, node.position_socketGravitySE = data = normalize(options.socketGravitySE), result = [0, 1].map(function(x) {
      var i = options.anchorSE[x];
      var o = context.optionIsAttach.anchorSE[x];
      var r = false !== o ? items[i._id] : null;
      var numberProperty = false !== o && r.conf.getStrokeWidth ? r.conf.getStrokeWidth(r, context) : 0;
      var current = false !== o && r.conf.getBBoxNest ? r.conf.getBBoxNest(r, context, numberProperty) : create(i, context.baseWindow);
      return node.capsMaskAnchor_pathDataSE[x] = false !== o && r.conf.getPathData ? r.conf.getPathData(r, context, numberProperty) : (o = null != (i = current).right ? i.right : i.left + i.width, r = null != i.bottom ? i.bottom : i.top + i.height, [{
        type : "M",
        values : [i.left, i.top]
      }, {
        type : "L",
        values : [o, i.top]
      }, {
        type : "L",
        values : [o, r]
      }, {
        type : "L",
        values : [i.left, r]
      }, {
        type : "Z",
        values : []
      }]), node.capsMaskAnchor_strokeWidthSE[x] = numberProperty, current;
    }), start = -1, options.socketSE[0] && options.socketSE[1] ? (args[0] = draw(result[0], options.socketSE[0]), args[1] = draw(result[1], options.socketSE[1])) : (options.socketSE[0] || options.socketSE[1] ? (idx = options.socketSE[0] ? (i = 0, 1) : (i = 1, 0), args[i] = draw(result[i], options.socketSE[i]), (paneNodes = margin.map(function(hash) {
      return draw(result[idx], hash);
    })).forEach(function(value) {
      var pos = func(value, args[i]);
      if (pos < start || -1 === start) {
        /** @type {!Object} */
        args[idx] = value;
        start = pos;
      }
    })) : (paneNodes = margin.map(function(hash) {
      return draw(result[1], hash);
    }), margin.map(function(hash) {
      return draw(result[0], hash);
    }).forEach(function(el) {
      paneNodes.forEach(function(e) {
        var pos = func(el, e);
        if (pos < start || -1 === start) {
          /** @type {!Object} */
          args[0] = el;
          args[1] = e;
          start = pos;
        }
      });
    })), [0, 1].forEach(function(i) {
      var _deltaX;
      var _deltaY;
      if (!options.socketSE[i]) {
        if (result[i].width || result[i].height) {
          if (result[i].width || args[i].socketId !== left && args[i].socketId !== undefined) {
            if (!(result[i].height || args[i].socketId !== top && args[i].socketId !== el)) {
              /** @type {number} */
              args[i].socketId = 0 <= args[i ? 0 : 1].y - result[i].top ? el : top;
            }
          } else {
            /** @type {number} */
            args[i].socketId = 0 <= args[i ? 0 : 1].x - result[i].left ? undefined : left;
          }
        } else {
          /** @type {number} */
          _deltaX = args[i ? 0 : 1].x - result[i].left;
          /** @type {number} */
          _deltaY = args[i ? 0 : 1].y - result[i].top;
          /** @type {number} */
          args[i].socketId = Math.abs(_deltaX) >= Math.abs(_deltaY) ? 0 <= _deltaX ? undefined : left : 0 <= _deltaY ? el : top;
        }
      }
    })), node.position_path !== opts.position_path || node.position_lineStrokeWidth !== opts.position_lineStrokeWidth || [0, 1].some(function(i) {
      return node.position_plugOverheadSE[i] !== opts.position_plugOverheadSE[i] || (a = args[i], b = opts.position_socketXYSE[i], a.x !== b.x || a.y !== b.y || a.socketId !== b.socketId) || (a = data[i], b = opts.position_socketGravitySE[i], (i = null == a ? "auto" : Array.isArray(a) ? "array" : "number") != (null == b ? "auto" : Array.isArray(b) ? "array" : "number") || ("array" == i ? a[0] !== b[0] || a[1] !== b[1] : a !== b));
      var a;
      var b;
    })) {
      switch(context.pathList.baseVal = array = [], context.pathList.animVal = null, node.position_path) {
        case straight:
          array.push([traverse(args[0]), traverse(args[1])]);
          break;
        case angle:
          /** @type {boolean} */
          f = "number" == typeof data[0] && 0 < data[0] || "number" == typeof data[1] && 0 < data[1];
          /** @type {number} */
          u = cx1 * (f ? -1 : 1);
          /** @type {number} */
          d = Math.atan2(args[1].y - args[0].y, args[1].x - args[0].x);
          /** @type {number} */
          f = u - d;
          /** @type {number} */
          d = Math.PI - d - u;
          /** @type {number} */
          u = func(args[0], args[1]) / Math.sqrt(2) * step;
          f = {
            x : args[0].x + Math.cos(f) * u,
            y : args[0].y + Math.sin(f) * u * -1
          };
          u = {
            x : args[1].x + Math.cos(d) * u,
            y : args[1].y + Math.sin(d) * u * -1
          };
          array.push([traverse(args[0]), f, u, traverse(args[1])]);
          break;
        case apexRestPath:
        case object:
          /** @type {!Array} */
          known_x = [data[0], node.position_path === object ? 0 : data[1]];
          /** @type {!Array} */
          xaList = [];
          /** @type {!Array} */
          btnY = [];
          args.forEach(function(e, i) {
            var that;
            var x = known_x[i];
            /** @type {({x: ?, y: ?}|{x: number, y: number})} */
            var offset = Array.isArray(x) ? {
              x : x[0],
              y : x[1]
            } : "number" == typeof x ? e.socketId === top ? {
              x : 0,
              y : -x
            } : e.socketId === undefined ? {
              x : x,
              y : 0
            } : e.socketId === el ? {
              x : 0,
              y : x
            } : {
              x : -x,
              y : 0
            } : (that = args[i ? 0 : 1], x = 0 < (x = node.position_plugOverheadSE[i]) ? U + (y < x ? (x - y) * k : 0) : z + (node.position_lineStrokeWidth > lastLine ? (node.position_lineStrokeWidth - lastLine) * curZoom : 0), e.socketId === top ? {
              x : 0,
              y : -(offset = (offset = (e.y - that.y) / 2) < x ? x : offset)
            } : e.socketId === undefined ? {
              x : offset = (offset = (that.x - e.x) / 2) < x ? x : offset,
              y : 0
            } : e.socketId === el ? {
              x : 0,
              y : offset = (offset = (that.y - e.y) / 2) < x ? x : offset
            } : {
              x : -(offset = (offset = (e.x - that.x) / 2) < x ? x : offset),
              y : 0
            });
            xaList[i] = e.x + offset.x;
            btnY[i] = e.y + offset.y;
          });
          array.push([traverse(args[0]), {
            x : xaList[0],
            y : btnY[0]
          }, {
            x : xaList[1],
            y : btnY[1]
          }, traverse(args[1])]);
          break;
        case v:
          !function() {
            /**
             * @param {number} mode
             * @return {?}
             */
            function connect(mode) {
              return mode === i ? undefined : mode === remove ? _START_TO_END : mode === undefined ? i : remove;
            }
            /**
             * @param {number} how
             * @return {?}
             */
            function drawLineChart(how) {
              return how === remove || how === _START_TO_END ? "x" : "y";
            }
            /**
             * @param {!Object} data
             * @param {number} s
             * @param {string} name
             * @return {?}
             */
            function f(data, s, name) {
              var options = {
                x : data.x,
                y : data.y
              };
              if (name) {
                if (name === connect(data.dirId)) {
                  throw new Error("Invalid dirId: " + name);
                }
                /** @type {string} */
                options.dirId = name;
              } else {
                options.dirId = data.dirId;
              }
              return options.dirId === i ? options.y -= s : options.dirId === remove ? options.x += s : options.dirId === undefined ? options.y += s : options.x -= s, options;
            }
            /**
             * @param {!Object} rect
             * @param {!Object} data
             * @return {?}
             */
            function fn(rect, data) {
              return data.dirId === i ? rect.y <= data.y : data.dirId === remove ? rect.x >= data.x : data.dirId === undefined ? rect.y >= data.y : rect.x <= data.x;
            }
            /**
             * @param {!Object} p
             * @param {!Object} point
             * @return {?}
             */
            function scale(p, point) {
              return point.dirId === i || point.dirId === undefined ? p.x === point.x : p.y === point.y;
            }
            /**
             * @param {!Object} page
             * @return {?}
             */
            function createSubCommand(page) {
              return page[0] ? {
                contain : 0,
                notContain : 1
              } : {
                contain : 1,
                notContain : 0
              };
            }
            /**
             * @param {!Object} x
             * @param {!Object} y
             * @param {string} i
             * @return {?}
             */
            function callback(x, y, i) {
              return Math.abs(y[i] - x[i]);
            }
            /**
             * @param {!Object} source
             * @param {!Object} target
             * @param {string} id
             * @return {?}
             */
            function process(source, target, id) {
              return "x" === id ? source.x < target.x ? remove : _START_TO_END : source.y < target.y ? undefined : i;
            }
            var start;
            /** @type {number} */
            var i = 1;
            /** @type {number} */
            var remove = 2;
            /** @type {number} */
            var undefined = 3;
            /** @type {number} */
            var _START_TO_END = 4;
            /** @type {!Array} */
            var result = [[], []];
            /** @type {!Array} */
            var o = [];
            args.forEach(function(options, k) {
              var el = traverse(options);
              var v = data[k];
              /** @type {!Array} */
              options = Array.isArray(v) ? v[0] < 0 ? [_START_TO_END, -v[0]] : 0 < v[0] ? [remove, v[0]] : v[1] < 0 ? [i, -v[1]] : 0 < v[1] ? [undefined, v[1]] : [options.socketId, 0] : "number" != typeof v ? [options.socketId, b] : 0 <= v ? [options.socketId, v] : [connect(options.socketId), -v];
              el.dirId = options[0];
              v = options[1];
              result[k].push(el);
              o[k] = f(el, v);
            });
            for (; function() {
              var auth0_time;
              var item;
              var a;
              var annotations;
              /** @type {!Array} */
              var page = [fn(o[1], o[0]), fn(o[0], o[1])];
              /** @type {!Array} */
              var arr = [drawLineChart(o[0].dirId), drawLineChart(o[1].dirId)];
              if (arr[0] === arr[1]) {
                if (page[0] && page[1]) {
                  return void(scale(o[1], o[0]) || (o[0][arr[0]] === o[1][arr[1]] ? (result[0].push(o[0]), result[1].push(o[1])) : (auth0_time = o[0][arr[0]] + (o[1][arr[1]] - o[0][arr[0]]) / 2, result[0].push(f(o[0], Math.abs(auth0_time - o[0][arr[0]]))), result[1].push(f(o[1], Math.abs(auth0_time - o[1][arr[1]]))))));
                }
                if (page[0] !== page[1]) {
                  item = createSubCommand(page);
                  if ((a = callback(o[item.notContain], o[item.contain], arr[item.notContain])) < b) {
                    o[item.notContain] = f(o[item.notContain], b - a);
                  }
                  result[item.notContain].push(o[item.notContain]);
                  o[item.notContain] = f(o[item.notContain], b, scale(o[item.contain], o[item.notContain]) ? "x" === arr[item.notContain] ? undefined : remove : process(o[item.notContain], o[item.contain], "x" === arr[item.notContain] ? "y" : "x"));
                } else {
                  a = callback(o[0], o[1], "x" === arr[0] ? "y" : "x");
                  result.forEach(function(result, i) {
                    /** @type {number} */
                    var k = 0 === i ? 1 : 0;
                    result.push(o[i]);
                    o[i] = f(o[i], b, 2 * b <= a ? process(o[i], o[k], "x" === arr[i] ? "y" : "x") : "x" === arr[i] ? undefined : remove);
                  });
                }
              } else {
                if (page[0] && page[1]) {
                  return void(scale(o[1], o[0]) ? result[1].push(o[1]) : scale(o[0], o[1]) ? result[0].push(o[0]) : result[0].push("x" === arr[0] ? {
                    x : o[1].x,
                    y : o[0].y
                  } : {
                    x : o[0].x,
                    y : o[1].y
                  }));
                }
                if (page[0] !== page[1]) {
                  item = createSubCommand(page);
                  result[item.notContain].push(o[item.notContain]);
                  o[item.notContain] = f(o[item.notContain], b, callback(o[item.notContain], o[item.contain], arr[item.contain]) >= b ? process(o[item.notContain], o[item.contain], arr[item.contain]) : o[item.contain].dirId);
                } else {
                  /** @type {!Array} */
                  annotations = [{
                    x : o[0].x,
                    y : o[0].y
                  }, {
                    x : o[1].x,
                    y : o[1].y
                  }];
                  result.forEach(function(result, i) {
                    /** @type {number} */
                    var key = 0 === i ? 1 : 0;
                    var value = callback(annotations[i], annotations[key], arr[i]);
                    if (value < b) {
                      o[i] = f(o[i], b - value);
                    }
                    result.push(o[i]);
                    o[i] = f(o[i], b, process(o[i], o[key], arr[key]));
                  });
                }
              }
              return 1;
            }();) {
            }
            result[1].reverse();
            result[0].concat(result[1]).forEach(function(end, canCreateDiscussions) {
              end = {
                x : end.x,
                y : end.y
              };
              if (0 < canCreateDiscussions) {
                array.push([start, end]);
              }
              /** @type {number} */
              start = end;
            });
          }();
      }
      /** @type {!Array} */
      _targetScrollPosition = [];
      node.position_plugOverheadSE.forEach(function(i, j) {
        var obj;
        var axis;
        var r;
        var text;
        var angle;
        var t;
        var p;
        var y;
        var k;
        /** @type {boolean} */
        var littleEndian = !j;
        if (0 < i) {
          if (2 === (obj = array[axis = littleEndian ? 0 : array.length - 1]).length) {
            _targetScrollPosition[axis] = _targetScrollPosition[axis] || func.apply(null, obj);
            if (_targetScrollPosition[axis] > upperBound) {
              if (_targetScrollPosition[axis] - i < upperBound) {
                /** @type {number} */
                i = _targetScrollPosition[axis] - upperBound;
              }
              p = transform(obj[0], obj[1], (littleEndian ? i : _targetScrollPosition[axis] - i) / _targetScrollPosition[axis]);
              /** @type {!Array} */
              array[axis] = littleEndian ? [p, obj[1]] : [obj[0], p];
              _targetScrollPosition[axis] -= i;
            }
          } else {
            _targetScrollPosition[axis] = _targetScrollPosition[axis] || add.apply(null, obj);
            if (_targetScrollPosition[axis] > upperBound) {
              if (_targetScrollPosition[axis] - i < upperBound) {
                /** @type {number} */
                i = _targetScrollPosition[axis] - upperBound;
              }
              p = f(obj[0], obj[1], obj[2], obj[3], set(obj[0], obj[1], obj[2], obj[3], littleEndian ? i : _targetScrollPosition[axis] - i));
              text = littleEndian ? (r = obj[0], p.toP1) : (r = obj[3], p.fromP2);
              /** @type {number} */
              angle = Math.atan2(r.y - p.y, p.x - r.x);
              t = func(p, text);
              /** @type {string} */
              p.x = r.x + Math.cos(angle) * i;
              /** @type {string} */
              p.y = r.y + Math.sin(angle) * i * -1;
              /** @type {string} */
              text.x = p.x + Math.cos(angle) * t;
              /** @type {string} */
              text.y = p.y + Math.sin(angle) * t * -1;
              /** @type {!Array} */
              array[axis] = littleEndian ? [p, p.toP1, p.toP2, obj[3]] : [obj[0], p.fromP1, p.fromP2, p];
              /** @type {null} */
              _targetScrollPosition[axis] = null;
            }
          }
        } else {
          if (i < 0) {
            obj = array[axis = littleEndian ? 0 : array.length - 1];
            p = args[j].socketId;
            /** @type {number} */
            j = -result[j]["x" == (y = p === left || p === undefined ? "x" : "y") ? "width" : "height"];
            /** @type {number} */
            k = (i = i < j ? j : i) * (p === left || p === top ? -1 : 1);
            if (2 === obj.length) {
              obj[littleEndian ? 0 : obj.length - 1][y] += k;
            } else {
              (littleEndian ? [0, 1] : [obj.length - 2, obj.length - 1]).forEach(function(x) {
                obj[x][y] += k;
              });
            }
            /** @type {null} */
            _targetScrollPosition[axis] = null;
          }
        }
      });
      opts.position_socketXYSE = normalize(args);
      opts.position_plugOverheadSE = normalize(node.position_plugOverheadSE);
      opts.position_path = node.position_path;
      opts.position_lineStrokeWidth = node.position_lineStrokeWidth;
      opts.position_socketGravitySE = normalize(data);
      /** @type {boolean} */
      output = true;
      if (context.events.apl_position) {
        context.events.apl_position.forEach(function(View) {
          View(context, array);
        });
      }
    }
    return output;
  }
  /**
   * @param {!Object} item
   * @param {string} state
   * @return {undefined}
   */
  function cb(item, state) {
    if (state !== item.isShown) {
      if (!!state != !!item.isShown) {
        /** @type {string} */
        item.svg.style.visibility = state ? "" : "hidden";
      }
      /** @type {string} */
      item.isShown = state;
      if (item.events && item.events.svgShow) {
        item.events.svgShow.forEach(function(render) {
          render(item, state);
        });
      }
    }
  }
  /**
   * @param {!Object} e
   * @param {!Object} params
   * @return {undefined}
   */
  function update(e, params) {
    var self;
    var opts;
    var node;
    var __vue_options__;
    var p;
    var _ref1;
    var def;
    var options;
    var config;
    var data;
    var r;
    var optionData;
    var b;
    var off;
    var res;
    var value;
    var item;
    var commits;
    var user;
    var E;
    var el;
    var pathData;
    var _childPassed;
    var graphRect;
    var element;
    var d;
    var offset;
    var containerRect;
    var o;
    var object;
    var viewBox;
    var indexedRows;
    var N;
    var t;
    var response;
    var height;
    var props;
    var partitions;
    var G;
    var x;
    var state;
    var states;
    var result;
    var me = {};
    if (params.line) {
      me.line = (options = (self = e).options, opts = self.curStats, config = self.events, data = false, data = callback(self, opts, "line_color", options.lineColor, config.cur_line_color) || data, data = callback(self, opts, "line_colorTra", parse(opts.line_color)[0] < 1) || data, data = callback(self, opts, "line_strokeWidth", options.lineSize, config.cur_line_strokeWidth) || data);
    }
    if (params.plug || me.line) {
      me.plug = (__vue_options__ = (node = e).options, p = node.curStats, _ref1 = node.events, def = false, [0, 1].forEach(function(name) {
        var isoPos;
        var extra;
        var compare;
        var base;
        var x;
        var y;
        var w;
        var scale;
        var v = __vue_options__.plugSE[name];
        def = callback(node, p.plug_enabledSE, name, v !== v_res) || def;
        def = callback(node, p.plug_plugSE, name, v) || def;
        def = callback(node, p.plug_colorSE, name, scale = __vue_options__.plugColorSE[name] || p.line_color, _ref1.cur_plug_colorSE) || def;
        def = callback(node, p.plug_colorTraSE, name, parse(scale)[0] < 1) || def;
        if (v !== v_res) {
          /** @type {number} */
          base = extra = (isoPos = weights[keys[v]]).widthR * __vue_options__.plugSizeSE[name];
          /** @type {number} */
          x = compare = isoPos.heightR * __vue_options__.plugSizeSE[name];
          if (model) {
            /** @type {number} */
            base = base * p.line_strokeWidth;
            /** @type {number} */
            x = x * p.line_strokeWidth;
          }
          def = callback(node, p.plug_markerWidthSE, name, base) || def;
          def = callback(node, p.plug_markerHeightSE, name, x) || def;
          /** @type {number} */
          p.capsMaskMarker_markerWidthSE[name] = extra;
          /** @type {number} */
          p.capsMaskMarker_markerHeightSE[name] = compare;
        }
        p.plugOutline_plugSE[name] = p.capsMaskMarker_plugSE[name] = v;
        if (p.plug_enabledSE[name]) {
          /** @type {number} */
          scale = p.line_strokeWidth / cfg.lineSize * __vue_options__.plugSizeSE[name];
          /** @type {number} */
          p.position_plugOverheadSE[name] = isoPos.overhead * scale;
          /** @type {number} */
          p.viewBox_plugBCircleSE[name] = isoPos.bCircle * scale;
          /** @type {number} */
          y = isoPos.sideLen * scale;
          /** @type {number} */
          w = isoPos.backLen * scale;
        } else {
          /** @type {number} */
          p.position_plugOverheadSE[name] = -p.line_strokeWidth / 2;
          /** @type {number} */
          p.viewBox_plugBCircleSE[name] = y = w = 0;
        }
        callback(node, p.attach_plugSideLenSE, name, y, _ref1.cur_attach_plugSideLenSE);
        callback(node, p.attach_plugBackLenSE, name, w, _ref1.cur_attach_plugBackLenSE);
        /** @type {boolean} */
        p.capsMaskAnchor_enabledSE[name] = !p.plug_enabledSE[name];
      }), def = callback(node, p, "plug_enabled", p.plug_enabledSE[0] || p.plug_enabledSE[1]) || def);
    }
    if (params.lineOutline || me.line) {
      me.lineOutline = (config = (options = e).options, data = options.curStats, _childPassed = false, _childPassed = callback(options, data, "lineOutline_enabled", config.lineOutlineEnabled) || _childPassed, _childPassed = callback(options, data, "lineOutline_color", config.lineOutlineColor) || _childPassed, _childPassed = callback(options, data, "lineOutline_colorTra", parse(data.lineOutline_color)[0] < 1) || _childPassed, config = data.line_strokeWidth * config.lineOutlineSize, _childPassed =
      callback(options, data, "lineOutline_strokeWidth", data.line_strokeWidth - 2 * config) || _childPassed, _childPassed = callback(options, data, "lineOutline_inStrokeWidth", data.lineOutline_colorTra ? data.lineOutline_strokeWidth + 2 * ratio : data.line_strokeWidth - config) || _childPassed);
    }
    if (params.plugOutline || me.line || me.plug || me.lineOutline) {
      me.plugOutline = (optionData = (r = e).options, b = r.curStats, off = false, [0, 1].forEach(function(i) {
        var v = b.plugOutline_plugSE[i];
        var expr = v !== v_res ? weights[keys[v]] : null;
        off = callback(r, b.plugOutline_enabledSE, i, optionData.plugOutlineEnabledSE[i] && b.plug_enabled && b.plug_enabledSE[i] && !!expr && !!expr.outlineBase) || off;
        off = callback(r, b.plugOutline_colorSE, i, v = optionData.plugOutlineColorSE[i] || b.lineOutline_color) || off;
        off = callback(r, b.plugOutline_colorTraSE, i, parse(v)[0] < 1) || off;
        if (expr && expr.outlineBase) {
          if ((v = optionData.plugOutlineSizeSE[i]) > expr.outlineMax) {
            v = expr.outlineMax;
          }
          /** @type {number} */
          v = v * (2 * expr.outlineBase);
          off = callback(r, b.plugOutline_strokeWidthSE, i, v) || off;
          off = callback(r, b.plugOutline_inStrokeWidthSE, i, b.plugOutline_colorTraSE[i] ? v - ratio / (b.line_strokeWidth / cfg.lineSize) / optionData.plugSizeSE[i] * 2 : v / 2) || off;
        }
      }), off);
    }
    if (params.faces || me.line || me.plug || me.lineOutline || me.plugOutline) {
      me.faces = (item = (res = e).curStats, commits = res.aplStats, user = res.events, E = false, !item.line_altColor && callback(res, commits, "line_color", value = item.line_color, user.apl_line_color) && (res.lineFace.style.stroke = value, E = true), callback(res, commits, "line_strokeWidth", value = item.line_strokeWidth, user.apl_line_strokeWidth) && (res.lineShape.style.strokeWidth = value + "px", E = true, (matchesSelector || err) && (debug(res, res.lineShape), err && (debug(res, res.lineFace),
      debug(res, res.lineMaskCaps)))), callback(res, commits, "lineOutline_enabled", value = item.lineOutline_enabled, user.apl_lineOutline_enabled) && (res.lineOutlineFace.style.display = value ? "inline" : "none", E = true), item.lineOutline_enabled && (callback(res, commits, "lineOutline_color", value = item.lineOutline_color, user.apl_lineOutline_color) && (res.lineOutlineFace.style.stroke = value, E = true), callback(res, commits, "lineOutline_strokeWidth", value = item.lineOutline_strokeWidth,
      user.apl_lineOutline_strokeWidth) && (res.lineOutlineMaskShape.style.strokeWidth = value + "px", E = true, err && (debug(res, res.lineOutlineMaskCaps), debug(res, res.lineOutlineFace))), callback(res, commits, "lineOutline_inStrokeWidth", value = item.lineOutline_inStrokeWidth, user.apl_lineOutline_inStrokeWidth) && (res.lineMaskShape.style.strokeWidth = value + "px", E = true, err && (debug(res, res.lineOutlineMaskCaps), debug(res, res.lineOutlineFace)))), callback(res, commits, "plug_enabled",
      value = item.plug_enabled, user.apl_plug_enabled) && (res.plugsFace.style.display = value ? "inline" : "none", E = true), item.plug_enabled && [0, 1].forEach(function(i) {
        var v = item.plug_plugSE[i];
        var self = v !== v_res ? weights[keys[v]] : null;
        var data = touchstart(i, self);
        if (callback(res, commits.plug_enabledSE, i, value = item.plug_enabledSE[i], user.apl_plug_enabledSE)) {
          /** @type {string} */
          res.plugsFace.style[data.prop] = value ? "url(#" + res.plugMarkerIdSE[i] + ")" : "none";
          /** @type {boolean} */
          E = true;
        }
        if (item.plug_enabledSE[i]) {
          if (callback(res, commits.plug_plugSE, i, v, user.apl_plug_plugSE)) {
            /** @type {string} */
            res.plugFaceSE[i].href.baseVal = "#" + self.elmId;
            fn(res, res.plugMarkerSE[i], data.orient, self.bBox, res.svg, res.plugMarkerShapeSE[i], res.plugsFace);
            /** @type {boolean} */
            E = true;
            if (matchesSelector) {
              debug(res, res.plugsFace);
            }
          }
          if (callback(res, commits.plug_colorSE, i, value = item.plug_colorSE[i], user.apl_plug_colorSE)) {
            res.plugFaceSE[i].style.fill = value;
            /** @type {boolean} */
            E = true;
            if ((ariaRole || model || err) && !item.line_colorTra) {
              debug(res, err ? res.lineMaskCaps : res.capsMaskLine);
            }
          }
          ["markerWidth", "markerHeight"].forEach(function(name) {
            /** @type {string} */
            var id = "plug_" + name + "SE";
            if (callback(res, commits[id], i, value = item[id][i], user["apl_" + id])) {
              res.plugMarkerSE[i][name].baseVal.value = value;
              /** @type {boolean} */
              E = true;
            }
          });
          if (callback(res, commits.plugOutline_enabledSE, i, value = item.plugOutline_enabledSE[i], user.apl_plugOutline_enabledSE)) {
            if (value) {
              /** @type {string} */
              res.plugFaceSE[i].style.mask = "url(#" + res.plugMaskIdSE[i] + ")";
              /** @type {string} */
              res.plugOutlineFaceSE[i].style.display = "inline";
            } else {
              /** @type {string} */
              res.plugFaceSE[i].style.mask = "none";
              /** @type {string} */
              res.plugOutlineFaceSE[i].style.display = "none";
            }
            /** @type {boolean} */
            E = true;
          }
          if (item.plugOutline_enabledSE[i]) {
            if (callback(res, commits.plugOutline_plugSE, i, v, user.apl_plugOutline_plugSE)) {
              /** @type {string} */
              res.plugOutlineFaceSE[i].href.baseVal = res.plugMaskShapeSE[i].href.baseVal = res.plugOutlineMaskShapeSE[i].href.baseVal = "#" + self.elmId;
              [res.plugMaskSE[i], res.plugOutlineMaskSE[i]].forEach(function(rect) {
                rect.x.baseVal.value = self.bBox.left;
                rect.y.baseVal.value = self.bBox.top;
                rect.width.baseVal.value = self.bBox.width;
                rect.height.baseVal.value = self.bBox.height;
              });
              /** @type {boolean} */
              E = true;
            }
            if (callback(res, commits.plugOutline_colorSE, i, value = item.plugOutline_colorSE[i], user.apl_plugOutline_colorSE)) {
              res.plugOutlineFaceSE[i].style.fill = value;
              /** @type {boolean} */
              E = true;
              if (err) {
                debug(res, res.lineMaskCaps);
                debug(res, res.lineOutlineMaskCaps);
              }
            }
            if (callback(res, commits.plugOutline_strokeWidthSE, i, value = item.plugOutline_strokeWidthSE[i], user.apl_plugOutline_strokeWidthSE)) {
              /** @type {string} */
              res.plugOutlineMaskShapeSE[i].style.strokeWidth = value + "px";
              /** @type {boolean} */
              E = true;
            }
            if (callback(res, commits.plugOutline_inStrokeWidthSE, i, value = item.plugOutline_inStrokeWidthSE[i], user.apl_plugOutline_inStrokeWidthSE)) {
              /** @type {string} */
              res.plugMaskShapeSE[i].style.strokeWidth = value + "px";
              /** @type {boolean} */
              E = true;
            }
          }
        }
      }), E);
    }
    if (params.position || me.line || me.plug) {
      me.position = render(e);
    }
    if (params.path || me.position) {
      /** @type {boolean} */
      me.path = (_childPassed = (el = e).curStats, offset = el.aplStats, d = el.pathList.animVal || el.pathList.baseVal, graphRect = _childPassed.path_edge, containerRect = false, d && (graphRect.x1 = graphRect.x2 = d[0][0].x, graphRect.y1 = graphRect.y2 = d[0][0].y, _childPassed.path_pathData = pathData = draw(d, function(position) {
        if (position.x < graphRect.x1) {
          graphRect.x1 = position.x;
        }
        if (position.y < graphRect.y1) {
          graphRect.y1 = position.y;
        }
        if (position.x > graphRect.x2) {
          graphRect.x2 = position.x;
        }
        if (position.y > graphRect.y2) {
          graphRect.y2 = position.y;
        }
      }), log(pathData, offset.path_pathData) && (el.linePath.setPathData(pathData), offset.path_pathData = pathData, containerRect = true, err ? (debug(el, el.plugsFace), debug(el, el.lineMaskCaps)) : matchesSelector && debug(el, el.linePath), el.events.apl_path && el.events.apl_path.forEach(function(updateCalback) {
        updateCalback(el, pathData);
      }))), containerRect);
    }
    me.viewBox = (d = (element = e).curStats, offset = element.aplStats, containerRect = d.path_edge, o = d.viewBox_bBox, object = offset.viewBox_bBox, viewBox = element.svg.viewBox.baseVal, indexedRows = element.svg.style, N = false, offset = Math.max(d.line_strokeWidth / 2, d.viewBox_plugBCircleSE[0] || 0, d.viewBox_plugBCircleSE[1] || 0), t = {
      x1 : containerRect.x1 - offset,
      y1 : containerRect.y1 - offset,
      x2 : containerRect.x2 + offset,
      y2 : containerRect.y2 + offset
    }, element.events.new_edge4viewBox && element.events.new_edge4viewBox.forEach(function(render) {
      render(element, t);
    }), o.x = d.lineMask_x = d.lineOutlineMask_x = d.maskBGRect_x = t.x1, o.y = d.lineMask_y = d.lineOutlineMask_y = d.maskBGRect_y = t.y1, o.width = t.x2 - t.x1, o.height = t.y2 - t.y1, ["x", "y", "width", "height"].forEach(function(index) {
      var item;
      if ((item = o[index]) !== object[index]) {
        viewBox[index] = object[index] = item;
        /** @type {string} */
        indexedRows[row[index]] = item + ("x" === index || "y" === index ? element.bodyOffset[index] : 0) + "px";
        /** @type {boolean} */
        N = true;
      }
      console.log(333333, item, o);
    }), N);
    me.mask = (props = (response = e).curStats, partitions = response.aplStats, G = false, props.plug_enabled ? [0, 1].forEach(function(language) {
      props.capsMaskMarker_enabledSE[language] = props.plug_enabledSE[language] && props.plug_colorTraSE[language] || props.plugOutline_enabledSE[language] && props.plugOutline_colorTraSE[language];
    }) : props.capsMaskMarker_enabledSE[0] = props.capsMaskMarker_enabledSE[1] = false, props.capsMaskMarker_enabled = props.capsMaskMarker_enabledSE[0] || props.capsMaskMarker_enabledSE[1], props.lineMask_outlineMode = props.lineOutline_enabled, props.caps_enabled = props.capsMaskMarker_enabled || props.capsMaskAnchor_enabledSE[0] || props.capsMaskAnchor_enabledSE[1], props.lineMask_enabled = props.caps_enabled || props.lineMask_outlineMode, (props.lineMask_enabled && !props.lineMask_outlineMode ||
    props.lineOutline_enabled) && ["x", "y"].forEach(function(name) {
      /** @type {string} */
      var i = "maskBGRect_" + name;
      if (callback(response, partitions, i, height = props[i])) {
        response.maskBGRect[name].baseVal.value = height;
        /** @type {boolean} */
        G = true;
      }
    }), callback(response, partitions, "lineMask_enabled", height = props.lineMask_enabled) && (response.lineFace.style.mask = height ? "url(#" + response.lineMaskId + ")" : "none", G = true, model && debug(response, response.lineMask)), props.lineMask_enabled && (callback(response, partitions, "lineMask_outlineMode", height = props.lineMask_outlineMode) && (height ? (response.lineMaskBG.style.display = "none", response.lineMaskShape.style.display = "inline") : (response.lineMaskBG.style.display =
    "inline", response.lineMaskShape.style.display = "none"), G = true), ["x", "y"].forEach(function(name) {
      /** @type {string} */
      var i = "lineMask_" + name;
      if (callback(response, partitions, i, height = props[i])) {
        response.lineMask[name].baseVal.value = height;
        /** @type {boolean} */
        G = true;
      }
    }), callback(response, partitions, "caps_enabled", height = props.caps_enabled) && (response.lineMaskCaps.style.display = response.lineOutlineMaskCaps.style.display = height ? "inline" : "none", G = true, model && debug(response, response.capsMaskLine)), props.caps_enabled && ([0, 1].forEach(function(i) {
      var t;
      if (callback(response, partitions.capsMaskAnchor_enabledSE, i, height = props.capsMaskAnchor_enabledSE[i])) {
        /** @type {string} */
        response.capsMaskAnchorSE[i].style.display = height ? "inline" : "none";
        /** @type {boolean} */
        G = true;
        if (model) {
          debug(response, response.lineMask);
        }
      }
      if (props.capsMaskAnchor_enabledSE[i]) {
        if (log(t = props.capsMaskAnchor_pathDataSE[i], partitions.capsMaskAnchor_pathDataSE[i])) {
          response.capsMaskAnchorSE[i].setPathData(t);
          partitions.capsMaskAnchor_pathDataSE[i] = t;
          /** @type {boolean} */
          G = true;
        }
        if (callback(response, partitions.capsMaskAnchor_strokeWidthSE, i, height = props.capsMaskAnchor_strokeWidthSE[i])) {
          /** @type {string} */
          response.capsMaskAnchorSE[i].style.strokeWidth = height + "px";
          /** @type {boolean} */
          G = true;
        }
      }
    }), callback(response, partitions, "capsMaskMarker_enabled", height = props.capsMaskMarker_enabled) && (response.capsMaskLine.style.display = height ? "inline" : "none", G = true), props.capsMaskMarker_enabled && [0, 1].forEach(function(i) {
      var v = props.capsMaskMarker_plugSE[i];
      var self = v !== v_res ? weights[keys[v]] : null;
      var item = touchstart(i, self);
      if (callback(response, partitions.capsMaskMarker_enabledSE, i, height = props.capsMaskMarker_enabledSE[i])) {
        /** @type {string} */
        response.capsMaskLine.style[item.prop] = height ? "url(#" + response.lineMaskMarkerIdSE[i] + ")" : "none";
        /** @type {boolean} */
        G = true;
      }
      if (props.capsMaskMarker_enabledSE[i]) {
        if (callback(response, partitions.capsMaskMarker_plugSE, i, v)) {
          /** @type {string} */
          response.capsMaskMarkerShapeSE[i].href.baseVal = "#" + self.elmId;
          fn(response, response.capsMaskMarkerSE[i], item.orient, self.bBox, response.svg, response.capsMaskMarkerShapeSE[i], response.capsMaskLine);
          /** @type {boolean} */
          G = true;
          if (matchesSelector) {
            debug(response, response.capsMaskLine);
            debug(response, response.lineFace);
          }
        }
        ["markerWidth", "markerHeight"].forEach(function(name) {
          /** @type {string} */
          var j = "capsMaskMarker_" + name + "SE";
          if (callback(response, partitions[j], i, height = props[j][i])) {
            response.capsMaskMarkerSE[i][name].baseVal.value = height;
            /** @type {boolean} */
            G = true;
          }
        });
      }
    }))), props.lineOutline_enabled && ["x", "y"].forEach(function(name) {
      /** @type {string} */
      var i = "lineOutlineMask_" + name;
      if (callback(response, partitions, i, height = props[i])) {
        response.lineOutlineMask[name].baseVal.value = height;
        /** @type {boolean} */
        G = true;
      }
    }), G);
    if (params.effect) {
      states = (x = e).curStats;
      result = x.aplStats;
      Object.keys(params).forEach(function(key) {
        var node = params[key];
        /** @type {string} */
        var i = key + "_enabled";
        /** @type {string} */
        var k = key + "_options";
        key = states[k];
        if (callback(x, result, i, state = states[i])) {
          if (state) {
            result[k] = normalize(key);
          }
          node[state ? "init" : "remove"](x);
        } else {
          if (state && extend(key, result[k])) {
            node.remove(x);
            /** @type {boolean} */
            result[i] = true;
            result[k] = normalize(key);
            node.init(x);
          }
        }
      });
    }
    if ((ariaRole || model) && me.line && !me.path) {
      debug(e, e.lineShape);
    }
    if (ariaRole && me.plug && !me.line) {
      debug(e, e.plugsFace);
    }
    fireComponentHook(e);
  }
  /**
   * @param {!Object} request
   * @param {!Object} event
   * @return {?}
   */
  function load(request, event) {
    return {
      duration : (expect(request.duration) && 0 < request.duration ? request : event).duration,
      timing : player.validTiming(request.timing) ? request.timing : normalize(event.timing)
    };
  }
  /**
   * @param {!Object} self
   * @param {string} parentId
   * @param {!Object} x
   * @param {!Function} obj
   * @return {undefined}
   */
  function select(self, parentId, x, obj) {
    /**
     * @return {undefined}
     */
    function goNext() {
      ["show_on", "show_effect", "show_animOptions"].forEach(function(i) {
        opts[i] = data[i];
      });
    }
    var data = self.curStats;
    var opts = self.aplStats;
    var settings = {};
    /** @type {string} */
    data.show_on = parentId;
    if (x && state[x]) {
      /** @type {!Object} */
      data.show_effect = x;
      data.show_animOptions = load(isArray(obj) ? obj : {}, state[x].defaultAnimOptions);
    }
    /** @type {boolean} */
    settings.show_on = data.show_on !== opts.show_on;
    /** @type {boolean} */
    settings.show_effect = data.show_effect !== opts.show_effect;
    settings.show_animOptions = extend(data.show_animOptions, opts.show_animOptions);
    if (settings.show_effect || settings.show_animOptions) {
      if (data.show_inAnim) {
        x = settings.show_effect ? state[opts.show_effect].stop(self, true, true) : state[opts.show_effect].stop(self);
        goNext();
        state[opts.show_effect].init(self, x);
      } else {
        if (settings.show_on) {
          if (opts.show_effect && settings.show_effect) {
            state[opts.show_effect].stop(self, true, true);
          }
          goNext();
          state[opts.show_effect].init(self);
        }
      }
    } else {
      if (settings.show_on) {
        goNext();
        state[opts.show_effect].start(self);
      }
    }
  }
  /**
   * @param {!Object} data
   * @param {!Object} i
   * @param {string} e
   * @return {?}
   */
  function done(data, i, e) {
    e = {
      props : data,
      optionName : e
    };
    return data.attachments.indexOf(i) < 0 && (!i.conf.bind || i.conf.bind(i, e)) && (data.attachments.push(i), i.boundTargets.push(e), 1);
  }
  /**
   * @param {!Object} msg
   * @param {!Object} t
   * @param {boolean} err
   * @return {undefined}
   */
  function run(msg, t, err) {
    var i = msg.attachments.indexOf(t);
    if (-1 < i) {
      msg.attachments.splice(i, 1);
    }
    if (t.boundTargets.some(function(event, maxAtomIndex) {
      return event.props === msg && (t.conf.unbind && t.conf.unbind(t, event), i = maxAtomIndex, true);
    })) {
      t.boundTargets.splice(i, 1);
      if (!err) {
        execute(function() {
          if (!t.boundTargets.length) {
            setup(t);
          }
        });
      }
    }
  }
  /**
   * @param {!Object} obj
   * @param {string} parent
   * @return {undefined}
   */
  function init(obj, parent) {
    /**
     * @param {!Object} element
     * @param {string} name
     * @param {string} id
     * @param {!Object} key
     * @param {string} fn
     * @return {?}
     */
    function parse(element, name, id, key, fn) {
      var item = {};
      return id ? null != key ? (item.container = element[id], item.key = key) : (item.container = element, item.key = id) : (item.container = element, item.key = name), item.default = fn, item.acceptsAuto = null == item.default, item;
    }
    /**
     * @param {!Object} elem
     * @param {string} container
     * @param {string} propertyName
     * @param {string} obj
     * @param {string} key
     * @param {?} options
     * @param {!Object} value
     * @return {?}
     */
    function get(elem, container, propertyName, obj, key, options, value) {
      var nptmask;
      var type;
      var fn;
      value = parse(elem, propertyName, key, options, value);
      return null != container[propertyName] && (type = (container[propertyName] + "").toLowerCase()) && (value.acceptsAuto && type === on || (fn = obj[type])) && fn !== value.container[value.key] && (value.container[value.key] = fn, nptmask = true), null != value.container[value.key] || value.acceptsAuto || (value.container[value.key] = value.default, nptmask = true), nptmask;
    }
    /**
     * @param {!Object} type
     * @param {string} data
     * @param {string} name
     * @param {string} str
     * @param {string} key
     * @param {?} options
     * @param {!Object} value
     * @param {!Function} _
     * @param {string} s
     * @return {?}
     */
    function callback(type, data, name, str, key, options, value, _, s) {
      var __WEBPACK_AMD_DEFINE_RESULT__;
      var obj;
      var err;
      var article;
      value = parse(type, name, key, options, value);
      if (!str) {
        if (null == value.default) {
          throw new Error("Invalid `type`: " + name);
        }
        /** @type {string} */
        str = typeof value.default;
      }
      return null != data[name] && (value.acceptsAuto && (data[name] + "").toLowerCase() === on || (err = obj = data[name], ("number" === (article = str) ? expect(err) : typeof err === article) && (obj = s && "string" === str && obj ? obj.trim() : obj, 1) && (!_ || _(obj)))) && obj !== value.container[value.key] && (value.container[value.key] = obj, __WEBPACK_AMD_DEFINE_RESULT__ = true), null != value.container[value.key] || value.acceptsAuto || (value.container[value.key] = value.default, __WEBPACK_AMD_DEFINE_RESULT__ =
      true), __WEBPACK_AMD_DEFINE_RESULT__;
    }
    /**
     * @param {string} height
     * @return {?}
     */
    function done(height) {
      var rect = v.appendChild(doc.createElementNS(i, "mask"));
      return rect.id = height, rect.maskUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE, [rect.x, rect.y, rect.width, rect.height].forEach(function(klass) {
        klass.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
      }), rect;
    }
    /**
     * @param {string} height
     * @return {?}
     */
    function render(height) {
      var el = v.appendChild(doc.createElementNS(i, "marker"));
      return el.id = height, el.markerUnits.baseVal = SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH, el.viewBox.baseVal || el.setAttribute("viewBox", "0 0 0 0"), el;
    }
    /**
     * @param {?} cascade
     * @return {?}
     */
    function fn(cascade) {
      return [cascade.width, cascade.height].forEach(function(klass) {
        klass.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100);
      }), cascade;
    }
    var prop;
    var self;
    var element;
    var svg;
    var v;
    var list;
    var target;
    var stepId;
    var elementId;
    var iframeID;
    var id;
    var map;
    var e;
    var doc;
    var node_;
    var item = obj.options;
    var args = {};
    if (parent = parent || {}, ["start", "end"].forEach(function(i, name) {
      var value = parent[i];
      /** @type {boolean} */
      var text = false;
      if (value && (handler(value) || (text = format(value, "anchor"))) && value !== item.anchorSE[name]) {
        if (false !== obj.optionIsAttach.anchorSE[name] && run(obj, items[item.anchorSE[name]._id]), text && !done(obj, items[value._id], i)) {
          throw new Error("Can't bind attachment");
        }
        item.anchorSE[name] = value;
        obj.optionIsAttach.anchorSE[name] = text;
        /** @type {boolean} */
        prop = args.position = true;
      }
    }), !item.anchorSE[0] || !item.anchorSE[1] || item.anchorSE[0] === item.anchorSE[1]) {
      throw new Error("`start` and `end` are required.");
    }
    if (prop && (id = function(body, name) {
      var data;
      var win;
      if (!(body = process(body)) || !(data = process(name))) {
        throw new Error("Cannot get frames.");
      }
      return body.length && data.length && (body.reverse(), data.reverse(), body.some(function(namespaces) {
        return data.some(function(fn) {
          return fn === namespaces && (win = fn.contentWindow, true);
        });
      })), win || window;
    }(false !== obj.optionIsAttach.anchorSE[0] ? items[item.anchorSE[0]._id].element : item.anchorSE[0], false !== obj.optionIsAttach.anchorSE[1] ? items[item.anchorSE[1]._id].element : item.anchorSE[1])) !== obj.baseWindow) {
      element = id;
      e = (self = obj).aplStats;
      doc = element.document;
      /** @type {string} */
      node_ = name + "-" + self._id;
      self.pathList = {};
      resolve(e, NS);
      Object.keys(params).forEach(function(name) {
        /** @type {string} */
        var state = name + "_enabled";
        if (e[state]) {
          params[name].remove(self);
          /** @type {boolean} */
          e[state] = false;
        }
      });
      if (self.baseWindow && self.svg) {
        self.baseWindow.document.body.removeChild(self.svg);
      }
      onLoad(self.baseWindow = element);
      self.bodyOffset = getSize(element);
      self.svg = svg = doc.createElementNS(i, "svg");
      /** @type {string} */
      svg.className.baseVal = name;
      if (!svg.viewBox.baseVal) {
        svg.setAttribute("viewBox", "0 0 0 0");
      }
      self.defs = v = svg.appendChild(doc.createElementNS(i, "defs"));
      self.linePath = target = v.appendChild(doc.createElementNS(i, "path"));
      /** @type {string} */
      target.id = stepId = node_ + "-line-path";
      /** @type {string} */
      target.className.baseVal = name + "-line-path";
      if (model) {
        /** @type {string} */
        target.style.fill = "none";
      }
      self.lineShape = target = v.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.id = elementId = node_ + "-line-shape";
      /** @type {string} */
      target.href.baseVal = "#" + stepId;
      /** @type {string} */
      (list = v.appendChild(doc.createElementNS(i, "g"))).id = iframeID = node_ + "-caps";
      /** @type {!Array<?>} */
      self.capsMaskAnchorSE = [0, 1].map(function() {
        var elem = list.appendChild(doc.createElementNS(i, "path"));
        return elem.className.baseVal = name + "-caps-mask-anchor", elem;
      });
      /** @type {!Array} */
      self.lineMaskMarkerIdSE = [node_ + "-caps-mask-marker-0", node_ + "-caps-mask-marker-1"];
      /** @type {!Array<?>} */
      self.capsMaskMarkerSE = [0, 1].map(function(name) {
        return render(self.lineMaskMarkerIdSE[name]);
      });
      /** @type {!Array<?>} */
      self.capsMaskMarkerShapeSE = [0, 1].map(function(n) {
        n = self.capsMaskMarkerSE[n].appendChild(doc.createElementNS(i, "use"));
        return n.className.baseVal = name + "-caps-mask-marker-shape", n;
      });
      self.capsMaskLine = target = list.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.className.baseVal = name + "-caps-mask-line";
      /** @type {string} */
      target.href.baseVal = "#" + elementId;
      self.maskBGRect = target = fn(v.appendChild(doc.createElementNS(i, "rect")));
      /** @type {string} */
      target.id = id = node_ + "-mask-bg-rect";
      /** @type {string} */
      target.className.baseVal = name + "-mask-bg-rect";
      if (model) {
        /** @type {string} */
        target.style.fill = "white";
      }
      self.lineMask = fn(done(self.lineMaskId = node_ + "-line-mask"));
      self.lineMaskBG = target = self.lineMask.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.href.baseVal = "#" + id;
      self.lineMaskShape = target = self.lineMask.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.className.baseVal = name + "-line-mask-shape";
      /** @type {string} */
      target.href.baseVal = "#" + stepId;
      /** @type {string} */
      target.style.display = "none";
      self.lineMaskCaps = target = self.lineMask.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.href.baseVal = "#" + iframeID;
      self.lineOutlineMask = fn(done(element = node_ + "-line-outline-mask"));
      /** @type {string} */
      (target = self.lineOutlineMask.appendChild(doc.createElementNS(i, "use"))).href.baseVal = "#" + id;
      self.lineOutlineMaskShape = target = self.lineOutlineMask.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.className.baseVal = name + "-line-outline-mask-shape";
      /** @type {string} */
      target.href.baseVal = "#" + stepId;
      self.lineOutlineMaskCaps = target = self.lineOutlineMask.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.href.baseVal = "#" + iframeID;
      self.face = svg.appendChild(doc.createElementNS(i, "g"));
      self.lineFace = target = self.face.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.href.baseVal = "#" + elementId;
      self.lineOutlineFace = target = self.face.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.href.baseVal = "#" + elementId;
      /** @type {string} */
      target.style.mask = "url(#" + element + ")";
      /** @type {string} */
      target.style.display = "none";
      /** @type {!Array} */
      self.plugMaskIdSE = [node_ + "-plug-mask-0", node_ + "-plug-mask-1"];
      /** @type {!Array<?>} */
      self.plugMaskSE = [0, 1].map(function(name) {
        return done(self.plugMaskIdSE[name]);
      });
      /** @type {!Array<?>} */
      self.plugMaskShapeSE = [0, 1].map(function(n) {
        n = self.plugMaskSE[n].appendChild(doc.createElementNS(i, "use"));
        return n.className.baseVal = name + "-plug-mask-shape", n;
      });
      /** @type {!Array} */
      map = [];
      /** @type {!Array<?>} */
      self.plugOutlineMaskSE = [0, 1].map(function(pkgName) {
        return done(map[pkgName] = node_ + "-plug-outline-mask-" + pkgName);
      });
      /** @type {!Array<?>} */
      self.plugOutlineMaskShapeSE = [0, 1].map(function(n) {
        n = self.plugOutlineMaskSE[n].appendChild(doc.createElementNS(i, "use"));
        return n.className.baseVal = name + "-plug-outline-mask-shape", n;
      });
      /** @type {!Array} */
      self.plugMarkerIdSE = [node_ + "-plug-marker-0", node_ + "-plug-marker-1"];
      /** @type {!Array<?>} */
      self.plugMarkerSE = [0, 1].map(function(element) {
        element = render(self.plugMarkerIdSE[element]);
        return model && (element.markerUnits.baseVal = SVGMarkerElement.SVG_MARKERUNITS_USERSPACEONUSE), element;
      });
      /** @type {!Array<?>} */
      self.plugMarkerShapeSE = [0, 1].map(function(parentId) {
        return self.plugMarkerSE[parentId].appendChild(doc.createElementNS(i, "g"));
      });
      /** @type {!Array<?>} */
      self.plugFaceSE = [0, 1].map(function(parentId) {
        return self.plugMarkerShapeSE[parentId].appendChild(doc.createElementNS(i, "use"));
      });
      /** @type {!Array<?>} */
      self.plugOutlineFaceSE = [0, 1].map(function(n) {
        var elem = self.plugMarkerShapeSE[n].appendChild(doc.createElementNS(i, "use"));
        return elem.style.mask = "url(#" + map[n] + ")", elem.style.display = "none", elem;
      });
      self.plugsFace = target = self.face.appendChild(doc.createElementNS(i, "use"));
      /** @type {string} */
      target.className.baseVal = name + "-plugs-face";
      /** @type {string} */
      target.href.baseVal = "#" + elementId;
      /** @type {string} */
      target.style.display = "none";
      if (self.curStats.show_inAnim) {
        /** @type {number} */
        self.isShown = 1;
        state[e.show_effect].stop(self, true);
      } else {
        if (!self.isShown) {
          /** @type {string} */
          svg.style.visibility = "hidden";
        }
      }
      doc.body.appendChild(svg);
      [0, 1, 2].forEach(function(o) {
        var group;
        o = self.options.labelSEM[o];
        if (o && format(o, "label") && (group = items[o._id]).conf.initSvg) {
          group.conf.initSvg(group, self);
        }
      });
      /** @type {boolean} */
      args.line = args.plug = args.lineOutline = args.plugOutline = args.faces = args.effect = true;
    }
    args.position = get(item, parent, "path", data, null, null, cfg.path) || args.position;
    args.position = get(item, parent, "startSocket", offset, "socketSE", 0) || args.position;
    args.position = get(item, parent, "endSocket", offset, "socketSE", 1) || args.position;
    [parent.startSocketGravity, parent.endSocketGravity].forEach(function(data, key) {
      var b;
      var a;
      /** @type {boolean} */
      var value = false;
      if (null != data) {
        if (Array.isArray(data)) {
          if (expect(data[0]) && expect(data[1])) {
            /** @type {!Array} */
            value = [data[0], data[1]];
            if (Array.isArray(item.socketGravitySE[key]) && (b = value, a = item.socketGravitySE[key], b.length === a.length && b.every(function(s, i) {
              return s === a[i];
            }))) {
              /** @type {boolean} */
              value = false;
            }
          }
        } else {
          if ((data + "").toLowerCase() === on) {
            /** @type {null} */
            value = null;
          } else {
            if (expect(data) && 0 <= data) {
              /** @type {number} */
              value = data;
            }
          }
          if (value === item.socketGravitySE[key]) {
            /** @type {boolean} */
            value = false;
          }
        }
        if (false !== value) {
          /** @type {boolean} */
          item.socketGravitySE[key] = value;
          /** @type {boolean} */
          args.position = true;
        }
      }
    });
    args.line = callback(item, parent, "color", null, "lineColor", null, cfg.lineColor, null, true) || args.line;
    args.line = callback(item, parent, "size", null, "lineSize", null, cfg.lineSize, function(canCreateDiscussions) {
      return 0 < canCreateDiscussions;
    }) || args.line;
    ["startPlug", "endPlug"].forEach(function(name, path) {
      args.plug = get(item, parent, name, day, "plugSE", path, cfg.plugSE[path]) || args.plug;
      args.plug = callback(item, parent, name + "Color", "string", "plugColorSE", path, null, null, true) || args.plug;
      args.plug = callback(item, parent, name + "Size", null, "plugSizeSE", path, cfg.plugSizeSE[path], function(canCreateDiscussions) {
        return 0 < canCreateDiscussions;
      }) || args.plug;
    });
    args.lineOutline = callback(item, parent, "outline", null, "lineOutlineEnabled", null, cfg.lineOutlineEnabled) || args.lineOutline;
    args.lineOutline = callback(item, parent, "outlineColor", null, "lineOutlineColor", null, cfg.lineOutlineColor, null, true) || args.lineOutline;
    args.lineOutline = callback(item, parent, "outlineSize", null, "lineOutlineSize", null, cfg.lineOutlineSize, function(canCreateDiscussions) {
      return 0 < canCreateDiscussions && canCreateDiscussions <= .48;
    }) || args.lineOutline;
    ["startPlugOutline", "endPlugOutline"].forEach(function(k, path) {
      args.plugOutline = callback(item, parent, k, null, "plugOutlineEnabledSE", path, cfg.plugOutlineEnabledSE[path]) || args.plugOutline;
      args.plugOutline = callback(item, parent, k + "Color", "string", "plugOutlineColorSE", path, null, null, true) || args.plugOutline;
      args.plugOutline = callback(item, parent, k + "Size", null, "plugOutlineSizeSE", path, cfg.plugOutlineSizeSE[path], function(canCreateDiscussions) {
        return 1 <= canCreateDiscussions;
      }) || args.plugOutline;
    });
    ["startLabel", "endLabel", "middleLabel"].forEach(function(i, fieldName) {
      var sid;
      var test;
      var o;
      var val = parent[i];
      var undefined = item.labelSEM[fieldName] && !obj.optionIsAttach.labelSEM[fieldName] ? items[item.labelSEM[fieldName]._id].text : item.labelSEM[fieldName];
      /** @type {boolean} */
      var msg = false;
      if ((sid = "string" == typeof val) && (val = val.trim()), (sid || val && (msg = format(val, "label"))) && val !== undefined) {
        if (item.labelSEM[fieldName] && (run(obj, items[item.labelSEM[fieldName]._id]), item.labelSEM[fieldName] = ""), val) {
          if (msg ? (test = items[(o = val)._id]).boundTargets.slice().forEach(function(index) {
            test.conf.removeOption(test, index);
          }) : o = new Error(args.captionLabel, [val]), !done(obj, items[o._id], i)) {
            throw new Error("Can't bind attachment");
          }
          item.labelSEM[fieldName] = o;
        }
        obj.optionIsAttach.labelSEM[fieldName] = msg;
      }
    });
    Object.keys(params).forEach(function(key) {
      /**
       * @param {!Object} requestId
       * @return {?}
       */
      function factory(requestId) {
        var f = {};
        return config.optionsConf.forEach(function(match) {
          var last = match[0];
          var version = match[3];
          if (!(null == match[4] || f[version])) {
            /** @type {!Array} */
            f[version] = [];
          }
          ("function" == typeof last ? last : "id" === last ? get : callback).apply(null, [f, requestId].concat(match.slice(1)));
        }), f;
      }
      /**
       * @param {!Object} data
       * @return {?}
       */
      function render(data) {
        var formatter;
        /** @type {string} */
        var name = key + "_animOptions";
        return data.hasOwnProperty("animation") ? isArray(data.animation) ? formatter = obj.curStats[name] = load(data.animation, config.defaultAnimOptions) : (formatter = !!data.animation, obj.curStats[name] = formatter ? load({}, config.defaultAnimOptions) : null) : (formatter = !!config.defaultEnabled, obj.curStats[name] = formatter ? load({}, config.defaultAnimOptions) : null), formatter;
      }
      var data;
      var result;
      var config = params[key];
      /** @type {string} */
      var type = key + "_enabled";
      /** @type {string} */
      var i = key + "_options";
      if (parent.hasOwnProperty(key)) {
        data = parent[key];
        if (isArray(data)) {
          /** @type {boolean} */
          obj.curStats[type] = true;
          result = obj.curStats[i] = factory(data);
          if (config.anim) {
            obj.curStats[i].animation = render(data);
          }
        } else {
          if (result = obj.curStats[type] = !!data) {
            obj.curStats[i] = factory({});
            if (config.anim) {
              obj.curStats[i].animation = render({});
            }
          }
        }
        if (extend(result, item[key])) {
          item[key] = result;
          /** @type {boolean} */
          args.effect = true;
        }
      }
    });
    update(obj, args);
  }
  /**
   * @param {!Object} date
   * @param {!Object} value
   * @param {!Object} options
   * @return {undefined}
   */
  function list(date, value, options) {
    var data = {
      options : {
        anchorSE : [],
        socketSE : [],
        socketGravitySE : [],
        plugSE : [],
        plugColorSE : [],
        plugSizeSE : [],
        plugOutlineEnabledSE : [],
        plugOutlineColorSE : [],
        plugOutlineSizeSE : [],
        labelSEM : ["", "", ""]
      },
      optionIsAttach : {
        anchorSE : [false, false],
        labelSEM : [false, false, false]
      },
      curStats : {},
      aplStats : {},
      attachments : [],
      events : {},
      reflowTargets : []
    };
    resolve(data.curStats, NS);
    resolve(data.aplStats, NS);
    Object.keys(params).forEach(function(i) {
      var src = params[i].stats;
      resolve(data.curStats, src);
      resolve(data.aplStats, src);
      /** @type {boolean} */
      data.options[i] = false;
    });
    resolve(data.curStats, u);
    resolve(data.aplStats, u);
    /** @type {string} */
    data.curStats.show_effect = reducerMountPoint;
    data.curStats.show_animOptions = normalize(state[reducerMountPoint].defaultAnimOptions);
    Object.defineProperty(this, "_id", {
      value : ++uniqueId
    });
    data._id = this._id;
    elements[this._id] = data;
    if (1 === arguments.length) {
      /** @type {!Object} */
      options = date;
      /** @type {null} */
      date = null;
    }
    options = options || {};
    if (date || value) {
      options = normalize(options);
      if (date) {
        /** @type {!Object} */
        options.start = date;
      }
      if (value) {
        /** @type {!Object} */
        options.end = value;
      }
    }
    /** @type {boolean} */
    data.isShown = data.aplStats.show_on = !options.hide;
    this.setOptions(options);
  }
  /**
   * @param {string} v
   * @return {?}
   */
  function refresh(v) {
    return function(name) {
      var options = {};
      options[v] = name;
      this.setOptions(options);
    };
  }
  /**
   * @param {!Object} res
   * @param {string} args
   * @return {undefined}
   */
  function validate(res, args) {
    var result;
    var self = {
      conf : res,
      curStats : {},
      aplStats : {},
      boundTargets : []
    };
    var data = {};
    res.argOptions.every(function(component) {
      return !(!args.length || ("string" == typeof component.type ? typeof args[0] !== component.type : "function" != typeof component.type || !component.type(args[0]))) && (data[component.optionName] = args.shift(), true);
    });
    result = args.length && isArray(args[0]) ? normalize(args[0]) : {};
    Object.keys(data).forEach(function(i) {
      result[i] = data[i];
    });
    if (res.stats) {
      resolve(self.curStats, res.stats);
      resolve(self.aplStats, res.stats);
    }
    Object.defineProperty(this, "_id", {
      value : ++nextid
    });
    Object.defineProperty(this, "isRemoved", {
      get : function() {
        return !items[this._id];
      }
    });
    self._id = this._id;
    if (!(res.init && !res.init(self, result))) {
      items[this._id] = self;
    }
  }
  var params;
  var state;
  var args;
  var Error;
  var format;
  var setup;
  var _takingTooLongTimeout;
  var isShallow;
  var values;
  var isSorted;
  var filters;
  var n;
  var result;
  var s;
  var len;
  var scope;
  var r;
  var valueByIndex;
  var results;
  var callId;
  var toString;
  var toStr;
  var Version;
  /** @type {string} */
  var name = "leader-line";
  /** @type {number} */
  var top = 1;
  /** @type {number} */
  var undefined = 2;
  /** @type {number} */
  var el = 3;
  /** @type {number} */
  var left = 4;
  var offset = {
    top : top,
    right : undefined,
    bottom : el,
    left : left
  };
  /** @type {number} */
  var straight = 1;
  /** @type {number} */
  var angle = 2;
  /** @type {number} */
  var apexRestPath = 3;
  /** @type {number} */
  var object = 4;
  /** @type {number} */
  var v = 5;
  var data = {
    straight : straight,
    arc : angle,
    fluid : apexRestPath,
    magnet : object,
    grid : v
  };
  /** @type {string} */
  var v_res = "behind";
  /** @type {string} */
  var selectId = name + "-defs";
  /** @type {string} */
  var template = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="leader-line-defs"><style><![CDATA[.leader-line{position:absolute;overflow:visible!important;pointer-events:none!important;font-size:16px}#leader-line-defs{width:0;height:0;position:absolute;left:0;top:0}.leader-line-line-path{fill:none}.leader-line-mask-bg-rect{fill:white}.leader-line-caps-mask-anchor,.leader-line-caps-mask-marker-shape{fill:black}.leader-line-caps-mask-anchor{stroke:black}.leader-line-caps-mask-line,.leader-line-plugs-face{stroke:rgba(0,0,0,0)}.leader-line-line-mask-shape{stroke:white}.leader-line-line-outline-mask-shape{stroke:black}.leader-line-plug-mask-shape{fill:white;stroke:black}.leader-line-plug-outline-mask-shape{fill:black;stroke:white}.leader-line-areaAnchor{position:absolute;overflow:visible!important}]]\x3e</style><defs><circle id="leader-line-disc" cx="0" cy="0" r="5"/><rect id="leader-line-square" x="-5" y="-5" width="10" height="10"/><polygon id="leader-line-arrow1" points="-8,-8 8,0 -8,8 -5,0"/><polygon id="leader-line-arrow2" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"/><polygon id="leader-line-arrow3" points="-4,-5 8,0 -4,5"/><g id="leader-line-hand"><path style="fill: #fcfcfc" d="M9.19 11.14h4.75c1.38 0 2.49-1.11 2.49-2.49 0-.51-.15-.98-.41-1.37h1.3c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.53-2.49-2.53h1.02c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49h14.96c1.37 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49H16.58C16-9.86 14.28-11.14 9.7-11.14c-4.79 0-6.55 3.42-7.87 4.73H-2.14v13.23h3.68C3.29 9.97 5.47 11.14 9.19 11.14L9.19 11.14Z"/><path style="fill: black" d="M13.95 12c1.85 0 3.35-1.5 3.35-3.35 0-.17-.02-.34-.04-.51h.07c1.85 0 3.35-1.5 3.35-3.35 0-.79-.27-1.51-.72-2.08 1.03-.57 1.74-1.67 1.74-2.93 0-.59-.16-1.15-.43-1.63h12.04c1.85 0 3.35-1.5 3.35-3.35 0-1.85-1.5-3.35-3.35-3.35H17.2C16.26-10.93 13.91-12 9.7-12 5.36-12 3.22-9.4 1.94-7.84c0 0-.29.33-.5.57-.63 0-3.58 0-3.58 0C-2.61-7.27-3-6.88-3-6.41v13.23c0 .47.39.86.86.86 0 0 2.48 0 3.2 0C2.9 10.73 5.29 12 9.19 12L13.95 12ZM9.19 10.28c-3.46 0-5.33-1.05-6.9-3.87-.15-.27-.44-.44-.75-.44 0 0-1.81 0-2.82 0V-5.55c1.06 0 3.11 0 3.11 0 .25 0 .44-.06.61-.25l.83-.95c1.23-1.49 2.91-3.53 6.43-3.53 3.45 0 4.9.74 5.57 1.72h-4.3c-.48 0-.86.38-.86.86s.39.86.86.86h22.34c.9 0 1.63.73 1.63 1.63 0 .9-.73 1.63-1.63 1.63H15.83c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.52c.9 0 1.63.73 1.63 1.63s-.73 1.63-1.63 1.63h-3.12c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.11c.88 0 1.63.76 1.63 1.67 0 .9-.73 1.63-1.63 1.63h-3.2c-.48 0-.86.39-.86.86 0 .47.39.86.86.86h1.36c.05.16.09.34.09.51 0 .9-.73 1.63-1.63 1.63C13.95 10.28 9.19 10.28 9.19 10.28Z"/></g><g id="leader-line-crosshair"><path d="M0-78.97c-43.54 0-78.97 35.43-78.97 78.97 0 43.54 35.43 78.97 78.97 78.97s78.97-35.43 78.97-78.97C78.97-43.54 43.55-78.97 0-78.97ZM76.51-1.21h-9.91v-9.11h-2.43v9.11h-11.45c-.64-28.12-23.38-50.86-51.5-51.5V-64.17h9.11V-66.6h-9.11v-9.91C42.46-75.86 75.86-42.45 76.51-1.21ZM-1.21-30.76h-9.11v2.43h9.11V-4.2c-1.44.42-2.57 1.54-2.98 2.98H-28.33v-9.11h-2.43v9.11H-50.29C-49.65-28-27.99-49.65-1.21-50.29V-30.76ZM-30.76 1.21v9.11h2.43v-9.11H-4.2c.42 1.44 1.54 2.57 2.98 2.98v24.13h-9.11v2.43h9.11v19.53C-27.99 49.65-49.65 28-50.29 1.21H-30.76ZM1.22 30.75h9.11v-2.43h-9.11V4.2c1.44-.42 2.56-1.54 2.98-2.98h24.13v9.11h2.43v-9.11h19.53C49.65 28 28 49.65 1.22 50.29V30.75ZM30.76-1.21v-9.11h-2.43v9.11H4.2c-.42-1.44-1.54-2.56-2.98-2.98V-28.33h9.11v-2.43h-9.11V-50.29C28-49.65 49.65-28 50.29-1.21H30.76ZM-1.21-76.51v9.91h-9.11v2.43h9.11v11.45c-28.12.64-50.86 23.38-51.5 51.5H-64.17v-9.11H-66.6v9.11h-9.91C-75.86-42.45-42.45-75.86-1.21-76.51ZM-76.51 1.21h9.91v9.11h2.43v-9.11h11.45c.64 28.12 23.38 50.86 51.5 51.5v11.45h-9.11v2.43h9.11v9.91C-42.45 75.86-75.86 42.45-76.51 1.21ZM1.22 76.51v-9.91h9.11v-2.43h-9.11v-11.45c28.12-.64 50.86-23.38 51.5-51.5h11.45v9.11h2.43v-9.11h9.91C75.86 42.45 42.45 75.86 1.22 76.51Z"/><path d="M0 83.58-7.1 96 7.1 96Z"/><path d="M0-83.58 7.1-96-7.1-96"/><path d="M83.58 0 96 7.1 96-7.1Z"/><path d="M-83.58 0-96-7.1-96 7.1Z"/></g></defs></svg>';
  var weights = {
    disc : {
      elmId : "leader-line-disc",
      noRotate : true,
      bBox : {
        left : -5,
        top : -5,
        width : 10,
        height : 10,
        right : 5,
        bottom : 5
      },
      widthR : 2.5,
      heightR : 2.5,
      bCircle : 5,
      sideLen : 5,
      backLen : 5,
      overhead : 0,
      outlineBase : 1,
      outlineMax : 4
    },
    square : {
      elmId : "leader-line-square",
      noRotate : true,
      bBox : {
        left : -5,
        top : -5,
        width : 10,
        height : 10,
        right : 5,
        bottom : 5
      },
      widthR : 2.5,
      heightR : 2.5,
      bCircle : 5,
      sideLen : 5,
      backLen : 5,
      overhead : 0,
      outlineBase : 1,
      outlineMax : 4
    },
    arrow1 : {
      elmId : "leader-line-arrow1",
      bBox : {
        left : -8,
        top : -8,
        width : 16,
        height : 16,
        right : 8,
        bottom : 8
      },
      widthR : 4,
      heightR : 4,
      bCircle : 8,
      sideLen : 8,
      backLen : 8,
      overhead : 8,
      outlineBase : 2,
      outlineMax : 1.5
    },
    arrow2 : {
      elmId : "leader-line-arrow2",
      bBox : {
        left : -7,
        top : -8,
        width : 11,
        height : 16,
        right : 4,
        bottom : 8
      },
      widthR : 2.75,
      heightR : 4,
      bCircle : 8,
      sideLen : 8,
      backLen : 7,
      overhead : 4,
      outlineBase : 1,
      outlineMax : 1.75
    },
    arrow3 : {
      elmId : "leader-line-arrow3",
      bBox : {
        left : -4,
        top : -5,
        width : 12,
        height : 10,
        right : 8,
        bottom : 5
      },
      widthR : 3,
      heightR : 2.5,
      bCircle : 8,
      sideLen : 5,
      backLen : 4,
      overhead : 8,
      outlineBase : 1,
      outlineMax : 2.5
    },
    hand : {
      elmId : "leader-line-hand",
      bBox : {
        left : -3,
        top : -12,
        width : 40,
        height : 24,
        right : 37,
        bottom : 12
      },
      widthR : 10,
      heightR : 6,
      bCircle : 37,
      sideLen : 12,
      backLen : 3,
      overhead : 37
    },
    crosshair : {
      elmId : "leader-line-crosshair",
      noRotate : true,
      bBox : {
        left : -96,
        top : -96,
        width : 192,
        height : 192,
        right : 96,
        bottom : 96
      },
      widthR : 48,
      heightR : 48,
      bCircle : 96,
      sideLen : 96,
      backLen : 96,
      overhead : 0
    }
  };
  var day = {
    behind : v_res,
    disc : "disc",
    square : "square",
    arrow1 : "arrow1",
    arrow2 : "arrow2",
    arrow3 : "arrow3",
    hand : "hand",
    crosshair : "crosshair"
  };
  var keys = {
    disc : "disc",
    square : "square",
    arrow1 : "arrow1",
    arrow2 : "arrow2",
    arrow3 : "arrow3",
    hand : "hand",
    crosshair : "crosshair"
  };
  /** @type {!Array} */
  var margin = [top, undefined, el, left];
  /** @type {string} */
  var on = "auto";
  var row = {
    x : "left",
    y : "top",
    width : "width",
    height : "height"
  };
  /** @type {number} */
  var z = 80;
  /** @type {number} */
  var lastLine = 4;
  /** @type {number} */
  var curZoom = 5;
  /** @type {number} */
  var U = 120;
  /** @type {number} */
  var y = 8;
  /** @type {number} */
  var k = 3.75;
  /** @type {number} */
  var upperBound = 10;
  /** @type {number} */
  var b = 30;
  /** @type {number} */
  var step = .5522847;
  /** @type {number} */
  var cx1 = .25 * Math.PI;
  /** @type {!RegExp} */
  var m = /^\s*(\-?[\d\.]+)\s*(%)?\s*$/;
  /** @type {string} */
  var i = "http://www.w3.org/2000/svg";
  /** @type {boolean} */
  var reply = "-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style && !window.navigator.msPointerEnabled;
  /** @type {boolean} */
  var err = !reply && !!document.uniqueID;
  /** @type {boolean} */
  var matchesSelector = "MozAppearance" in document.documentElement.style;
  /** @type {boolean} */
  var ariaRole = !(reply || matchesSelector || !window.chrome || !window.CSS);
  /** @type {boolean} */
  var model = !reply && !err && !matchesSelector && !ariaRole && !window.chrome && "WebkitAppearance" in document.documentElement.style;
  /** @type {number} */
  var ratio = err || reply ? .2 : .1;
  var cfg = {
    path : apexRestPath,
    lineColor : "coral",
    lineSize : 4,
    plugSE : [v_res, "arrow1"],
    plugSizeSE : [1, 1],
    lineOutlineEnabled : false,
    lineOutlineColor : "indianred",
    lineOutlineSize : .25,
    plugOutlineEnabledSE : [false, false],
    plugOutlineSizeSE : [1, 1]
  };
  /** @type {function(!Function): ?} */
  var isArray = (toString = {}.toString, toStr = {}.hasOwnProperty.toString, Version = toStr.call(Object), function(obj) {
    return obj && "[object Object]" === toString.call(obj) && (!(obj = Object.getPrototypeOf(obj)) || (obj = obj.hasOwnProperty("constructor") && obj.constructor) && "function" == typeof obj && toStr.call(obj) === Version);
  });
  /** @type {function(number): boolean} */
  var expect = Number.isFinite || function(data) {
    return "number" == typeof data && window.isFinite(data);
  };
  var player = (s = {
    ease : [.25, .1, .25, 1],
    linear : [0, 0, 1, 1],
    "ease-in" : [.42, 0, 1, 1],
    "ease-out" : [0, 0, .58, 1],
    "ease-in-out" : [.42, 0, .58, 1]
  }, len = 1e3 / 60 / 2, scope = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(_nextEventFunc) {
    setTimeout(_nextEventFunc, len);
  }, r = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(e) {
    clearTimeout(e);
  }, valueByIndex = Number.isFinite || function(data) {
    return "number" == typeof data && window.isFinite(data);
  }, results = [], callId = 0, {
    add : function(value, curve, t, v, c, data, index) {
      /**
       * @param {number} display
       * @param {number} x
       * @return {?}
       */
      function add(display, x) {
        return {
          value : value(x),
          timeRatio : display,
          outputRatio : x
        };
      }
      var promises;
      var step;
      var pinHeight;
      var i;
      var height;
      var p2;
      var h;
      var distance;
      var r;
      var y;
      /** @type {number} */
      var myCallId = ++callId;
      if ("string" == typeof c && (c = s[c]), value = value || function() {
      }, t < len) {
        /** @type {!Array} */
        promises = [add(0, 0), add(1, 1)];
      } else {
        if (step = len / t, promises = [add(0, 0)], 0 === c[0] && 0 === c[1] && 1 === c[2] && 1 === c[3]) {
          /** @type {number} */
          i = step;
          for (; i <= 1; i = i + step) {
            promises.push(add(i, i));
          }
        } else {
          /** @type {number} */
          height = pinHeight = (i = step) / 10;
          for (; height <= 1; height = height + pinHeight) {
            /** @type {number} */
            h = height;
            y = r = distance = void 0;
            /** @type {number} */
            distance = (y = height * height) * height;
            /** @type {number} */
            y = y * (3 * (r = 1 - height));
            if (i <= (p2 = {
              x : (h = 3 * (r * r) * height) * c[0] + y * c[2] + distance,
              y : h * c[1] + y * c[3] + distance
            }).x) {
              promises.push(add(p2.x, p2.y));
              /** @type {number} */
              i = i + step;
            }
          }
        }
        promises.push(add(1, 1));
      }
      return results.push(data = {
        animId : myCallId,
        frameCallback : curve,
        duration : t,
        count : v,
        frames : promises,
        reverse : !!data
      }), false !== index && getValue(data, index), myCallId;
    },
    remove : function(n) {
      var a;
      if (results.some(function(i, b) {
        return i.animId === n && (a = b, !(i.framesStart = null));
      })) {
        results.splice(a, 1);
      }
    },
    start : function(diff, i, url) {
      results.some(function(data) {
        return data.animId === diff && (data.reverse = !!i, getValue(data, url), true);
      });
    },
    stop : function(element, clearQueue) {
      var v;
      return results.some(function(data) {
        return data.animId === element && (clearQueue ? null != data.lastFrame && (v = data.frames[data.lastFrame].timeRatio) : (v = (Date.now() - data.framesStart) / data.duration, (v = data.reverse ? 1 - v : v) < 0 ? v = 0 : 1 < v && (v = 1)), !(data.framesStart = null));
      }), v;
    },
    validTiming : function(a) {
      return "string" == typeof a ? s[a] : Array.isArray(a) && [0, 1, 2, 3].every(function(i) {
        return valueByIndex(a[i]) && 0 <= a[i] && a[i] <= 1;
      }) ? [a[0], a[1], a[2], a[3]] : null;
    }
  });
  /**
   * @param {!Window} global
   * @return {undefined}
   */
  var dateFormatProperties = function(global) {
    if (!(global.SVGPathElement.prototype.getPathData && global.SVGPathElement.prototype.setPathData)) {
      (function() {
        /**
         * @param {string} s
         * @return {undefined}
         */
        function Source(s) {
          /** @type {string} */
          this._string = s;
          /** @type {number} */
          this._currentIndex = 0;
          this._endIndex = this._string.length;
          /** @type {null} */
          this._prevCommand = null;
          this._skipOptionalSpaces();
        }
        /**
         * @param {string} string
         * @return {?}
         */
        function parsePathDataString(string) {
          if (!string || 0 === string.length) {
            return [];
          }
          var source = new Source(string);
          /** @type {!Array} */
          var pathData = [];
          if (source.initialCommandIsMoveTo()) {
            for (; source.hasMoreData();) {
              var pathSeg = source.parseSegment();
              if (null === pathSeg) {
                break;
              }
              pathData.push(pathSeg);
            }
          }
          return pathData;
        }
        /**
         * @param {!Object} pathData
         * @return {?}
         */
        function clonePathData(pathData) {
          return pathData.map(function(e) {
            return {
              type : e.type,
              values : Array.prototype.slice.call(e.values)
            };
          });
        }
        /**
         * @param {!Array} b
         * @return {?}
         */
        function init(b) {
          /** @type {!Array} */
          var array = [];
          /** @type {null} */
          var undefined = null;
          /** @type {null} */
          var oldBack = null;
          /** @type {null} */
          var direction = null;
          /** @type {null} */
          var back = null;
          /** @type {null} */
          var i = null;
          /** @type {null} */
          var n = null;
          /** @type {null} */
          var j = null;
          return b.forEach(function(option) {
            var x2;
            var val;
            var value;
            var min;
            var front;
            var r;
            var x;
            var y;
            if ("M" === option.type) {
              x = option.values[0];
              y = option.values[1];
              array.push({
                type : "M",
                values : [x, y]
              });
              back = n = x;
              i = j = y;
            } else {
              if ("C" === option.type) {
                front = option.values[0];
                r = option.values[1];
                x2 = option.values[2];
                val = option.values[3];
                x = option.values[4];
                y = option.values[5];
                array.push({
                  type : "C",
                  values : [front, r, x2, val, x, y]
                });
                oldBack = x2;
                direction = val;
                back = x;
                i = y;
              } else {
                if ("L" === option.type) {
                  x = option.values[0];
                  y = option.values[1];
                  array.push({
                    type : "L",
                    values : [x, y]
                  });
                  back = x;
                  i = y;
                } else {
                  if ("H" === option.type) {
                    x = option.values[0];
                    array.push({
                      type : "L",
                      values : [x, i]
                    });
                    back = x;
                  } else {
                    if ("V" === option.type) {
                      y = option.values[0];
                      array.push({
                        type : "L",
                        values : [back, y]
                      });
                      i = y;
                    } else {
                      if ("S" === option.type) {
                        x2 = option.values[0];
                        val = option.values[1];
                        x = option.values[2];
                        y = option.values[3];
                        min = "C" === undefined || "S" === undefined ? (value = back + (back - oldBack), i + (i - direction)) : (value = back, i);
                        array.push({
                          type : "C",
                          values : [value, min, x2, val, x, y]
                        });
                        oldBack = x2;
                        direction = val;
                        back = x;
                        i = y;
                      } else {
                        if ("T" === option.type) {
                          x = option.values[0];
                          y = option.values[1];
                          r = "Q" === undefined || "T" === undefined ? (front = back + (back - oldBack), i + (i - direction)) : (front = back, i);
                          array.push({
                            type : "C",
                            values : [value = back + 2 * (front - back) / 3, min = i + 2 * (r - i) / 3, x + 2 * (front - x) / 3, y + 2 * (r - y) / 3, x, y]
                          });
                          oldBack = front;
                          direction = r;
                          back = x;
                          i = y;
                        } else {
                          if ("Q" === option.type) {
                            front = option.values[0];
                            r = option.values[1];
                            x = option.values[2];
                            y = option.values[3];
                            array.push({
                              type : "C",
                              values : [value = back + 2 * (front - back) / 3, min = i + 2 * (r - i) / 3, x + 2 * (front - x) / 3, y + 2 * (r - y) / 3, x, y]
                            });
                            oldBack = front;
                            direction = r;
                            back = x;
                            i = y;
                          } else {
                            if ("A" === option.type) {
                              val = option.values[0];
                              value = option.values[1];
                              min = option.values[2];
                              front = option.values[3];
                              r = option.values[4];
                              x = option.values[5];
                              y = option.values[6];
                              if (0 === val || 0 === value) {
                                array.push({
                                  type : "C",
                                  values : [back, i, x, y, x, y]
                                });
                                back = x;
                                i = y;
                              } else {
                                if (!(back === x && i === y)) {
                                  update(back, i, x, y, val, value, min, front, r).forEach(function(wallTextures) {
                                    array.push({
                                      type : "C",
                                      values : wallTextures
                                    });
                                    back = x;
                                    i = y;
                                  });
                                }
                              }
                            } else {
                              if ("Z" === option.type) {
                                array.push(option);
                                back = n;
                                i = j;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            undefined = option.type;
          }), array;
        }
        var OP_MAP = {
          Z : "Z",
          M : "M",
          L : "L",
          C : "C",
          Q : "Q",
          A : "A",
          H : "H",
          V : "V",
          S : "S",
          T : "T",
          z : "Z",
          m : "m",
          l : "l",
          c : "c",
          q : "q",
          a : "a",
          h : "h",
          v : "v",
          s : "s",
          t : "t"
        };
        /** @type {boolean} */
        var o = -1 !== global.navigator.userAgent.indexOf("MSIE ");
        Source.prototype = {
          parseSegment : function() {
            var undefined = this._string[this._currentIndex];
            var command = OP_MAP[undefined] || null;
            if (null === command) {
              if (null === this._prevCommand) {
                return null;
              }
              if (null === (command = ("+" === undefined || "-" === undefined || "." === undefined || "0" <= undefined && undefined <= "9") && "Z" !== this._prevCommand ? "M" === this._prevCommand ? "L" : "m" === this._prevCommand ? "l" : this._prevCommand : null)) {
                return null;
              }
            } else {
              this._currentIndex += 1;
            }
            /** @type {null} */
            var scale = null;
            undefined = (this._prevCommand = command).toUpperCase();
            return "H" === undefined || "V" === undefined ? scale = [this._parseNumber()] : "M" === undefined || "L" === undefined || "T" === undefined ? scale = [this._parseNumber(), this._parseNumber()] : "S" === undefined || "Q" === undefined ? scale = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()] : "C" === undefined ? scale = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()] : "A" ===
            undefined ? scale = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseArcFlag(), this._parseArcFlag(), this._parseNumber(), this._parseNumber()] : "Z" === undefined && (this._skipOptionalSpaces(), scale = []), null === scale || 0 <= scale.indexOf(null) ? null : {
              type : command,
              values : scale
            };
          },
          hasMoreData : function() {
            return this._currentIndex < this._endIndex;
          },
          peekSegmentType : function() {
            var char_ = this._string[this._currentIndex];
            return OP_MAP[char_] || null;
          },
          initialCommandIsMoveTo : function() {
            if (!this.hasMoreData()) {
              return true;
            }
            var version = this.peekSegmentType();
            return "M" === version || "m" === version;
          },
          _isCurrentSpace : function() {
            var char_ = this._string[this._currentIndex];
            return char_ <= " " && (" " === char_ || "\n" === char_ || "\t" === char_ || "\r" === char_ || "\f" === char_);
          },
          _skipOptionalSpaces : function() {
            for (; this._currentIndex < this._endIndex && this._isCurrentSpace();) {
              this._currentIndex += 1;
            }
            return this._currentIndex < this._endIndex;
          },
          _skipOptionalSpacesOrDelimiter : function() {
            return !(this._currentIndex < this._endIndex && !this._isCurrentSpace() && "," !== this._string[this._currentIndex]) && (this._skipOptionalSpaces() && this._currentIndex < this._endIndex && "," === this._string[this._currentIndex] && (this._currentIndex += 1, this._skipOptionalSpaces()), this._currentIndex < this._endIndex);
          },
          _parseNumber : function() {
            /** @type {number} */
            var t = 0;
            /** @type {number} */
            var y1 = 0;
            /** @type {number} */
            var n = 1;
            /** @type {number} */
            var b = 0;
            /** @type {number} */
            var HeaderContentBonusMultiplier = 1;
            /** @type {number} */
            var B = 1;
            var startIndex = this._currentIndex;
            if (this._skipOptionalSpaces(), this._currentIndex < this._endIndex && "+" === this._string[this._currentIndex] ? this._currentIndex += 1 : this._currentIndex < this._endIndex && "-" === this._string[this._currentIndex] && (this._currentIndex += 1, HeaderContentBonusMultiplier = -1), this._currentIndex === this._endIndex || (this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex]) && "." !== this._string[this._currentIndex]) {
              return null;
            }
            var startIntPartIndex = this._currentIndex;
            for (; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9";) {
              this._currentIndex += 1;
            }
            if (this._currentIndex !== startIntPartIndex) {
              /** @type {number} */
              var scanIntPartIndex = this._currentIndex - 1;
              /** @type {number} */
              var diffX = 1;
              for (; startIntPartIndex <= scanIntPartIndex;) {
                /** @type {number} */
                y1 = y1 + diffX * (this._string[scanIntPartIndex] - "0");
                --scanIntPartIndex;
                /** @type {number} */
                diffX = diffX * 10;
              }
            }
            if (this._currentIndex < this._endIndex && "." === this._string[this._currentIndex]) {
              if (this._currentIndex += 1, this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex]) {
                return null;
              }
              for (; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9";) {
                /** @type {number} */
                n = n * 10;
                /** @type {number} */
                b = b + (this._string.charAt(this._currentIndex) - "0") / n;
                this._currentIndex += 1;
              }
            }
            if (this._currentIndex !== startIndex && this._currentIndex + 1 < this._endIndex && ("e" === this._string[this._currentIndex] || "E" === this._string[this._currentIndex]) && "x" !== this._string[this._currentIndex + 1] && "m" !== this._string[this._currentIndex + 1]) {
              if (this._currentIndex += 1, "+" === this._string[this._currentIndex] ? this._currentIndex += 1 : "-" === this._string[this._currentIndex] && (this._currentIndex += 1, B = -1), this._currentIndex >= this._endIndex || this._string[this._currentIndex] < "0" || "9" < this._string[this._currentIndex]) {
                return null;
              }
              for (; this._currentIndex < this._endIndex && "0" <= this._string[this._currentIndex] && this._string[this._currentIndex] <= "9";) {
                /** @type {number} */
                t = t * 10;
                /** @type {number} */
                t = t + (this._string[this._currentIndex] - "0");
                this._currentIndex += 1;
              }
            }
            /** @type {number} */
            var headerScore = y1 + b;
            return headerScore = headerScore * HeaderContentBonusMultiplier, t && (headerScore = headerScore * Math.pow(10, B * t)), startIndex === this._currentIndex ? null : (this._skipOptionalSpacesOrDelimiter(), headerScore);
          },
          _parseArcFlag : function() {
            if (this._currentIndex >= this._endIndex) {
              return null;
            }
            /** @type {null} */
            var e = null;
            var char_ = this._string[this._currentIndex];
            if (this._currentIndex += 1, "0" === char_) {
              /** @type {number} */
              e = 0;
            } else {
              if ("1" !== char_) {
                return null;
              }
              /** @type {number} */
              e = 1;
            }
            return this._skipOptionalSpacesOrDelimiter(), e;
          }
        };
        /** @type {function(string, string): undefined} */
        var comparatorFn = global.SVGPathElement.prototype.setAttribute;
        /** @type {function(string, ?): undefined} */
        var removeAttribute = global.SVGPathElement.prototype.removeAttribute;
        var $cachedPathData = global.Symbol ? global.Symbol() : "__cachedPathData";
        var $cachedNormalizedPathData = global.Symbol ? global.Symbol() : "__cachedNormalizedPathData";
        /**
         * @param {number} o
         * @param {number} value
         * @param {number} i
         * @param {number} a
         * @param {number} s
         * @param {number} h
         * @param {number} time
         * @param {number} id
         * @param {string} key
         * @param {!Array} e
         * @return {?}
         */
        var update = function(o, value, i, a, s, h, time, id, key, e) {
          /**
           * @param {number} b
           * @param {number} a
           * @param {number} x
           * @return {?}
           */
          function rotate(b, a, x) {
            return {
              x : b * Math.cos(x) - a * Math.sin(x),
              y : b * Math.sin(x) + a * Math.cos(x)
            };
          }
          /** @type {number} */
          var angleRad = Math.PI * time / 180;
          /** @type {!Array} */
          var res = [];
          if (e) {
            b = e[0];
            d = e[1];
            p = e[2];
            n = e[3];
          } else {
            o = (x = rotate(o, value, -angleRad)).x;
            value = x.y;
            if (1 < (x = (t = (o - (i = (y = rotate(i, a, -angleRad)).x)) / 2) * t / (s * s) + (w = (value - (a = y.y)) / 2) * w / (h * h))) {
              /** @type {number} */
              s = s * (x = Math.sqrt(x));
              /** @type {number} */
              h = h * x;
            }
            /** @type {number} */
            y = s * s;
            /** @type {number} */
            x = h * h;
            /** @type {number} */
            p = (y = (id === key ? -1 : 1) * Math.sqrt(Math.abs((y * x - y * w * w - x * t * t) / (y * w * w + x * t * t)))) * s * w / h + (o + i) / 2;
            /** @type {number} */
            n = y * -h * t / s + (value + a) / 2;
            /** @type {number} */
            b = Math.asin(parseFloat(((value - n) / h).toFixed(9)));
            /** @type {number} */
            d = Math.asin(parseFloat(((a - n) / h).toFixed(9)));
            if (o < p) {
              /** @type {number} */
              b = Math.PI - b;
            }
            if (i < p) {
              /** @type {number} */
              d = Math.PI - d;
            }
            if (b < 0) {
              /** @type {number} */
              b = 2 * Math.PI + b;
            }
            if (d < 0) {
              /** @type {number} */
              d = 2 * Math.PI + d;
            }
            if (key && d < b) {
              /** @type {number} */
              b = b - 2 * Math.PI;
            }
            if (!key && b < d) {
              /** @type {number} */
              d = d - 2 * Math.PI;
            }
          }
          var w;
          var y;
          var t;
          /** @type {number} */
          var x = d - b;
          if (Math.abs(x) > 120 * Math.PI / 180) {
            w = d;
            /** @type {number} */
            y = i;
            /** @type {number} */
            t = a;
            /** @type {number} */
            d = key && b < d ? b + 120 * Math.PI / 180 * 1 : b + 120 * Math.PI / 180 * -1;
            /** @type {number} */
            i = p + s * Math.cos(d);
            /** @type {number} */
            a = n + h * Math.sin(d);
            res = update(i, a, y, t, s, h, time, 0, key, [d, w, p, n]);
          }
          /** @type {number} */
          x = d - b;
          /** @type {number} */
          var p = Math.cos(b);
          /** @type {number} */
          var n = Math.sin(b);
          /** @type {number} */
          var b = Math.cos(d);
          /** @type {number} */
          var d = Math.sin(d);
          /** @type {number} */
          x = Math.tan(x / 4);
          /** @type {number} */
          s = 4 / 3 * s * x;
          /** @type {number} */
          h = 4 / 3 * h * x;
          /** @type {!Array} */
          x = [o, value];
          /** @type {!Array} */
          p = [o + s * n, value - h * p];
          /** @type {!Array} */
          b = [i + s * d, a - h * b];
          /** @type {!Array} */
          a = [i, a];
          if (p[0] = 2 * x[0] - p[0], p[1] = 2 * x[1] - p[1], e) {
            return [p, b, a].concat(res);
          }
          /** @type {!Array<string>} */
          res = [p, b, a].concat(res).join().split(",");
          /** @type {!Array} */
          var partialContent = [];
          /** @type {!Array} */
          var values = [];
          return res.forEach(function(canCreateDiscussions, i) {
            if (i % 2) {
              values.push(rotate(res[i - 1], res[i], angleRad).y);
            } else {
              values.push(rotate(res[i], res[i + 1], angleRad).x);
            }
            if (6 === values.length) {
              partialContent.push(values);
              /** @type {!Array} */
              values = [];
            }
          }), partialContent;
        };
        /**
         * @param {string} a
         * @param {string} b
         * @return {undefined}
         */
        global.SVGPathElement.prototype.setAttribute = function(a, b) {
          if ("d" === a) {
            /** @type {null} */
            this[$cachedPathData] = null;
            /** @type {null} */
            this[$cachedNormalizedPathData] = null;
          }
          comparatorFn.call(this, a, b);
        };
        /**
         * @param {string} name
         * @param {?} domNode
         * @return {undefined}
         */
        global.SVGPathElement.prototype.removeAttribute = function(name, domNode) {
          if ("d" === name) {
            /** @type {null} */
            this[$cachedPathData] = null;
            /** @type {null} */
            this[$cachedNormalizedPathData] = null;
          }
          removeAttribute.call(this, name);
        };
        /**
         * @param {!Object} obj
         * @return {?}
         */
        global.SVGPathElement.prototype.getPathData = function(obj) {
          if (obj && obj.normalize) {
            if (this[$cachedNormalizedPathData]) {
              return clonePathData(this[$cachedNormalizedPathData]);
            }
            if (this[$cachedPathData]) {
              pathData = clonePathData(this[$cachedPathData]);
            } else {
              pathData = parsePathDataString(this.getAttribute("d") || "");
              this[$cachedPathData] = clonePathData(pathData);
            }
            obj = init((absolutizedPathData = [], maxY = minX = minY = currentX = null, pathData.forEach(function(win) {
              var cx1;
              var maxY;
              var x2;
              var y2;
              var x;
              var y;
              var undefined = win.type;
              if ("M" === undefined) {
                x = win.values[0];
                y = win.values[1];
                absolutizedPathData.push({
                  type : "M",
                  values : [x, y]
                });
                currentX = minX = x;
                minY = maxY = y;
              } else {
                if ("m" === undefined) {
                  x = currentX + win.values[0];
                  y = minY + win.values[1];
                  absolutizedPathData.push({
                    type : "M",
                    values : [x, y]
                  });
                  currentX = minX = x;
                  minY = maxY = y;
                } else {
                  if ("L" === undefined) {
                    x = win.values[0];
                    y = win.values[1];
                    absolutizedPathData.push({
                      type : "L",
                      values : [x, y]
                    });
                    currentX = x;
                    minY = y;
                  } else {
                    if ("l" === undefined) {
                      x = currentX + win.values[0];
                      y = minY + win.values[1];
                      absolutizedPathData.push({
                        type : "L",
                        values : [x, y]
                      });
                      currentX = x;
                      minY = y;
                    } else {
                      if ("C" === undefined) {
                        cx1 = win.values[0];
                        maxY = win.values[1];
                        x2 = win.values[2];
                        y2 = win.values[3];
                        x = win.values[4];
                        y = win.values[5];
                        absolutizedPathData.push({
                          type : "C",
                          values : [cx1, maxY, x2, y2, x, y]
                        });
                        currentX = x;
                        minY = y;
                      } else {
                        if ("c" === undefined) {
                          cx1 = currentX + win.values[0];
                          maxY = minY + win.values[1];
                          x2 = currentX + win.values[2];
                          y2 = minY + win.values[3];
                          x = currentX + win.values[4];
                          y = minY + win.values[5];
                          absolutizedPathData.push({
                            type : "C",
                            values : [cx1, maxY, x2, y2, x, y]
                          });
                          currentX = x;
                          minY = y;
                        } else {
                          if ("Q" === undefined) {
                            cx1 = win.values[0];
                            maxY = win.values[1];
                            x = win.values[2];
                            y = win.values[3];
                            absolutizedPathData.push({
                              type : "Q",
                              values : [cx1, maxY, x, y]
                            });
                            currentX = x;
                            minY = y;
                          } else {
                            if ("q" === undefined) {
                              cx1 = currentX + win.values[0];
                              maxY = minY + win.values[1];
                              x = currentX + win.values[2];
                              y = minY + win.values[3];
                              absolutizedPathData.push({
                                type : "Q",
                                values : [cx1, maxY, x, y]
                              });
                              currentX = x;
                              minY = y;
                            } else {
                              if ("A" === undefined) {
                                x = win.values[5];
                                y = win.values[6];
                                absolutizedPathData.push({
                                  type : "A",
                                  values : [win.values[0], win.values[1], win.values[2], win.values[3], win.values[4], x, y]
                                });
                                currentX = x;
                                minY = y;
                              } else {
                                if ("a" === undefined) {
                                  x = currentX + win.values[5];
                                  y = minY + win.values[6];
                                  absolutizedPathData.push({
                                    type : "A",
                                    values : [win.values[0], win.values[1], win.values[2], win.values[3], win.values[4], x, y]
                                  });
                                  currentX = x;
                                  minY = y;
                                } else {
                                  if ("H" === undefined) {
                                    x = win.values[0];
                                    absolutizedPathData.push({
                                      type : "H",
                                      values : [x]
                                    });
                                    currentX = x;
                                  } else {
                                    if ("h" === undefined) {
                                      x = currentX + win.values[0];
                                      absolutizedPathData.push({
                                        type : "H",
                                        values : [x]
                                      });
                                      currentX = x;
                                    } else {
                                      if ("V" === undefined) {
                                        y = win.values[0];
                                        absolutizedPathData.push({
                                          type : "V",
                                          values : [y]
                                        });
                                        minY = y;
                                      } else {
                                        if ("v" === undefined) {
                                          y = minY + win.values[0];
                                          absolutizedPathData.push({
                                            type : "V",
                                            values : [y]
                                          });
                                          minY = y;
                                        } else {
                                          if ("S" === undefined) {
                                            x2 = win.values[0];
                                            y2 = win.values[1];
                                            x = win.values[2];
                                            y = win.values[3];
                                            absolutizedPathData.push({
                                              type : "S",
                                              values : [x2, y2, x, y]
                                            });
                                            currentX = x;
                                            minY = y;
                                          } else {
                                            if ("s" === undefined) {
                                              x2 = currentX + win.values[0];
                                              y2 = minY + win.values[1];
                                              x = currentX + win.values[2];
                                              y = minY + win.values[3];
                                              absolutizedPathData.push({
                                                type : "S",
                                                values : [x2, y2, x, y]
                                              });
                                              currentX = x;
                                              minY = y;
                                            } else {
                                              if ("T" === undefined) {
                                                x = win.values[0];
                                                y = win.values[1];
                                                absolutizedPathData.push({
                                                  type : "T",
                                                  values : [x, y]
                                                });
                                                currentX = x;
                                                minY = y;
                                              } else {
                                                if ("t" === undefined) {
                                                  x = currentX + win.values[0];
                                                  y = minY + win.values[1];
                                                  absolutizedPathData.push({
                                                    type : "T",
                                                    values : [x, y]
                                                  });
                                                  currentX = x;
                                                  minY = y;
                                                } else {
                                                  if (!("Z" !== undefined && "z" !== undefined)) {
                                                    absolutizedPathData.push({
                                                      type : "Z",
                                                      values : []
                                                    });
                                                    currentX = minX;
                                                    minY = maxY;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }), absolutizedPathData));
            return this[$cachedNormalizedPathData] = clonePathData(obj), obj;
          }
          if (this[$cachedPathData]) {
            return clonePathData(this[$cachedPathData]);
          }
          var absolutizedPathData;
          var currentX;
          var minY;
          var minX;
          var maxY;
          var pathData = parsePathDataString(this.getAttribute("d") || "");
          return this[$cachedPathData] = clonePathData(pathData), pathData;
        };
        /**
         * @param {!Object} data
         * @return {undefined}
         */
        global.SVGPathElement.prototype.setPathData = function(data) {
          if (0 === data.length) {
            if (o) {
              this.setAttribute("d", "");
            } else {
              this.removeAttribute("d");
            }
          } else {
            /** @type {string} */
            var id = "";
            /** @type {number} */
            var i = 0;
            var tldCount = data.length;
            for (; i < tldCount; i = i + 1) {
              var scope = data[i];
              if (0 < i) {
                /** @type {string} */
                id = id + " ";
              }
              /** @type {string} */
              id = id + scope.type;
              if (scope.values && 0 < scope.values.length) {
                /** @type {string} */
                id = id + (" " + scope.values.join(" "));
              }
            }
            this.setAttribute("d", id);
          }
        };
        /**
         * @param {!Object} obj
         * @return {?}
         */
        global.SVGRectElement.prototype.getPathData = function(obj) {
          var count = this.x.baseVal.value;
          var y = this.y.baseVal.value;
          var i = this.width.baseVal.value;
          var height = this.height.baseVal.value;
          var n = (this.hasAttribute("rx") ? this.rx : this.ry).baseVal.value;
          var ry = (this.hasAttribute("ry") ? this.ry : this.rx).baseVal.value;
          /** @type {!Array<?>} */
          y = (y = [{
            type : "M",
            values : [count + (n = i / 2 < n ? i / 2 : n), y]
          }, {
            type : "H",
            values : [count + i - n]
          }, {
            type : "A",
            values : [n, ry = height / 2 < ry ? height / 2 : ry, 0, 0, 1, count + i, y + ry]
          }, {
            type : "V",
            values : [y + height - ry]
          }, {
            type : "A",
            values : [n, ry, 0, 0, 1, count + i - n, y + height]
          }, {
            type : "H",
            values : [count + n]
          }, {
            type : "A",
            values : [n, ry, 0, 0, 1, count, y + height - ry]
          }, {
            type : "V",
            values : [y + ry]
          }, {
            type : "A",
            values : [n, ry, 0, 0, 1, count + n, y]
          }, {
            type : "Z",
            values : []
          }]).filter(function(el) {
            return "A" !== el.type || 0 !== el.values[0] && 0 !== el.values[1];
          });
          return y = obj && true === obj.normalize ? init(y) : y;
        };
        /**
         * @param {!Object} obj
         * @return {?}
         */
        global.SVGCircleElement.prototype.getPathData = function(obj) {
          var cx = this.cx.baseVal.value;
          var cy = this.cy.baseVal.value;
          var r = this.r.baseVal.value;
          /** @type {!Array} */
          cy = [{
            type : "M",
            values : [cx + r, cy]
          }, {
            type : "A",
            values : [r, r, 0, 0, 1, cx, cy + r]
          }, {
            type : "A",
            values : [r, r, 0, 0, 1, cx - r, cy]
          }, {
            type : "A",
            values : [r, r, 0, 0, 1, cx, cy - r]
          }, {
            type : "A",
            values : [r, r, 0, 0, 1, cx + r, cy]
          }, {
            type : "Z",
            values : []
          }];
          return cy = obj && true === obj.normalize ? init(cy) : cy;
        };
        /**
         * @param {!Object} obj
         * @return {?}
         */
        global.SVGEllipseElement.prototype.getPathData = function(obj) {
          var cx = this.cx.baseVal.value;
          var cy = this.cy.baseVal.value;
          var rx = this.rx.baseVal.value;
          var ry = this.ry.baseVal.value;
          /** @type {!Array} */
          cy = [{
            type : "M",
            values : [cx + rx, cy]
          }, {
            type : "A",
            values : [rx, ry, 0, 0, 1, cx, cy + ry]
          }, {
            type : "A",
            values : [rx, ry, 0, 0, 1, cx - rx, cy]
          }, {
            type : "A",
            values : [rx, ry, 0, 0, 1, cx, cy - ry]
          }, {
            type : "A",
            values : [rx, ry, 0, 0, 1, cx + rx, cy]
          }, {
            type : "Z",
            values : []
          }];
          return cy = obj && true === obj.normalize ? init(cy) : cy;
        };
        /**
         * @return {?}
         */
        global.SVGLineElement.prototype.getPathData = function() {
          return [{
            type : "M",
            values : [this.x1.baseVal.value, this.y1.baseVal.value]
          }, {
            type : "L",
            values : [this.x2.baseVal.value, this.y2.baseVal.value]
          }];
        };
        /**
         * @return {?}
         */
        global.SVGPolylineElement.prototype.getPathData = function() {
          /** @type {!Array} */
          var pathData = [];
          /** @type {number} */
          var i = 0;
          for (; i < this.points.numberOfItems; i = i + 1) {
            var n = this.points.getItem(i);
            pathData.push({
              type : 0 === i ? "M" : "L",
              values : [n.x, n.y]
            });
          }
          return pathData;
        };
        /**
         * @return {?}
         */
        global.SVGPolygonElement.prototype.getPathData = function() {
          /** @type {!Array} */
          var absolutizedPathData = [];
          /** @type {number} */
          var i = 0;
          for (; i < this.points.numberOfItems; i = i + 1) {
            var n = this.points.getItem(i);
            absolutizedPathData.push({
              type : 0 === i ? "M" : "L",
              values : [n.x, n.y]
            });
          }
          return absolutizedPathData.push({
            type : "Z",
            values : []
          }), absolutizedPathData;
        };
      })();
    }
  };
  reply = (n = {}, t.m = filters = [function(canCreateDiscussions, res, networkMonitor) {
    /**
     * @return {undefined}
     */
    function index() {
      var n = void 0;
      var e = void 0;
      if (record) {
        body.call(window, record);
        /** @type {null} */
        record = null;
      }
      results.forEach(function(event) {
        var e;
        if (e = event.event) {
          /** @type {null} */
          event.event = null;
          event.listener(e);
          /** @type {boolean} */
          n = true;
        }
      });
      if (n) {
        /** @type {number} */
        r = Date.now();
        /** @type {boolean} */
        e = true;
      } else {
        if (Date.now() - r < playerEdge) {
          /** @type {boolean} */
          e = true;
        }
      }
      if (e) {
        record = itemCreateListener.call(window, index);
      }
    }
    /**
     * @param {!Function} fn
     * @return {?}
     */
    function off(fn) {
      /** @type {number} */
      var lastTrackInfoUrl = -1;
      return results.some(function(subscription, trackInfoUrl) {
        return subscription.listener === fn && (lastTrackInfoUrl = trackInfoUrl, true);
      }), lastTrackInfoUrl;
    }
    networkMonitor.r(res);
    /** @type {number} */
    var playerEdge = 500;
    /** @type {!Array} */
    var results = [];
    var itemCreateListener = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(_nextEventFunc) {
      return setTimeout(_nextEventFunc, 1e3 / 60);
    };
    var body = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(e) {
      return clearTimeout(e);
    };
    /** @type {number} */
    var r = Date.now();
    var record = void 0;
    res.default = {
      add : function(self) {
        var data = void 0;
        return -1 === off(self) ? (results.push(data = {
          listener : self
        }), function(extra) {
          /** @type {string} */
          data.event = extra;
          if (!record) {
            index();
          }
        }) : null;
      },
      remove : function(index) {
        if (-1 < (index = off(index))) {
          results.splice(index, 1);
          if (!results.length && record) {
            body.call(window, record);
            /** @type {null} */
            record = null;
          }
        }
      }
    };
  }], t.c = n, t.d = function(d, name, n) {
    if (!t.o(d, name)) {
      Object.defineProperty(d, name, {
        enumerable : true,
        get : n
      });
    }
  }, t.r = function(o) {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) {
      Object.defineProperty(o, Symbol.toStringTag, {
        value : "Module"
      });
    }
    Object.defineProperty(o, "__esModule", {
      value : true
    });
  }, t.t = function(value, defaultValue) {
    if (1 & defaultValue && (value = t(value)), 8 & defaultValue) {
      return value;
    }
    if (4 & defaultValue && "object" == typeof value && value && value.__esModule) {
      return value;
    }
    /** @type {!Object} */
    var d = Object.create(null);
    if (t.r(d), Object.defineProperty(d, "default", {
      enumerable : true,
      value : value
    }), 2 & defaultValue && "string" != typeof value) {
      var key;
      for (key in value) {
        t.d(d, key, function(subel) {
          return value[subel];
        }.bind(null, key));
      }
    }
    return d;
  }, t.n = function(module) {
    /** @type {function(): ?} */
    var n = module && module.__esModule ? function() {
      return module.default;
    } : function() {
      return module;
    };
    return t.d(n, "a", n), n;
  }, t.o = function(property, object) {
    return Object.prototype.hasOwnProperty.call(property, object);
  }, t.p = "", t(t.s = 0).default);
  var NS = {
    line_altColor : {
      iniValue : false
    },
    line_color : {},
    line_colorTra : {
      iniValue : false
    },
    line_strokeWidth : {},
    plug_enabled : {
      iniValue : false
    },
    plug_enabledSE : {
      hasSE : true,
      iniValue : false
    },
    plug_plugSE : {
      hasSE : true,
      iniValue : v_res
    },
    plug_colorSE : {
      hasSE : true
    },
    plug_colorTraSE : {
      hasSE : true,
      iniValue : false
    },
    plug_markerWidthSE : {
      hasSE : true
    },
    plug_markerHeightSE : {
      hasSE : true
    },
    lineOutline_enabled : {
      iniValue : false
    },
    lineOutline_color : {},
    lineOutline_colorTra : {
      iniValue : false
    },
    lineOutline_strokeWidth : {},
    lineOutline_inStrokeWidth : {},
    plugOutline_enabledSE : {
      hasSE : true,
      iniValue : false
    },
    plugOutline_plugSE : {
      hasSE : true,
      iniValue : v_res
    },
    plugOutline_colorSE : {
      hasSE : true
    },
    plugOutline_colorTraSE : {
      hasSE : true,
      iniValue : false
    },
    plugOutline_strokeWidthSE : {
      hasSE : true
    },
    plugOutline_inStrokeWidthSE : {
      hasSE : true
    },
    position_socketXYSE : {
      hasSE : true,
      hasProps : true
    },
    position_plugOverheadSE : {
      hasSE : true
    },
    position_path : {},
    position_lineStrokeWidth : {},
    position_socketGravitySE : {
      hasSE : true
    },
    path_pathData : {},
    path_edge : {
      hasProps : true
    },
    viewBox_bBox : {
      hasProps : true
    },
    viewBox_plugBCircleSE : {
      hasSE : true
    },
    lineMask_enabled : {
      iniValue : false
    },
    lineMask_outlineMode : {
      iniValue : false
    },
    lineMask_x : {},
    lineMask_y : {},
    lineOutlineMask_x : {},
    lineOutlineMask_y : {},
    maskBGRect_x : {},
    maskBGRect_y : {},
    capsMaskAnchor_enabledSE : {
      hasSE : true,
      iniValue : false
    },
    capsMaskAnchor_pathDataSE : {
      hasSE : true
    },
    capsMaskAnchor_strokeWidthSE : {
      hasSE : true
    },
    capsMaskMarker_enabled : {
      iniValue : false
    },
    capsMaskMarker_enabledSE : {
      hasSE : true,
      iniValue : false
    },
    capsMaskMarker_plugSE : {
      hasSE : true,
      iniValue : v_res
    },
    capsMaskMarker_markerWidthSE : {
      hasSE : true
    },
    capsMaskMarker_markerHeightSE : {
      hasSE : true
    },
    caps_enabled : {
      iniValue : false
    },
    attach_plugSideLenSE : {
      hasSE : true
    },
    attach_plugBackLenSE : {
      hasSE : true
    }
  };
  var u = {
    show_on : {},
    show_effect : {},
    show_animOptions : {},
    show_animId : {},
    show_inAnim : {}
  };
  /** @type {string} */
  var reducerMountPoint = "fade";
  /** @type {!Array} */
  var notesToRemove = [];
  var elements = {};
  /** @type {number} */
  var uniqueId = 0;
  var items = {};
  /** @type {number} */
  var nextid = 0;
  return params = {
    dash : {
      stats : {
        dash_len : {},
        dash_gap : {},
        dash_maxOffset : {}
      },
      anim : true,
      defaultAnimOptions : {
        duration : 1e3,
        timing : "linear"
      },
      optionsConf : [["type", "len", "number", null, null, null, function(canCreateDiscussions) {
        return 0 < canCreateDiscussions;
      }], ["type", "gap", "number", null, null, null, function(canCreateDiscussions) {
        return 0 < canCreateDiscussions;
      }]],
      init : function(a) {
        get(a, "apl_line_strokeWidth", params.dash.update);
        /** @type {number} */
        a.lineFace.style.strokeDashoffset = 0;
        params.dash.update(a);
      },
      remove : function(data) {
        var task = data.curStats;
        remove(data, "apl_line_strokeWidth", params.dash.update);
        if (task.dash_animId) {
          player.remove(task.dash_animId);
          /** @type {null} */
          task.dash_animId = null;
        }
        /** @type {string} */
        data.lineFace.style.strokeDasharray = "none";
        /** @type {number} */
        data.lineFace.style.strokeDashoffset = 0;
        resolve(data.aplStats, params.dash.stats);
      },
      update : function(instance) {
        var options;
        var self = instance.curStats;
        var opts = instance.aplStats;
        var params = opts.dash_options;
        /** @type {boolean} */
        var value = false;
        self.dash_len = params.len || 2 * opts.line_strokeWidth;
        self.dash_gap = params.gap || opts.line_strokeWidth;
        self.dash_maxOffset = self.dash_len + self.dash_gap;
        value = callback(instance, opts, "dash_len", self.dash_len) || value;
        if (value = callback(instance, opts, "dash_gap", self.dash_gap) || value) {
          /** @type {string} */
          instance.lineFace.style.strokeDasharray = opts.dash_len + "," + opts.dash_gap;
        }
        if (self.dash_animOptions) {
          value = callback(instance, opts, "dash_maxOffset", self.dash_maxOffset);
          if (opts.dash_animOptions && (value || extend(self.dash_animOptions, opts.dash_animOptions))) {
            if (self.dash_animId) {
              options = player.stop(self.dash_animId);
              player.remove(self.dash_animId);
            }
            /** @type {null} */
            opts.dash_animOptions = null;
          }
          if (!opts.dash_animOptions) {
            self.dash_animId = player.add(function(displayEnd) {
              return (1 - displayEnd) * opts.dash_maxOffset + "px";
            }, function(length) {
              /** @type {number} */
              instance.lineFace.style.strokeDashoffset = length;
            }, self.dash_animOptions.duration, 0, self.dash_animOptions.timing, false, options);
            opts.dash_animOptions = normalize(self.dash_animOptions);
          }
        } else {
          if (opts.dash_animOptions) {
            if (self.dash_animId) {
              player.remove(self.dash_animId);
              /** @type {null} */
              self.dash_animId = null;
            }
            /** @type {number} */
            instance.lineFace.style.strokeDashoffset = 0;
            /** @type {null} */
            opts.dash_animOptions = null;
          }
        }
      }
    },
    gradient : {
      stats : {
        gradient_colorSE : {
          hasSE : true
        },
        gradient_pointSE : {
          hasSE : true,
          hasProps : true
        }
      },
      optionsConf : [["type", "startColor", "string", "colorSE", 0, null, null, true], ["type", "endColor", "string", "colorSE", 1, null, null, true]],
      init : function(self) {
        var doc = self.baseWindow.document;
        var element = self.defs;
        /** @type {string} */
        var n = name + "-" + self._id + "-gradient";
        self.efc_gradient_gradient = element = element.appendChild(doc.createElementNS(i, "linearGradient"));
        /** @type {string} */
        element.id = n;
        element.gradientUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;
        [element.x1, element.y1, element.x2, element.y2].forEach(function(klass) {
          klass.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
        });
        /** @type {!Array<?>} */
        self.efc_gradient_stopSE = [0, 1].map(function(value) {
          var elem = self.efc_gradient_gradient.appendChild(doc.createElementNS(i, "stop"));
          try {
            /** @type {string} */
            elem.offset.baseVal = value;
          } catch (redirect_params) {
            if (redirect_params.code !== DOMException.NO_MODIFICATION_ALLOWED_ERR) {
              throw redirect_params;
            }
            elem.setAttribute("offset", value);
          }
          return elem;
        });
        get(self, "cur_plug_colorSE", params.gradient.update);
        get(self, "apl_path", params.gradient.update);
        /** @type {boolean} */
        self.curStats.line_altColor = true;
        /** @type {string} */
        self.lineFace.style.stroke = "url(#" + n + ")";
        params.gradient.update(self);
      },
      remove : function(obj) {
        if (obj.efc_gradient_gradient) {
          obj.defs.removeChild(obj.efc_gradient_gradient);
          /** @type {null} */
          obj.efc_gradient_gradient = obj.efc_gradient_stopSE = null;
        }
        remove(obj, "cur_plug_colorSE", params.gradient.update);
        remove(obj, "apl_path", params.gradient.update);
        /** @type {boolean} */
        obj.curStats.line_altColor = false;
        obj.lineFace.style.stroke = obj.curStats.line_color;
        resolve(obj.aplStats, params.gradient.stats);
      },
      update : function(el) {
        var markerCoord;
        var child = el.curStats;
        var row = el.aplStats;
        var t = row.gradient_options;
        var b2 = el.pathList.animVal || el.pathList.baseVal;
        [0, 1].forEach(function(tagName) {
          child.gradient_colorSE[tagName] = t.colorSE[tagName] || child.plug_colorSE[tagName];
        });
        markerCoord = b2[0][0];
        child.gradient_pointSE[0] = {
          x : markerCoord.x,
          y : markerCoord.y
        };
        markerCoord = (b2 = b2[b2.length - 1])[b2.length - 1];
        child.gradient_pointSE[1] = {
          x : markerCoord.x,
          y : markerCoord.y
        };
        [0, 1].forEach(function(i) {
          var value;
          if (callback(el, row.gradient_colorSE, i, value = child.gradient_colorSE[i])) {
            if (model) {
              value = parse(value);
              el.efc_gradient_stopSE[i].style.stopColor = value[1];
              el.efc_gradient_stopSE[i].style.stopOpacity = value[0];
            } else {
              el.efc_gradient_stopSE[i].style.stopColor = value;
            }
          }
          ["x", "y"].forEach(function(offset) {
            if ((value = child.gradient_pointSE[i][offset]) !== row.gradient_pointSE[i][offset]) {
              el.efc_gradient_gradient[offset + (i + 1)].baseVal.value = row.gradient_pointSE[i][offset] = value;
            }
          });
        });
      }
    },
    dropShadow : {
      stats : {
        dropShadow_dx : {},
        dropShadow_dy : {},
        dropShadow_blur : {},
        dropShadow_color : {},
        dropShadow_opacity : {},
        dropShadow_x : {},
        dropShadow_y : {}
      },
      optionsConf : [["type", "dx", null, null, null, 2], ["type", "dy", null, null, null, 4], ["type", "blur", null, null, null, 3, function(canCreateDiscussions) {
        return 0 <= canCreateDiscussions;
      }], ["type", "color", null, null, null, "#000", null, true], ["type", "opacity", null, null, null, .8, function(canCreateDiscussions) {
        return 0 <= canCreateDiscussions && canCreateDiscussions <= 1;
      }]],
      init : function(node) {
        var api;
        var n;
        var parent;
        var self;
        var o = node.baseWindow.document;
        var defs = node.defs;
        /** @type {string} */
        var f = name + "-" + node._id + "-dropShadow";
        var group = (api = o, n = f, self = {}, "boolean" != typeof isSorted && (isSorted = !!window.SVGFEDropShadowElement && !model), self.elmsAppend = [self.elmFilter = o = api.createElementNS(i, "filter")], o.filterUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE, o.x.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), o.y.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), o.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100), o.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
        100), o.id = n, isSorted ? (self.elmOffset = self.elmBlur = parent = o.appendChild(api.createElementNS(i, "feDropShadow")), self.styleFlood = parent.style) : (self.elmBlur = o.appendChild(api.createElementNS(i, "feGaussianBlur")), self.elmOffset = parent = o.appendChild(api.createElementNS(i, "feOffset")), parent.result.baseVal = "offsetblur", parent = o.appendChild(api.createElementNS(i, "feFlood")), self.styleFlood = parent.style, (parent = o.appendChild(api.createElementNS(i, "feComposite"))).in2.baseVal =
        "offsetblur", parent.operator.baseVal = SVGFECompositeElement.SVG_FECOMPOSITE_OPERATOR_IN, (parent = o.appendChild(api.createElementNS(i, "feMerge"))).appendChild(api.createElementNS(i, "feMergeNode")), parent.appendChild(api.createElementNS(i, "feMergeNode")).in1.baseVal = "SourceGraphic"), self);
        ["elmFilter", "elmOffset", "elmBlur", "styleFlood", "elmsAppend"].forEach(function(key) {
          node["efc_dropShadow_" + key] = group[key];
        });
        group.elmsAppend.forEach(function(defElement) {
          defs.appendChild(defElement);
        });
        node.face.setAttribute("filter", "url(#" + f + ")");
        get(node, "new_edge4viewBox", params.dropShadow.adjustEdge);
        params.dropShadow.update(node);
      },
      remove : function(data) {
        var t = data.defs;
        if (data.efc_dropShadow_elmsAppend) {
          data.efc_dropShadow_elmsAppend.forEach(function(e) {
            t.removeChild(e);
          });
          /** @type {null} */
          data.efc_dropShadow_elmFilter = data.efc_dropShadow_elmOffset = data.efc_dropShadow_elmBlur = data.efc_dropShadow_styleFlood = data.efc_dropShadow_elmsAppend = null;
        }
        remove(data, "new_edge4viewBox", params.dropShadow.adjustEdge);
        update(data, {});
        data.face.removeAttribute("filter");
        resolve(data.aplStats, params.dropShadow.stats);
      },
      update : function(item) {
        var value;
        var n;
        var element = item.curStats;
        var buffer = item.aplStats;
        var options = buffer.dropShadow_options;
        element.dropShadow_dx = value = options.dx;
        if (callback(item, buffer, "dropShadow_dx", value)) {
          item.efc_dropShadow_elmOffset.dx.baseVal = value;
          /** @type {boolean} */
          n = true;
        }
        element.dropShadow_dy = value = options.dy;
        if (callback(item, buffer, "dropShadow_dy", value)) {
          item.efc_dropShadow_elmOffset.dy.baseVal = value;
          /** @type {boolean} */
          n = true;
        }
        element.dropShadow_blur = value = options.blur;
        if (callback(item, buffer, "dropShadow_blur", value)) {
          item.efc_dropShadow_elmBlur.setStdDeviation(value, value);
          /** @type {boolean} */
          n = true;
        }
        if (n) {
          update(item, {});
        }
        element.dropShadow_color = value = options.color;
        if (callback(item, buffer, "dropShadow_color", value)) {
          item.efc_dropShadow_styleFlood.floodColor = value;
        }
        element.dropShadow_opacity = value = options.opacity;
        if (callback(item, buffer, "dropShadow_opacity", value)) {
          item.efc_dropShadow_styleFlood.floodOpacity = value;
        }
      },
      adjustEdge : function(a, b) {
        var coords;
        var u = a.curStats;
        var l = a.aplStats;
        if (null != u.dropShadow_dx) {
          /** @type {number} */
          coords = 3 * u.dropShadow_blur;
          if ((coords = {
            x1 : b.x1 - coords + u.dropShadow_dx,
            y1 : b.y1 - coords + u.dropShadow_dy,
            x2 : b.x2 + coords + u.dropShadow_dx,
            y2 : b.y2 + coords + u.dropShadow_dy
          }).x1 < b.x1) {
            b.x1 = coords.x1;
          }
          if (coords.y1 < b.y1) {
            b.y1 = coords.y1;
          }
          if (coords.x2 > b.x2) {
            b.x2 = coords.x2;
          }
          if (coords.y2 > b.y2) {
            b.y2 = coords.y2;
          }
          ["x", "y"].forEach(function(name) {
            var t;
            /** @type {string} */
            var i = "dropShadow_" + name;
            u[i] = t = b[name + "1"];
            if (callback(a, l, i, t)) {
              a.efc_dropShadow_elmFilter[name].baseVal.value = t;
            }
          });
        }
      }
    }
  }, Object.keys(params).forEach(function(name) {
    var config = params[name];
    var data = config.stats;
    data[name + "_enabled"] = {
      iniValue : false
    };
    data[name + "_options"] = {
      hasProps : true
    };
    if (config.anim) {
      data[name + "_animOptions"] = {};
      data[name + "_animId"] = {};
    }
  }), state = {
    none : {
      defaultAnimOptions : {},
      init : function(self, url) {
        var action = self.curStats;
        if (action.show_animId) {
          player.remove(action.show_animId);
          /** @type {null} */
          action.show_animId = null;
        }
        state.none.start(self, url);
      },
      start : function(p, f) {
        state.none.stop(p, true);
      },
      stop : function(result, done, data) {
        var courseSections = result.curStats;
        return data = null != data ? data : result.aplStats.show_on, courseSections.show_inAnim = false, done && cb(result, data), data ? 1 : 0;
      }
    },
    fade : {
      defaultAnimOptions : {
        duration : 300,
        timing : "linear"
      },
      init : function(self, url) {
        var action = self.curStats;
        var item = self.aplStats;
        if (action.show_animId) {
          player.remove(action.show_animId);
        }
        action.show_animId = player.add(function(value) {
          return value;
        }, function(opacity, canCreateDiscussions) {
          if (canCreateDiscussions) {
            state.fade.stop(self, true);
          } else {
            /** @type {string} */
            self.svg.style.opacity = opacity + "";
            if (err) {
              debug(self, self.svg);
              fireComponentHook(self);
            }
          }
        }, item.show_animOptions.duration, 1, item.show_animOptions.timing, null, false);
        state.fade.start(self, url);
      },
      start : function(self, e) {
        var objArray;
        var audioContext = self.curStats;
        if (audioContext.show_inAnim) {
          objArray = player.stop(audioContext.show_animId);
        }
        cb(self, 1);
        /** @type {boolean} */
        audioContext.show_inAnim = true;
        player.start(audioContext.show_animId, !self.aplStats.show_on, null != e ? e : objArray);
      },
      stop : function(context, app, v) {
        var a;
        var audioContext = context.curStats;
        return v = null != v ? v : context.aplStats.show_on, a = audioContext.show_inAnim ? player.stop(audioContext.show_animId) : v ? 1 : 0, audioContext.show_inAnim = false, app && (context.svg.style.opacity = v ? "" : "0", cb(context, v)), a;
      }
    },
    draw : {
      defaultAnimOptions : {
        duration : 500,
        timing : [.58, 0, .42, 1]
      },
      init : function(el, e) {
        var data = el.curStats;
        var item = el.aplStats;
        var value = el.pathList.baseVal;
        var result = prompt(value);
        var times = result.segsLen;
        var interval = result.lenAll;
        if (data.show_animId) {
          player.remove(data.show_animId);
        }
        data.show_animId = player.add(function(x) {
          var t;
          var result;
          var args;
          /** @type {number} */
          var i = -1;
          if (0 === x) {
            /** @type {!Array} */
            result = [[value[0][0], value[0][0]]];
          } else {
            if (1 === x) {
              result = value;
            } else {
              /** @type {number} */
              t = interval * x;
              /** @type {!Array} */
              result = [];
              for (; t >= times[++i];) {
                result.push(value[i]);
                /** @type {number} */
                t = t - times[i];
              }
              if (t) {
                if (2 === (args = value[i]).length) {
                  result.push([args[0], transform(args[0], args[1], t / times[i])]);
                } else {
                  x = f(args[0], args[1], args[2], args[3], set(args[0], args[1], args[2], args[3], t));
                  result.push([args[0], x.fromP1, x.fromP2, x]);
                }
              }
            }
          }
          return result;
        }, function(canCreateDiscussions, isSlidingUp) {
          if (isSlidingUp) {
            state.draw.stop(el, true);
          } else {
            el.pathList.animVal = canCreateDiscussions;
            update(el, {
              path : true
            });
          }
        }, item.show_animOptions.duration, 1, item.show_animOptions.timing, null, false);
        state.draw.start(el, e);
      },
      start : function(self, e) {
        var objArray;
        var audioContext = self.curStats;
        if (audioContext.show_inAnim) {
          objArray = player.stop(audioContext.show_animId);
        }
        cb(self, 1);
        /** @type {boolean} */
        audioContext.show_inAnim = true;
        get(self, "apl_position", state.draw.update);
        player.start(audioContext.show_animId, !self.aplStats.show_on, null != e ? e : objArray);
      },
      stop : function(el, id, status) {
        var a;
        var data = el.curStats;
        return status = null != status ? status : el.aplStats.show_on, a = data.show_inAnim ? player.stop(data.show_animId) : status ? 1 : 0, data.show_inAnim = false, id && (el.pathList.animVal = status ? null : [[el.pathList.baseVal[0][0], el.pathList.baseVal[0][0]]], update(el, {
          path : true
        }), cb(el, status)), a;
      },
      update : function(value) {
        remove(value, "apl_position", state.draw.update);
        if (value.curStats.show_inAnim) {
          state.draw.init(value, state.draw.stop(value));
        } else {
          value.aplStats.show_animOptions = {};
        }
      }
    }
  }, [["start", "anchorSE", 0], ["end", "anchorSE", 1], ["color", "lineColor"], ["size", "lineSize"], ["startSocketGravity", "socketGravitySE", 0], ["endSocketGravity", "socketGravitySE", 1], ["startPlugColor", "plugColorSE", 0], ["endPlugColor", "plugColorSE", 1], ["startPlugSize", "plugSizeSE", 0], ["endPlugSize", "plugSizeSE", 1], ["outline", "lineOutlineEnabled"], ["outlineColor", "lineOutlineColor"], ["outlineSize", "lineOutlineSize"], ["startPlugOutline", "plugOutlineEnabledSE", 0], ["endPlugOutline",
  "plugOutlineEnabledSE", 1], ["startPlugOutlineColor", "plugOutlineColorSE", 0], ["endPlugOutlineColor", "plugOutlineColorSE", 1], ["startPlugOutlineSize", "plugOutlineSizeSE", 0], ["endPlugOutlineSize", "plugOutlineSizeSE", 1]].forEach(function(match) {
    var name = match[0];
    var index = match[1];
    var quote = match[2];
    Object.defineProperty(list.prototype, name, {
      get : function() {
        var value = null != quote ? elements[this._id].options[index][quote] : index ? elements[this._id].options[index] : elements[this._id].options[name];
        return null == value ? on : normalize(value);
      },
      set : refresh(name),
      enumerable : true
    });
  }), [["path", data], ["startSocket", offset, "socketSE", 0], ["endSocket", offset, "socketSE", 1], ["startPlug", day, "plugSE", 0], ["endPlug", day, "plugSE", 1]].forEach(function(obj) {
    var m = obj[0];
    var components = obj[1];
    var property = obj[2];
    var i = obj[3];
    Object.defineProperty(list.prototype, m, {
      get : function() {
        var firstEltToMigrate;
        var name = null != i ? elements[this._id].options[property][i] : property ? elements[this._id].options[property] : elements[this._id].options[m];
        return name ? Object.keys(components).some(function(n) {
          return components[n] === name && (firstEltToMigrate = n, true);
        }) ? firstEltToMigrate : new Error("It's broken") : on;
      },
      set : refresh(m),
      enumerable : true
    });
  }), Object.keys(params).forEach(function(name) {
    var config = params[name];
    Object.defineProperty(list.prototype, name, {
      get : function() {
        var obj;
        var options;
        var data = elements[this._id].options[name];
        return isArray(data) ? (obj = data, options = config.optionsConf.reduce(function(serverElements, row) {
          var validationVM;
          var e = row[0];
          var i = row[1];
          var fields = row[2];
          var key = row[3];
          row = row[4];
          var value = null != row ? obj[key][row] : key ? obj[key] : obj[i];
          return serverElements[i] = "id" === e ? value ? Object.keys(fields).some(function(v) {
            return fields[v] === value && (validationVM = v, true);
          }) ? validationVM : new Error("It's broken") : on : null == value ? on : normalize(value), serverElements;
        }, {}), config.anim && (options.animation = normalize(obj.animation)), options) : data;
      },
      set : refresh(name),
      enumerable : true
    });
  }), ["startLabel", "endLabel", "middleLabel"].forEach(function(name, fieldName) {
    Object.defineProperty(list.prototype, name, {
      get : function() {
        var data = elements[this._id];
        var options = data.options;
        return options.labelSEM[fieldName] && !data.optionIsAttach.labelSEM[fieldName] ? items[options.labelSEM[fieldName]._id].text : options.labelSEM[fieldName] || "";
      },
      set : refresh(name),
      enumerable : true
    });
  }), list.prototype.setOptions = function(options) {
    return init(elements[this._id], options), this;
  }, list.prototype.position = function() {
    return update(elements[this._id], {
      position : true
    }), this;
  }, list.prototype.remove = function() {
    var data = elements[this._id];
    var args = data.curStats;
    Object.keys(params).forEach(function(i) {
      /** @type {string} */
      i = i + "_animId";
      if (args[i]) {
        player.remove(args[i]);
      }
    });
    if (args.show_animId) {
      player.remove(args.show_animId);
    }
    data.attachments.slice().forEach(function(t) {
      run(data, t);
    });
    if (data.baseWindow && data.svg) {
      data.baseWindow.document.body.removeChild(data.svg);
    }
    delete elements[this._id];
  }, list.prototype.show = function(e, x) {
    return select(elements[this._id], true, e, x), this;
  }, list.prototype.hide = function(start, callback) {
    return select(elements[this._id], false, start, callback), this;
  }, setup = function(i) {
    if (i && items[i._id]) {
      i.boundTargets.slice().forEach(function(job) {
        run(job.props, i, true);
      });
      if (i.conf.remove) {
        i.conf.remove(i);
      }
      delete items[i._id];
    }
  }, validate.prototype.remove = function() {
    var self = this;
    var value = items[self._id];
    if (value) {
      value.boundTargets.slice().forEach(function(index) {
        value.conf.removeOption(value, index);
      });
      execute(function() {
        var itm = items[self._id];
        if (itm) {
          console.error("LeaderLineAttachment was not removed by removeOption");
          setup(itm);
        }
      });
    }
  }, Error = validate, window.LeaderLineAttachment = Error, format = function(options, type) {
    return options instanceof Error && (!(options.isRemoved || type && items[options._id].conf.type !== type) || null);
  }, args = {
    pointAnchor : {
      type : "anchor",
      argOptions : [{
        optionName : "element",
        type : handler
      }],
      init : function(e, opts) {
        return e.element = args.pointAnchor.checkElement(opts.element), e.x = args.pointAnchor.parsePercent(opts.x, true) || [.5, true], e.y = args.pointAnchor.parsePercent(opts.y, true) || [.5, true], true;
      },
      removeOption : function(e, value) {
        var ctx = value.props;
        var data = {};
        var input = e.element;
        e = ctx.options.anchorSE["start" === value.optionName ? 1 : 0];
        if (input === e) {
          input = e === document.body ? new Error(args.pointAnchor, [input]) : document.body;
        }
        data[value.optionName] = input;
        init(ctx, data);
      },
      getBBoxNest : function(table, context) {
        var result = create(table.element, context.baseWindow);
        var courseSections = result.width;
        context = result.height;
        return result.width = result.height = 0, result.left = result.right = result.left + table.x[0] * (table.x[1] ? courseSections : 1), result.top = result.bottom = result.top + table.y[0] * (table.y[1] ? context : 1), result;
      },
      parsePercent : function(name, value) {
        var t;
        var usedLanguage;
        /** @type {boolean} */
        var i = false;
        return expect(name) ? usedLanguage = name : "string" == typeof name && (t = m.exec(name)) && t[2] && (i = 0 !== (usedLanguage = parseFloat(t[1]) / 100)), null != usedLanguage && (value || 0 <= usedLanguage) ? [usedLanguage, i] : null;
      },
      checkElement : function(element) {
        if (null == element) {
          /** @type {!HTMLBodyElement} */
          element = document.body;
        } else {
          if (!handler(element)) {
            throw new Error("`element` must be Element");
          }
        }
        return element;
      }
    },
    areaAnchor : {
      type : "anchor",
      argOptions : [{
        optionName : "element",
        type : handler
      }, {
        optionName : "shape",
        type : "string"
      }],
      stats : {
        color : {},
        strokeWidth : {},
        elementWidth : {},
        elementHeight : {},
        elementLeft : {},
        elementTop : {},
        pathListRel : {},
        bBoxRel : {},
        pathData : {},
        viewBoxBBox : {
          hasProps : true
        },
        dashLen : {},
        dashGap : {}
      },
      init : function(self, options) {
        var document;
        /** @type {!Array} */
        var current = [];
        return self.element = args.pointAnchor.checkElement(options.element), "string" == typeof options.color && (self.color = options.color.trim()), "string" == typeof options.fillColor && (self.fill = options.fillColor.trim()), expect(options.size) && 0 <= options.size && (self.size = options.size), options.dash && (self.dash = true, expect(options.dash.len) && 0 < options.dash.len && (self.dashLen = options.dash.len), expect(options.dash.gap) && 0 < options.dash.gap && (self.dashGap = options.dash.gap)),
        "circle" === options.shape ? self.shape = options.shape : "polygon" === options.shape && Array.isArray(options.points) && 3 <= options.points.length && options.points.every(function(symbolOffset) {
          var item = {};
          return !(!(item.x = args.pointAnchor.parsePercent(symbolOffset[0], true)) || !(item.y = args.pointAnchor.parsePercent(symbolOffset[1], true))) && (current.push(item), (item.x[1] || item.y[1]) && (self.hasRatio = true), true);
        }) ? (self.shape = options.shape, self.points = current) : (self.shape = "rect", self.radius = expect(options.radius) && 0 <= options.radius ? options.radius : 0), "rect" !== self.shape && "circle" !== self.shape || (self.x = args.pointAnchor.parsePercent(options.x, true) || [-.05, true], self.y = args.pointAnchor.parsePercent(options.y, true) || [-.05, true], self.width = args.pointAnchor.parsePercent(options.width) || [1.1, true], self.height = args.pointAnchor.parsePercent(options.height) ||
        [1.1, true], (self.x[1] || self.y[1] || self.width[1] || self.height[1]) && (self.hasRatio = true)), document = self.element.ownerDocument, self.svg = options = document.createElementNS(i, "svg"), options.className.baseVal = name + "-areaAnchor", options.viewBox.baseVal || options.setAttribute("viewBox", "0 0 0 0"), self.path = options.appendChild(document.createElementNS(i, "path")), self.path.style.fill = self.fill || "none", self.isShown = false, options.style.visibility = "hidden", document.body.appendChild(options),
        onLoad(document = document.defaultView), self.bodyOffset = getSize(document), self.updateColor = function() {
          var ev = self.curStats;
          var t = self.aplStats;
          var item = self.boundTargets.length ? self.boundTargets[0].props.curStats : null;
          ev.color = item = self.color || (item ? item.line_color : cfg.lineColor);
          if (callback(self, t, "color", item)) {
            self.path.style.stroke = item;
          }
        }, self.updateShow = function() {
          cb(self, self.boundTargets.some(function(p) {
            return true === p.props.isShown;
          }));
        }, true;
      },
      bind : function(options, value) {
        value = value.props;
        return options.color || get(value, "cur_line_color", options.updateColor), get(value, "svgShow", options.updateShow), execute(function() {
          options.updateColor();
          options.updateShow();
        }), true;
      },
      unbind : function(props, options) {
        options = options.props;
        if (!props.color) {
          remove(options, "cur_line_color", props.updateColor);
        }
        remove(options, "svgShow", props.updateShow);
        if (1 < props.boundTargets.length) {
          execute(function() {
            props.updateColor();
            props.updateShow();
            if (args.areaAnchor.update(props)) {
              props.boundTargets.forEach(function(selector) {
                update(selector.props, {
                  position : true
                });
              });
            }
          });
        }
      },
      removeOption : function(value, index) {
        args.pointAnchor.removeOption(value, index);
      },
      remove : function(target) {
        if (target.boundTargets.length) {
          console.error("LeaderLineAttachment was not unbound by remove");
          target.boundTargets.forEach(function(e) {
            args.areaAnchor.unbind(target, e);
          });
        }
        target.svg.parentNode.removeChild(target.svg);
      },
      getStrokeWidth : function(self, feature) {
        return args.areaAnchor.update(self) && 1 < self.boundTargets.length && execute(function() {
          self.boundTargets.forEach(function(selector) {
            if (selector.props !== feature) {
              update(selector.props, {
                position : true
              });
            }
          });
        }), self.curStats.strokeWidth;
      },
      getPathData : function(obj, app) {
        var frame = create(obj.element, app.baseWindow);
        return draw(obj.curStats.pathListRel, function(box) {
          box.x += frame.left;
          box.y += frame.top;
        });
      },
      getBBoxNest : function(bounds, delta) {
        delta = create(bounds.element, delta.baseWindow);
        bounds = bounds.curStats.bBoxRel;
        return {
          left : bounds.left + delta.left,
          top : bounds.top + delta.top,
          right : bounds.right + delta.left,
          bottom : bounds.bottom + delta.top,
          width : bounds.width,
          height : bounds.height
        };
      },
      update : function(config) {
        var node;
        var item;
        var rect;
        var o;
        var padding;
        var pos;
        var j;
        var i;
        var radius;
        var w;
        var a;
        var offset;
        var obj;
        var object;
        var locals;
        var result;
        var options = config.curStats;
        var data = config.aplStats;
        var matchingSeriParams = config.boundTargets.length ? config.boundTargets[0].props.curStats : null;
        var self = {};
        if (self.strokeWidth = callback(config, options, "strokeWidth", null != config.size ? config.size : matchingSeriParams ? matchingSeriParams.line_strokeWidth : cfg.lineSize), node = $(config.element), self.elementWidth = callback(config, options, "elementWidth", node.width), self.elementHeight = callback(config, options, "elementHeight", node.height), self.elementLeft = callback(config, options, "elementLeft", node.left), self.elementTop = callback(config, options, "elementTop", node.top),
        self.strokeWidth || config.hasRatio && (self.elementWidth || self.elementHeight)) {
          switch(config.shape) {
            case "rect":
              /** @type {number} */
              (offset = {
                left : config.x[0] * (config.x[1] ? node.width : 1),
                top : config.y[0] * (config.y[1] ? node.height : 1),
                width : config.width[0] * (config.width[1] ? node.width : 1),
                height : config.height[0] * (config.height[1] ? node.height : 1)
              }).right = offset.left + offset.width;
              /** @type {number} */
              offset.bottom = offset.top + offset.height;
              /** @type {number} */
              a = options.strokeWidth / 2;
              /** @type {number} */
              i = (j = Math.min(offset.width, offset.height)) ? j / 2 * Math.SQRT2 + a : 0;
              /** @type {!Array} */
              w = (j = config.radius ? config.radius <= i ? config.radius : i : 0) ? (i = (j - a) / Math.SQRT2, w = [{
                x : offset.left - (radius = j - i),
                y : offset.top + i
              }, {
                x : offset.left + i,
                y : offset.top - radius
              }, {
                x : offset.right - i,
                y : offset.top - radius
              }, {
                x : offset.right + radius,
                y : offset.top + i
              }, {
                x : offset.right + radius,
                y : offset.bottom - i
              }, {
                x : offset.right - i,
                y : offset.bottom + radius
              }, {
                x : offset.left + i,
                y : offset.bottom + radius
              }, {
                x : offset.left - radius,
                y : offset.bottom - i
              }], options.pathListRel = [[w[0], {
                x : w[0].x,
                y : w[0].y - (a = j * step)
              }, {
                x : w[1].x - a,
                y : w[1].y
              }, w[1]]], w[1].x !== w[2].x && options.pathListRel.push([w[1], w[2]]), options.pathListRel.push([w[2], {
                x : w[2].x + a,
                y : w[2].y
              }, {
                x : w[3].x,
                y : w[3].y - a
              }, w[3]]), w[3].y !== w[4].y && options.pathListRel.push([w[3], w[4]]), options.pathListRel.push([w[4], {
                x : w[4].x,
                y : w[4].y + a
              }, {
                x : w[5].x + a,
                y : w[5].y
              }, w[5]]), w[5].x !== w[6].x && options.pathListRel.push([w[5], w[6]]), options.pathListRel.push([w[6], {
                x : w[6].x - a,
                y : w[6].y
              }, {
                x : w[7].x,
                y : w[7].y + a
              }, w[7]]), w[7].y !== w[0].y && options.pathListRel.push([w[7], w[0]]), options.pathListRel.push([]), radius = j - i + options.strokeWidth / 2, [{
                x : offset.left - radius,
                y : offset.top - radius
              }, {
                x : offset.right + radius,
                y : offset.bottom + radius
              }]) : (radius = options.strokeWidth / 2, w = [{
                x : offset.left - radius,
                y : offset.top - radius
              }, {
                x : offset.right + radius,
                y : offset.bottom + radius
              }], options.pathListRel = [[w[0], {
                x : w[1].x,
                y : w[0].y
              }], [{
                x : w[1].x,
                y : w[0].y
              }, w[1]], [w[1], {
                x : w[0].x,
                y : w[1].y
              }], []], [{
                x : offset.left - options.strokeWidth,
                y : offset.top - options.strokeWidth
              }, {
                x : offset.right + options.strokeWidth,
                y : offset.bottom + options.strokeWidth
              }]);
              options.bBoxRel = {
                left : w[0].x,
                top : w[0].y,
                right : w[1].x,
                bottom : w[1].y,
                width : w[1].x - w[0].x,
                height : w[1].y - w[0].y
              };
              break;
            case "circle":
              if (!((pos = {
                left : config.x[0] * (config.x[1] ? node.width : 1),
                top : config.y[0] * (config.y[1] ? node.height : 1),
                width : config.width[0] * (config.width[1] ? node.width : 1),
                height : config.height[0] * (config.height[1] ? node.height : 1)
              }).width || pos.height)) {
                /** @type {number} */
                pos.width = pos.height = 10;
              }
              if (!pos.width) {
                /** @type {number} */
                pos.width = pos.height;
              }
              if (!pos.height) {
                /** @type {number} */
                pos.height = pos.width;
              }
              /** @type {number} */
              pos.right = pos.left + pos.width;
              /** @type {number} */
              pos.bottom = pos.top + pos.height;
              /** @type {number} */
              a = pos.left + pos.width / 2;
              /** @type {number} */
              j = pos.top + pos.height / 2;
              /** @type {number} */
              padding = options.strokeWidth / 2;
              /** @type {number} */
              i = pos.width / 2;
              /** @type {number} */
              radius = pos.height / 2;
              /** @type {number} */
              offset = i * Math.SQRT2 + padding;
              /** @type {number} */
              w = radius * Math.SQRT2 + padding;
              /** @type {!Array} */
              options.pathListRel = [[(padding = [{
                x : a - offset,
                y : j
              }, {
                x : a,
                y : j - w
              }, {
                x : a + offset,
                y : j
              }, {
                x : a,
                y : j + w
              }])[0], {
                x : padding[0].x,
                y : padding[0].y - (a = w * step)
              }, {
                x : padding[1].x - (j = offset * step),
                y : padding[1].y
              }, padding[1]], [padding[1], {
                x : padding[1].x + j,
                y : padding[1].y
              }, {
                x : padding[2].x,
                y : padding[2].y - a
              }, padding[2]], [padding[2], {
                x : padding[2].x,
                y : padding[2].y + a
              }, {
                x : padding[3].x + j,
                y : padding[3].y
              }, padding[3]], [padding[3], {
                x : padding[3].x - j,
                y : padding[3].y
              }, {
                x : padding[0].x,
                y : padding[0].y + a
              }, padding[0]], []];
              /** @type {number} */
              i = offset - i + options.strokeWidth / 2;
              /** @type {number} */
              radius = w - radius + options.strokeWidth / 2;
              /** @type {!Array} */
              padding = [{
                x : pos.left - i,
                y : pos.top - radius
              }, {
                x : pos.right + i,
                y : pos.bottom + radius
              }];
              options.bBoxRel = {
                left : padding[0].x,
                top : padding[0].y,
                right : padding[1].x,
                bottom : padding[1].y,
                width : padding[1].x - padding[0].x,
                height : padding[1].y - padding[0].y
              };
              break;
            case "polygon":
              config.points.forEach(function(y) {
                /** @type {number} */
                var x = y.x[0] * (y.x[1] ? node.width : 1);
                /** @type {number} */
                y = y.y[0] * (y.y[1] ? node.height : 1);
                if (rect) {
                  if (x < rect.left) {
                    /** @type {number} */
                    rect.left = x;
                  }
                  if (x > rect.right) {
                    /** @type {number} */
                    rect.right = x;
                  }
                  if (y < rect.top) {
                    /** @type {number} */
                    rect.top = y;
                  }
                  if (y > rect.bottom) {
                    /** @type {number} */
                    rect.bottom = y;
                  }
                } else {
                  rect = {
                    left : x,
                    right : x,
                    top : y,
                    bottom : y
                  };
                }
                if (o) {
                  options.pathListRel.push([o, {
                    x : x,
                    y : y
                  }]);
                } else {
                  /** @type {!Array} */
                  options.pathListRel = [];
                }
                o = {
                  x : x,
                  y : y
                };
              });
              options.pathListRel.push([]);
              /** @type {number} */
              padding = options.strokeWidth / 2;
              /** @type {!Array} */
              padding = [{
                x : rect.left - padding,
                y : rect.top - padding
              }, {
                x : rect.right + padding,
                y : rect.bottom + padding
              }];
              options.bBoxRel = {
                left : padding[0].x,
                top : padding[0].y,
                right : padding[1].x,
                bottom : padding[1].y,
                width : padding[1].x - padding[0].x,
                height : padding[1].y - padding[0].y
              };
          }
          /** @type {boolean} */
          self.pathListRel = self.bBoxRel = true;
        }
        return (self.pathListRel || self.elementLeft || self.elementTop) && (options.pathData = draw(options.pathListRel, function(coords) {
          coords.x += node.left;
          coords.y += node.top;
        })), callback(config, data, "strokeWidth", item = options.strokeWidth) && (config.path.style.strokeWidth = item + "px"), log(item = options.pathData, data.pathData) && (config.path.setPathData(item), data.pathData = item, self.pathData = true), config.dash && (!self.pathData && (!self.strokeWidth || config.dashLen && config.dashGap) || (options.dashLen = config.dashLen || 2 * options.strokeWidth, options.dashGap = config.dashGap || options.strokeWidth), self.dash = callback(config, data,
        "dashLen", options.dashLen) || self.dash, self.dash = callback(config, data, "dashGap", options.dashGap) || self.dash, self.dash && (config.path.style.strokeDasharray = data.dashLen + "," + data.dashGap)), obj = options.viewBoxBBox, object = data.viewBoxBBox, locals = config.svg.viewBox.baseVal, result = config.svg.style, obj.x = options.bBoxRel.left + node.left, obj.y = options.bBoxRel.top + node.top, obj.width = options.bBoxRel.width, obj.height = options.bBoxRel.height, ["x", "y", "width",
        "height"].forEach(function(key) {
          if ((item = obj[key]) !== object[key]) {
            locals[key] = object[key] = item;
            /** @type {string} */
            result[row[key]] = item + ("x" === key || "y" === key ? config.bodyOffset[key] : 0) + "px";
          }
        }), self.strokeWidth || self.pathListRel || self.bBoxRel;
      }
    },
    mouseHoverAnchor : {
      type : "anchor",
      argOptions : [{
        optionName : "element",
        type : handler
      }, {
        optionName : "showEffectName",
        type : "string"
      }],
      style : {
        backgroundImage : "url('data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==')",
        backgroundSize : "",
        backgroundRepeat : "no-repeat",
        backgroundColor : "#f8f881",
        cursor : "default"
      },
      hoverStyle : {
        backgroundImage : "none",
        backgroundColor : "#fadf8f"
      },
      padding : {
        top : 1,
        right : 15,
        bottom : 1,
        left : 2
      },
      minHeight : 15,
      backgroundPosition : {
        right : 2,
        top : 2
      },
      backgroundSize : {
        width : 12,
        height : 12
      },
      dirKeys : [["top", "Top"], ["right", "Right"], ["bottom", "Bottom"], ["left", "Left"]],
      init : function(self, options) {
        var style;
        var element;
        var display;
        var start;
        var x;
        var f;
        var node;
        var elem;
        var height;
        var data = args.mouseHoverAnchor;
        var pos = {};
        if (self.element = args.pointAnchor.checkElement(options.element), node = self.element, !((elem = node.ownerDocument) && (height = elem.defaultView) && height.HTMLElement && node instanceof height.HTMLElement)) {
          throw new Error("`element` must be HTML element");
        }
        return data.style.backgroundSize = data.backgroundSize.width + "px " + data.backgroundSize.height + "px", ["style", "hoverStyle"].forEach(function(i) {
          var row = data[i];
          self[i] = Object.keys(row).reduce(function(res, name) {
            return res[name] = row[name], res;
          }, {});
        }), "inline" === (style = self.element.ownerDocument.defaultView.getComputedStyle(self.element, "")).display ? self.style.display = "inline-block" : "none" === style.display && (self.style.display = "block"), args.mouseHoverAnchor.dirKeys.forEach(function(a) {
          var i = a[0];
          a = "padding" + a[1];
          if (parseFloat(style[a]) < data.padding[i]) {
            self.style[a] = data.padding[i] + "px";
          }
        }), self.style.display && (display = self.element.style.display, self.element.style.display = self.style.display), args.mouseHoverAnchor.dirKeys.forEach(function(a) {
          a = "padding" + a[1];
          if (self.style[a]) {
            pos[a] = self.element.style[a];
            self.element.style[a] = self.style[a];
          }
        }), (node = self.element.getBoundingClientRect()).height < data.minHeight && (err ? (height = data.minHeight, "content-box" === style.boxSizing ? height = height - (parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)) : "padding-box" === style.boxSizing && (height = height - (parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))), self.style.height = height + "px") : self.style.height = parseFloat(style.height) +
        (data.minHeight - node.height) + "px"), self.style.backgroundPosition = model ? node.width - data.backgroundSize.width - data.backgroundPosition.right + "px " + data.backgroundPosition.top + "px" : "right " + data.backgroundPosition.right + "px top " + data.backgroundPosition.top + "px", self.style.display && (self.element.style.display = display), args.mouseHoverAnchor.dirKeys.forEach(function(a) {
          a = "padding" + a[1];
          if (self.style[a]) {
            self.element.style[a] = pos[a];
          }
        }), ["style", "hoverStyle"].forEach(function(name) {
          var original = self[name];
          var obj = options[name];
          if (isArray(obj)) {
            Object.keys(obj).forEach(function(key) {
              if ("string" == typeof obj[key] || expect(obj[key])) {
                original[key] = obj[key];
              } else {
                if (null == obj[key]) {
                  delete original[key];
                }
              }
            });
          }
        }), "function" == typeof options.onSwitch && (f = options.onSwitch), options.showEffectName && state[options.showEffectName] && (self.showEffectName = start = options.showEffectName), x = options.animOptions, self.elmStyle = element = self.element.style, self.mouseenter = function(event) {
          self.hoverStyleSave = data.getStyles(element, Object.keys(self.hoverStyle));
          data.setStyles(element, self.hoverStyle);
          self.boundTargets.forEach(function(data) {
            select(data.props, true, start, x);
          });
          if (f) {
            f(event);
          }
        }, self.mouseleave = function(event) {
          data.setStyles(element, self.hoverStyleSave);
          self.boundTargets.forEach(function(data) {
            select(data.props, false, start, x);
          });
          if (f) {
            f(event);
          }
        }, true;
      },
      bind : function(item, options) {
        var el;
        var a;
        var b;
        var handler;
        var fn;
        return options.props.svg ? args.mouseHoverAnchor.llShow(options.props, false, item.showEffectName) : execute(function() {
          args.mouseHoverAnchor.llShow(options.props, false, item.showEffectName);
        }), item.enabled || (item.styleSave = args.mouseHoverAnchor.getStyles(item.elmStyle, Object.keys(item.style)), args.mouseHoverAnchor.setStyles(item.elmStyle, item.style), item.removeEventListener = (el = item.element, a = item.mouseenter, b = item.mouseleave, "onmouseenter" in el && "onmouseleave" in el ? (el.addEventListener("mouseenter", a, false), el.addEventListener("mouseleave", b, false), function() {
          el.removeEventListener("mouseenter", a, false);
          el.removeEventListener("mouseleave", b, false);
        }) : (console.warn("mouseenter and mouseleave events polyfill is enabled."), el.addEventListener("mouseover", handler = function(e) {
          if (!(e.relatedTarget && (e.relatedTarget === this || this.compareDocumentPosition(e.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY))) {
            a.apply(this, arguments);
          }
        }), el.addEventListener("mouseout", fn = function(e) {
          if (!(e.relatedTarget && (e.relatedTarget === this || this.compareDocumentPosition(e.relatedTarget) & Node.DOCUMENT_POSITION_CONTAINED_BY))) {
            b.apply(this, arguments);
          }
        }), function() {
          el.removeEventListener("mouseover", handler, false);
          el.removeEventListener("mouseout", fn, false);
        })), item.enabled = true), true;
      },
      unbind : function(o, f) {
        if (o.enabled && o.boundTargets.length <= 1) {
          o.removeEventListener();
          args.mouseHoverAnchor.setStyles(o.elmStyle, o.styleSave);
          /** @type {boolean} */
          o.enabled = false;
        }
        args.mouseHoverAnchor.llShow(f.props, true, o.showEffectName);
      },
      removeOption : function(value, index) {
        args.pointAnchor.removeOption(value, index);
      },
      remove : function(t) {
        if (t.boundTargets.length) {
          console.error("LeaderLineAttachment was not unbound by remove");
          t.boundTargets.forEach(function(e) {
            args.mouseHoverAnchor.unbind(t, e);
          });
        }
      },
      getBBoxNest : function(table, context) {
        return create(table.element, context.baseWindow);
      },
      llShow : function(self, e, changeset_id) {
        state[changeset_id || self.curStats.show_effect].stop(self, true, e);
        /** @type {string} */
        self.aplStats.show_on = e;
      },
      getStyles : function(options, props) {
        return props.reduce(function(requestObj, i) {
          return requestObj[i] = options[i], requestObj;
        }, {});
      },
      setStyles : function(o, items) {
        Object.keys(items).forEach(function(name) {
          o[name] = items[name];
        });
      }
    },
    captionLabel : {
      type : "label",
      argOptions : [{
        optionName : "text",
        type : "string"
      }],
      stats : {
        color : {},
        x : {},
        y : {}
      },
      textStyleProps : ["fontFamily", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize", "fontSizeAdjust", "kerning", "letterSpacing", "wordSpacing", "textDecoration"],
      init : function(self, options) {
        return "string" == typeof options.text && (self.text = options.text.trim()), !!self.text && ("string" == typeof options.color && (self.color = options.color.trim()), self.outlineColor = "string" == typeof options.outlineColor ? options.outlineColor.trim() : "#fff", Array.isArray(options.offset) && expect(options.offset[0]) && expect(options.offset[1]) && (self.offset = {
          x : options.offset[0],
          y : options.offset[1]
        }), expect(options.lineOffset) && (self.lineOffset = options.lineOffset), args.captionLabel.textStyleProps.forEach(function(name) {
          if (null != options[name]) {
            self[name] = options[name];
          }
        }), self.updateColor = function(event) {
          args.captionLabel.updateColor(self, event);
        }, self.updateSocketXY = function(s) {
          var t;
          var values = self.curStats;
          var a = self.aplStats;
          var offset = s.curStats;
          var o = offset.position_socketXYSE[self.socketIndex];
          if (null != o.x) {
            if (self.offset) {
              values.x = o.x + self.offset.x;
              values.y = o.y + self.offset.y;
            } else {
              /** @type {number} */
              t = self.height / 2;
              /** @type {number} */
              s = Math.max(offset.attach_plugSideLenSE[self.socketIndex] || 0, offset.line_strokeWidth / 2);
              offset = offset.position_socketXYSE[self.socketIndex ? 0 : 1];
              if (o.socketId === left || o.socketId === undefined) {
                values.x = o.socketId === left ? o.x - t - self.width : o.x + t;
                values.y = offset.y < o.y ? o.y + s + t : o.y - s - t - self.height;
              } else {
                values.x = offset.x < o.x ? o.x + s + t : o.x - s - t - self.width;
                values.y = o.socketId === top ? o.y - t - self.height : o.y + t;
              }
            }
            if (callback(self, a, "x", t = values.x)) {
              self.elmPosition.x.baseVal.getItem(0).value = t;
            }
            if (callback(self, a, "y", t = values.y)) {
              self.elmPosition.y.baseVal.getItem(0).value = t + self.height;
            }
          }
        }, self.updatePath = function(t) {
          var values = self.curStats;
          var ref = self.aplStats;
          t = t.pathList.animVal || t.pathList.baseVal;
          if (t) {
            t = args.captionLabel.getMidPoint(t, self.lineOffset);
            /** @type {number} */
            values.x = t.x - self.width / 2;
            /** @type {number} */
            values.y = t.y - self.height / 2;
            if (callback(self, ref, "x", t = values.x)) {
              /** @type {number} */
              self.elmPosition.x.baseVal.getItem(0).value = t;
            }
            if (callback(self, ref, "y", t = values.y)) {
              self.elmPosition.y.baseVal.getItem(0).value = t + self.height;
            }
          }
        }, self.updateShow = function(entity) {
          args.captionLabel.updateShow(self, entity);
        }, model && (self.adjustEdge = function(qb, t) {
          var n = self.curStats;
          if (null != n.x) {
            args.captionLabel.adjustEdge(t, {
              x : n.x,
              y : n.y,
              width : self.width,
              height : self.height
            }, self.strokeWidth / 2);
          }
        }), true);
      },
      updateColor : function(e, options) {
        var that = e.curStats;
        var a = e.aplStats;
        options = options.curStats;
        that.color = options = e.color || options.line_color;
        if (callback(e, a, "color", options)) {
          /** @type {string} */
          e.styleFill.fill = options;
        }
      },
      updateShow : function(node, on) {
        /** @type {boolean} */
        on = true === on.isShown;
        if (on !== node.isShown) {
          /** @type {string} */
          node.styleShow.visibility = on ? "" : "hidden";
          /** @type {string} */
          node.isShown = on;
        }
      },
      adjustEdge : function(b, c, a) {
        a = {
          x1 : c.x - a,
          y1 : c.y - a,
          x2 : c.x + c.width + a,
          y2 : c.y + c.height + a
        };
        if (a.x1 < b.x1) {
          /** @type {number} */
          b.x1 = a.x1;
        }
        if (a.y1 < b.y1) {
          /** @type {number} */
          b.y1 = a.y1;
        }
        if (a.x2 > b.x2) {
          b.x2 = a.x2;
        }
        if (a.y2 > b.y2) {
          b.y2 = a.y2;
        }
      },
      newText : function(text, doc, size, id, length) {
        var defs;
        var obj;
        var item = doc.createElementNS(i, "text");
        return item.textContent = text, [item.x, item.y].forEach(function(klass) {
          var svgLength = size.createSVGLength();
          svgLength.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
          klass.baseVal.initialize(svgLength);
        }), "boolean" != typeof values && (values = "paintOrder" in item.style), length && !values ? (defs = doc.createElementNS(i, "defs"), item.id = id, defs.appendChild(item), (obj = (text = doc.createElementNS(i, "g")).appendChild(doc.createElementNS(i, "use"))).href.baseVal = "#" + id, (doc = text.appendChild(doc.createElementNS(i, "use"))).href.baseVal = "#" + id, (obj = obj.style).strokeLinejoin = "round", {
          elmPosition : item,
          styleText : item.style,
          styleFill : doc.style,
          styleStroke : obj,
          styleShow : text.style,
          elmsAppend : [defs, text]
        }) : (obj = item.style, length && (obj.strokeLinejoin = "round", obj.paintOrder = "stroke"), {
          elmPosition : item,
          styleText : obj,
          styleFill : obj,
          styleStroke : length ? obj : null,
          styleShow : obj,
          elmsAppend : [item]
        });
      },
      getMidPoint : function(val, fieldnameTruncated) {
        var args;
        var finalTypes;
        var s = prompt(val);
        var color = s.segsLen;
        s = s.lenAll;
        /** @type {number} */
        var i = -1;
        var t = s / 2 + (fieldnameTruncated || 0);
        if (t <= 0) {
          return 2 === (args = val[0]).length ? transform(args[0], args[1], 0) : f(args[0], args[1], args[2], args[3], 0);
        }
        if (s <= t) {
          return 2 === (args = val[val.length - 1]).length ? transform(args[0], args[1], 1) : f(args[0], args[1], args[2], args[3], 1);
        }
        /** @type {!Array} */
        finalTypes = [];
        for (; t > color[++i];) {
          finalTypes.push(val[i]);
          /** @type {number} */
          t = t - color[i];
        }
        return 2 === (args = val[i]).length ? transform(args[0], args[1], t / color[i]) : f(args[0], args[1], args[2], args[3], set(args[0], args[1], args[2], args[3], t));
      },
      initSvg : function(options, obj) {
        var urlElementOrData;
        var height;
        var self = args.captionLabel.newText(options.text, obj.baseWindow.document, obj.svg, name + "-captionLabel-" + options._id, options.outlineColor);
        ["elmPosition", "styleFill", "styleShow", "elmsAppend"].forEach(function(k) {
          options[k] = self[k];
        });
        /** @type {boolean} */
        options.isShown = false;
        /** @type {string} */
        options.styleShow.visibility = "hidden";
        args.captionLabel.textStyleProps.forEach(function(name) {
          if (null != options[name]) {
            self.styleText[name] = options[name];
          }
        });
        self.elmsAppend.forEach(function(elementInformation) {
          obj.svg.appendChild(elementInformation);
        });
        urlElementOrData = self.elmPosition.getBBox();
        options.width = urlElementOrData.width;
        options.height = urlElementOrData.height;
        if (options.outlineColor) {
          /** @type {number} */
          height = urlElementOrData.height / 9;
          /** @type {string} */
          self.styleStroke.strokeWidth = (height = 10 < height ? 10 : height < 2 ? 2 : height) + "px";
          self.styleStroke.stroke = options.outlineColor;
        }
        /** @type {number} */
        options.strokeWidth = height || 0;
        resolve(options.aplStats, args.captionLabel.stats);
        options.updateColor(obj);
        if (options.refSocketXY) {
          options.updateSocketXY(obj);
        } else {
          options.updatePath(obj);
        }
        if (model) {
          update(obj, {});
        }
        options.updateShow(obj);
      },
      bind : function(options, request) {
        var data = request.props;
        return options.color || get(data, "cur_line_color", options.updateColor), (options.refSocketXY = "startLabel" === request.optionName || "endLabel" === request.optionName) ? (options.socketIndex = "startLabel" === request.optionName ? 0 : 1, get(data, "apl_position", options.updateSocketXY), options.offset || (get(data, "cur_attach_plugSideLenSE", options.updateSocketXY), get(data, "cur_line_strokeWidth", options.updateSocketXY))) : get(data, "apl_path", options.updatePath), get(data, "svgShow",
        options.updateShow), model && get(data, "new_edge4viewBox", options.adjustEdge), args.captionLabel.initSvg(options, data), true;
      },
      unbind : function(self, element) {
        var obj = element.props;
        if (self.elmsAppend) {
          self.elmsAppend.forEach(function(__el) {
            obj.svg.removeChild(__el);
          });
          /** @type {null} */
          self.elmPosition = self.styleFill = self.styleShow = self.elmsAppend = null;
        }
        resolve(self.curStats, args.captionLabel.stats);
        resolve(self.aplStats, args.captionLabel.stats);
        if (!self.color) {
          remove(obj, "cur_line_color", self.updateColor);
        }
        if (self.refSocketXY) {
          remove(obj, "apl_position", self.updateSocketXY);
          if (!self.offset) {
            remove(obj, "cur_attach_plugSideLenSE", self.updateSocketXY);
            remove(obj, "cur_line_strokeWidth", self.updateSocketXY);
          }
        } else {
          remove(obj, "apl_path", self.updatePath);
        }
        remove(obj, "svgShow", self.updateShow);
        if (model) {
          remove(obj, "new_edge4viewBox", self.adjustEdge);
          update(obj, {});
        }
      },
      removeOption : function(value, e) {
        var ctx = e.props;
        var item = {};
        /** @type {string} */
        item[e.optionName] = "";
        init(ctx, item);
      },
      remove : function(t) {
        if (t.boundTargets.length) {
          console.error("LeaderLineAttachment was not unbound by remove");
          t.boundTargets.forEach(function(e) {
            args.captionLabel.unbind(t, e);
          });
        }
      }
    },
    pathLabel : {
      type : "label",
      argOptions : [{
        optionName : "text",
        type : "string"
      }],
      stats : {
        color : {},
        startOffset : {},
        pathData : {}
      },
      init : function(self, options) {
        return "string" == typeof options.text && (self.text = options.text.trim()), !!self.text && ("string" == typeof options.color && (self.color = options.color.trim()), self.outlineColor = "string" == typeof options.outlineColor ? options.outlineColor.trim() : "#fff", expect(options.lineOffset) && (self.lineOffset = options.lineOffset), args.captionLabel.textStyleProps.forEach(function(name) {
          if (null != options[name]) {
            self[name] = options[name];
          }
        }), self.updateColor = function(event) {
          args.captionLabel.updateColor(self, event);
        }, self.updatePath = function(path) {
          var layer = self.curStats;
          var data = self.aplStats;
          var pathData = path.curStats;
          var i = path.pathList.animVal || path.pathList.baseVal;
          if (i) {
            layer.pathData = pathData = args.pathLabel.getOffsetPathData(i, pathData.line_strokeWidth / 2 + self.strokeWidth / 2 + self.height / 4, 1.25 * self.height);
            if (log(pathData, data.pathData)) {
              self.elmPath.setPathData(pathData);
              data.pathData = pathData;
              self.bBox = self.elmPosition.getBBox();
              self.updateStartOffset(path);
            }
          }
        }, self.updateStartOffset = function(value) {
          var last;
          var update;
          var data = self.curStats;
          var a = self.aplStats;
          var config = value.curStats;
          if (data.pathData) {
            if (!(2 === self.semIndex && !self.lineOffset)) {
              update = data.pathData.reduce(function(sum, segment) {
                var n;
                var v = segment.values;
                switch(segment.type) {
                  case "M":
                    last = {
                      x : v[0],
                      y : v[1]
                    };
                    break;
                  case "L":
                    n = {
                      x : v[0],
                      y : v[1]
                    };
                    if (last) {
                      sum = sum + func(last, n);
                    }
                    last = n;
                    break;
                  case "C":
                    n = {
                      x : v[4],
                      y : v[5]
                    };
                    if (last) {
                      sum = sum + add(last, {
                        x : v[0],
                        y : v[1]
                      }, {
                        x : v[2],
                        y : v[3]
                      }, n);
                    }
                    last = n;
                }
                return sum;
              }, 0);
              value = 0 === self.semIndex ? 0 : 1 === self.semIndex ? update : update / 2;
              if (2 !== self.semIndex) {
                /** @type {number} */
                config = Math.max(config.attach_plugBackLenSE[self.semIndex] || 0, config.line_strokeWidth / 2) + self.strokeWidth / 2 + self.height / 4;
                value = (value = value + (0 === self.semIndex ? config : -config)) < 0 ? 0 : update < value ? update : value;
              }
              if (self.lineOffset) {
                value = (value = value + self.lineOffset) < 0 ? 0 : update < value ? update : value;
              }
              /** @type {number} */
              data.startOffset = value;
              if (callback(self, a, "startOffset", value)) {
                /** @type {number} */
                self.elmOffset.startOffset.baseVal.value = value;
              }
            }
          }
        }, self.updateShow = function(entity) {
          args.captionLabel.updateShow(self, entity);
        }, model && (self.adjustEdge = function(qb, t) {
          if (self.bBox) {
            args.captionLabel.adjustEdge(t, self.bBox, self.strokeWidth / 2);
          }
        }), true);
      },
      getOffsetPathData : function(child, i, padlen) {
        /**
         * @param {!Object} e
         * @param {!Object} t
         * @return {?}
         */
        function transform(e, t) {
          return Math.abs(e.x - t.x) < 3 && Math.abs(e.y - t.y) < 3;
        }
        var m;
        var next;
        /** @type {!Array} */
        var messages = [];
        return child.forEach(function(vertices) {
          var item;
          var v;
          var data;
          var index;
          var x;
          var p1;
          var beta;
          var w;
          var u;
          var t;
          var r;
          if (2 === vertices.length) {
            w = vertices[0];
            u = vertices[1];
            /** @type {number} */
            t = i;
            /** @type {number} */
            r = Math.atan2(w.y - u.y, u.x - w.x) + .5 * Math.PI;
            /** @type {!Array} */
            item = [{
              x : w.x + Math.cos(r) * t,
              y : w.y + Math.sin(r) * t * -1
            }, {
              x : u.x + Math.cos(r) * t,
              y : u.y + Math.sin(r) * t * -1
            }];
            if (m) {
              data = m.points;
              if (0 <= (beta = Math.atan2(data[1].y - data[0].y, data[0].x - data[1].x) - Math.atan2(vertices[0].y - vertices[1].y, vertices[1].x - vertices[0].x)) && beta <= Math.PI) {
                v = {
                  type : "line",
                  points : item,
                  inside : true
                };
              } else {
                x = filter(data[0], data[1], i);
                index = filter(item[1], item[0], i);
                p1 = data[0];
                w = item[1];
                /** @type {number} */
                r = (u = x).x - p1.x;
                /** @type {number} */
                t = u.y - p1.y;
                /** @type {number} */
                beta = w.x - index.x;
                /** @type {number} */
                u = w.y - index.y;
                /** @type {number} */
                w = (-t * (p1.x - index.x) + r * (p1.y - index.y)) / (-beta * t + r * u);
                /** @type {number} */
                u = (beta * (p1.y - index.y) - u * (p1.x - index.x)) / (-beta * t + r * u);
                /** @type {({points: !Array, type: string})} */
                v = (t = 0 <= w && w <= 1 && 0 <= u && u <= 1 ? {
                  x : p1.x + u * r,
                  y : p1.y + u * t
                } : null) ? {
                  type : "line",
                  points : [data[1] = t, item[1]]
                } : (data[1] = transform(index, x) ? index : x, {
                  type : "line",
                  points : [index, item[1]]
                });
                m.len = func(data[0], data[1]);
              }
            } else {
              v = {
                type : "line",
                points : item
              };
            }
            v.len = func(v.points[0], v.points[1]);
            messages.push(m = v);
          } else {
            messages.push({
              type : "cubic",
              points : function(left, b, text, undefined, size, width) {
                var result;
                var direction;
                /** @type {number} */
                var height = add(left, b, text, undefined) / width;
                /** @type {number} */
                var initialVerticalPosition = 1 / (width < size ? size / width * height : height);
                /** @type {!Array} */
                var statPointCoordinatesList = [];
                /** @type {number} */
                var y = 0;
                for (; direction = (90 - (result = f(left, b, text, undefined, y)).angle) * (Math.PI / 180), statPointCoordinatesList.push({
                  x : result.x + Math.cos(direction) * size,
                  y : result.y + Math.sin(direction) * size * -1
                }), !(1 <= y);) {
                  if (1 < (y = y + initialVerticalPosition)) {
                    /** @type {number} */
                    y = 1;
                  }
                }
                return statPointCoordinatesList;
              }(vertices[0], vertices[1], vertices[2], vertices[3], i, 16)
            });
            /** @type {null} */
            m = null;
          }
        }), m = null, messages.forEach(function(self) {
          var data;
          m = "line" === self.type ? (self.inside && (m.len > i ? ((data = m.points)[1] = filter(data[0], data[1], -i), m.len = func(data[0], data[1])) : (m.points = null, m.len = 0), self.len > i + padlen ? ((data = self.points)[0] = filter(data[1], data[0], -(i + padlen)), self.len = func(data[0], data[1])) : (self.points = null, self.len = 0)), self) : null;
        }), messages.reduce(function(array, tag) {
          var l = tag.points;
          return l && (next && transform(l[0], next) || array.push({
            type : "M",
            values : [l[0].x, l[0].y]
          }), "line" === tag.type ? array.push({
            type : "L",
            values : [l[1].x, l[1].y]
          }) : (l.shift(), l.forEach(function(objectToMeasure) {
            array.push({
              type : "L",
              values : [objectToMeasure.x, objectToMeasure.y]
            });
          })), next = l[l.length - 1]), array;
        }, []);
      },
      newText : function(id, svg, name, length) {
        var baseName;
        var el;
        var element;
        var obj;
        var node = svg.createElementNS(i, "defs");
        var passedEl = node.appendChild(svg.createElementNS(i, "path"));
        return passedEl.id = baseName = name + "-path", (element = (el = svg.createElementNS(i, "text")).appendChild(svg.createElementNS(i, "textPath"))).href.baseVal = "#" + baseName, element.startOffset.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0), element.textContent = id, "boolean" != typeof values && (values = "paintOrder" in el.style), length && !values ? (el.id = id = name + "-text", node.appendChild(el), (obj = (name = svg.createElementNS(i, "g")).appendChild(svg.createElementNS(i,
        "use"))).href.baseVal = "#" + id, (svg = name.appendChild(svg.createElementNS(i, "use"))).href.baseVal = "#" + id, (obj = obj.style).strokeLinejoin = "round", {
          elmPosition : el,
          elmPath : passedEl,
          elmOffset : element,
          styleText : el.style,
          styleFill : svg.style,
          styleStroke : obj,
          styleShow : name.style,
          elmsAppend : [node, name]
        }) : (obj = el.style, length && (obj.strokeLinejoin = "round", obj.paintOrder = "stroke"), {
          elmPosition : el,
          elmPath : passedEl,
          elmOffset : element,
          styleText : obj,
          styleFill : obj,
          styleStroke : length ? obj : null,
          styleShow : obj,
          elmsAppend : [node, el]
        });
      },
      initSvg : function(options, obj) {
        var urlElementOrData;
        var height;
        var value;
        var node = args.pathLabel.newText(options.text, obj.baseWindow.document, name + "-pathLabel-" + options._id, options.outlineColor);
        ["elmPosition", "elmPath", "elmOffset", "styleFill", "styleShow", "elmsAppend"].forEach(function(k) {
          options[k] = node[k];
        });
        /** @type {boolean} */
        options.isShown = false;
        /** @type {string} */
        options.styleShow.visibility = "hidden";
        args.captionLabel.textStyleProps.forEach(function(name) {
          if (null != options[name]) {
            node.styleText[name] = options[name];
          }
        });
        node.elmsAppend.forEach(function(elementInformation) {
          obj.svg.appendChild(elementInformation);
        });
        node.elmPath.setPathData([{
          type : "M",
          values : [0, 100]
        }, {
          type : "h",
          values : [100]
        }]);
        if (ariaRole) {
          value = node.elmOffset.href.baseVal;
          /** @type {string} */
          node.elmOffset.href.baseVal = "";
        }
        urlElementOrData = node.elmPosition.getBBox();
        if (ariaRole) {
          node.elmOffset.href.baseVal = value;
        }
        node.styleText.textAnchor = ["start", "end", "middle"][options.semIndex];
        if (!(2 !== options.semIndex || options.lineOffset)) {
          node.elmOffset.startOffset.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 50);
        }
        options.height = urlElementOrData.height;
        if (options.outlineColor) {
          /** @type {number} */
          height = urlElementOrData.height / 9;
          /** @type {string} */
          node.styleStroke.strokeWidth = (height = 10 < height ? 10 : height < 2 ? 2 : height) + "px";
          node.styleStroke.stroke = options.outlineColor;
        }
        /** @type {number} */
        options.strokeWidth = height || 0;
        resolve(options.aplStats, args.pathLabel.stats);
        options.updateColor(obj);
        options.updatePath(obj);
        options.updateStartOffset(obj);
        if (model) {
          update(obj, {});
        }
        options.updateShow(obj);
      },
      bind : function(options, request) {
        var data = request.props;
        return options.color || get(data, "cur_line_color", options.updateColor), get(data, "cur_line_strokeWidth", options.updatePath), get(data, "apl_path", options.updatePath), options.semIndex = "startLabel" === request.optionName ? 0 : "endLabel" === request.optionName ? 1 : 2, 2 === options.semIndex && !options.lineOffset || get(data, "cur_attach_plugBackLenSE", options.updateStartOffset), get(data, "svgShow", options.updateShow), model && get(data, "new_edge4viewBox", options.adjustEdge),
        args.pathLabel.initSvg(options, data), true;
      },
      unbind : function(self, element) {
        var obj = element.props;
        if (self.elmsAppend) {
          self.elmsAppend.forEach(function(__el) {
            obj.svg.removeChild(__el);
          });
          /** @type {null} */
          self.elmPosition = self.elmPath = self.elmOffset = self.styleFill = self.styleShow = self.elmsAppend = null;
        }
        resolve(self.curStats, args.pathLabel.stats);
        resolve(self.aplStats, args.pathLabel.stats);
        if (!self.color) {
          remove(obj, "cur_line_color", self.updateColor);
        }
        remove(obj, "cur_line_strokeWidth", self.updatePath);
        remove(obj, "apl_path", self.updatePath);
        if (!(2 === self.semIndex && !self.lineOffset)) {
          remove(obj, "cur_attach_plugBackLenSE", self.updateStartOffset);
        }
        remove(obj, "svgShow", self.updateShow);
        if (model) {
          remove(obj, "new_edge4viewBox", self.adjustEdge);
          update(obj, {});
        }
      },
      removeOption : function(value, e) {
        var ctx = e.props;
        var item = {};
        /** @type {string} */
        item[e.optionName] = "";
        init(ctx, item);
      },
      remove : function(t) {
        if (t.boundTargets.length) {
          console.error("LeaderLineAttachment was not unbound by remove");
          t.boundTargets.forEach(function(e) {
            args.pathLabel.unbind(t, e);
          });
        }
      }
    }
  }, Object.keys(args).forEach(function(num) {
    /**
     * @return {?}
     */
    list[num] = function() {
      return new Error(args[num], Array.prototype.slice.call(arguments));
    };
  }), list.positionByWindowResize = true, window.addEventListener("resize", reply.add(function() {
    if (list.positionByWindowResize) {
      Object.keys(elements).forEach(function(k) {
        update(elements[k], {
          position : true
        });
      });
    }
  }), false), list;
}();
export default LeaderLine;
