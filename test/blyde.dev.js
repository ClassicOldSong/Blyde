(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var toString$1 = {}.toString;

var _cof = function(it){
  return toString$1.call(it).slice(8, -1);
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
	var _console;

	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return (_console = console).log.apply(_console, ['[Blyde]'].concat(args));
};
var info = function info() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return loglevel.info.apply(loglevel, ['[Blyde]'].concat(args));
};
var warn = function warn() {
	for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		args[_key3] = arguments[_key3];
	}

	return loglevel.warn.apply(loglevel, ['[Blyde]'].concat(args));
};
var error = function error() {
	for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
		args[_key4] = arguments[_key4];
	}

	return loglevel.error.apply(loglevel, ['[Blyde]'].concat(args));
};

{
	loglevel.setLevel('trace');
	info('Debug logging enabled!');
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
		warn(fn, 'is not a function!');
	}
};

function _ref$1(i) {
	return i.call(window);
}

var init = function init() {
	document.removeEventListener('DOMContentLoaded', init, false);
	if (window.Velocity) Blyde$1.useVelocity(window.Velocity);
	loaded = true;
	initQuery.forEach(_ref$1);
	info('Blyde v' + "0.1.0-alpha.20.dev.9cd953d" + ' initlized!');
};

document.addEventListener('DOMContentLoaded', init, false);
if (document.readyState === "interactive" || document.readyState === "complete") init();

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
			if (config.autoNameSpace === 'keep') info('$node property "' + i + '" has been kept.');else {
				var fnName = i;
				if (config.autoNameSpace === 'rename') {
					fnName = name + i;
					info('$node property "' + i + '" has been renamed to "' + fnName + '".');
				} else {
					warn('$node property "' + i + '" in "' + name + '" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.');
				}
				methods.node[fnName] = node[i];
			}
		} else methods.node[i] = node[i];
	}
	for (var _i in list) {
		if (methods.list[_i]) {
			if (config.autoNameSpace === 'keep') info('$nodeList property "' + _i + '" has been kept.');else {
				var _fnName = _i;
				if (config.autoNameSpace === 'rename') {
					_fnName = name + _i;
					info('$nodeList property "' + _i + '" has been renamed to "' + _fnName + '".');
				} else {
					warn('$nodeList property "' + _i + '" in "' + name + '" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.');
				}
				methods.list[_fnName] = list[_i];
			}
		} else methods.list[_i] = list[_i];
	}
	for (var _i2 in blyde) {
		if (methods.blyde[_i2]) {
			if (config.autoNameSpace === 'keep') info('Blyde property "' + _i2 + '" has been kept.');else {
				var _fnName2 = _i2;
				if (config.autoNameSpace === 'rename') {
					_fnName2 = name + _i2;
					info('Blyde property "' + _i2 + '" has been renamed to "' + _fnName2 + '".');
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
	info('Plugin "' + name + '" loaded.');
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
		version: 'Blyde v' + "0.1.0-alpha.20.dev.9cd953d",
		methods: methodsShot,
		plugins: pluginShot,
		$node: $node,
		$nodeList: $nodeList,
		log: log,
		info: info,
		warn: warn,
		error: error
	};
};

var regFn = (function (plugin) {
	var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	register(plugin(takeSnapshot), config);
});

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
var toObject$1    = _toObject;
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = toObject$1(O);
  if(has$3(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var LIBRARY        = _library;
var $export$2        = _export;
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
    } else $export$2($export$2.P + $export$2.F * (BUGGY || VALUES_BUG), NAME, methods);
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
var $export$3        = _export;
var toObject$2       = _toObject;
var call           = _iterCall;
var isArrayIter    = _isArrayIter;
var toLength$1       = _toLength;
var createProperty = _createProperty;
var getIterFn      = core_getIteratorMethod;

$export$3($export$3.S + $export$3.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject$2(arrayLike)
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

var safeZone = document.createDocumentFragment();

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

		function _ref() {
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

			_ref();
		} else {
			error(this, 'may not have been attached to document properly.');
		}
		return this.$;
	},
	after: function after() {
		var _arguments2 = arguments,
		    _this2 = this;

		function _ref2() {
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

			_ref2();
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
		} else warn(fn, 'is not a function!');
	},
	at: function at(type, fn) {
		function _ref5(i) {
			i.at(type, fn);
		}

		if (typeof fn === 'function') {
			this.forEach(_ref5);
			return this;
		} else warn(fn, 'is not a function!');
	},
	off: function off(type, fn, useCapture) {
		function _ref6(i) {
			i.off(type, fn, !!useCapture);
		}

		if (typeof fn === 'function') {
			this.forEach(_ref6);
			return this;
		} else warn(fn, 'is not a function!');
	},
	trigger: function trigger(event, config) {
		if (typeof event === 'string') event = new Event(event, config);
		this.forEach(function (i) {
			return i.trigger(event);
		});
	}
};

// most Object methods by ES6 should accept primitives
var $export$4 = _export;
var core$1    = _core;
var fails   = _fails;
var _objectSap = function(KEY, exec){
  var fn  = (core$1.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export$4($export$4.S + $export$4.F * fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)
var toObject$3 = _toObject;
var $keys$1    = _objectKeys;

_objectSap('keys', function(){
  return function keys(it){
    return $keys$1(toObject$3(it));
  };
});

var keys$2 = _core.Object.keys;

var keys$1 = createCommonjsModule(function (module) {
module.exports = { "default": keys$2, __esModule: true };
});

var _Object$keys = unwrapExports(keys$1);

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

var f$3 = _wks;

var _wksExt = {
	f: f$3
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

var _meta = createCommonjsModule(function (module) {
var META     = _uid('meta')
  , isObject = _isObject
  , has      = _has
  , setDesc  = _objectDp.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_fails(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var global$5         = _global;
var core$2           = _core;
var LIBRARY$1        = _library;
var wksExt$1         = _wksExt;
var defineProperty$1 = _objectDp.f;
var _wksDefine = function(name){
  var $Symbol = core$2.Symbol || (core$2.Symbol = LIBRARY$1 ? {} : global$5.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty$1($Symbol, name, {value: wksExt$1.f(name)});
};

var getKeys$2   = _objectKeys;
var toIObject$4 = _toIobject;
var _keyof = function(object, el){
  var O      = toIObject$4(object)
    , keys   = getKeys$2(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

// all enumerable object keys, includes symbols
var getKeys$3 = _objectKeys;
var gOPS$1    = _objectGops;
var pIE$1     = _objectPie;
var _enumKeys = function(it){
  var result     = getKeys$3(it)
    , getSymbols = gOPS$1.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE$1.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)
var cof$2 = _cof;
var _isArray = Array.isArray || function isArray(arg){
  return cof$2(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys$3      = _objectKeysInternal;
var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys$3(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject$5 = _toIobject;
var gOPN$1      = _objectGopn.f;
var toString$2  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN$1(it);
  } catch(e){
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it){
  return windowNames && toString$2.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$5(it));
};

var _objectGopnExt = {
	f: f$4
};

var pIE$2            = _objectPie;
var createDesc$3     = _propertyDesc;
var toIObject$6      = _toIobject;
var toPrimitive$2    = _toPrimitive;
var has$5            = _has;
var IE8_DOM_DEFINE$1 = _ie8DomDefine;
var gOPD$1           = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
  O = toIObject$6(O);
  P = toPrimitive$2(P, true);
  if(IE8_DOM_DEFINE$1)try {
    return gOPD$1(O, P);
  } catch(e){ /* empty */ }
  if(has$5(O, P))return createDesc$3(!pIE$2.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

// ECMAScript 6 symbols shim
var global$4         = _global;
var has$4            = _has;
var DESCRIPTORS    = _descriptors;
var $export$5        = _export;
var redefine$1       = _redefine;
var META           = _meta.KEY;
var $fails         = _fails;
var shared$1         = _shared;
var setToStringTag$2 = _setToStringTag;
var uid$1            = _uid;
var wks            = _wks;
var wksExt         = _wksExt;
var wksDefine      = _wksDefine;
var keyOf          = _keyof;
var enumKeys       = _enumKeys;
var isArray$1        = _isArray;
var anObject$4       = _anObject;
var toIObject$3      = _toIobject;
var toPrimitive$1    = _toPrimitive;
var createDesc$2     = _propertyDesc;
var _create        = _objectCreate;
var gOPNExt        = _objectGopnExt;
var $GOPD          = _objectGopd;
var $DP            = _objectDp;
var $keys$2          = _objectKeys;
var gOPD           = $GOPD.f;
var dP$3             = $DP.f;
var gOPN           = gOPNExt.f;
var $Symbol        = global$4.Symbol;
var $JSON          = global$4.JSON;
var _stringify     = $JSON && $JSON.stringify;
var PROTOTYPE$2      = 'prototype';
var HIDDEN         = wks('_hidden');
var TO_PRIMITIVE   = wks('toPrimitive');
var isEnum         = {}.propertyIsEnumerable;
var SymbolRegistry = shared$1('symbol-registry');
var AllSymbols     = shared$1('symbols');
var OPSymbols      = shared$1('op-symbols');
var ObjectProto$1    = Object[PROTOTYPE$2];
var USE_NATIVE     = typeof $Symbol == 'function';
var QObject        = global$4.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP$3({}, 'a', {
    get: function(){ return dP$3(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto$1, key);
  if(protoDesc)delete ObjectProto$1[key];
  dP$3(it, key, D);
  if(protoDesc && it !== ObjectProto$1)dP$3(ObjectProto$1, key, protoDesc);
} : dP$3;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty$1 = function defineProperty(it, key, D){
  if(it === ObjectProto$1)$defineProperty$1(OPSymbols, key, D);
  anObject$4(it);
  key = toPrimitive$1(key, true);
  anObject$4(D);
  if(has$4(AllSymbols, key)){
    if(!D.enumerable){
      if(!has$4(it, HIDDEN))dP$3(it, HIDDEN, createDesc$2(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has$4(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc$2(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP$3(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject$4(it);
  var keys = enumKeys(P = toIObject$3(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty$1(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive$1(key, true));
  if(this === ObjectProto$1 && has$4(AllSymbols, key) && !has$4(OPSymbols, key))return false;
  return E || !has$4(this, key) || !has$4(AllSymbols, key) || has$4(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject$3(it);
  key = toPrimitive$1(key, true);
  if(it === ObjectProto$1 && has$4(AllSymbols, key) && !has$4(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has$4(AllSymbols, key) && !(has$4(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject$3(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has$4(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto$1
    , names  = gOPN(IS_OP ? OPSymbols : toIObject$3(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has$4(AllSymbols, key = names[i++]) && (IS_OP ? has$4(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid$1(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto$1)$set.call(OPSymbols, value);
      if(has$4(this, HIDDEN) && has$4(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc$2(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine$1($Symbol[PROTOTYPE$2], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty$1;
  _objectGopn.f = gOPNExt.f = $getOwnPropertyNames;
  _objectPie.f  = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_library){
    redefine$1(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  };
}

$export$5($export$5.G + $export$5.W + $export$5.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i$1 = 0; symbols.length > i$1; )wks(symbols[i$1++]);

for(var symbols = $keys$2(wks.store), i$1 = 0; symbols.length > i$1; )wksDefine(symbols[i$1++]);

$export$5($export$5.S + $export$5.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has$4(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export$5($export$5.S + $export$5.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty$1,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export$5($export$5.S + $export$5.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray$1(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag$2($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag$2(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag$2(global$4.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var index = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": index, __esModule: true };
});

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _iterator = iterator;

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = symbol;

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

var anObject$5 = _anObject;
var get$1      = core_getIteratorMethod;
var core_getIterator = _core.getIterator = function(it){
  var iterFn = get$1(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject$5(iterFn.call(it));
};

var getIterator$1 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$1, __esModule: true };
});

var _getIterator = unwrapExports(getIterator);

var listeners = {};
var eventHandler = function eventHandler(e) {
	var _this = this;

	var targets = [];
	e.path.forEach(function (i) {
		if (listeners[_this.$id][i.$id]) targets.push(i);
	});
	if (targets.length === 0) return;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	function _ref2() {
		var i = _step.value;

		function _ref(j) {
			if (j.call(i, e) === false) ifBreak = true;
		}

		if (listeners[_this.$id][i.$id][e.type]) {
			var ifBreak = false;
			listeners[_this.$id][i.$id][e.type].forEach(_ref);
			if (ifBreak) return {
					v: void 0
				};
		}
	}

	try {
		var _loop = _ref2;
		for (var _iterator = _getIterator(targets), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ret = _loop();

			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
};

var handlers = {
	on: function on(type, fn) {
		var _this2 = this;

		var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				return _this2.addEventListener(i, fn, useCapture);
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	listen: function listen(type, node, fn) {
		var _this3 = this;

		if (node instanceof $node) node = node.$el;else node = node.$.$el;
		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				if (i !== '') {
					if (!listeners[_this3.$id]) listeners[_this3.$id] = {};
					if (!listeners[_this3.$id][node.$id]) {
						_this3.addEventListener(i, eventHandler, true);
						listeners[_this3.$id][node.$id] = {};
					}
					if (!listeners[_this3.$id][node.$id][i]) listeners[_this3.$id][node.$id][i] = [];
					listeners[_this3.$id][node.$id][i].push(fn);
				}
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	at: function at(type, fn) {
		handlers.listen.call(window, type, this, fn);
		return this.$;
	},
	drop: function drop(type, node, fn) {
		var _this4 = this;

		if (node instanceof $node) node = node.$el;else node = node.$.$el;
		var types = type.split(' ');
		if (typeof fn === 'function') {
			if (listeners[this.$id] && listeners[this.$id][node.$id]) {
				types.forEach(function (i) {
					if (i !== '' && listeners[_this4.$id][node.$id][i]) {
						var fns = listeners[_this4.$id][node.$id][i];
						fns.splice(fns.indexOf(fn), 1);
						if (listeners[_this4.$id][node.$id][i].length === 0) {
							delete listeners[_this4.$id][node.$id][i];
							if (function () {
								for (var j in listeners[_this4.$id]) {
									if (listeners[_this4.$id][j][i]) return false;
								}
								return true;
							}()) _this4.removeEventListener(i, eventHandler, true);
							if (_Object$keys(listeners[_this4.$id][node.$id]).length === 0) {
								delete listeners[_this4.$id][node.$id];
								if (_Object$keys(listeners[_this4.$id]).length === 0) delete listeners[_this4.$id];
							}
						}
					}
				});
			}
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	off: function off(type, fn) {
		var _this5 = this;

		var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		var types = type.split(' ');
		if (typeof fn === 'function') {
			types.forEach(function (i) {
				_this5.removeEventListener(i, fn, useCapture);
				handlers.drop.call(window, i, _this5, fn);
			});
			return this.$;
		} else warn(fn, 'is not a function!');
	},
	trigger: function trigger(event, config) {
		if (typeof event === 'string') event = new Event(event, config);
		this.dispatchEvent(event);
		return this.$;
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
	version: 'Blyde v' + "0.1.0-alpha.20.dev.9cd953d",
	fn: regFn,
	q: nodeMethods.q.bind(document),
	qa: nodeMethods.qa.bind(document),
	on: function on() {
		var _eventHandlers$on;

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		(_eventHandlers$on = handlers.on).call.apply(_eventHandlers$on, [window].concat(args));
		return this;
	},
	listen: function listen() {
		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		handlers.listencall.apply(handlers, [window].concat(args));
		return this;
	},
	at: function at() {
		var _eventHandlers$at;

		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		(_eventHandlers$at = handlers.at).call.apply(_eventHandlers$at, [window].concat(args));
		return this;
	},
	drop: function drop() {
		var _eventHandlers$drop;

		for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		(_eventHandlers$drop = handlers.drop).call.apply(_eventHandlers$drop, [window].concat(args));
		return this;
	},
	off: function off() {
		var _eventHandlers$off;

		for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
			args[_key7] = arguments[_key7];
		}

		(_eventHandlers$off = handlers.off).call.apply(_eventHandlers$off, [window].concat(args));
		return this;
	},
	trigger: function trigger() {
		var _eventHandlers$trigge;

		for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
			args[_key8] = arguments[_key8];
		}

		(_eventHandlers$trigge = handlers.trigger).call.apply(_eventHandlers$trigge, [window].concat(args));
		return this;
	},

	useVelocity: useVelocity
};

regFn(function () {
	var plugin = {
		name: 'Blyde',
		node: _Object$assign(nodeMethods, handlers),
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
	if (window.$) warn('"window.$" may have been taken by another library, use "window.Blyde" for non-conflict usage.');else Object.defineProperty(window, '$', { value: Blyde$1 });
}

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwiLi4vc3JjL2RlYnVnLmpzIiwiLi4vc3JjL2JseWRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL3NyYy9zaGFyZWQuanMiLCIuLi9zcmMvcmVnaXN0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3JlYXRlLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vc3JjL21ldGhvZHMvbm9kZS5qcyIsIi4uL3NyYy9tZXRob2RzL2xpc3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fa2V5b2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi1leHQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvZ2V0LWl0ZXJhdG9yLmpzIiwiLi4vc3JjL21ldGhvZHMvZXZlbnQuanMiLCIuLi9zcmMvbWV0aG9kcy9ibHlkZS5qcyIsIi4uL3NyYy9sb2FkZXIuanMiLCIuLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnblwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgQVBJXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogUGFja2FnZS1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBsb2dnaW5nIGZyb20gJ2xvZ2xldmVsJ1xuY29uc3QgbG9nID0gKC4uLmFyZ3MpID0+IGNvbnNvbGUubG9nKCdbQmx5ZGVdJywgLi4uYXJncylcbmNvbnN0IGluZm8gPSAoLi4uYXJncykgPT4gbG9nZ2luZy5pbmZvKCdbQmx5ZGVdJywgLi4uYXJncylcbmNvbnN0IHdhcm4gPSAoLi4uYXJncykgPT4gbG9nZ2luZy53YXJuKCdbQmx5ZGVdJywgLi4uYXJncylcbmNvbnN0IGVycm9yID0gKC4uLmFyZ3MpID0+IGxvZ2dpbmcuZXJyb3IoJ1tCbHlkZV0nLCAuLi5hcmdzKVxuXG5pZiAoRU5WID09PSAncHJvZHVjdGlvbicpIHtcblx0bG9nZ2luZy5zZXRMZXZlbCgnZXJyb3InKVxufSBlbHNlIHtcblx0bG9nZ2luZy5zZXRMZXZlbCgndHJhY2UnKVxuXHRpbmZvKCdEZWJ1ZyBsb2dnaW5nIGVuYWJsZWQhJylcbn1cblxuZXhwb3J0IHsgbG9nLCBpbmZvLCB3YXJuLCBlcnJvciB9XG4iLCIvKiBnbG9iYWwgVkVSU0lPTiAqL1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGluZm8sIHdhcm4gfSBmcm9tICcuL2RlYnVnLmpzJ1xuXG5jb25zdCBpbml0UXVlcnkgPSBbXVxubGV0IGxvYWRlZCA9IGZhbHNlXG5cbmNvbnN0IEJseWRlID0gKGZuKSA9PiB7XG5cdGlmICh0eXBlb2YoZm4pID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0aWYgKGxvYWRlZCkge1xuXHRcdFx0Zm4uY2FsbCh3aW5kb3cpXG5cdFx0fSBlbHNlIHtcblx0XHRcdGluaXRRdWVyeS5wdXNoKGZuKVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fVxufVxuXG5jb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0LCBmYWxzZSlcblx0aWYgKHdpbmRvdy5WZWxvY2l0eSkgQmx5ZGUudXNlVmVsb2NpdHkod2luZG93LlZlbG9jaXR5KVxuXHRsb2FkZWQgPSB0cnVlXG5cdGluaXRRdWVyeS5mb3JFYWNoKGkgPT4gaS5jYWxsKHdpbmRvdykpXG5cdGluZm8oYEJseWRlIHYke1ZFUlNJT059IGluaXRsaXplZCFgKVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCwgZmFsc2UpXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikgaW5pdCgpXG5cbmV4cG9ydCBkZWZhdWx0IEJseWRlXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IG1ldGhvZHMgPSB7XG5cdG5vZGU6IHt9LFxuXHRsaXN0OiB7fSxcblx0Ymx5ZGU6IHt9XG59XG5cbmNvbnN0ICRub2RlID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3Rvcihub2RlKSB7XG5cdFx0dGhpcy4kZWwgPSBub2RlXG5cdFx0Zm9yIChsZXQgaSBpbiBtZXRob2RzLm5vZGUpIHtcblx0XHRcdGlmIChtZXRob2RzLm5vZGVbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbikgdGhpc1tpXSA9IG1ldGhvZHMubm9kZVtpXS5iaW5kKG5vZGUpXG5cdFx0XHRlbHNlIHRoaXNbaV0gPSBtZXRob2RzLm5vZGVbaV1cblx0XHR9XG5cdFx0aWYgKCFub2RlLiRpZCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsICckaWQnLCB7dmFsdWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDEwLCAxNikpLnRvU3RyaW5nKDM2KX0pXG5cdH1cbn1cbmNvbnN0ICRub2RlTGlzdCA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IobGlzdCkge1xuXHRcdHRoaXMuJGxpc3QgPSBbXVxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykgdGhpcy4kbGlzdC5wdXNoKGxpc3RbaV0uJClcblx0XHRmb3IgKGxldCBpIGluIG1ldGhvZHMubGlzdCkge1xuXHRcdFx0aWYgKG1ldGhvZHMubGlzdFtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB0aGlzW2ldID0gbWV0aG9kcy5saXN0W2ldLmJpbmQodGhpcy4kbGlzdClcblx0XHRcdGVsc2UgdGhpc1tpXSA9IG1ldGhvZHMubm9kZVtpXVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgeyBtZXRob2RzLCAkbm9kZSwgJG5vZGVMaXN0IH1cbiIsIi8qIGdsb2JhbCBWRVJTSU9OICovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgbG9nLCBpbmZvLCB3YXJuLCBlcnJvciB9IGZyb20gJy4vZGVidWcuanMnXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCB7IG1ldGhvZHMsICRub2RlLCAkbm9kZUxpc3QgfSBmcm9tICcuL3NoYXJlZC5qcydcblxuY29uc3QgcGx1Z2lucyA9IHt9XG5cbmNvbnN0IHJlZ2lzdGVyID0gKHtuYW1lLCBub2RlLCBsaXN0LCBibHlkZX0sIGNvbmZpZykgPT4ge1xuXHRpZiAoIW5hbWUpIHtcblx0XHRlcnJvcignUGx1Z2luIG5hbWUgbm90IHByZWNlbnQhIFJlZ2lzdHJhdGlvbiBhYm9ydGVkLicpXG5cdFx0cmV0dXJuXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBub2RlKSB7XG5cdFx0aWYgKG1ldGhvZHMubm9kZVtpXSkge1xuXHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAna2VlcCcpIGluZm8oYCRub2RlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIGtlcHQuYClcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgZm5OYW1lID0gaVxuXHRcdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdyZW5hbWUnKSB7XG5cdFx0XHRcdFx0Zm5OYW1lID0gbmFtZSArIGlcblx0XHRcdFx0XHRpbmZvKGAkbm9kZSBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiByZW5hbWVkIHRvIFwiJHtmbk5hbWV9XCIuYClcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3YXJuKGAkbm9kZSBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwiY29uZmlnLmF1dG9OYW1lU3BhY2VcIiB0byBcInJlbmFtZVwiIHRvIGtlZXAgYm90aC5gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1ldGhvZHMubm9kZVtmbk5hbWVdID0gbm9kZVtpXVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBtZXRob2RzLm5vZGVbaV0gPSBub2RlW2ldXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBsaXN0KSB7XG5cdFx0aWYgKG1ldGhvZHMubGlzdFtpXSkge1xuXHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAna2VlcCcpIGluZm8oYCRub2RlTGlzdCBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiBrZXB0LmApXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IGZuTmFtZSA9IGlcblx0XHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAncmVuYW1lJykge1xuXHRcdFx0XHRcdGZuTmFtZSA9IG5hbWUgKyBpXG5cdFx0XHRcdFx0aW5mbyhgJG5vZGVMaXN0IHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYCRub2RlTGlzdCBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwiY29uZmlnLmF1dG9OYW1lU3BhY2VcIiB0byBcInJlbmFtZVwiIHRvIGtlZXAgYm90aC5gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG1ldGhvZHMubGlzdFtmbk5hbWVdID0gbGlzdFtpXVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBtZXRob2RzLmxpc3RbaV0gPSBsaXN0W2ldXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBibHlkZSkge1xuXHRcdGlmIChtZXRob2RzLmJseWRlW2ldKSB7XG5cdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdrZWVwJykgaW5mbyhgQmx5ZGUgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4ga2VwdC5gKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCBmbk5hbWUgPSBpXG5cdFx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ3JlbmFtZScpIHtcblx0XHRcdFx0XHRmbk5hbWUgPSBuYW1lICsgaVxuXHRcdFx0XHRcdGluZm8oYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGluIFwiJHtuYW1lfVwiIGhhcyByZXBsYWNlZCB0aGUgb3JpZ2luYWwgb25lLCBzZXQgXCJjb25maWcuYXV0b05hbWVTcGFjZVwiIHRvIFwicmVuYW1lXCIgdG8ga2VlcCBib3RoLmApXG5cdFx0XHRcdH1cblx0XHRcdFx0bWV0aG9kcy5ibHlkZVtmbk5hbWVdID0gYmx5ZGVbaV1cblx0XHRcdFx0Qmx5ZGVbZm5OYW1lXSA9IGJseWRlW2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1ldGhvZHMuYmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdFx0Qmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdH1cblx0fVxuXHRwbHVnaW5zW25hbWVdID0geyBub2RlLCBsaXN0LCBibHlkZSB9XG5cdGluZm8oYFBsdWdpbiBcIiR7bmFtZX1cIiBsb2FkZWQuYClcbn1cblxuY29uc3QgdGFrZVNuYXBzaG90ID0gKCkgPT4ge1xuXHRjb25zdCBtZXRob2RzU2hvdCA9IHtcblx0XHRub2RlOiBPYmplY3QuYXNzaWduKHt9LCBtZXRob2RzLm5vZGUpLFxuXHRcdGxpc3Q6IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMubGlzdCksXG5cdFx0Ymx5ZGU6IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMuYmx5ZGUpXG5cdH1cblx0Y29uc3QgcGx1Z2luU2hvdCA9IHt9XG5cdGZvciAobGV0IGkgaW4gcGx1Z2lucykge1xuXHRcdHBsdWdpblNob3RbaV0gPSB7XG5cdFx0XHRub2RlOiBPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5zW2ldLm5vZGUpLFxuXHRcdFx0bGlzdDogT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luc1tpXS5saXN0KSxcblx0XHRcdGJseWRlOiBPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5zW2ldLmJseWRlKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge1xuXHRcdHZlcnNpb246IGBCbHlkZSB2JHtWRVJTSU9OfWAsXG5cdFx0bWV0aG9kczogbWV0aG9kc1Nob3QsXG5cdFx0cGx1Z2luczogcGx1Z2luU2hvdCxcblx0XHQkbm9kZSxcblx0XHQkbm9kZUxpc3QsXG5cdFx0bG9nLFxuXHRcdGluZm8sXG5cdFx0d2Fybixcblx0XHRlcnJvclxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW4sIGNvbmZpZyA9IHt9KSA9PiB7XG5cdHJlZ2lzdGVyKHBsdWdpbih0YWtlU25hcHNob3QpLCBjb25maWcpXG59XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyAgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgaW5kZXgsIHZhbHVlKXtcbiAgaWYoaW5kZXggaW4gb2JqZWN0KSRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCB0b09iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgY2FsbCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgdG9MZW5ndGggICAgICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5JylcbiAgLCBnZXRJdGVyRm4gICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XG4gICAgdmFyIE8gICAgICAgPSB0b09iamVjdChhcnJheUxpa2UpXG4gICAgICAsIEMgICAgICAgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5XG4gICAgICAsIGFMZW4gICAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIG1hcGZuICAgPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBpbmRleCAgID0gMFxuICAgICAgLCBpdGVyRm4gID0gZ2V0SXRlckZuKE8pXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZihtYXBwaW5nKW1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpe1xuICAgICAgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvcihyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb21cIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9mcm9tID0gcmVxdWlyZShcIi4uL2NvcmUtanMvYXJyYXkvZnJvbVwiKTtcblxudmFyIF9mcm9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Zyb20pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIyW2ldID0gYXJyW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAoMCwgX2Zyb20yLmRlZmF1bHQpKGFycik7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IHdhcm4sIGVycm9yIH0gZnJvbSAnLi4vZGVidWcuanMnXG5pbXBvcnQgeyAkbm9kZSwgJG5vZGVMaXN0IH0gZnJvbSAnLi4vc2hhcmVkLmpzJ1xuXG5jb25zdCBzYWZlWm9uZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdHEoc2VsZWN0b3IpIHtcblx0XHRpZiAoIShzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGUpKSB7XG5cdFx0XHRzZWxlY3RvciA9IHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcblx0XHR9XG5cdFx0aWYgKHNlbGVjdG9yKSByZXR1cm4gc2VsZWN0b3IuJFxuXHR9LFxuXG5cdHFhKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZUxpc3QpIHJldHVybiBuZXcgJG5vZGVMaXN0KHNlbGVjdG9yKVxuXHRcdHJldHVybiBuZXcgJG5vZGVMaXN0KHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG5cdH0sXG5cblx0YWRkQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0Y29uc3QgY2xhc3NlcyA9IGNsYXNzTmFtZS5zcGxpdCgnICcpXG5cdFx0dGhpcy5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHJlbW92ZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBjbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdHRoaXMuY2xhc3NMaXN0LnJlbW92ZSguLi5jbGFzc2VzKVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHR0b2dnbGVDbGFzcyhjbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gY2xhc3NOYW1lLnNwbGl0KCcgJylcblx0XHRjb25zdCBjbGFzc0FyciA9IHRoaXMuY2xhc3NOYW1lLnNwbGl0KCcgJylcblx0XHRjbGFzc2VzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGNvbnN0IGNsYXNzSW5kZXggPSBjbGFzc0Fyci5pbmRleE9mKGkpXG5cdFx0XHRpZiAoY2xhc3NJbmRleCA+IC0xKSB7XG5cdFx0XHRcdGNsYXNzQXJyLnNwbGljZShjbGFzc0luZGV4LCAxKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xhc3NBcnIucHVzaChpKVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0dGhpcy5jbGFzc05hbWUgPSBjbGFzc0Fyci5qb2luKCcgJykudHJpbSgpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHJlcGxhY2VXaXRoKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGVcblx0XHRpZiAocGFyZW50KSB7XG5cdFx0XHRwYXJlbnQucmVwbGFjZUNoaWxkKG5vZGUsIHRoaXMpXG5cdFx0XHRyZXR1cm4gbm9kZS4kXG5cdFx0fSBlbHNlIHtcblx0XHRcdGVycm9yKHRoaXMsICdtYXkgbm90IGhhdmUgYmVlbiBhdHRhY2hlZCB0byBkb2N1bWVudCBwcm9wZXJseS4nKVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH1cblx0fSxcblxuXHRzd2FwKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRjb25zdCB0aGlzUGFyZW50ID0gdGhpcy5wYXJlbnROb2RlXG5cdFx0Y29uc3Qgbm9kZVBhcmVudCA9IG5vZGUucGFyZW50Tm9kZVxuXHRcdGNvbnN0IHRoaXNTaWJsaW5nID0gdGhpcy5uZXh0U2libGluZ1xuXHRcdGNvbnN0IG5vZGVTaWJsaW5nID0gbm9kZS5uZXh0U2libGluZ1xuXHRcdGlmICh0aGlzUGFyZW50ICYmIG5vZGVQYXJlbnQpIHtcblx0XHRcdHRoaXNQYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHRoaXNTaWJsaW5nKVxuXHRcdFx0bm9kZVBhcmVudC5pbnNlcnRCZWZvcmUodGhpcywgbm9kZVNpYmxpbmcpXG5cdFx0XHRyZXR1cm4gbm9kZS4kXG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBlcnJOb2RlcyA9IFtdXG5cdFx0XHRpZiAodGhpc1BhcmVudCA9PT0gbnVsbCkge1xuXHRcdFx0XHRlcnJOb2Rlcy5wdXNoKHRoaXMpXG5cdFx0XHR9XG5cdFx0XHRpZiAobm9kZVBhcmVudCA9PT0gbnVsbCkge1xuXHRcdFx0XHRlcnJOb2Rlcy5wdXNoKG5vZGUpXG5cdFx0XHR9XG5cdFx0XHRlcnJvciguLi5lcnJOb2RlcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fVxuXHR9LFxuXG5cdGJlZm9yZSguLi5ub2Rlcykge1xuXHRcdGlmICh0aGlzLnBhcmVudE5vZGUpIHtcblx0XHRcdGNvbnN0IHRlbXBGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdFx0bm9kZXMucmV2ZXJzZSgpXG5cdFx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0XHR0ZW1wRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaSlcblx0XHRcdH0pXG5cdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBGcmFnbWVudCwgdGhpcylcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IodGhpcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRhZnRlciguLi5ub2Rlcykge1xuXHRcdGlmICh0aGlzLnBhcmVudE5vZGUpIHtcblx0XHRcdGNvbnN0IHRlbXBGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdFx0bm9kZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpZiAoaSBpbnN0YW5jZW9mICRub2RlKSBpID0gaS4kZWxcblx0XHRcdFx0dGVtcEZyYWdtZW50LmFwcGVuZENoaWxkKGkpXG5cdFx0XHR9KVxuXHRcdFx0aWYgKHRoaXMubmV4dFNpYmxpbmcpIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0ZW1wRnJhZ21lbnQsIHRoaXMubmV4dFNpYmxpbmcpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuYXBwZW5kKHRlbXBGcmFnbWVudClcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IodGhpcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRhcHBlbmQoLi4ubm9kZXMpIHtcblx0XHRpZiAoWzEsOSwxMV0uaW5kZXhPZih0aGlzLm5vZGVUeXBlKSA9PT0gLTEpIHtcblx0XHRcdHdhcm4oJ1RoaXMgbm9kZSB0eXBlIGRvZXMgbm90IHN1cHBvcnQgbWV0aG9kIFwiYXBwZW5kXCIuJylcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRjb25zdCB0ZW1wRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpZiAoaSBpbnN0YW5jZW9mICRub2RlKSBpID0gaS4kZWxcblx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdH0pXG5cdFx0dGhpcy5hcHBlbmRDaGlsZCh0ZW1wRnJhZ21lbnQpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHByZXBlbmQoLi4ubm9kZXMpIHtcblx0XHRpZiAoWzEsOSwxMV0uaW5kZXhPZih0aGlzLm5vZGVUeXBlKSA9PT0gLTEpIHtcblx0XHRcdHdhcm4oJ1RoaXMgbm9kZSB0eXBlIGRvZXMgbm90IHN1cHBvcnQgbWV0aG9kIFwicHJlcGVuZFwiLicpXG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0bm9kZXMucmV2ZXJzZSgpXG5cdFx0bm9kZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aWYgKGkgaW5zdGFuY2VvZiAkbm9kZSkgaSA9IGkuJGVsXG5cdFx0XHR0ZW1wRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaSlcblx0XHR9KVxuXHRcdGlmICh0aGlzLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHRoaXMuaW5zZXJ0QmVmb3JlKHRlbXBGcmFnbWVudCwgdGhpcy4kZWwuZmlyc3RDaGlsZClcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZCh0ZW1wRnJhZ21lbnQpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRhcHBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0bm9kZS5hcHBlbmRDaGlsZCh0aGlzKVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRwcmVwZW5kVG8obm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGlmIChub2RlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdG5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIG5vZGUuZmlyc3RDaGlsZClcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZS5hcHBlbmRDaGlsZCh0aGlzKVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0ZW1wdHkoKSB7XG5cdFx0dGhpcy5pbm5lckhUTUwgPSAnJ1xuXHR9LFxuXG5cdHJlbW92ZSgpIHtcblx0XHR0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcylcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0c2FmZVJlbW92ZSgpIHtcblx0XHRzYWZlWm9uZS5hcHBlbmRDaGlsZCh0aGlzKVxuXHRcdHJldHVybiB0aGlzLiRcblx0fVxuXG5cdC8vIGFuaW1hdGUobmFtZSkge1xuXHQvLyBcdHRoaXMuJC5hZGRDbGFzcyhgJHtuYW1lfS10cmFuc2ApXG5cdC8vIFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdC8vIFx0XHR0aGlzLiQuYWRkQ2xhc3MoYCR7bmFtZX0tc3RhcnRgKVxuXHQvLyBcdFx0dGhpcy4kLmFkZENsYXNzKGAke25hbWV9LWVuZGApXG5cdC8vIFx0fSwgMClcblx0Ly8gXHRyZXR1cm4gdGhpcy4kXG5cdC8vIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vZGVidWcuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9ub2RlLmpzJ1xuaW1wb3J0IHsgJG5vZGUgfSBmcm9tICcuLi9zaGFyZWQuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0YWRkQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLmFkZENsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0YXBwZW5kVG8obm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IG5vZGVzID0gW11cblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdG5vZGVzLnB1c2goaS4kZWwpXG5cdFx0fSlcblx0XHRub2RlTWV0aG9kcy5hcHBlbmQuY2FsbChub2RlLCAuLi5ub2Rlcylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHByZXBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0Y29uc3Qgbm9kZXMgPSBbXVxuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0bm9kZXMucHVzaChpLiRlbClcblx0XHR9KVxuXHRcdG5vZGVNZXRob2RzLnByZXBlbmQuY2FsbChub2RlLCAuLi5ub2Rlcylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS50b2dnbGVDbGFzcyhjbGFzc05hbWUpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdGVtcHR5KCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5lbXB0eSgpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdHJlbW92ZSgpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkucmVtb3ZlKClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0c2FmZVJlbW92ZSgpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkuc2FmZVJlbW92ZSgpXG5cdFx0fSlcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXG5cdG9uKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkub24odHlwZSwgZm4sICEhdXNlQ2FwdHVyZSlcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gdGhpc1xuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRhdCh0eXBlLCBmbikge1xuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpLmF0KHR5cGUsIGZuKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fSBlbHNlIHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9LFxuXG5cdG9mZih0eXBlLCBmbiwgdXNlQ2FwdHVyZSkge1xuXHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpLm9mZih0eXBlLCBmbiwgISF1c2VDYXB0dXJlKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fSBlbHNlIHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9LFxuXG5cdHRyaWdnZXIoZXZlbnQsIGNvbmZpZykge1xuXHRcdGlmICh0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnKSBldmVudCA9IG5ldyBFdmVudChldmVudCwgY29uZmlnKVxuXHRcdHRoaXMuZm9yRWFjaChpID0+IGkudHJpZ2dlcihldmVudCkpXG5cdH1cbn1cbiIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNvcmUgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyIGZuICA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07IiwiLy8gMTkuMS4yLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsICRrZXlzICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGtleXMoaXQpe1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmtleXMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5rZXlzOyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5c1wiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwge3ZhbHVlOiB3a3NFeHQuZihuYW1lKX0pO1xufTsiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pe1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BOICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdvYnNlcnZhYmxlJyk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59OyIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0ICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3IgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vZGVidWcuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4uL3NoYXJlZC5qcydcblxuY29uc3QgbGlzdGVuZXJzID0ge31cbmNvbnN0IGV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0Y29uc3QgdGFyZ2V0cyA9IFtdXG5cdGUucGF0aC5mb3JFYWNoKChpKSA9PiB7XG5cdFx0aWYgKGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdKSB0YXJnZXRzLnB1c2goaSlcblx0fSlcblx0aWYgKHRhcmdldHMubGVuZ3RoID09PSAwKSByZXR1cm5cblx0Zm9yIChsZXQgaSBvZiB0YXJnZXRzKSB7XG5cdFx0aWYgKGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdW2UudHlwZV0pIHtcblx0XHRcdGxldCBpZkJyZWFrID0gZmFsc2Vcblx0XHRcdGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdW2UudHlwZV0uZm9yRWFjaCgoaikgPT4ge1xuXHRcdFx0XHRpZiAoai5jYWxsKGksIGUpID09PSBmYWxzZSkgaWZCcmVhayA9IHRydWVcblx0XHRcdH0pXG5cdFx0XHRpZiAoaWZCcmVhaykgcmV0dXJuXG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGhhbmRsZXJzID0ge1xuXHRvbih0eXBlLCBmbiwgdXNlQ2FwdHVyZSA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0eXBlcy5mb3JFYWNoKGkgPT4gdGhpcy5hZGRFdmVudExpc3RlbmVyKGksIGZuLCB1c2VDYXB0dXJlKSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0bGlzdGVuKHR5cGUsIG5vZGUsIGZuKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0ZWxzZSBub2RlID0gbm9kZS4kLiRlbFxuXHRcdGNvbnN0IHR5cGVzID0gdHlwZS5zcGxpdCgnICcpXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpZiAoaSAhPT0gJycpIHtcblx0XHRcdFx0XHRpZiAoIWxpc3RlbmVyc1t0aGlzLiRpZF0pIGxpc3RlbmVyc1t0aGlzLiRpZF0gPSB7fVxuXHRcdFx0XHRcdGlmICghbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF0pIHtcblx0XHRcdFx0XHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihpLCBldmVudEhhbmRsZXIsIHRydWUpXG5cdFx0XHRcdFx0XHRsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXSA9IHt9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1baV0pIGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdW2ldID0gW11cblx0XHRcdFx0XHRsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXS5wdXNoKGZuKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRhdCh0eXBlLCBmbikge1xuXHRcdGhhbmRsZXJzLmxpc3Rlbi5jYWxsKHdpbmRvdywgdHlwZSwgdGhpcywgZm4pXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGRyb3AodHlwZSwgbm9kZSwgZm4pIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRlbHNlIG5vZGUgPSBub2RlLiQuJGVsXG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRpZiAobGlzdGVuZXJzW3RoaXMuJGlkXSAmJiBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXSkge1xuXHRcdFx0XHR0eXBlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGkgIT09ICcnICYmIGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdW2ldKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmbnMgPSBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0Zm5zLnNwbGljZShmbnMuaW5kZXhPZihmbiksIDEpXG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1baV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0XHRpZiAoKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqIGluIGxpc3RlbmVyc1t0aGlzLiRpZF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsaXN0ZW5lcnNbdGhpcy4kaWRdW2pdW2ldKSByZXR1cm4gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHRcdFx0fSkoKSkgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGksIGV2ZW50SGFuZGxlciwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1cblx0XHRcdFx0XHRcdFx0XHRpZiAoT2JqZWN0LmtleXMobGlzdGVuZXJzW3RoaXMuJGlkXSkubGVuZ3RoID09PSAwKSBkZWxldGUgbGlzdGVuZXJzW3RoaXMuJGlkXVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRvZmYodHlwZSwgZm4sIHVzZUNhcHR1cmUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHR5cGVzID0gdHlwZS5zcGxpdCgnICcpXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoaSwgZm4sIHVzZUNhcHR1cmUpXG5cdFx0XHRcdGhhbmRsZXJzLmRyb3AuY2FsbCh3aW5kb3csIGksIHRoaXMsIGZuKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0dHJpZ2dlcihldmVudCwgY29uZmlnKSB7XG5cdFx0aWYgKHR5cGVvZiBldmVudCA9PT0gJ3N0cmluZycpIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50LCBjb25maWcpXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuXHRcdHJldHVybiB0aGlzLiRcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyc1xuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgcmVnRm4gZnJvbSAnLi4vcmVnaXN0ZXIuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9ub2RlLmpzJ1xuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSAnLi9ldmVudC5qcydcblxubGV0IHZlbG9jaXR5VXNlZCA9IGZhbHNlXG5cbmNvbnN0IHVzZVZlbG9jaXR5ID0gKHYpID0+IHtcblx0aWYgKHZlbG9jaXR5VXNlZCkgcmV0dXJuXG5cdHJlZ0ZuKCgpID0+IHtcblx0XHR2ZWxvY2l0eVVzZWQgPSB0cnVlXG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6ICdWZWxvY2l0eScsXG5cdFx0XHRub2RlOiB7XG5cdFx0XHRcdHZlbG9jaXR5KC4uLmFyZ3MpIHtcblx0XHRcdFx0XHR2KHRoaXMsIC4uLmFyZ3MpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bGlzdDoge1xuXHRcdFx0XHR2ZWxvY2l0eSguLi5hcmdzKSB7XG5cdFx0XHRcdFx0dGhpcy5mb3JFYWNoKGkgPT4gdihpLiRlbCwgLi4uYXJncykpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGF1dG9OYW1lU3BhY2U6IGZhbHNlXG5cdH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0dmVyc2lvbjogYEJseWRlIHYke1ZFUlNJT059YCxcblx0Zm46IHJlZ0ZuLFxuXHRxOiBub2RlTWV0aG9kcy5xLmJpbmQoZG9jdW1lbnQpLFxuXHRxYTogbm9kZU1ldGhvZHMucWEuYmluZChkb2N1bWVudCksXG5cdG9uKC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLm9uLmNhbGwod2luZG93LCAuLi5hcmdzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cdGxpc3RlbiguLi5hcmdzKSB7XG5cdFx0ZXZlbnRIYW5kbGVycy5saXN0ZW5jYWxsKHdpbmRvdywgLi4uYXJncylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXHRhdCguLi5hcmdzKSB7XG5cdFx0ZXZlbnRIYW5kbGVycy5hdC5jYWxsKHdpbmRvdywgLi4uYXJncylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXHRkcm9wKC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLmRyb3AuY2FsbCh3aW5kb3csIC4uLmFyZ3MpXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblx0b2ZmKC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLm9mZi5jYWxsKHdpbmRvdywgLi4uYXJncylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXHR0cmlnZ2VyKC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLnRyaWdnZXIuY2FsbCh3aW5kb3csIC4uLmFyZ3MpXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblx0dXNlVmVsb2NpdHlcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCByZWdGbiBmcm9tICcuL3JlZ2lzdGVyLmpzJ1xuaW1wb3J0IG5vZGVNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9ub2RlLmpzJ1xuaW1wb3J0IGxpc3RNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9saXN0LmpzJ1xuaW1wb3J0IGJseWRlTWV0aG9kcyBmcm9tICcuL21ldGhvZHMvYmx5ZGUuanMnXG5pbXBvcnQgZXZlbnRIYW5kbGVycyBmcm9tICcuL21ldGhvZHMvZXZlbnQuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4vc2hhcmVkLmpzJ1xuXG5yZWdGbigoKSA9PiB7XG5cdGNvbnN0IHBsdWdpbiA9IHtcblx0XHRuYW1lOiAnQmx5ZGUnLFxuXHRcdG5vZGU6IE9iamVjdC5hc3NpZ24obm9kZU1ldGhvZHMsIGV2ZW50SGFuZGxlcnMpLFxuXHRcdGxpc3Q6IGxpc3RNZXRob2RzLFxuXHRcdGJseWRlOiBibHlkZU1ldGhvZHNcblx0fVxuXHRyZXR1cm4gcGx1Z2luXG59LCB7XG5cdGF1dG9OYW1lU3BhY2U6IGZhbHNlXG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsICckJywge1xuXHRnZXQoKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICckJywgeyB2YWx1ZTogbmV3ICRub2RlKHRoaXMpIH0pXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9XG59KVxuXG5leHBvcnQgZGVmYXVsdCBCbHlkZVxuIiwiLyogZ2xvYmFsIGRlZmluZSAqL1xuJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCbHlkZSBmcm9tICcuL2xvYWRlci5qcydcbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuL2RlYnVnLmpzJ1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBCbHlkZVxufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKCgpID0+IEJseWRlKVxufSBlbHNlIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ0JseWRlJywgeyB2YWx1ZTogQmx5ZGUgfSlcblx0aWYgKHdpbmRvdy4kKSB3YXJuKGBcIndpbmRvdy4kXCIgbWF5IGhhdmUgYmVlbiB0YWtlbiBieSBhbm90aGVyIGxpYnJhcnksIHVzZSBcIndpbmRvdy5CbHlkZVwiIGZvciBub24tY29uZmxpY3QgdXNhZ2UuYClcblx0ZWxzZSBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnJCcsIHsgdmFsdWU6IEJseWRlIH0pXG59XG4iXSwibmFtZXMiOlsicmVxdWlyZSQkMCIsImlzT2JqZWN0IiwicmVxdWlyZSQkMSIsImRvY3VtZW50IiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJkUCIsImdsb2JhbCIsIiRleHBvcnQiLCJ0b1N0cmluZyIsIklPYmplY3QiLCJ0b0ludGVnZXIiLCJtaW4iLCJ0b0lPYmplY3QiLCJkZWZpbmVkIiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDQiLCJ0aGlzIiwibG9nIiwiYXJncyIsImluZm8iLCJsb2dnaW5nIiwid2FybiIsImVycm9yIiwiRU5WIiwic2V0TGV2ZWwiLCJpbml0UXVlcnkiLCJsb2FkZWQiLCJCbHlkZSIsImZuIiwiY2FsbCIsIndpbmRvdyIsInB1c2giLCJpIiwiaW5pdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJWZWxvY2l0eSIsInVzZVZlbG9jaXR5IiwiZm9yRWFjaCIsIlZFUlNJT04iLCJhZGRFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsIm1ldGhvZHMiLCIkbm9kZSIsIm5vZGUiLCIkZWwiLCJGdW5jdGlvbiIsImJpbmQiLCIkaWQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG93IiwiJG5vZGVMaXN0IiwibGlzdCIsIiRsaXN0IiwibGVuZ3RoIiwiJCIsInBsdWdpbnMiLCJyZWdpc3RlciIsImNvbmZpZyIsIm5hbWUiLCJibHlkZSIsImF1dG9OYW1lU3BhY2UiLCJmbk5hbWUiLCJ0YWtlU25hcHNob3QiLCJtZXRob2RzU2hvdCIsInBsdWdpblNob3QiLCJwbHVnaW4iLCJhbk9iamVjdCIsImdldEtleXMiLCJlbnVtQnVnS2V5cyIsIklFX1BST1RPIiwiUFJPVE9UWVBFIiwiaGFzIiwiY3JlYXRlIiwic2V0VG9TdHJpbmdUYWciLCJ0b09iamVjdCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQ4IiwicmVxdWlyZSQkNyIsImhpZGUiLCJyZXF1aXJlJCQ2IiwiSXRlcmF0b3JzIiwiSVRFUkFUT1IiLCJjcmVhdGVEZXNjIiwiY29mIiwiVEFHIiwiY3R4IiwidG9MZW5ndGgiLCJzYWZlWm9uZSIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWxlY3RvciIsIk5vZGUiLCJxdWVyeVNlbGVjdG9yIiwiTm9kZUxpc3QiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2xhc3NOYW1lIiwiY2xhc3NlcyIsInNwbGl0IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiY2xhc3NBcnIiLCJjbGFzc0luZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImpvaW4iLCJ0cmltIiwicGFyZW50IiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsInRoaXNQYXJlbnQiLCJub2RlUGFyZW50IiwidGhpc1NpYmxpbmciLCJuZXh0U2libGluZyIsIm5vZGVTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwiZXJyTm9kZXMiLCJ0ZW1wRnJhZ21lbnQiLCJub2RlcyIsInJldmVyc2UiLCJhcHBlbmRDaGlsZCIsImFwcGVuZCIsIm5vZGVUeXBlIiwiZmlyc3RDaGlsZCIsImlubmVySFRNTCIsInJlbW92ZUNoaWxkIiwiZW1wdHkiLCJzYWZlUmVtb3ZlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInByZXBlbmQiLCJ0b2dnbGVDbGFzcyIsInR5cGUiLCJ1c2VDYXB0dXJlIiwib24iLCJhdCIsIm9mZiIsImV2ZW50IiwiRXZlbnQiLCJ0cmlnZ2VyIiwiY29yZSIsIiRrZXlzIiwiTElCUkFSWSIsIndrc0V4dCIsImdPUFMiLCJwSUUiLCJnT1BOIiwidG9QcmltaXRpdmUiLCJJRThfRE9NX0RFRklORSIsImdPUEQiLCJyZXF1aXJlJCQyOSIsInJlcXVpcmUkJDI4IiwicmVxdWlyZSQkMjciLCJyZXF1aXJlJCQyNiIsInJlZGVmaW5lIiwicmVxdWlyZSQkMjUiLCJyZXF1aXJlJCQyNCIsInJlcXVpcmUkJDIzIiwic2hhcmVkIiwicmVxdWlyZSQkMjIiLCJyZXF1aXJlJCQyMSIsInVpZCIsInJlcXVpcmUkJDIwIiwicmVxdWlyZSQkMTkiLCJyZXF1aXJlJCQxOCIsInJlcXVpcmUkJDE3IiwicmVxdWlyZSQkMTYiLCJyZXF1aXJlJCQxNSIsImlzQXJyYXkiLCJyZXF1aXJlJCQxNCIsInJlcXVpcmUkJDEzIiwicmVxdWlyZSQkMTIiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEwIiwiT2JqZWN0UHJvdG8iLCIkZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJsaXN0ZW5lcnMiLCJldmVudEhhbmRsZXIiLCJlIiwidGFyZ2V0cyIsInBhdGgiLCJqIiwiaWZCcmVhayIsImhhbmRsZXJzIiwidHlwZXMiLCJsaXN0ZW4iLCJmbnMiLCJkcm9wIiwiZGlzcGF0Y2hFdmVudCIsInZlbG9jaXR5VXNlZCIsInYiLCJyZWdGbiIsIm5vZGVNZXRob2RzIiwicSIsInFhIiwibGlzdGVuY2FsbCIsImV2ZW50SGFuZGxlcnMiLCJsaXN0TWV0aG9kcyIsImJseWRlTWV0aG9kcyIsInByb3RvdHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSSxNQUFNLEdBQUcsY0FBYyxHQUFHLE9BQU8sTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUk7SUFDN0UsTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEdB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
