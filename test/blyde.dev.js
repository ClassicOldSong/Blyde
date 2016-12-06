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
	log('Blyde v' + "0.1.0-alpha.17.dev.c667d27" + ' initlized!');
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
	var $nodeMethods = {};
	for (var i in methods.node) {
		if (methods.node[i] instanceof Function) $nodeMethods[i] = methods.node[i].bind(node);else $nodeMethods[i] = methods.node[i];
	}
	_Object$assign(this, $nodeMethods);
	var id = '';
	if (node.$id) id = node.$id;else {
		id = Math.floor(Math.random() * Math.pow(10, 16)).toString(36);
		Object.defineProperty(node, '$id', { value: id });
	}
};
var $nodeList = function $nodeList(list) {
	_classCallCheck(this, $nodeList);

	this.$list = [];
	for (var i = 0; i < list.length; i++) {
		this.$list.push(list[i].$);
	}var $listMethods = {};
	for (var _i in methods.list) {
		if (methods.list[_i] instanceof Function) $listMethods[_i] = methods.list[_i].bind(this.$list);else $listMethods[_i] = methods.node[_i];
	}
	_Object$assign(this, $listMethods);
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
		version: 'Blyde v' + "0.1.0-alpha.17.dev.c667d27",
		methods: methodsShot,
		plugins: pluginShot,
		$node: $node,
		$nodeList: $nodeList,
		log: log,
		warn: warn,
		error: error
	};
};

