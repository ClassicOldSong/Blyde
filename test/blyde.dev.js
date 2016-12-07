(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var loglevel = createCommonjsModule(function (module) {
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(commonjsGlobal, function () {
    "use strict";
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // these private functions always need `this` to be set properly

    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }
    }

    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public API
       *
       */

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Package-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    return defaultLogger;
}));
});

var log = function log() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return loglevel.info.apply(loglevel, ['[Blyde]'].concat(args));
};
var warn = function warn() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return loglevel.warn.apply(loglevel, ['[Blyde]'].concat(args));
};
var error = function error() {
	for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		args[_key3] = arguments[_key3];
	}

	return loglevel.error.apply(loglevel, ['[Blyde]'].concat(args));
};

{
	loglevel.setLevel('trace');
	log('Debug logging enabled!');
}

var initQuery = [];
var loaded = false;

var Blyde$1 = function Blyde$1(fn) {
	if (typeof fn === 'function') {
		if (loaded) {
			fn.call(window);
		} else {
			initQuery.push(fn);
		}
	} else {
		log(fn, 'is not a function!');
	}
};

function _ref$1(i) {
	return initQuery[i].call(window);
}

var init = function init() {
	document.removeEventListener('DOMContentLoaded', init, false);
	if (window.Velocity) Blyde$1.useVelocity(window.Velocity);
	loaded = true;
	initQuery.forEach(_ref$1);
	log('Blyde v' + "0.1.0-alpha.18.dev.e8eb9b4" + ' initlized!');
};

document.addEventListener('DOMContentLoaded', init, false);
if (document.readyState === "interactive" || document.readyState === "complete") init();

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = _aFunction;
var _ctx = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!isObject$2(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject       = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive    = _toPrimitive;
var dP$1             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP$1(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var dP         = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var global$1    = _global;
var core      = _core;
var ctx       = _ctx;
var hide      = _hide;
var PROTOTYPE = 'prototype';

var $export$1 = function(type, name, source){
  var IS_FORCED = type & $export$1.F
    , IS_GLOBAL = type & $export$1.G
    , IS_STATIC = type & $export$1.S
    , IS_PROTO  = type & $export$1.P
    , IS_BIND   = type & $export$1.B
    , IS_WRAP   = type & $export$1.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] : (global$1[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$1)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export$1.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1;   // forced
$export$1.G = 2;   // global
$export$1.S = 4;   // static
$export$1.P = 8;   // proto
$export$1.B = 16;  // bind
$export$1.W = 32;  // wrap
$export$1.U = 64;  // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _cof;
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject$1 = _iobject;
var defined = _defined;
var _toIobject = function(it){
  return IObject$1(defined(it));
};

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength
var toInteger = _toInteger;
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$1 = _toInteger;
var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = toInteger$1(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes
var toIObject$1 = _toIobject;
var toLength  = _toLength;
var toIndex   = _toIndex;
var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject$1($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store  = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var uid    = _uid;
var _sharedKey = function(key){
  return shared[key] || (shared[key] = uid(key));
};

var has          = _has;
var toIObject    = _toIobject;
var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = _objectKeysInternal;
var enumBugKeys = _enumBugKeys;

var _objectKeys = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)
var defined$1 = _defined;
var _toObject = function(it){
  return Object(defined$1(it));
};

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = _objectKeys;
var gOPS     = _objectGops;
var pIE      = _objectPie;
var toObject = _toObject;
var IObject  = _iobject;
var $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)
var $export = _export;

$export($export.S + $export.F, 'Object', {assign: _objectAssign});

var assign$2 = _core.Object.assign;

var assign$1 = createCommonjsModule(function (module) {
module.exports = { "default": assign$2, __esModule: true };
});

var _Object$assign = unwrapExports(assign$1);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var methods = {
	node: {},
	list: {},
	blyde: {}
};

var $node = function $node(node) {
	_classCallCheck(this, $node);

	this.$el = node;
	for (var i in methods.node) {
		if (methods.node[i] instanceof Function) this[i] = methods.node[i].bind(node);else this[i] = methods.node[i];
	}
	if (!node.$id) Object.defineProperty(node, '$id', { value: Math.floor(Math.random() * Math.pow(10, 16)).toString(36) });
};
var $nodeList = function $nodeList(list) {
	_classCallCheck(this, $nodeList);

	this.$list = [];
	for (var i = 0; i < list.length; i++) {
		this.$list.push(list[i].$);
	}for (var _i in methods.list) {
		if (methods.list[_i] instanceof Function) this[_i] = methods.list[_i].bind(this.$list);else this[_i] = methods.node[_i];
	}
};

var plugins = {};

var register = function register(_ref, config) {
	var name = _ref.name,
	    node = _ref.node,
	    list = _ref.list,
	    blyde = _ref.blyde;

	if (!name) {
		error('Plugin name not precent! Registration aborted.');
		return;
	}
	for (var i in node) {
		if (methods.node[i]) {
			if (config.autoNameSpace === 'keep') log('$node property "' + i + '" has been kept.');else {
				var fnName = i;
				if (config.autoNameSpace === 'rename') {
					fnName = name + i;
					log('$node property "' + i + '" has been renamed to "' + fnName + '".');
				} else {
					warn('$node property "' + i + '" in "' + name + '" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.');
				}
				methods.node[fnName] = node[i];
			}
		} else methods.node[i] = node[i];
	}
	for (var _i in list) {
		if (methods.list[_i]) {
			if (config.autoNameSpace === 'keep') log('$nodeList property "' + _i + '" has been kept.');else {
				var _fnName = _i;
				if (config.autoNameSpace === 'rename') {
					_fnName = name + _i;
					log('$nodeList property "' + _i + '" has been renamed to "' + _fnName + '".');
				} else {
					warn('$nodeList property "' + _i + '" in "' + name + '" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.');
				}
				methods.list[_fnName] = list[_i];
			}
		} else methods.list[_i] = list[_i];
	}
	for (var _i2 in blyde) {
		if (methods.blyde[_i2]) {
			if (config.autoNameSpace === 'keep') log('Blyde property "' + _i2 + '" has been kept.');else {
				var _fnName2 = _i2;
				if (config.autoNameSpace === 'rename') {
					_fnName2 = name + _i2;
					log('Blyde property "' + _i2 + '" has been renamed to "' + _fnName2 + '".');
				} else {
					warn('Blyde property "' + _i2 + '" in "' + name + '" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.');
				}
				methods.blyde[_fnName2] = blyde[_i2];
				Blyde$1[_fnName2] = blyde[_i2];
			}
		} else {
			methods.blyde[_i2] = blyde[_i2];
			Blyde$1[_i2] = blyde[_i2];
		}
	}
	plugins[name] = { node: node, list: list, blyde: blyde };
	log('Plugin "' + name + '" loaded.');
};

var takeSnapshot = function takeSnapshot() {
	var methodsShot = {
		node: _Object$assign({}, methods.node),
		list: _Object$assign({}, methods.list),
		blyde: _Object$assign({}, methods.blyde)
	};
	var pluginShot = {};
	for (var i in plugins) {
		pluginShot[i] = {
			node: _Object$assign({}, plugins[i].node),
			list: _Object$assign({}, plugins[i].list),
			blyde: _Object$assign({}, plugins[i].blyde)
		};
	}
	return {
		version: 'Blyde v' + "0.1.0-alpha.18.dev.e8eb9b4",
		methods: methodsShot,
		plugins: pluginShot,
		$node: $node,
		$nodeList: $nodeList,
		log: log,
		warn: warn,
		error: error,
		takeSnapshot: takeSnapshot
	};
};

var regFn = (function (plugin) {
	var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	register(plugin(takeSnapshot()), config);
});

// most Object methods by ES6 should accept primitives
var $export$2 = _export;
var core$1    = _core;
var fails   = _fails;
var _objectSap = function(KEY, exec){
  var fn  = (core$1.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export$2($export$2.S + $export$2.F * fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)
var toObject$1 = _toObject;
var $keys$1    = _objectKeys;

_objectSap('keys', function(){
  return function keys(it){
    return $keys$1(toObject$1(it));
  };
});

var keys$2 = _core.Object.keys;

var keys$1 = createCommonjsModule(function (module) {
module.exports = { "default": keys$2, __esModule: true };
});

var _Object$keys = unwrapExports(keys$1);

var toInteger$2 = _toInteger;
var defined$2   = _defined;
// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(defined$2(that))
      , i = toInteger$2(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

var dP$2       = _objectDp;
var anObject$2 = _anObject;
var getKeys$1  = _objectKeys;

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  anObject$2(O);
  var keys   = getKeys$1(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP$2.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject$1    = _anObject;
var dPs         = _objectDps;
var enumBugKeys$1 = _enumBugKeys;
var IE_PROTO$1    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = enumBugKeys$1.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][enumBugKeys$1[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = anObject$1(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , uid        = _uid
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var has$2 = _has;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !has$2(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var create$1         = _objectCreate;
var descriptor     = _propertyDesc;
var setToStringTag$1 = _setToStringTag;
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = create$1(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag$1(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has$3         = _has;
var toObject$2    = _toObject;
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = toObject$2(O);
  if(has$3(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var LIBRARY        = _library;
var $export$3        = _export;
var redefine       = _redefine;
var hide$1           = _hide;
var has$1            = _has;
var Iterators      = _iterators;
var $iterCreate    = _iterCreate;
var setToStringTag = _setToStringTag;
var getPrototypeOf = _objectGpo;
var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has$1(IteratorPrototype, ITERATOR))hide$1(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide$1(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export$3($export$3.P + $export$3.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

// call something on iterator step with safe closing on error
var anObject$3 = _anObject;
var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject$3(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject$3(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator
var Iterators$1  = _iterators;
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (Iterators$1.Array === it || ArrayProto[ITERATOR$1] === it);
};

var $defineProperty = _objectDp;
var createDesc$1      = _propertyDesc;

var _createProperty = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc$1(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof$1 = _cof;
var TAG$1 = _wks('toStringTag');
var ARG = cof$1(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? cof$1(O)
    // ES3 arguments fallback
    : (B = cof$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var classof   = _classof;
var ITERATOR$2  = _wks('iterator');
var Iterators$2 = _iterators;
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || Iterators$2[classof(it)];
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

var ctx$1            = _ctx;
var $export$4        = _export;
var toObject$3       = _toObject;
var call           = _iterCall;
var isArrayIter    = _isArrayIter;
var toLength$1       = _toLength;
var createProperty = _createProperty;
var getIterFn      = core_getIteratorMethod;

$export$4($export$4.S + $export$4.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject$3(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx$1(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength$1(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$3 = _core.Array.from;

var from$1 = createCommonjsModule(function (module) {
module.exports = { "default": from$3, __esModule: true };
});

var toConsumableArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _from = from$1;

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

var addToUnscopables = _addToUnscopables;
var step             = _iterStep;
var Iterators$4        = _iterators;
var toIObject$2        = _toIobject;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = toIObject$2(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators$4.Arguments = Iterators$4.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var global$3        = _global;
var hide$2          = _hide;
var Iterators$3     = _iterators;
var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global$3[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide$2(proto, TO_STRING_TAG, NAME);
  Iterators$3[NAME] = Iterators$3.Array;
}

var anObject$4 = _anObject;
var get$1      = core_getIteratorMethod;
var core_getIterator = _core.getIterator = function(it){
  var iterFn = get$1(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject$4(iterFn.call(it));
};

var getIterator$1 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$1, __esModule: true };
});

var _getIterator = unwrapExports(getIterator);

var safeZone = document.createDocumentFragment();
var evtHandler = function evtHandler(e, listeners) {
	var target = function () {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _getIterator(e.path), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				if (i.$id && listeners[i.$id]) return i;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}();
	if (!target) return;

	function _ref(i) {
		return i.call(target, e);
	}

	if (listeners[target.$id][e.type]) {
		listeners[target.$id][e.type].forEach(_ref);
	}
};

var nodeMethods = {
	q: function q(selector) {
		if (!(selector instanceof Node)) {
			selector = this.querySelector(selector);
		}
		if (selector) return selector.$;
	},
	qa: function qa(selector) {
		if (selector instanceof NodeList) return new $nodeList(selector);
		return new $nodeList(this.querySelectorAll(selector));
	},
	addClass: function addClass(className) {
		var _classList;

		var classes = className.split(' ');
		(_classList = this.classList).add.apply(_classList, _toConsumableArray(classes));
		return this.$;
	},
	removeClass: function removeClass(className) {
		var _classList2;

		var classes = className.split(' ');
		(_classList2 = this.classList).remove.apply(_classList2, _toConsumableArray(classes));
		return this.$;
	},
	toggleClass: function toggleClass(className) {
		var classes = className.split(' ');
		var classArr = this.className.split(' ');
		classes.forEach(function (i) {
			var classIndex = classArr.indexOf(i);
			if (classIndex > -1) {
				classArr.splice(classIndex, 1);
			} else {
				classArr.push(i);
			}
		});
		this.className = classArr.join(' ').trim();
		return this.$;
	},
	replaceWith: function replaceWith(node) {
		if (node instanceof $node) node = node.$el;
		var parent = this.parentNode;
		if (parent) {
			parent.replaceChild(node, this);
			return node.$;
		} else {
			error(this, 'may not have been attached to document properly.');
			return this.$;
		}
	},
	swap: function swap(node) {
		if (node instanceof $node) node = node.$el;
		var thisParent = this.parentNode;
		var nodeParent = node.parentNode;
		var thisSibling = this.nextSibling;
		var nodeSibling = node.nextSibling;
		if (thisParent && nodeParent) {
			thisParent.insertBefore(node, thisSibling);
			nodeParent.insertBefore(this, nodeSibling);
			return node.$;
		} else {
			var errNodes = [];
			if (thisParent === null) {
				errNodes.push(this);
			}
			if (nodeParent === null) {
				errNodes.push(node);
			}
			error.apply(undefined, errNodes.concat(['may not have been attached to document properly.']));
			return this.$;
		}
	},
	before: function before() {
		var _arguments = arguments,
		    _this = this;

		function _ref2() {
			var tempFragment = document.createDocumentFragment();

			for (_len = _arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
				nodes[_key] = _arguments[_key];
			}

			nodes.reverse();
			nodes.forEach(function (i) {
				if (i instanceof $node) i = i.$el;
				tempFragment.appendChild(i);
			});
			_this.parentNode.insertBefore(tempFragment, _this);
		}

		if (this.parentNode) {
			var _len, nodes, _key;

			_ref2();
		} else {
			error(this, 'may not have been attached to document properly.');
		}
		return this.$;
	},
	after: function after() {
		var _arguments2 = arguments,
		    _this2 = this;

		function _ref3() {
			var tempFragment = document.createDocumentFragment();

			for (_len2 = _arguments2.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				nodes[_key2] = _arguments2[_key2];
			}

			nodes.forEach(function (i) {
				if (i instanceof $node) i = i.$el;
				tempFragment.appendChild(i);
			});
			if (_this2.nextSibling) {
				_this2.parentNode.insertBefore(tempFragment, _this2.nextSibling);
			} else {
				_this2.parentNode.append(tempFragment);
			}
		}

		if (this.parentNode) {
			var _len2, nodes, _key2;

			_ref3();
		} else {
			error(this, 'may not have been attached to document properly.');
		}
		return this.$;
	},
	append: function append() {
		if ([1, 9, 11].indexOf(this.nodeType) === -1) {
			warn('This node type does not support method "append".');
			return;
		}
		var tempFragment = document.createDocumentFragment();

		for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			nodes[_key3] = arguments[_key3];
		}

		nodes.forEach(function (i) {
			if (i instanceof $node) i = i.$el;
			tempFragment.appendChild(i);
		});
		this.appendChild(tempFragment);
		return this.$;
	},
	prepend: function prepend() {
		if ([1, 9, 11].indexOf(this.nodeType) === -1) {
			warn('This node type does not support method "prepend".');
			return;
		}
		var tempFragment = document.createDocumentFragment();

		for (var _len4 = arguments.length, nodes = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			nodes[_key4] = arguments[_key4];
		}

		nodes.reverse();
		nodes.forEach(function (i) {
			if (i instanceof $node) i = i.$el;
			tempFragment.appendChild(i);
		});
		if (this.firstChild) {
			this.insertBefore(tempFragment, this.$el.firstChild);
		} else {
			this.appendChild(tempFragment);
		}
		return this.$;
	},
	appendTo: function appendTo(node) {
		if (node instanceof $node) node = node.$el;
		node.appendChild(this);
		return this.$;
	},
	prependTo: function prependTo(node) {
		if (node instanceof $node) node = node.$el;
		if (node.firstChild) {
			node.insertBefore(this, node.firstChild);
		} else {
			node.appendChild(this);
		}
		return this.$;
	},
	empty: function empty() {
		this.innerHTML = '';
	},
	remove: function remove() {
		this.parentNode.removeChild(this);
		return this.$;
	},
	safeRemove: function safeRemove() {
		safeZone.appendChild(this);
		return this.$;
	},
	on: function on(type, fn, useCapture) {
		var _this3 = this;

		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				return _this3.addEventListener(i, fn, !!useCapture);
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	off: function off(type, fn, useCapture) {
		var _this4 = this;

		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				return _this4.$el.removeEventListener(i, fn, !!useCapture);
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	__eventHandler__: function __eventHandler__(e) {
		evtHandler(e, this.$.listeners);
	},
	at: function at(type, node, fn) {
		var _this5 = this;

		if (node instanceof $node) node = node.$el;else node = node.$.$el;
		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				if (i !== '') {
					if (!_this5.$.listeners) _this5.$.listeners = {};
					if (!_this5.$.listeners[node.$id]) {
						_this5.addEventListener(i, _this5.$.__eventHandler__, true);
						_this5.$.listeners[node.$id] = {};
					}
					if (!_this5.$.listeners[node.$id][i]) _this5.$.listeners[node.$id][i] = [];
					_this5.$.listeners[node.$id][i].push(fn);
				}
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	un: function un(type, node, fn) {
		var _this6 = this;

		if (node instanceof $node) node = node.$el;else node = node.$.$el;
		var types = type.split(' ');
		if (typeof fn === 'function') {
			if (this.$.listeners && this.$.listeners[node.$id]) {
				types.forEach(function (i) {
					if (i !== '' && _this6.$.listeners[node.$id][i]) {
						var fns = _this6.$.listeners[node.$id][i];
						fns.splice(fns.indexOf(fn), 1);
						if (_this6.$.listeners[node.$id][i].length === 0) {
							delete _this6.$.listeners[node.$id][i];
							if (function () {
								for (var j in _this6.$.listeners) {
									if (_this6.$.listeners[j][i]) return false;
								}
								return true;
							}()) _this6.removeEventListener(i, _this6.$.__eventHandler__, true);
							if (_Object$keys(_this6.$.listeners[node.$id]).length === 0) {
								delete _this6.$.listeners[node.$id];
								if (_Object$keys(_this6.$.listeners).length === 0) delete _this6.$.listeners;
							}
						}
					}
				});
			}
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	trigger: function trigger(event, config) {
		if (typeof event === 'string') event = new Event(event, config);
		this.dispatchEvent(event);
	}
};

function _ref$2(i) {
	i.empty();
}

function _ref2(i) {
	i.remove();
}

function _ref3(i) {
	i.safeRemove();
}

var listMethods = {
	addClass: function addClass(className) {
		this.forEach(function (i) {
			i.addClass(className);
		});
		return this;
	},
	removeClass: function removeClass(className) {
		this.forEach(function (i) {
			i.removeClass(className);
		});
		return this;
	},
	appendTo: function appendTo(node) {
		var _nodeMethods$append;

		if (node instanceof $node) node = node.$el;
		var nodes = [];
		this.forEach(function (i) {
			nodes.push(i.$el);
		});
		(_nodeMethods$append = nodeMethods.append).call.apply(_nodeMethods$append, [node].concat(nodes));
		return this;
	},
	prependTo: function prependTo(node) {
		var _nodeMethods$prepend;

		if (node instanceof $node) node = node.$el;
		var nodes = [];
		this.forEach(function (i) {
			nodes.push(i.$el);
		});
		(_nodeMethods$prepend = nodeMethods.prepend).call.apply(_nodeMethods$prepend, [node].concat(nodes));
		return this;
	},
	toggleClass: function toggleClass(className) {
		this.forEach(function (i) {
			i.toggleClass(className);
		});
		return this;
	},
	empty: function empty() {
		this.forEach(_ref$2);
		return this;
	},
	remove: function remove() {
		this.forEach(_ref2);
		return this;
	},
	safeRemove: function safeRemove() {
		this.forEach(_ref3);
		return this;
	},
	on: function on(type, fn, useCapture) {
		function _ref4(i) {
			i.on(type, fn, !!useCapture);
		}

		if (typeof fn === 'function') {
			this.forEach(_ref4);
			return this;
		} else {
			warn(fn, 'is not a function!');
		}
	},
	off: function off(type, fn, useCapture) {
		function _ref5(i) {
			i.off(type, fn, !!useCapture);
		}

		if (typeof fn === 'function') {
			this.forEach(_ref5);
			return this;
		} else {
			warn(fn, 'is not a function!');
		}
	},
	trigger: function trigger(event, config) {
		if (typeof event === 'string') event = new Event(event, config);
		this.forEach(function (i) {
			return i.trigger(event);
		});
	}
};

var velocityUsed = false;

var useVelocity = function useVelocity(v) {
	if (velocityUsed) return;

	function _velocity() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		v.apply(undefined, [this].concat(args));
		return this.$;
	}

	function _velocity2() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		this.forEach(function (i) {
			return v.apply(undefined, [i.$el].concat(args));
		});
		return this;
	}

	regFn(function () {
		velocityUsed = true;
		return {
			name: 'Velocity',
			node: {
				velocity: _velocity
			},
			list: {
				velocity: _velocity2
			}
		};
	}, {
		autoNameSpace: false
	});
};

var blydeMethods = {
	version: 'Blyde v' + "0.1.0-alpha.18.dev.e8eb9b4",
	fn: regFn,
	q: nodeMethods.q.bind(document),
	qa: nodeMethods.qa.bind(document),
	on: nodeMethods.on.bind(window),
	off: nodeMethods.off.bind(window),
	useVelocity: useVelocity
};

regFn(function () {
	var plugin = {
		name: 'Blyde',
		node: nodeMethods,
		list: listMethods,
		blyde: blydeMethods
	};
	return plugin;
}, {
	autoNameSpace: false
});

Object.defineProperty(Node.prototype, '$', {
	get: function get() {
		Object.defineProperty(this, '$', { value: new $node(this) });
		return this.$;
	}
});

function _ref() {
	return Blyde$1;
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Blyde$1;
} else if (typeof define === 'function' && define.amd) {
	define(_ref);
} else {
	Object.defineProperty(window, 'Blyde', { value: Blyde$1 });
	if (window.$) log('"window.$" may have been taken by another library, use "window.Blyde" for non-conflict usage.');else Object.defineProperty(window, '$', { value: Blyde$1 });
}

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCIuLi9zcmMvZGVidWcuanMiLCIuLi9zcmMvYmx5ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL3NyYy9zaGFyZWQuanMiLCIuLi9zcmMvcmVnaXN0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3JlYXRlLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vZ2V0LWl0ZXJhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCIuLi9zcmMvbWV0aG9kcy9ub2RlLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL3NyYy9tZXRob2RzL2JseWRlLmpzIiwiLi4vc3JjL2xvYWRlci5qcyIsIi4uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgQVBJXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogUGFja2FnZS1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBsb2dnaW5nIGZyb20gJ2xvZ2xldmVsJ1xuY29uc3QgbG9nID0gKC4uLmFyZ3MpID0+IGxvZ2dpbmcuaW5mbygnW0JseWRlXScsIC4uLmFyZ3MpXG5jb25zdCB3YXJuID0gKC4uLmFyZ3MpID0+IGxvZ2dpbmcud2FybignW0JseWRlXScsIC4uLmFyZ3MpXG5jb25zdCBlcnJvciA9ICguLi5hcmdzKSA9PiBsb2dnaW5nLmVycm9yKCdbQmx5ZGVdJywgLi4uYXJncylcblxuaWYgKEVOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdGxvZ2dpbmcuc2V0TGV2ZWwoJ2Vycm9yJylcbn0gZWxzZSB7XG5cdGxvZ2dpbmcuc2V0TGV2ZWwoJ3RyYWNlJylcblx0bG9nKCdEZWJ1ZyBsb2dnaW5nIGVuYWJsZWQhJylcbn1cblxuZXhwb3J0IHsgbG9nLCB3YXJuLCBlcnJvciB9XG4iLCIvKiBnbG9iYWwgVkVSU0lPTiAqL1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vZGVidWcuanMnXG5cbmNvbnN0IGluaXRRdWVyeSA9IFtdXG5sZXQgbG9hZGVkID0gZmFsc2VcblxuY29uc3QgQmx5ZGUgPSAoZm4pID0+IHtcblx0aWYgKHR5cGVvZihmbikgPT09ICdmdW5jdGlvbicpIHtcblx0XHRpZiAobG9hZGVkKSB7XG5cdFx0XHRmbi5jYWxsKHdpbmRvdylcblx0XHR9IGVsc2Uge1xuXHRcdFx0aW5pdFF1ZXJ5LnB1c2goZm4pXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGxvZyhmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH1cbn1cblxuY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCwgZmFsc2UpXG5cdGlmICh3aW5kb3cuVmVsb2NpdHkpIEJseWRlLnVzZVZlbG9jaXR5KHdpbmRvdy5WZWxvY2l0eSlcblx0bG9hZGVkID0gdHJ1ZVxuXHRpbml0UXVlcnkuZm9yRWFjaChpID0+IGluaXRRdWVyeVtpXS5jYWxsKHdpbmRvdykpXG5cdGxvZyhgQmx5ZGUgdiR7VkVSU0lPTn0gaW5pdGxpemVkIWApXG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0LCBmYWxzZSlcbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIgfHwgZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSBpbml0KClcblxuZXhwb3J0IGRlZmF1bHQgQmx5ZGVcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTsiLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b0lPYmplY3QgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwga2V5O1xuICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgJGFzc2lnbiAgPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICB2YXIgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsIGFMZW4gID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mXG4gICAgLCBpc0VudW0gICAgID0gcElFLmY7XG4gIHdoaWxlKGFMZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJyl9KTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduOyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBtZXRob2RzID0ge1xuXHRub2RlOiB7fSxcblx0bGlzdDoge30sXG5cdGJseWRlOiB7fVxufVxuXG5jb25zdCAkbm9kZSA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3Iobm9kZSkge1xuXHRcdHRoaXMuJGVsID0gbm9kZVxuXHRcdGZvciAobGV0IGkgaW4gbWV0aG9kcy5ub2RlKSB7XG5cdFx0XHRpZiAobWV0aG9kcy5ub2RlW2ldIGluc3RhbmNlb2YgRnVuY3Rpb24pIHRoaXNbaV0gPSBtZXRob2RzLm5vZGVbaV0uYmluZChub2RlKVxuXHRcdFx0ZWxzZSB0aGlzW2ldID0gbWV0aG9kcy5ub2RlW2ldXG5cdFx0fVxuXHRcdGlmICghbm9kZS4kaWQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCAnJGlkJywge3ZhbHVlOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygxMCwgMTYpKS50b1N0cmluZygzNil9KVxuXHR9XG59XG5jb25zdCAkbm9kZUxpc3QgPSBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKGxpc3QpIHtcblx0XHR0aGlzLiRsaXN0ID0gW11cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHRoaXMuJGxpc3QucHVzaChsaXN0W2ldLiQpXG5cdFx0Zm9yIChsZXQgaSBpbiBtZXRob2RzLmxpc3QpIHtcblx0XHRcdGlmIChtZXRob2RzLmxpc3RbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbikgdGhpc1tpXSA9IG1ldGhvZHMubGlzdFtpXS5iaW5kKHRoaXMuJGxpc3QpXG5cdFx0XHRlbHNlIHRoaXNbaV0gPSBtZXRob2RzLm5vZGVbaV1cblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IHsgbWV0aG9kcywgJG5vZGUsICRub2RlTGlzdCB9XG4iLCIvKiBnbG9iYWwgVkVSU0lPTiAqL1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGxvZywgd2FybiwgZXJyb3IgfSBmcm9tICcuL2RlYnVnLmpzJ1xuaW1wb3J0IEJseWRlIGZyb20gJy4vYmx5ZGUuanMnXG5pbXBvcnQgeyBtZXRob2RzLCAkbm9kZSwgJG5vZGVMaXN0IH0gZnJvbSAnLi9zaGFyZWQuanMnXG5cbmNvbnN0IHBsdWdpbnMgPSB7fVxuXG5jb25zdCByZWdpc3RlciA9ICh7bmFtZSwgbm9kZSwgbGlzdCwgYmx5ZGV9LCBjb25maWcpID0+IHtcblx0aWYgKCFuYW1lKSB7XG5cdFx0ZXJyb3IoJ1BsdWdpbiBuYW1lIG5vdCBwcmVjZW50ISBSZWdpc3RyYXRpb24gYWJvcnRlZC4nKVxuXHRcdHJldHVyblxuXHR9XG5cdGZvciAobGV0IGkgaW4gbm9kZSkge1xuXHRcdGlmIChtZXRob2RzLm5vZGVbaV0pIHtcblx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ2tlZXAnKSBsb2coYCRub2RlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIGtlcHQuYClcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgZm5OYW1lID0gaVxuXHRcdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdyZW5hbWUnKSB7XG5cdFx0XHRcdFx0Zm5OYW1lID0gbmFtZSArIGlcblx0XHRcdFx0XHRsb2coYCRub2RlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYCRub2RlIHByb3BlcnR5IFwiJHtpfVwiIGluIFwiJHtuYW1lfVwiIGhhcyByZXBsYWNlZCB0aGUgb3JpZ2luYWwgb25lLCBzZXQgXCJjb25maWcuYXV0b05hbWVTcGFjZVwiIHRvIFwicmVuYW1lXCIgdG8ga2VlcCBib3RoLmApXG5cdFx0XHRcdH1cblx0XHRcdFx0bWV0aG9kcy5ub2RlW2ZuTmFtZV0gPSBub2RlW2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlIG1ldGhvZHMubm9kZVtpXSA9IG5vZGVbaV1cblx0fVxuXHRmb3IgKGxldCBpIGluIGxpc3QpIHtcblx0XHRpZiAobWV0aG9kcy5saXN0W2ldKSB7XG5cdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdrZWVwJykgbG9nKGAkbm9kZUxpc3QgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4ga2VwdC5gKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCBmbk5hbWUgPSBpXG5cdFx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ3JlbmFtZScpIHtcblx0XHRcdFx0XHRmbk5hbWUgPSBuYW1lICsgaVxuXHRcdFx0XHRcdGxvZyhgJG5vZGVMaXN0IHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYCRub2RlTGlzdCBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwiY29uZmlnLmF1dG9OYW1lU3BhY2VcIiB0byBcInJlbmFtZVwiIHRvIGtlZXAgYm90aC5gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1ldGhvZHMubGlzdFtmbk5hbWVdID0gbGlzdFtpXVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBtZXRob2RzLmxpc3RbaV0gPSBsaXN0W2ldXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBibHlkZSkge1xuXHRcdGlmIChtZXRob2RzLmJseWRlW2ldKSB7XG5cdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdrZWVwJykgbG9nKGBCbHlkZSBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiBrZXB0LmApXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IGZuTmFtZSA9IGlcblx0XHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAncmVuYW1lJykge1xuXHRcdFx0XHRcdGZuTmFtZSA9IG5hbWUgKyBpXG5cdFx0XHRcdFx0bG9nKGBCbHlkZSBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiByZW5hbWVkIHRvIFwiJHtmbk5hbWV9XCIuYClcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3YXJuKGBCbHlkZSBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwiY29uZmlnLmF1dG9OYW1lU3BhY2VcIiB0byBcInJlbmFtZVwiIHRvIGtlZXAgYm90aC5gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1ldGhvZHMuYmx5ZGVbZm5OYW1lXSA9IGJseWRlW2ldXG5cdFx0XHRcdEJseWRlW2ZuTmFtZV0gPSBibHlkZVtpXVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtZXRob2RzLmJseWRlW2ldID0gYmx5ZGVbaV1cblx0XHRcdEJseWRlW2ldID0gYmx5ZGVbaV1cblx0XHR9XG5cdH1cblx0cGx1Z2luc1tuYW1lXSA9IHsgbm9kZSwgbGlzdCwgYmx5ZGUgfVxuXHRsb2coYFBsdWdpbiBcIiR7bmFtZX1cIiBsb2FkZWQuYClcbn1cblxuY29uc3QgdGFrZVNuYXBzaG90ID0gKCkgPT4ge1xuXHRjb25zdCBtZXRob2RzU2hvdCA9IHtcblx0XHRub2RlOiBPYmplY3QuYXNzaWduKHt9LCBtZXRob2RzLm5vZGUpLFxuXHRcdGxpc3Q6IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMubGlzdCksXG5cdFx0Ymx5ZGU6IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMuYmx5ZGUpXG5cdH1cblx0Y29uc3QgcGx1Z2luU2hvdCA9IHt9XG5cdGZvciAobGV0IGkgaW4gcGx1Z2lucykge1xuXHRcdHBsdWdpblNob3RbaV0gPSB7XG5cdFx0XHRub2RlOiBPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5zW2ldLm5vZGUpLFxuXHRcdFx0bGlzdDogT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luc1tpXS5saXN0KSxcblx0XHRcdGJseWRlOiBPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5zW2ldLmJseWRlKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge1xuXHRcdHZlcnNpb246IGBCbHlkZSB2JHtWRVJTSU9OfWAsXG5cdFx0bWV0aG9kczogbWV0aG9kc1Nob3QsXG5cdFx0cGx1Z2luczogcGx1Z2luU2hvdCxcblx0XHQkbm9kZSxcblx0XHQkbm9kZUxpc3QsXG5cdFx0bG9nLFxuXHRcdHdhcm4sXG5cdFx0ZXJyb3IsXG5cdFx0dGFrZVNuYXBzaG90XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKHBsdWdpbiwgY29uZmlnID0ge30pID0+IHtcblx0cmVnaXN0ZXIocGx1Z2luKHRha2VTbmFwc2hvdCgpKSwgY29uZmlnKVxufVxuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGZhaWxzICAgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGV4ZWMpe1xuICB2YXIgZm4gID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG4gICAgLCBleHAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTsiLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgJGtleXMgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmtleXM7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGluZGV4LCB2YWx1ZSl7XG4gIGlmKGluZGV4IGluIG9iamVjdCkkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgcmV0dXJuIHtkb25lOiBzYWZlID0gdHJ1ZX07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIGNhbGwgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpXG4gICwgZ2V0SXRlckZuICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBDICAgICAgID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheVxuICAgICAgLCBhTGVuICAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tOyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZnJvbSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2FycmF5L2Zyb21cIik7XG5cbnZhciBfZnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mcm9tKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyMltpXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKDAsIF9mcm9tMi5kZWZhdWx0KShhcnIpO1xuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0ICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3IgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuLCBlcnJvciB9IGZyb20gJy4uL2RlYnVnLmpzJ1xuaW1wb3J0IHsgJG5vZGUsICRub2RlTGlzdCB9IGZyb20gJy4uL3NoYXJlZC5qcydcblxuY29uc3Qgc2FmZVpvbmUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbmNvbnN0IGV2dEhhbmRsZXIgPSBmdW5jdGlvbihlLCBsaXN0ZW5lcnMpIHtcblx0Y29uc3QgdGFyZ2V0ID0gKCgpID0+IHtcblx0XHRmb3IgKGxldCBpIG9mIGUucGF0aCkge1xuXHRcdFx0aWYgKGkuJGlkICYmIGxpc3RlbmVyc1tpLiRpZF0pIHJldHVybiBpXG5cdFx0fVxuXHR9KSgpXG5cdGlmICghdGFyZ2V0KSByZXR1cm5cblx0aWYgKGxpc3RlbmVyc1t0YXJnZXQuJGlkXVtlLnR5cGVdKSB7XG5cdFx0bGlzdGVuZXJzW3RhcmdldC4kaWRdW2UudHlwZV0uZm9yRWFjaChpID0+IGkuY2FsbCh0YXJnZXQsIGUpKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0cShzZWxlY3Rvcikge1xuXHRcdGlmICghKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZSkpIHtcblx0XHRcdHNlbGVjdG9yID0gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuXHRcdH1cblx0XHRpZiAoc2VsZWN0b3IpIHJldHVybiBzZWxlY3Rvci4kXG5cdH0sXG5cblx0cWEoc2VsZWN0b3IpIHtcblx0XHRpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBOb2RlTGlzdCkgcmV0dXJuIG5ldyAkbm9kZUxpc3Qoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIG5ldyAkbm9kZUxpc3QodGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblx0fSxcblxuXHRhZGRDbGFzcyhjbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gY2xhc3NOYW1lLnNwbGl0KCcgJylcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcylcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0Y29uc3QgY2xhc3NlcyA9IGNsYXNzTmFtZS5zcGxpdCgnICcpXG5cdFx0dGhpcy5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBjbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNvbnN0IGNsYXNzQXJyID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNsYXNzZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IGNsYXNzQXJyLmluZGV4T2YoaSlcblx0XHRcdGlmIChjbGFzc0luZGV4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NBcnIuc3BsaWNlKGNsYXNzSW5kZXgsIDEpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGFzc0Fyci5wdXNoKGkpXG5cdFx0XHR9XG5cdFx0fSlcblx0XHR0aGlzLmNsYXNzTmFtZSA9IGNsYXNzQXJyLmpvaW4oJyAnKS50cmltKClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVwbGFjZVdpdGgobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZVxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5yZXBsYWNlQ2hpbGQobm9kZSwgdGhpcylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IodGhpcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fVxuXHR9LFxuXG5cdHN3YXAobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHRoaXNQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGVcblx0XHRjb25zdCBub2RlUGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0Y29uc3QgdGhpc1NpYmxpbmcgPSB0aGlzLm5leHRTaWJsaW5nXG5cdFx0Y29uc3Qgbm9kZVNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nXG5cdFx0aWYgKHRoaXNQYXJlbnQgJiYgbm9kZVBhcmVudCkge1xuXHRcdFx0dGhpc1BhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgdGhpc1NpYmxpbmcpXG5cdFx0XHRub2RlUGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBub2RlU2libGluZylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGVyck5vZGVzID0gW11cblx0XHRcdGlmICh0aGlzUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2godGhpcylcblx0XHRcdH1cblx0XHRcdGlmIChub2RlUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2gobm9kZSlcblx0XHRcdH1cblx0XHRcdGVycm9yKC4uLmVyck5vZGVzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9XG5cdH0sXG5cblx0YmVmb3JlKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdFx0aWYgKGkgaW5zdGFuY2VvZiAkbm9kZSkgaSA9IGkuJGVsXG5cdFx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdFx0fSlcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFmdGVyKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0XHR0ZW1wRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaSlcblx0XHRcdH0pXG5cdFx0XHRpZiAodGhpcy5uZXh0U2libGluZykge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBGcmFnbWVudCwgdGhpcy5uZXh0U2libGluZylcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmQodGVtcEZyYWdtZW50KVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJhcHBlbmRcIi4nKVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdGNvbnN0IHRlbXBGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0dGVtcEZyYWdtZW50LmFwcGVuZENoaWxkKGkpXG5cdFx0fSlcblx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cHJlcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJwcmVwZW5kXCIuJylcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRjb25zdCB0ZW1wRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpZiAoaSBpbnN0YW5jZW9mICRub2RlKSBpID0gaS4kZWxcblx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdH0pXG5cdFx0aWYgKHRoaXMuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGhpcy5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzLiRlbC5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZFRvKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHByZXBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0aWYgKG5vZGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0bm9kZS5pbnNlcnRCZWZvcmUodGhpcywgbm9kZS5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRlbXB0eSgpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9ICcnXG5cdH0sXG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRzYWZlUmVtb3ZlKCkge1xuXHRcdHNhZmVab25lLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdG9uKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0eXBlcy5mb3JFYWNoKGkgPT4gdGhpcy5hZGRFdmVudExpc3RlbmVyKGksIGZuLCAhIXVzZUNhcHR1cmUpKVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRvZmYodHlwZSwgZm4sIHVzZUNhcHR1cmUpIHtcblx0XHRjb25zdCB0eXBlcyA9IHR5cGUuc3BsaXQoJyAnKVxuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHR5cGVzLmZvckVhY2goaSA9PiB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKGksIGZuLCAhIXVzZUNhcHR1cmUpKVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRfX2V2ZW50SGFuZGxlcl9fKGUpIHtcblx0XHRldnRIYW5kbGVyKGUsIHRoaXMuJC5saXN0ZW5lcnMpXG5cdH0sXG5cblx0YXQodHlwZSwgbm9kZSwgZm4pIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRlbHNlIG5vZGUgPSBub2RlLiQuJGVsXG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0eXBlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGlmIChpICE9PSAnJykge1xuXHRcdFx0XHRcdGlmICghdGhpcy4kLmxpc3RlbmVycykgdGhpcy4kLmxpc3RlbmVycyA9IHt9XG5cdFx0XHRcdFx0aWYgKCF0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXSkge1xuXHRcdFx0XHRcdFx0dGhpcy5hZGRFdmVudExpc3RlbmVyKGksIHRoaXMuJC5fX2V2ZW50SGFuZGxlcl9fLCB0cnVlKVxuXHRcdFx0XHRcdFx0dGhpcy4kLmxpc3RlbmVyc1tub2RlLiRpZF0gPSB7fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMuJC5saXN0ZW5lcnNbbm9kZS4kaWRdW2ldKSB0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXVtpXSA9IFtdXG5cdFx0XHRcdFx0dGhpcy4kLmxpc3RlbmVyc1tub2RlLiRpZF1baV0ucHVzaChmbilcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0dW4odHlwZSwgbm9kZSwgZm4pIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRlbHNlIG5vZGUgPSBub2RlLiQuJGVsXG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRpZiAodGhpcy4kLmxpc3RlbmVycyAmJiB0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXSkge1xuXHRcdFx0XHR0eXBlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGkgIT09ICcnICYmIHRoaXMuJC5saXN0ZW5lcnNbbm9kZS4kaWRdW2ldKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmbnMgPSB0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0Zm5zLnNwbGljZShmbnMuaW5kZXhPZihmbiksIDEpXG5cdFx0XHRcdFx0XHRpZiAodGhpcy4kLmxpc3RlbmVyc1tub2RlLiRpZF1baV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0XHRpZiAoKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqIGluIHRoaXMuJC5saXN0ZW5lcnMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLiQubGlzdGVuZXJzW2pdW2ldKSByZXR1cm4gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHRcdFx0fSkoKSkgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGksIHRoaXMuJC5fX2V2ZW50SGFuZGxlcl9fLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRpZiAoT2JqZWN0LmtleXModGhpcy4kLmxpc3RlbmVyc1tub2RlLiRpZF0pLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLiQubGlzdGVuZXJzW25vZGUuJGlkXVxuXHRcdFx0XHRcdFx0XHRcdGlmIChPYmplY3Qua2V5cyh0aGlzLiQubGlzdGVuZXJzKS5sZW5ndGggPT09IDApIGRlbGV0ZSB0aGlzLiQubGlzdGVuZXJzXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fSBlbHNlIHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9LFxuXG5cdHRyaWdnZXIoZXZlbnQsIGNvbmZpZykge1xuXHRcdGlmICh0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnKSBldmVudCA9IG5ldyBFdmVudChldmVudCwgY29uZmlnKVxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChldmVudClcblx0fVxuXG5cdC8vIGFuaW1hdGUobmFtZSkge1xuXHQvLyBcdHRoaXMuJC5hZGRDbGFzcyhgJHtuYW1lfS10cmFuc2ApXG5cdC8vIFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdC8vIFx0XHR0aGlzLiQuYWRkQ2xhc3MoYCR7bmFtZX0tc3RhcnRgKVxuXHQvLyBcdFx0dGhpcy4kLmFkZENsYXNzKGAke25hbWV9LWVuZGApXG5cdC8vIFx0fSwgMClcblx0Ly8gXHRyZXR1cm4gdGhpcy4kXG5cdC8vIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vZGVidWcuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9ub2RlLmpzJ1xuaW1wb3J0IHsgJG5vZGUgfSBmcm9tICcuLi9zaGFyZWQuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0YWRkQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLmFkZENsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0YXBwZW5kVG8obm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IG5vZGVzID0gW11cblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdG5vZGVzLnB1c2goaS4kZWwpXG5cdFx0fSlcblx0XHRub2RlTWV0aG9kcy5hcHBlbmQuY2FsbChub2RlLCAuLi5ub2Rlcylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHByZXBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0Y29uc3Qgbm9kZXMgPSBbXVxuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0bm9kZXMucHVzaChpLiRlbClcblx0XHR9KVxuXHRcdG5vZGVNZXRob2RzLnByZXBlbmQuY2FsbChub2RlLCAuLi5ub2Rlcylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS50b2dnbGVDbGFzcyhjbGFzc05hbWUpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdGVtcHR5KCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5lbXB0eSgpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHJlbW92ZSgpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkucmVtb3ZlKClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0c2FmZVJlbW92ZSgpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkuc2FmZVJlbW92ZSgpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdG9uKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkub24odHlwZSwgZm4sICEhdXNlQ2FwdHVyZSlcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gdGhpc1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0XHR9XG5cdH0sXG5cblx0b2ZmKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkub2ZmKHR5cGUsIGZuLCAhIXVzZUNhcHR1cmUpXG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdFx0fVxuXHR9LFxuXG5cdHRyaWdnZXIoZXZlbnQsIGNvbmZpZykge1xuXHRcdGlmICh0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnKSBldmVudCA9IG5ldyBFdmVudChldmVudCwgY29uZmlnKVxuXHRcdHRoaXMuZm9yRWFjaChpID0+IGkudHJpZ2dlcihldmVudCkpXG5cdH1cbn1cbiIsIi8qIGdsb2JhbCBWRVJTSU9OICovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHJlZ0ZuIGZyb20gJy4uL3JlZ2lzdGVyLmpzJ1xuaW1wb3J0IG5vZGVNZXRob2RzIGZyb20gJy4vbm9kZS5qcydcblxubGV0IHZlbG9jaXR5VXNlZCA9IGZhbHNlXG5cbmNvbnN0IHVzZVZlbG9jaXR5ID0gKHYpID0+IHtcblx0aWYgKHZlbG9jaXR5VXNlZCkgcmV0dXJuXG5cdHJlZ0ZuKCgpID0+IHtcblx0XHR2ZWxvY2l0eVVzZWQgPSB0cnVlXG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6ICdWZWxvY2l0eScsXG5cdFx0XHRub2RlOiB7XG5cdFx0XHRcdHZlbG9jaXR5KC4uLmFyZ3MpIHtcblx0XHRcdFx0XHR2KHRoaXMsIC4uLmFyZ3MpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bGlzdDoge1xuXHRcdFx0XHR2ZWxvY2l0eSguLi5hcmdzKSB7XG5cdFx0XHRcdFx0dGhpcy5mb3JFYWNoKGkgPT4gdihpLiRlbCwgLi4uYXJncykpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGF1dG9OYW1lU3BhY2U6IGZhbHNlXG5cdH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0dmVyc2lvbjogYEJseWRlIHYke1ZFUlNJT059YCxcblx0Zm46IHJlZ0ZuLFxuXHRxOiBub2RlTWV0aG9kcy5xLmJpbmQoZG9jdW1lbnQpLFxuXHRxYTogbm9kZU1ldGhvZHMucWEuYmluZChkb2N1bWVudCksXG5cdG9uOiBub2RlTWV0aG9kcy5vbi5iaW5kKHdpbmRvdyksXG5cdG9mZjogbm9kZU1ldGhvZHMub2ZmLmJpbmQod2luZG93KSxcblx0dXNlVmVsb2NpdHlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCByZWdGbiBmcm9tICcuL3JlZ2lzdGVyLmpzJ1xuaW1wb3J0IG5vZGVNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9ub2RlLmpzJ1xuaW1wb3J0IGxpc3RNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9saXN0LmpzJ1xuaW1wb3J0IGJseWRlTWV0aG9kcyBmcm9tICcuL21ldGhvZHMvYmx5ZGUuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4vc2hhcmVkLmpzJ1xuXG5yZWdGbigoKSA9PiB7XG5cdGNvbnN0IHBsdWdpbiA9IHtcblx0XHRuYW1lOiAnQmx5ZGUnLFxuXHRcdG5vZGU6IG5vZGVNZXRob2RzLFxuXHRcdGxpc3Q6IGxpc3RNZXRob2RzLFxuXHRcdGJseWRlOiBibHlkZU1ldGhvZHNcblx0fVxuXHRyZXR1cm4gcGx1Z2luXG59LCB7XG5cdGF1dG9OYW1lU3BhY2U6IGZhbHNlXG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsICckJywge1xuXHRnZXQoKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICckJywgeyB2YWx1ZTogbmV3ICRub2RlKHRoaXMpIH0pXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9XG59KVxuXG5leHBvcnQgZGVmYXVsdCBCbHlkZVxuIiwiLyogZ2xvYmFsIGRlZmluZSAqL1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCbHlkZSBmcm9tICcuL2xvYWRlci5qcydcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vZGVidWcuanMnXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IEJseWRlXG59IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRkZWZpbmUoKCkgPT4gQmx5ZGUpXG59IGVsc2Uge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnQmx5ZGUnLCB7IHZhbHVlOiBCbHlkZSB9KVxuXHRpZiAod2luZG93LiQpIGxvZyhgXCJ3aW5kb3cuJFwiIG1heSBoYXZlIGJlZW4gdGFrZW4gYnkgYW5vdGhlciBsaWJyYXJ5LCB1c2UgXCJ3aW5kb3cuQmx5ZGVcIiBmb3Igbm9uLWNvbmZsaWN0IHVzYWdlLmApXG5cdGVsc2UgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJyQnLCB7IHZhbHVlOiBCbHlkZSB9KVxufSJdLCJuYW1lcyI6WyJ0aGlzIiwibG9nIiwiYXJncyIsImxvZ2dpbmciLCJpbmZvIiwid2FybiIsImVycm9yIiwiRU5WIiwic2V0TGV2ZWwiLCJpbml0UXVlcnkiLCJsb2FkZWQiLCJCbHlkZSIsImZuIiwiY2FsbCIsIndpbmRvdyIsInB1c2giLCJpIiwiaW5pdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJWZWxvY2l0eSIsInVzZVZlbG9jaXR5IiwiZm9yRWFjaCIsIlZFUlNJT04iLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWFkeVN0YXRlIiwicmVxdWlyZSQkMCIsImlzT2JqZWN0IiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwiZFAiLCJnbG9iYWwiLCIkZXhwb3J0IiwiSU9iamVjdCIsInRvSW50ZWdlciIsIm1pbiIsInRvSU9iamVjdCIsImRlZmluZWQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNCIsIm1ldGhvZHMiLCIkbm9kZSIsIm5vZGUiLCIkZWwiLCJGdW5jdGlvbiIsImJpbmQiLCIkaWQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG93IiwidG9TdHJpbmciLCIkbm9kZUxpc3QiLCJsaXN0IiwiJGxpc3QiLCJsZW5ndGgiLCIkIiwicGx1Z2lucyIsInJlZ2lzdGVyIiwiY29uZmlnIiwibmFtZSIsImJseWRlIiwiYXV0b05hbWVTcGFjZSIsImZuTmFtZSIsInRha2VTbmFwc2hvdCIsIm1ldGhvZHNTaG90IiwicGx1Z2luU2hvdCIsInBsdWdpbiIsImNvcmUiLCJ0b09iamVjdCIsIiRrZXlzIiwiYW5PYmplY3QiLCJnZXRLZXlzIiwiZW51bUJ1Z0tleXMiLCJJRV9QUk9UTyIsIlBST1RPVFlQRSIsImhhcyIsImNyZWF0ZSIsInNldFRvU3RyaW5nVGFnIiwicmVxdWlyZSQkOSIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ3IiwiaGlkZSIsInJlcXVpcmUkJDYiLCJJdGVyYXRvcnMiLCJJVEVSQVRPUiIsImNyZWF0ZURlc2MiLCJjb2YiLCJUQUciLCJjdHgiLCJ0b0xlbmd0aCIsImdldCIsInNhZmVab25lIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImV2dEhhbmRsZXIiLCJlIiwibGlzdGVuZXJzIiwidGFyZ2V0IiwicGF0aCIsInR5cGUiLCJzZWxlY3RvciIsIk5vZGUiLCJxdWVyeVNlbGVjdG9yIiwiTm9kZUxpc3QiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2xhc3NOYW1lIiwiY2xhc3NlcyIsInNwbGl0IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiY2xhc3NBcnIiLCJjbGFzc0luZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImpvaW4iLCJ0cmltIiwicGFyZW50IiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsInRoaXNQYXJlbnQiLCJub2RlUGFyZW50IiwidGhpc1NpYmxpbmciLCJuZXh0U2libGluZyIsIm5vZGVTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwiZXJyTm9kZXMiLCJ0ZW1wRnJhZ21lbnQiLCJub2RlcyIsInJldmVyc2UiLCJhcHBlbmRDaGlsZCIsImFwcGVuZCIsIm5vZGVUeXBlIiwiZmlyc3RDaGlsZCIsImlubmVySFRNTCIsInJlbW92ZUNoaWxkIiwidXNlQ2FwdHVyZSIsInR5cGVzIiwiX19ldmVudEhhbmRsZXJfXyIsImZucyIsImoiLCJldmVudCIsIkV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImVtcHR5Iiwic2FmZVJlbW92ZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJwcmVwZW5kIiwidG9nZ2xlQ2xhc3MiLCJvbiIsIm9mZiIsInRyaWdnZXIiLCJ2ZWxvY2l0eVVzZWQiLCJ2IiwicmVnRm4iLCJub2RlTWV0aG9kcyIsInEiLCJxYSIsImxpc3RNZXRob2RzIiwiYmx5ZGVNZXRob2RzIiwicHJvdG90eXBlIiwibW9kdWxlIiwiZXhwb3J0cyIsImRlZmluZSIsImFtZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLENBQUMsVUFBVSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ3pCLFlBQVksQ0FBQztJQUNiLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3RCLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUNyRCxjQUFjLEdBQUcsVUFBVSxFQUFFLENBQUM7S0FDakMsTUFBTTtRQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxFQUFFLENBQUM7S0FDM0I7Q0FDSixDQUFDQSxjQUFJLEVBQUUsWUFBWTtJQUNoQixZQUFZLENBQUM7SUFDYixJQUFJLElBQUksR0FBRyxXQUFXLEVBQUUsQ0FBQztJQUN6QixJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUM7O0lBRWhDLFNBQVMsVUFBVSxDQUFDLFVBQVUsRUFBRTtRQUM1QixJQUFJLE9BQU8sT0FBTyxLQUFLLGFBQWEsRUFBRTtZQUNs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