var regFn = (function (plugin) {
	var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	register(plugin(takeSnapshot()), config);
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
	version: 'Blyde v' + "0.1.0-alpha.17.dev.c667d27",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCIuLi9zcmMvZGVidWcuanMiLCIuLi9zcmMvYmx5ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL3NyYy9zaGFyZWQuanMiLCIuLi9zcmMvcmVnaXN0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3JlYXRlLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb20uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3RvQ29uc3VtYWJsZUFycmF5LmpzIiwiLi4vc3JjL21ldGhvZHMvbm9kZS5qcyIsIi4uL3NyYy9tZXRob2RzL2xpc3QuanMiLCIuLi9zcmMvbWV0aG9kcy9ibHlkZS5qcyIsIi4uL3NyYy9sb2FkZXIuanMiLCIuLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxuKlxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XG5cbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIFdlIGNhbid0IGJ1aWxkIGEgcmVhbCBtZXRob2Qgd2l0aG91dCBhIGNvbnNvbGUgdG8gbG9nIHRvXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGVzZSBwcml2YXRlIGZ1bmN0aW9ucyBhbHdheXMgbmVlZCBgdGhpc2AgdG8gYmUgc2V0IHByb3Blcmx5XG5cbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbCh0aGlzLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/XG4gICAgICAgICAgICAgICAgbm9vcCA6XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRNZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXG4gICAgICAgIFwidHJhY2VcIixcbiAgICAgICAgXCJkZWJ1Z1wiLFxuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJ3YXJuXCIsXG4gICAgICAgIFwiZXJyb3JcIlxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBMb2dnZXIobmFtZSwgZGVmYXVsdExldmVsLCBmYWN0b3J5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY3VycmVudExldmVsO1xuICAgICAgdmFyIHN0b3JhZ2VLZXkgPSBcImxvZ2xldmVsXCI7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBzdG9yYWdlS2V5ICs9IFwiOlwiICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xuICAgICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGVyc2lzdGVkTGV2ZWwoKSB7XG4gICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb29raWUgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gY29va2llLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvXihbXjtdKykvLmV4ZWMoY29va2llLnNsaWNlKGxvY2F0aW9uKSlbMV07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgc3RvcmVkIGxldmVsIGlzIG5vdCB2YWxpZCwgdHJlYXQgaXQgYXMgaWYgbm90aGluZyB3YXMgc3RvcmVkLlxuICAgICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RvcmVkTGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKlxuICAgICAgICogUHVibGljIEFQSVxuICAgICAgICpcbiAgICAgICAqL1xuXG4gICAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcbiAgICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xuXG4gICAgICBzZWxmLm1ldGhvZEZhY3RvcnkgPSBmYWN0b3J5IHx8IGRlZmF1bHRNZXRob2RGYWN0b3J5O1xuXG4gICAgICBzZWxmLmdldExldmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50TGV2ZWw7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsLCBwZXJzaXN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgY3VycmVudExldmVsID0gbGV2ZWw7XG4gICAgICAgICAgICAgIGlmIChwZXJzaXN0ICE9PSBmYWxzZSkgeyAgLy8gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwoc2VsZiwgbGV2ZWwsIG5hbWUpO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUgJiYgbGV2ZWwgPCBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXREZWZhdWx0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgICAgICBpZiAoIWdldFBlcnNpc3RlZExldmVsKCkpIHtcbiAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5ULCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgcmlnaHQgbGV2ZWxcbiAgICAgIHZhciBpbml0aWFsTGV2ZWwgPSBnZXRQZXJzaXN0ZWRMZXZlbCgpO1xuICAgICAgaWYgKGluaXRpYWxMZXZlbCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5pdGlhbExldmVsID0gZGVmYXVsdExldmVsID09IG51bGwgPyBcIldBUk5cIiA6IGRlZmF1bHRMZXZlbDtcbiAgICAgIH1cbiAgICAgIHNlbGYuc2V0TGV2ZWwoaW5pdGlhbExldmVsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKlxuICAgICAqIFBhY2thZ2UtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbn0pKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgbG9nZ2luZyBmcm9tICdsb2dsZXZlbCdcbmNvbnN0IGxvZyA9ICguLi5hcmdzKSA9PiBsb2dnaW5nLmluZm8oJ1tCbHlkZV0nLCAuLi5hcmdzKVxuY29uc3Qgd2FybiA9ICguLi5hcmdzKSA9PiBsb2dnaW5nLndhcm4oJ1tCbHlkZV0nLCAuLi5hcmdzKVxuY29uc3QgZXJyb3IgPSAoLi4uYXJncykgPT4gbG9nZ2luZy5lcnJvcignW0JseWRlXScsIC4uLmFyZ3MpXG5cbmlmIChFTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHRsb2dnaW5nLnNldExldmVsKCdlcnJvcicpXG59IGVsc2Uge1xuXHRsb2dnaW5nLnNldExldmVsKCd0cmFjZScpXG5cdGxvZygnRGVidWcgbG9nZ2luZyBlbmFibGVkIScpXG59XG5cbmV4cG9ydCB7IGxvZywgd2FybiwgZXJyb3IgfVxuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuL2RlYnVnLmpzJ1xuXG5jb25zdCBpbml0UXVlcnkgPSBbXVxubGV0IGxvYWRlZCA9IGZhbHNlXG5cbmNvbnN0IEJseWRlID0gKGZuKSA9PiB7XG5cdGlmICh0eXBlb2YoZm4pID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0aWYgKGxvYWRlZCkge1xuXHRcdFx0Zm4uY2FsbCh3aW5kb3cpXG5cdFx0fSBlbHNlIHtcblx0XHRcdGluaXRRdWVyeS5wdXNoKGZuKVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRsb2coZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9XG59XG5cbmNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXQsIGZhbHNlKVxuXHRpZiAod2luZG93LlZlbG9jaXR5KSBCbHlkZS51c2VWZWxvY2l0eSh3aW5kb3cuVmVsb2NpdHkpXG5cdGxvYWRlZCA9IHRydWVcblx0aW5pdFF1ZXJ5LmZvckVhY2goaSA9PiBpbml0UXVlcnlbaV0uY2FsbCh3aW5kb3cpKVxuXHRsb2coYEJseWRlIHYke1ZFUlNJT059IGluaXRsaXplZCFgKVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCwgZmFsc2UpXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikgaW5pdCgpXG5cbmV4cG9ydCBkZWZhdWx0IEJseWRlXG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnblwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCdcblxuY29uc3QgbWV0aG9kcyA9IHtcblx0bm9kZToge30sXG5cdGxpc3Q6IHt9LFxuXHRibHlkZToge31cbn1cblxuY29uc3QgJG5vZGUgPSBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKG5vZGUpIHtcblx0XHR0aGlzLiRlbCA9IG5vZGVcblx0XHRsZXQgJG5vZGVNZXRob2RzID0ge31cblx0XHRmb3IgKGxldCBpIGluIG1ldGhvZHMubm9kZSkge1xuXHRcdFx0aWYgKG1ldGhvZHMubm9kZVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSAkbm9kZU1ldGhvZHNbaV0gPSBtZXRob2RzLm5vZGVbaV0uYmluZChub2RlKVxuXHRcdFx0ZWxzZSAkbm9kZU1ldGhvZHNbaV0gPSBtZXRob2RzLm5vZGVbaV1cblx0XHR9XG5cdFx0T2JqZWN0LmFzc2lnbih0aGlzLCAkbm9kZU1ldGhvZHMpXG5cdFx0bGV0IGlkID0gJydcblx0XHRpZiAobm9kZS4kaWQpIGlkID0gbm9kZS4kaWRcblx0XHRlbHNlIHtcblx0XHRcdGlkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMTAsIDE2KSkudG9TdHJpbmcoMzYpXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgJyRpZCcsIHt2YWx1ZTogaWR9KVxuXHRcdH1cblx0fVxufVxuY29uc3QgJG5vZGVMaXN0ID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3RvcihsaXN0KSB7XG5cdFx0dGhpcy4kbGlzdCA9IFtdXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB0aGlzLiRsaXN0LnB1c2gobGlzdFtpXS4kKVxuXHRcdGxldCAkbGlzdE1ldGhvZHMgPSB7fVxuXHRcdGZvciAobGV0IGkgaW4gbWV0aG9kcy5saXN0KSB7XG5cdFx0XHRpZiAobWV0aG9kcy5saXN0W2ldIGluc3RhbmNlb2YgRnVuY3Rpb24pICRsaXN0TWV0aG9kc1tpXSA9IG1ldGhvZHMubGlzdFtpXS5iaW5kKHRoaXMuJGxpc3QpXG5cdFx0XHRlbHNlICRsaXN0TWV0aG9kc1tpXSA9IG1ldGhvZHMubm9kZVtpXVxuXHRcdH1cblx0XHRPYmplY3QuYXNzaWduKHRoaXMsICRsaXN0TWV0aG9kcylcblx0fVxufVxuXG5leHBvcnQgeyBtZXRob2RzLCAkbm9kZSwgJG5vZGVMaXN0IH1cbiIsIi8qIGdsb2JhbCBWRVJTSU9OICovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgbG9nLCB3YXJuLCBlcnJvciB9IGZyb20gJy4vZGVidWcuanMnXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCB7IG1ldGhvZHMsICRub2RlLCAkbm9kZUxpc3QgfSBmcm9tICcuL3NoYXJlZC5qcydcblxuY29uc3QgcGx1Z2lucyA9IHt9XG5cbmNvbnN0IHJlZ2lzdGVyID0gKHtuYW1lLCBub2RlLCBsaXN0LCBibHlkZX0sIGNvbmZpZykgPT4ge1xuXHRpZiAoIW5hbWUpIHtcblx0XHRlcnJvcignUGx1Z2luIG5hbWUgbm90IHByZWNlbnQhIFJlZ2lzdHJhdGlvbiBhYm9ydGVkLicpXG5cdFx0cmV0dXJuXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBub2RlKSB7XG5cdFx0aWYgKG1ldGhvZHMubm9kZVtpXSkge1xuXHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAna2VlcCcpIGxvZyhgJG5vZGUgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4ga2VwdC5gKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCBmbk5hbWUgPSBpXG5cdFx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ3JlbmFtZScpIHtcblx0XHRcdFx0XHRmbk5hbWUgPSBuYW1lICsgaVxuXHRcdFx0XHRcdGxvZyhgJG5vZGUgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4gcmVuYW1lZCB0byBcIiR7Zm5OYW1lfVwiLmApXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0d2FybihgJG5vZGUgcHJvcGVydHkgXCIke2l9XCIgaW4gXCIke25hbWV9XCIgaGFzIHJlcGxhY2VkIHRoZSBvcmlnaW5hbCBvbmUsIHNldCBcImNvbmZpZy5hdXRvTmFtZVNwYWNlXCIgdG8gXCJyZW5hbWVcIiB0byBrZWVwIGJvdGguYClcblx0XHRcdFx0fVxuXHRcdFx0XHRtZXRob2RzLm5vZGVbZm5OYW1lXSA9IG5vZGVbaV1cblx0XHRcdH1cblx0XHR9IGVsc2UgbWV0aG9kcy5ub2RlW2ldID0gbm9kZVtpXVxuXHR9XG5cdGZvciAobGV0IGkgaW4gbGlzdCkge1xuXHRcdGlmIChtZXRob2RzLmxpc3RbaV0pIHtcblx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ2tlZXAnKSBsb2coYCRub2RlTGlzdCBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiBrZXB0LmApXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IGZuTmFtZSA9IGlcblx0XHRcdFx0aWYgKGNvbmZpZy5hdXRvTmFtZVNwYWNlID09PSAncmVuYW1lJykge1xuXHRcdFx0XHRcdGZuTmFtZSA9IG5hbWUgKyBpXG5cdFx0XHRcdFx0bG9nKGAkbm9kZUxpc3QgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4gcmVuYW1lZCB0byBcIiR7Zm5OYW1lfVwiLmApXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0d2FybihgJG5vZGVMaXN0IHByb3BlcnR5IFwiJHtpfVwiIGluIFwiJHtuYW1lfVwiIGhhcyByZXBsYWNlZCB0aGUgb3JpZ2luYWwgb25lLCBzZXQgXCJjb25maWcuYXV0b05hbWVTcGFjZVwiIHRvIFwicmVuYW1lXCIgdG8ga2VlcCBib3RoLmApXG5cdFx0XHRcdH1cblx0XHRcdFx0bWV0aG9kcy5saXN0W2ZuTmFtZV0gPSBsaXN0W2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlIG1ldGhvZHMubGlzdFtpXSA9IGxpc3RbaV1cblx0fVxuXHRmb3IgKGxldCBpIGluIGJseWRlKSB7XG5cdFx0aWYgKG1ldGhvZHMuYmx5ZGVbaV0pIHtcblx0XHRcdGlmIChjb25maWcuYXV0b05hbWVTcGFjZSA9PT0gJ2tlZXAnKSBsb2coYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIGtlcHQuYClcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgZm5OYW1lID0gaVxuXHRcdFx0XHRpZiAoY29uZmlnLmF1dG9OYW1lU3BhY2UgPT09ICdyZW5hbWUnKSB7XG5cdFx0XHRcdFx0Zm5OYW1lID0gbmFtZSArIGlcblx0XHRcdFx0XHRsb2coYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGluIFwiJHtuYW1lfVwiIGhhcyByZXBsYWNlZCB0aGUgb3JpZ2luYWwgb25lLCBzZXQgXCJjb25maWcuYXV0b05hbWVTcGFjZVwiIHRvIFwicmVuYW1lXCIgdG8ga2VlcCBib3RoLmApXG5cdFx0XHRcdH1cblx0XHRcdFx0bWV0aG9kcy5ibHlkZVtmbk5hbWVdID0gYmx5ZGVbaV1cblx0XHRcdFx0Qmx5ZGVbZm5OYW1lXSA9IGJseWRlW2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1ldGhvZHMuYmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdFx0Qmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdH1cblx0fVxuXHRwbHVnaW5zW25hbWVdID0geyBub2RlLCBsaXN0LCBibHlkZSB9XG5cdGxvZyhgUGx1Z2luIFwiJHtuYW1lfVwiIGxvYWRlZC5gKVxufVxuXG5jb25zdCB0YWtlU25hcHNob3QgPSAoKSA9PiB7XG5cdGNvbnN0IG1ldGhvZHNTaG90ID0ge1xuXHRcdG5vZGU6IE9iamVjdC5hc3NpZ24oe30sIG1ldGhvZHMubm9kZSksXG5cdFx0bGlzdDogT2JqZWN0LmFzc2lnbih7fSwgbWV0aG9kcy5saXN0KSxcblx0XHRibHlkZTogT2JqZWN0LmFzc2lnbih7fSwgbWV0aG9kcy5ibHlkZSlcblx0fVxuXHRjb25zdCBwbHVnaW5TaG90ID0ge31cblx0Zm9yIChsZXQgaSBpbiBwbHVnaW5zKSB7XG5cdFx0cGx1Z2luU2hvdFtpXSA9IHtcblx0XHRcdG5vZGU6IE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbnNbaV0ubm9kZSksXG5cdFx0XHRsaXN0OiBPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5zW2ldLmxpc3QpLFxuXHRcdFx0Ymx5ZGU6IE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbnNbaV0uYmx5ZGUpXG5cdFx0fVxuXHR9XG5cdHJldHVybiB7XG5cdFx0dmVyc2lvbjogYEJseWRlIHYke1ZFUlNJT059YCxcblx0XHRtZXRob2RzOiBtZXRob2RzU2hvdCxcblx0XHRwbHVnaW5zOiBwbHVnaW5TaG90LFxuXHRcdCRub2RlLFxuXHRcdCRub2RlTGlzdCxcblx0XHRsb2csXG5cdFx0d2Fybixcblx0XHRlcnJvclxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW4sIGNvbmZpZyA9IHt9KSA9PiB7XG5cdHJlZ2lzdGVyKHBsdWdpbih0YWtlU25hcHNob3QoKSksIGNvbmZpZylcbn1cbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciBkUCAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpe1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgICA9IGdldEtleXMoUHJvcGVydGllcylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpID0gMFxuICAgICwgUDtcbiAgd2hpbGUobGVuZ3RoID4gaSlkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjICAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBpbmRleCwgdmFsdWUpe1xuICBpZihpbmRleCBpbiBvYmplY3QpJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHRvT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBjYWxsICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCB0b0xlbmd0aCAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKVxuICAsIGdldEl0ZXJGbiAgICAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcbiAgICB2YXIgTyAgICAgICA9IHRvT2JqZWN0KGFycmF5TGlrZSlcbiAgICAgICwgQyAgICAgICA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXlcbiAgICAgICwgYUxlbiAgICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgbWFwZm4gICA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGluZGV4ICAgPSAwXG4gICAgICAsIGl0ZXJGbiAgPSBnZXRJdGVyRm4oTylcbiAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmKG1hcHBpbmcpbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZihpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSl7XG4gICAgICBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEM7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2Zyb20gPSByZXF1aXJlKFwiLi4vY29yZS1qcy9hcnJheS9mcm9tXCIpO1xuXG52YXIgX2Zyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnJvbSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycjJbaV0gPSBhcnJbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICgwLCBfZnJvbTIuZGVmYXVsdCkoYXJyKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgd2FybiwgZXJyb3IgfSBmcm9tICcuLi9kZWJ1Zy5qcydcbmltcG9ydCB7ICRub2RlLCAkbm9kZUxpc3QgfSBmcm9tICcuLi9zaGFyZWQuanMnXG5cbmNvbnN0IHNhZmVab25lID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0cShzZWxlY3Rvcikge1xuXHRcdGlmICghKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZSkpIHtcblx0XHRcdHNlbGVjdG9yID0gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuXHRcdH1cblx0XHRpZiAoc2VsZWN0b3IpIHJldHVybiBzZWxlY3Rvci4kXG5cdH0sXG5cblx0cWEoc2VsZWN0b3IpIHtcblx0XHRpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBOb2RlTGlzdCkgcmV0dXJuIG5ldyAkbm9kZUxpc3Qoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIG5ldyAkbm9kZUxpc3QodGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblx0fSxcblxuXHRhZGRDbGFzcyhjbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gY2xhc3NOYW1lLnNwbGl0KCcgJylcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcylcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0Y29uc3QgY2xhc3NlcyA9IGNsYXNzTmFtZS5zcGxpdCgnICcpXG5cdFx0dGhpcy5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBjbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNvbnN0IGNsYXNzQXJyID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNsYXNzZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IGNsYXNzQXJyLmluZGV4T2YoaSlcblx0XHRcdGlmIChjbGFzc0luZGV4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NBcnIuc3BsaWNlKGNsYXNzSW5kZXgsIDEpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGFzc0Fyci5wdXNoKGkpXG5cdFx0XHR9XG5cdFx0fSlcblx0XHR0aGlzLmNsYXNzTmFtZSA9IGNsYXNzQXJyLmpvaW4oJyAnKS50cmltKClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVwbGFjZVdpdGgobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZVxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5yZXBsYWNlQ2hpbGQobm9kZSwgdGhpcylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IodGhpcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fVxuXHR9LFxuXG5cdHN3YXAobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHRoaXNQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGVcblx0XHRjb25zdCBub2RlUGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0Y29uc3QgdGhpc1NpYmxpbmcgPSB0aGlzLm5leHRTaWJsaW5nXG5cdFx0Y29uc3Qgbm9kZVNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nXG5cdFx0aWYgKHRoaXNQYXJlbnQgJiYgbm9kZVBhcmVudCkge1xuXHRcdFx0dGhpc1BhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgdGhpc1NpYmxpbmcpXG5cdFx0XHRub2RlUGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBub2RlU2libGluZylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGVyck5vZGVzID0gW11cblx0XHRcdGlmICh0aGlzUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2godGhpcylcblx0XHRcdH1cblx0XHRcdGlmIChub2RlUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2gobm9kZSlcblx0XHRcdH1cblx0XHRcdGVycm9yKC4uLmVyck5vZGVzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9XG5cdH0sXG5cblx0YmVmb3JlKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdFx0aWYgKGkgaW5zdGFuY2VvZiAkbm9kZSkgaSA9IGkuJGVsXG5cdFx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdFx0fSlcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFmdGVyKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0XHR0ZW1wRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaSlcblx0XHRcdH0pXG5cdFx0XHRpZiAodGhpcy5uZXh0U2libGluZykge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBGcmFnbWVudCwgdGhpcy5uZXh0U2libGluZylcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmQodGVtcEZyYWdtZW50KVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJhcHBlbmRcIi4nKVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdGNvbnN0IHRlbXBGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0dGVtcEZyYWdtZW50LmFwcGVuZENoaWxkKGkpXG5cdFx0fSlcblx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cHJlcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJwcmVwZW5kXCIuJylcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRjb25zdCB0ZW1wRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpZiAoaSBpbnN0YW5jZW9mICRub2RlKSBpID0gaS4kZWxcblx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdH0pXG5cdFx0aWYgKHRoaXMuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGhpcy5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzLiRlbC5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZFRvKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHByZXBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0aWYgKG5vZGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0bm9kZS5pbnNlcnRCZWZvcmUodGhpcywgbm9kZS5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRlbXB0eSgpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9ICcnXG5cdH0sXG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRzYWZlUmVtb3ZlKCkge1xuXHRcdHNhZmVab25lLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdG9uKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mKGZuKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaChpID0+IHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihpLCBmbiwgISF1c2VDYXB0dXJlKSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0b2ZmKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mKGZuKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaChpID0+IHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoaSwgZm4sICEhdXNlQ2FwdHVyZSkpXG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fSBlbHNlIHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9XG5cblx0Ly8gYW5pbWF0ZShuYW1lKSB7XG5cdC8vIFx0dGhpcy4kLmFkZENsYXNzKGAke25hbWV9LXRyYW5zYClcblx0Ly8gXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0Ly8gXHRcdHRoaXMuJC5hZGRDbGFzcyhgJHtuYW1lfS1zdGFydGApXG5cdC8vIFx0XHR0aGlzLiQuYWRkQ2xhc3MoYCR7bmFtZX0tZW5kYClcblx0Ly8gXHR9LCAwKVxuXHQvLyBcdHJldHVybiB0aGlzLiRcblx0Ly8gfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuLi9kZWJ1Zy5qcydcbmltcG9ydCBub2RlTWV0aG9kcyBmcm9tICcuL25vZGUuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4uL3NoYXJlZC5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhZGRDbGFzcyhjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkuYWRkQ2xhc3MoY2xhc3NOYW1lKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRyZW1vdmVDbGFzcyhjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRhcHBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0Y29uc3Qgbm9kZXMgPSBbXVxuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0bm9kZXMucHVzaChpLiRlbClcblx0XHR9KVxuXHRcdG5vZGVNZXRob2RzLmFwcGVuZC5jYWxsKG5vZGUsIC4uLm5vZGVzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cHJlcGVuZFRvKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRjb25zdCBub2RlcyA9IFtdXG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRub2Rlcy5wdXNoKGkuJGVsKVxuXHRcdH0pXG5cdFx0bm9kZU1ldGhvZHMucHJlcGVuZC5jYWxsKG5vZGUsIC4uLm5vZGVzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0dG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0ZW1wdHkoKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLmVtcHR5KClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5yZW1vdmUoKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRzYWZlUmVtb3ZlKCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5zYWZlUmVtb3ZlKClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0b24odHlwZSwgZm4sIHVzZUNhcHR1cmUpIHtcblx0XHRpZiAodHlwZW9mKGZuKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkub24odHlwZSwgZm4sICEhdXNlQ2FwdHVyZSlcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm4gdGhpc1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0XHR9XG5cdH0sXG5cblx0b2ZmKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0aWYgKHR5cGVvZihmbikgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpLm9mZih0eXBlLCBmbiwgISF1c2VDYXB0dXJlKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fSBlbHNlIHtcblx0XHRcdHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHRcdH1cblx0fVxufVxuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgcmVnRm4gZnJvbSAnLi4vcmVnaXN0ZXIuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9ub2RlLmpzJ1xuXG5sZXQgdmVsb2NpdHlVc2VkID0gZmFsc2VcblxuY29uc3QgdXNlVmVsb2NpdHkgPSAodikgPT4ge1xuXHRpZiAodmVsb2NpdHlVc2VkKSByZXR1cm5cblx0cmVnRm4oKCkgPT4ge1xuXHRcdHZlbG9jaXR5VXNlZCA9IHRydWVcblx0XHRyZXR1cm4ge1xuXHRcdFx0bmFtZTogJ1ZlbG9jaXR5Jyxcblx0XHRcdG5vZGU6IHtcblx0XHRcdFx0dmVsb2NpdHkoLi4uYXJncykge1xuXHRcdFx0XHRcdHYodGhpcywgLi4uYXJncylcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRsaXN0OiB7XG5cdFx0XHRcdHZlbG9jaXR5KC4uLmFyZ3MpIHtcblx0XHRcdFx0XHR0aGlzLmZvckVhY2goaSA9PiB2KGkuJGVsLCAuLi5hcmdzKSlcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0YXV0b05hbWVTcGFjZTogZmFsc2Vcblx0fSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHR2ZXJzaW9uOiBgQmx5ZGUgdiR7VkVSU0lPTn1gLFxuXHRmbjogcmVnRm4sXG5cdHE6IG5vZGVNZXRob2RzLnEuYmluZChkb2N1bWVudCksXG5cdHFhOiBub2RlTWV0aG9kcy5xYS5iaW5kKGRvY3VtZW50KSxcblx0b246IG5vZGVNZXRob2RzLm9uLmJpbmQod2luZG93KSxcblx0b2ZmOiBub2RlTWV0aG9kcy5vZmYuYmluZCh3aW5kb3cpLFxuXHR1c2VWZWxvY2l0eVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBCbHlkZSBmcm9tICcuL2JseWRlLmpzJ1xuaW1wb3J0IHJlZ0ZuIGZyb20gJy4vcmVnaXN0ZXIuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9tZXRob2RzL25vZGUuanMnXG5pbXBvcnQgbGlzdE1ldGhvZHMgZnJvbSAnLi9tZXRob2RzL2xpc3QuanMnXG5pbXBvcnQgYmx5ZGVNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9ibHlkZS5qcydcbmltcG9ydCB7ICRub2RlIH0gZnJvbSAnLi9zaGFyZWQuanMnXG5cbnJlZ0ZuKCgpID0+IHtcblx0Y29uc3QgcGx1Z2luID0ge1xuXHRcdG5hbWU6ICdCbHlkZScsXG5cdFx0bm9kZTogbm9kZU1ldGhvZHMsXG5cdFx0bGlzdDogbGlzdE1ldGhvZHMsXG5cdFx0Ymx5ZGU6IGJseWRlTWV0aG9kc1xuXHR9XG5cdHJldHVybiBwbHVnaW5cbn0sIHtcblx0YXV0b05hbWVTcGFjZTogZmFsc2Vcbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJyQnLCB7XG5cdGdldCgpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJyQnLCB7IHZhbHVlOiBuZXcgJG5vZGUodGhpcykgfSlcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IEJseWRlXG4iLCIvKiBnbG9iYWwgZGVmaW5lICovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0IEJseWRlIGZyb20gJy4vbG9hZGVyLmpzJ1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9kZWJ1Zy5qcydcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gQmx5ZGVcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZSgoKSA9PiBCbHlkZSlcbn0gZWxzZSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdCbHlkZScsIHsgdmFsdWU6IEJseWRlIH0pXG5cdGlmICh3aW5kb3cuJCkgbG9nKGBcIndpbmRvdy4kXCIgbWF5IGhhdmUgYmVlbiB0YWtlbiBieSBhbm90aGVyIGxpYnJhcnksIHVzZSBcIndpbmRvdy5CbHlkZVwiIGZvciBub24tY29uZmxpY3QgdXNhZ2UuYClcblx0ZWxzZSBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnJCcsIHsgdmFsdWU6IEJseWRlIH0pXG59Il0sIm5hbWVzIjpbInRoaXMiLCJsb2ciLCJhcmdzIiwibG9nZ2luZyIsImluZm8iLCJ3YXJuIiwiZXJyb3IiLCJFTlYiLCJzZXRMZXZlbCIsImluaXRRdWVyeSIsImxvYWRlZCIsIkJseWRlIiwiZm4iLCJjYWxsIiwid2luZG93IiwicHVzaCIsImkiLCJpbml0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIlZlbG9jaXR5IiwidXNlVmVsb2NpdHkiLCJmb3JFYWNoIiwiVkVSU0lPTiIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlYWR5U3RhdGUiLCJyZXF1aXJlJCQwIiwiaXNPYmplY3QiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJkUCIsImdsb2JhbCIsIiRleHBvcnQiLCJJT2JqZWN0IiwidG9JbnRlZ2VyIiwibWluIiwidG9JT2JqZWN0IiwiZGVmaW5lZCIsInJlcXVpcmUkJDUiLCJyZXF1aXJlJCQ0IiwibWV0aG9kcyIsIiRub2RlIiwibm9kZSIsIiRlbCIsIiRub2RlTWV0aG9kcyIsIkZ1bmN0aW9uIiwiYmluZCIsImlkIiwiJGlkIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG93IiwidG9TdHJpbmciLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiJG5vZGVMaXN0IiwibGlzdCIsIiRsaXN0IiwibGVuZ3RoIiwiJCIsIiRsaXN0TWV0aG9kcyIsInBsdWdpbnMiLCJyZWdpc3RlciIsImNvbmZpZyIsIm5hbWUiLCJibHlkZSIsImF1dG9OYW1lU3BhY2UiLCJmbk5hbWUiLCJ0YWtlU25hcHNob3QiLCJtZXRob2RzU2hvdCIsInBsdWdpblNob3QiLCJwbHVnaW4iLCJhbk9iamVjdCIsImdldEtleXMiLCJlbnVtQnVnS2V5cyIsIklFX1BST1RPIiwiUFJPVE9UWVBFIiwiaGFzIiwiY3JlYXRlIiwic2V0VG9TdHJpbmdUYWciLCJ0b09iamVjdCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQ4IiwicmVxdWlyZSQkNyIsImhpZGUiLCJyZXF1aXJlJCQ2IiwiSXRlcmF0b3JzIiwiSVRFUkFUT1IiLCJjcmVhdGVEZXNjIiwiY29mIiwiVEFHIiwiY3R4IiwidG9MZW5ndGgiLCJzYWZlWm9uZSIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWxlY3RvciIsIk5vZGUiLCJxdWVyeVNlbGVjdG9yIiwiTm9kZUxpc3QiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2xhc3NOYW1lIiwiY2xhc3NlcyIsInNwbGl0IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiY2xhc3NBcnIiLCJjbGFzc0luZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImpvaW4iLCJ0cmltIiwicGFyZW50IiwicGFyZW50Tm9kZSIsInJlcGxhY2VDaGlsZCIsInRoaXNQYXJlbnQiLCJub2RlUGFyZW50IiwidGhpc1NpYmxpbmciLCJuZXh0U2libGluZyIsIm5vZGVTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwiZXJyTm9kZXMiLCJ0ZW1wRnJhZ21lbnQiLCJub2RlcyIsInJldmVyc2UiLCJhcHBlbmRDaGlsZCIsImFwcGVuZCIsIm5vZGVUeXBlIiwiZmlyc3RDaGlsZCIsImlubmVySFRNTCIsInJlbW92ZUNoaWxkIiwidHlwZSIsInVzZUNhcHR1cmUiLCJ0eXBlcyIsImVtcHR5Iiwic2FmZVJlbW92ZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJwcmVwZW5kIiwidG9nZ2xlQ2xhc3MiLCJvbiIsIm9mZiIsInZlbG9jaXR5VXNlZCIsInYiLCJyZWdGbiIsIm5vZGVNZXRob2RzIiwicSIsInFhIiwibGlzdE1ldGhvZHMiLCJibHlkZU1ldGhvZHMiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmaW5lIiwiYW1kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsQ0FBQyxVQUFVLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDekIsWUFBWSxDQUFDO0lBQ2IsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdEIsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1FBQ3JELGNBQWMsR0FBRyxVQUFVLEVBQUUsQ0FBQztLQUNqQyxNQUFNO1FBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLEVBQUUsQ0FBQztLQUMzQjtDQUNKLENBQUNBLGNBQUksRUFBRSxZQUFZO0lBQ2hCLFlBQVksQ0FBQztJQUNiLElBQUksSUFBSSxHQUFHLFdBQVcsRUFBRSxDQUFDO0lBQ3pCLElBQUksYUFBYSxHQUFHLFdBQVcsQ0FBQzs7SUFFaEMsU0FBUyxVQUFVLENBQUMsVUFBVSxFQUFFO1FB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
