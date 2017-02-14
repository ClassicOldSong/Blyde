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

var logger = loglevel.getLogger('blyde');

var trace = logger.trace.bind(null, '[Blyde]');
var debug = logger.debug.bind(null, '[Blyde]');
var info = logger.info.bind(null, '[Blyde]');
var warn = logger.warn.bind(null, '[Blyde]');
var error = logger.error.bind(null, '[Blyde]');

{
	logger.setLevel('trace');
}

info('Debug logging enabled!');

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
	info('Blyde v' + "0.1.0-beta.2.dev.84725b5" + ' initlized!');
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

var _redefine = _hide;

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

var f$3 = _wks;

var _wksExt = {
	f: f$3
};

var _library = true;

var global$4         = _global;
var core$1           = _core;
var LIBRARY        = _library;
var wksExt$1         = _wksExt;
var defineProperty$1 = _objectDp.f;
var _wksDefine = function(name){
  var $Symbol = core$1.Symbol || (core$1.Symbol = LIBRARY ? {} : global$4.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty$1($Symbol, name, {value: wksExt$1.f(name)});
};

var getKeys$1   = _objectKeys;
var toIObject$3 = _toIobject;
var _keyof = function(object, el){
  var O      = toIObject$3(object)
    , keys   = getKeys$1(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

// all enumerable object keys, includes symbols
var getKeys$2 = _objectKeys;
var gOPS$1    = _objectGops;
var pIE$1     = _objectPie;
var _enumKeys = function(it){
  var result     = getKeys$2(it)
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
var cof$1 = _cof;
var _isArray = Array.isArray || function isArray(arg){
  return cof$1(arg) == 'Array';
};

var dP$3       = _objectDp;
var anObject$3 = _anObject;
var getKeys$3  = _objectKeys;

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  anObject$3(O);
  var keys   = getKeys$3(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP$3.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject$2    = _anObject;
var dPs         = _objectDps;
var enumBugKeys$1 = _enumBugKeys;
var IE_PROTO$1    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$2   = 'prototype';

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
  while(i--)delete createDict[PROTOTYPE$2][enumBugKeys$1[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$2] = anObject$2(O);
    result = new Empty;
    Empty[PROTOTYPE$2] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys$2      = _objectKeysInternal;
var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys$2(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject$4 = _toIobject;
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
  return windowNames && toString$2.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$4(it));
};

var _objectGopnExt = {
	f: f$4
};

var pIE$2            = _objectPie;
var createDesc$2     = _propertyDesc;
var toIObject$5      = _toIobject;
var toPrimitive$2    = _toPrimitive;
var has$3            = _has;
var IE8_DOM_DEFINE$1 = _ie8DomDefine;
var gOPD$1           = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
  O = toIObject$5(O);
  P = toPrimitive$2(P, true);
  if(IE8_DOM_DEFINE$1)try {
    return gOPD$1(O, P);
  } catch(e){ /* empty */ }
  if(has$3(O, P))return createDesc$2(!pIE$2.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

// ECMAScript 6 symbols shim
var global$3         = _global;
var has$1            = _has;
var DESCRIPTORS    = _descriptors;
var $export$2        = _export;
var redefine       = _redefine;
var META           = _meta.KEY;
var $fails         = _fails;
var shared$1         = _shared;
var setToStringTag = _setToStringTag;
var uid$1            = _uid;
var wks            = _wks;
var wksExt         = _wksExt;
var wksDefine      = _wksDefine;
var keyOf          = _keyof;
var enumKeys       = _enumKeys;
var isArray$1        = _isArray;
var anObject$1       = _anObject;
var toIObject$2      = _toIobject;
var toPrimitive$1    = _toPrimitive;
var createDesc$1     = _propertyDesc;
var _create        = _objectCreate;
var gOPNExt        = _objectGopnExt;
var $GOPD          = _objectGopd;
var $DP            = _objectDp;
var $keys$1          = _objectKeys;
var gOPD           = $GOPD.f;
var dP$2             = $DP.f;
var gOPN           = gOPNExt.f;
var $Symbol        = global$3.Symbol;
var $JSON          = global$3.JSON;
var _stringify     = $JSON && $JSON.stringify;
var PROTOTYPE$1      = 'prototype';
var HIDDEN         = wks('_hidden');
var TO_PRIMITIVE   = wks('toPrimitive');
var isEnum         = {}.propertyIsEnumerable;
var SymbolRegistry = shared$1('symbol-registry');
var AllSymbols     = shared$1('symbols');
var OPSymbols      = shared$1('op-symbols');
var ObjectProto    = Object[PROTOTYPE$1];
var USE_NATIVE     = typeof $Symbol == 'function';
var QObject        = global$3.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP$2({}, 'a', {
    get: function(){ return dP$2(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP$2(it, key, D);
  if(protoDesc && it !== ObjectProto)dP$2(ObjectProto, key, protoDesc);
} : dP$2;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$1]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject$1(it);
  key = toPrimitive$1(key, true);
  anObject$1(D);
  if(has$1(AllSymbols, key)){
    if(!D.enumerable){
      if(!has$1(it, HIDDEN))dP$2(it, HIDDEN, createDesc$1(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has$1(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc$1(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP$2(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject$1(it);
  var keys = enumKeys(P = toIObject$2(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive$1(key, true));
  if(this === ObjectProto && has$1(AllSymbols, key) && !has$1(OPSymbols, key))return false;
  return E || !has$1(this, key) || !has$1(AllSymbols, key) || has$1(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject$2(it);
  key = toPrimitive$1(key, true);
  if(it === ObjectProto && has$1(AllSymbols, key) && !has$1(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has$1(AllSymbols, key) && !(has$1(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject$2(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has$1(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject$2(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has$1(AllSymbols, key = names[i++]) && (IS_OP ? has$1(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid$1(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has$1(this, HIDDEN) && has$1(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc$1(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE$1], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  _objectGopn.f = gOPNExt.f = $getOwnPropertyNames;
  _objectPie.f  = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_library){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  };
}

$export$2($export$2.G + $export$2.W + $export$2.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys$1(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has$1(SymbolRegistry, key += '')
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

$export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
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
$JSON && $export$2($export$2.S + $export$2.F * (!USE_NATIVE || $fails(function(){
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
$Symbol[PROTOTYPE$1][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global$3.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var index = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": index, __esModule: true };
});

var _Symbol = unwrapExports(symbol);

var $cache = {};
var $methods = {
	node: {},
	list: {},
	blyde: {}
};

var $getSymbol = function $getSymbol() {
	return _Symbol(Math.floor(Math.random() * Math.pow(10, 16)).toString(36));
};

var $node = function $node(node) {
	_classCallCheck(this, $node);

	this.$el = node;
	for (var i in $methods.node) {
		if ($methods.node[i] instanceof Function) this[i] = $methods.node[i].bind(node);else this[i] = $methods.node[i];
	}
	if (!node.$id) Object.defineProperty(node, '$id', { value: $getSymbol() });
	$cache[node.$id] = this;
};
var $nodeList = function $nodeList(list) {
	_classCallCheck(this, $nodeList);

	this.$list = [];
	for (var i = 0; i < list.length; i++) {
		this.$list.push(list[i].$);
	}for (var _i in $methods.list) {
		if ($methods.list[_i] instanceof Function) this[_i] = $methods.list[_i].bind(this.$list);else this[_i] = $methods.node[_i];
	}
};

var plugins = {};

var register = function register(_ref, options) {
	var name = _ref.name,
	    node = _ref.node,
	    list = _ref.list,
	    blyde = _ref.blyde;

	if (!name) return error('Plugin name not precent! Registration aborted.');
	if (name in plugins) return warn('Plugin "' + name + '" has already been registered.');
	for (var i in node) {
		if ($methods.node[i]) {
			if (options.autoNameSpace === 'keep') info('$node property "' + i + '" has been kept.');else {
				var fnName = i;
				if (options.autoNameSpace === 'rename') {
					fnName = name + i;
					info('$node property "' + i + '" has been renamed to "' + fnName + '".');
				} else {
					warn('$node property "' + i + '" in "' + name + '" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.');
				}
				$methods.node[fnName] = node[i];
			}
		} else $methods.node[i] = node[i];
	}
	for (var _i in list) {
		if ($methods.list[_i]) {
			if (options.autoNameSpace === 'keep') info('$nodeList property "' + _i + '" has been kept.');else {
				var _fnName = _i;
				if (options.autoNameSpace === 'rename') {
					_fnName = name + _i;
					info('$nodeList property "' + _i + '" has been renamed to "' + _fnName + '".');
				} else {
					warn('$nodeList property "' + _i + '" in "' + name + '" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.');
				}
				$methods.list[_fnName] = list[_i];
			}
		} else $methods.list[_i] = list[_i];
	}
	for (var _i2 in blyde) {
		if ($methods.blyde[_i2]) {
			if (options.autoNameSpace === 'keep') info('Blyde property "' + _i2 + '" has been kept.');else {
				var _fnName2 = _i2;
				if (options.autoNameSpace === 'rename') {
					_fnName2 = name + _i2;
					info('Blyde property "' + _i2 + '" has been renamed to "' + _fnName2 + '".');
				} else {
					warn('Blyde property "' + _i2 + '" in "' + name + '" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.');
				}
				$methods.blyde[_fnName2] = blyde[_i2];
				Blyde$1[_fnName2] = blyde[_i2];
			}
		} else {
			$methods.blyde[_i2] = blyde[_i2];
			Blyde$1[_i2] = blyde[_i2];
		}
	}
	info('Plugin "' + name + '" loaded.');
};

var takeSnapshot = function takeSnapshot() {
	var methodsShot = {
		node: _Object$assign({}, $methods.node),
		list: _Object$assign({}, $methods.list),
		blyde: _Object$assign({}, $methods.blyde)
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
		version: 'Blyde v' + "0.1.0-beta.2.dev.84725b5",
		plugins: pluginShot,
		$methods: methodsShot,
		$node: $node,
		$nodeList: $nodeList,
		$getSymbol: $getSymbol,
		trace: trace,
		debug: debug,
		info: info,
		warn: warn,
		loglevel: loglevel,
		error: error
	};
};

var regFn = (function (plugin) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	register(plugin(takeSnapshot), options);
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

var _iterators = {};

var create$1         = _objectCreate;
var descriptor     = _propertyDesc;
var setToStringTag$2 = _setToStringTag;
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = create$1(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag$2(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has$5         = _has;
var toObject$1    = _toObject;
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto$1 = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = toObject$1(O);
  if(has$5(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto$1 : null;
};

var LIBRARY$1        = _library;
var $export$3        = _export;
var redefine$1       = _redefine;
var hide$1           = _hide;
var has$4            = _has;
var Iterators      = _iterators;
var $iterCreate    = _iterCreate;
var setToStringTag$1 = _setToStringTag;
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
      setToStringTag$1(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY$1 && !has$4(IteratorPrototype, ITERATOR))hide$1(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY$1 || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
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
      if(!(key in proto))redefine$1(proto, key, methods[key]);
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
var anObject$4 = _anObject;
var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject$4(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject$4(ret.call(iterator));
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

var $defineProperty$1 = _objectDp;
var createDesc$3      = _propertyDesc;

var _createProperty = function(object, index, value){
  if(index in object)$defineProperty$1.f(object, index, createDesc$3(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof$2 = _cof;
var TAG$1 = _wks('toStringTag');
var ARG = cof$2(function(){ return arguments; }()) == 'Arguments';

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
    : ARG ? cof$2(O)
    // ES3 arguments fallback
    : (B = cof$2(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
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
var toObject$2       = _toObject;
var call           = _iterCall;
var isArrayIter    = _isArrayIter;
var toLength$1       = _toLength;
var createProperty = _createProperty;
var getIterFn      = core_getIteratorMethod;

$export$4($export$4.S + $export$4.F * !_iterDetect(function(iter){ Array.from(iter); }), 'Array', {
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
		if (!(selector instanceof Node)) selector = this.querySelector(selector);
		if (selector) return new $node(selector);
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
		delete $cache[this.$id];
		return this;
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
var $export$5 = _export;
var core$2    = _core;
var fails   = _fails;
var _objectSap = function(KEY, exec){
  var fn  = (core$2.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export$5($export$5.S + $export$5.F * fails(function(){ fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)
var toObject$3 = _toObject;
var $keys$3    = _objectKeys;

_objectSap('keys', function(){
  return function keys(it){
    return $keys$3(toObject$3(it));
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
var toIObject$6        = _toIobject;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = toIObject$6(iterated); // target
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

var global$5        = _global;
var hide$2          = _hide;
var Iterators$3     = _iterators;
var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i$1 = 0; i$1 < 5; i$1++){
  var NAME       = collections[i$1]
    , Collection = global$5[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide$2(proto, TO_STRING_TAG, NAME);
  Iterators$3[NAME] = Iterators$3.Array;
}

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
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
	if (velocityUsed) return warn('Velocity.js support has already been enabled!');

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
	version: 'Blyde v' + "0.1.0-beta.2.dev.84725b5",
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

	$getSymbol: $getSymbol,
	useVelocity: useVelocity,
	trace: trace,
	debug: debug,
	info: info,
	warn: warn,
	error: error,
	loglevel: loglevel
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
		return $cache[this.$id] || new $node(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGlkZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwiLi4vc3JjL2RlYnVnLmpzIiwiLi4vc3JjL2JseWRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy1leHQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2tleW9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIi4uL3NyYy9zaGFyZWQuanMiLCIuLi9zcmMvcmVnaXN0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NsYXNzb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXkuanMiLCIuLi9zcmMvbWV0aG9kcy9ub2RlLmpzIiwiLi4vc3JjL21ldGhvZHMvbGlzdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvZ2V0LWl0ZXJhdG9yLmpzIiwiLi4vc3JjL21ldGhvZHMvZXZlbnQuanMiLCIuLi9zcmMvbWV0aG9kcy9ibHlkZS5qcyIsIi4uL3NyYy9sb2FkZXIuanMiLCIuLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIFMpe1xuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZighUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59OyIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnblwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgQVBJXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogUGFja2FnZS1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCBsb2dsZXZlbCBmcm9tICdsb2dsZXZlbCdcbmNvbnN0IGxvZ2dlciA9IGxvZ2xldmVsLmdldExvZ2dlcignYmx5ZGUnKVxuXG5jb25zdCB0cmFjZSA9IGxvZ2dlci50cmFjZS5iaW5kKG51bGwsICdbQmx5ZGVdJylcbmNvbnN0IGRlYnVnID0gbG9nZ2VyLmRlYnVnLmJpbmQobnVsbCwgJ1tCbHlkZV0nKVxuY29uc3QgaW5mbyA9IGxvZ2dlci5pbmZvLmJpbmQobnVsbCwgJ1tCbHlkZV0nKVxuY29uc3Qgd2FybiA9IGxvZ2dlci53YXJuLmJpbmQobnVsbCwgJ1tCbHlkZV0nKVxuY29uc3QgZXJyb3IgPSBsb2dnZXIuZXJyb3IuYmluZChudWxsLCAnW0JseWRlXScpXG5cbmlmIChFTlYgPT09ICdwcm9kdWN0aW9uJykge1xuXHRsb2dnZXIuc2V0TGV2ZWwoJ2Vycm9yJylcbn0gZWxzZSB7XG5cdGxvZ2dlci5zZXRMZXZlbCgndHJhY2UnKVxufVxuXG5pbmZvKCdEZWJ1ZyBsb2dnaW5nIGVuYWJsZWQhJylcblxuZXhwb3J0IHsgdHJhY2UsIGRlYnVnLCBpbmZvLCB3YXJuLCBlcnJvciwgbG9nbGV2ZWwgfVxuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBpbmZvLCB3YXJuIH0gZnJvbSAnLi9kZWJ1Zy5qcydcblxuY29uc3QgaW5pdFF1ZXJ5ID0gW11cbmxldCBsb2FkZWQgPSBmYWxzZVxuXG5jb25zdCBCbHlkZSA9IChmbikgPT4ge1xuXHRpZiAodHlwZW9mKGZuKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChsb2FkZWQpIHtcblx0XHRcdGZuLmNhbGwod2luZG93KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpbml0UXVlcnkucHVzaChmbilcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0d2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH1cbn1cblxuY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCwgZmFsc2UpXG5cdGlmICh3aW5kb3cuVmVsb2NpdHkpIEJseWRlLnVzZVZlbG9jaXR5KHdpbmRvdy5WZWxvY2l0eSlcblx0bG9hZGVkID0gdHJ1ZVxuXHRpbml0UXVlcnkuZm9yRWFjaChpID0+IGkuY2FsbCh3aW5kb3cpKVxuXHRpbmZvKGBCbHlkZSB2JHtWRVJTSU9OfSBpbml0bGl6ZWQhYClcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXQsIGZhbHNlKVxuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIGluaXQoKVxuXG5leHBvcnQgZGVmYXVsdCBCbHlkZVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBzdG9yZSAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgU3ltYm9sICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbFxuICAsIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlOyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHJlc3VsdCAgICAgPSBnZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gcElFLmZcbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgUFJPVE9UWVBFICAgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0gZW51bUJ1Z0tleXMubGVuZ3RoXG4gICAgLCBsdCAgICAgPSAnPCdcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcbiAgdmFyIHJlc3VsdDtcbiAgaWYoTyAhPT0gbnVsbCl7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pe1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCBnT1BOICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmZcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdvYnNlcnZhYmxlJyk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCAkY2FjaGUgPSB7fVxuY29uc3QgJG1ldGhvZHMgPSB7XG5cdG5vZGU6IHt9LFxuXHRsaXN0OiB7fSxcblx0Ymx5ZGU6IHt9XG59XG5cbmNvbnN0ICRnZXRTeW1ib2wgPSAoKSA9PiBTeW1ib2woTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMTAsIDE2KSkudG9TdHJpbmcoMzYpKVxuXG5jb25zdCAkbm9kZSA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3Iobm9kZSkge1xuXHRcdHRoaXMuJGVsID0gbm9kZVxuXHRcdGZvciAobGV0IGkgaW4gJG1ldGhvZHMubm9kZSkge1xuXHRcdFx0aWYgKCRtZXRob2RzLm5vZGVbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbikgdGhpc1tpXSA9ICRtZXRob2RzLm5vZGVbaV0uYmluZChub2RlKVxuXHRcdFx0ZWxzZSB0aGlzW2ldID0gJG1ldGhvZHMubm9kZVtpXVxuXHRcdH1cblx0XHRpZiAoIW5vZGUuJGlkKSBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgJyRpZCcsIHt2YWx1ZTogJGdldFN5bWJvbCgpfSlcblx0XHQkY2FjaGVbbm9kZS4kaWRdID0gdGhpc1xuXHR9XG59XG5jb25zdCAkbm9kZUxpc3QgPSBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKGxpc3QpIHtcblx0XHR0aGlzLiRsaXN0ID0gW11cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHRoaXMuJGxpc3QucHVzaChsaXN0W2ldLiQpXG5cdFx0Zm9yIChsZXQgaSBpbiAkbWV0aG9kcy5saXN0KSB7XG5cdFx0XHRpZiAoJG1ldGhvZHMubGlzdFtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB0aGlzW2ldID0gJG1ldGhvZHMubGlzdFtpXS5iaW5kKHRoaXMuJGxpc3QpXG5cdFx0XHRlbHNlIHRoaXNbaV0gPSAkbWV0aG9kcy5ub2RlW2ldXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCB7ICRjYWNoZSwgJG1ldGhvZHMsICRnZXRTeW1ib2wsICRub2RlLCAkbm9kZUxpc3QgfVxuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCB7ICRnZXRTeW1ib2wsICRtZXRob2RzLCAkbm9kZSwgJG5vZGVMaXN0IH0gZnJvbSAnLi9zaGFyZWQuanMnXG5pbXBvcnQgeyB0cmFjZSwgZGVidWcsIGluZm8sIHdhcm4sIGVycm9yLCBsb2dsZXZlbCB9IGZyb20gJy4vZGVidWcuanMnXG5cbmNvbnN0IHBsdWdpbnMgPSB7fVxuXG5jb25zdCByZWdpc3RlciA9ICh7bmFtZSwgbm9kZSwgbGlzdCwgYmx5ZGV9LCBvcHRpb25zKSA9PiB7XG5cdGlmICghbmFtZSkgcmV0dXJuIGVycm9yKCdQbHVnaW4gbmFtZSBub3QgcHJlY2VudCEgUmVnaXN0cmF0aW9uIGFib3J0ZWQuJylcblx0aWYgKG5hbWUgaW4gcGx1Z2lucykgcmV0dXJuIHdhcm4oYFBsdWdpbiBcIiR7bmFtZX1cIiBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuYClcblx0Zm9yIChsZXQgaSBpbiBub2RlKSB7XG5cdFx0aWYgKCRtZXRob2RzLm5vZGVbaV0pIHtcblx0XHRcdGlmIChvcHRpb25zLmF1dG9OYW1lU3BhY2UgPT09ICdrZWVwJykgaW5mbyhgJG5vZGUgcHJvcGVydHkgXCIke2l9XCIgaGFzIGJlZW4ga2VwdC5gKVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCBmbk5hbWUgPSBpXG5cdFx0XHRcdGlmIChvcHRpb25zLmF1dG9OYW1lU3BhY2UgPT09ICdyZW5hbWUnKSB7XG5cdFx0XHRcdFx0Zm5OYW1lID0gbmFtZSArIGlcblx0XHRcdFx0XHRpbmZvKGAkbm9kZSBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiByZW5hbWVkIHRvIFwiJHtmbk5hbWV9XCIuYClcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3YXJuKGAkbm9kZSBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwib3B0aW9ucy5hdXRvTmFtZVNwYWNlXCIgdG8gXCJyZW5hbWVcIiB0byBrZWVwIGJvdGguYClcblx0XHRcdFx0fVxuXHRcdFx0XHQkbWV0aG9kcy5ub2RlW2ZuTmFtZV0gPSBub2RlW2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlICRtZXRob2RzLm5vZGVbaV0gPSBub2RlW2ldXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBsaXN0KSB7XG5cdFx0aWYgKCRtZXRob2RzLmxpc3RbaV0pIHtcblx0XHRcdGlmIChvcHRpb25zLmF1dG9OYW1lU3BhY2UgPT09ICdrZWVwJykgaW5mbyhgJG5vZGVMaXN0IHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIGtlcHQuYClcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgZm5OYW1lID0gaVxuXHRcdFx0XHRpZiAob3B0aW9ucy5hdXRvTmFtZVNwYWNlID09PSAncmVuYW1lJykge1xuXHRcdFx0XHRcdGZuTmFtZSA9IG5hbWUgKyBpXG5cdFx0XHRcdFx0aW5mbyhgJG5vZGVMaXN0IHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYCRub2RlTGlzdCBwcm9wZXJ0eSBcIiR7aX1cIiBpbiBcIiR7bmFtZX1cIiBoYXMgcmVwbGFjZWQgdGhlIG9yaWdpbmFsIG9uZSwgc2V0IFwib3B0aW9ucy5hdXRvTmFtZVNwYWNlXCIgdG8gXCJyZW5hbWVcIiB0byBrZWVwIGJvdGguYClcblx0XHRcdFx0fVxuXHRcdFx0XHQkbWV0aG9kcy5saXN0W2ZuTmFtZV0gPSBsaXN0W2ldXG5cdFx0XHR9XG5cdFx0fSBlbHNlICRtZXRob2RzLmxpc3RbaV0gPSBsaXN0W2ldXG5cdH1cblx0Zm9yIChsZXQgaSBpbiBibHlkZSkge1xuXHRcdGlmICgkbWV0aG9kcy5ibHlkZVtpXSkge1xuXHRcdFx0aWYgKG9wdGlvbnMuYXV0b05hbWVTcGFjZSA9PT0gJ2tlZXAnKSBpbmZvKGBCbHlkZSBwcm9wZXJ0eSBcIiR7aX1cIiBoYXMgYmVlbiBrZXB0LmApXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IGZuTmFtZSA9IGlcblx0XHRcdFx0aWYgKG9wdGlvbnMuYXV0b05hbWVTcGFjZSA9PT0gJ3JlbmFtZScpIHtcblx0XHRcdFx0XHRmbk5hbWUgPSBuYW1lICsgaVxuXHRcdFx0XHRcdGluZm8oYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGhhcyBiZWVuIHJlbmFtZWQgdG8gXCIke2ZuTmFtZX1cIi5gKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHdhcm4oYEJseWRlIHByb3BlcnR5IFwiJHtpfVwiIGluIFwiJHtuYW1lfVwiIGhhcyByZXBsYWNlZCB0aGUgb3JpZ2luYWwgb25lLCBzZXQgXCJvcHRpb25zLmF1dG9OYW1lU3BhY2VcIiB0byBcInJlbmFtZVwiIHRvIGtlZXAgYm90aC5gKVxuXHRcdFx0XHR9XG5cdFx0XHRcdCRtZXRob2RzLmJseWRlW2ZuTmFtZV0gPSBibHlkZVtpXVxuXHRcdFx0XHRCbHlkZVtmbk5hbWVdID0gYmx5ZGVbaV1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0JG1ldGhvZHMuYmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdFx0Qmx5ZGVbaV0gPSBibHlkZVtpXVxuXHRcdH1cblx0fVxuXHRpbmZvKGBQbHVnaW4gXCIke25hbWV9XCIgbG9hZGVkLmApXG59XG5cbmNvbnN0IHRha2VTbmFwc2hvdCA9ICgpID0+IHtcblx0Y29uc3QgbWV0aG9kc1Nob3QgPSB7XG5cdFx0bm9kZTogT2JqZWN0LmFzc2lnbih7fSwgJG1ldGhvZHMubm9kZSksXG5cdFx0bGlzdDogT2JqZWN0LmFzc2lnbih7fSwgJG1ldGhvZHMubGlzdCksXG5cdFx0Ymx5ZGU6IE9iamVjdC5hc3NpZ24oe30sICRtZXRob2RzLmJseWRlKVxuXHR9XG5cdGNvbnN0IHBsdWdpblNob3QgPSB7fVxuXHRmb3IgKGxldCBpIGluIHBsdWdpbnMpIHtcblx0XHRwbHVnaW5TaG90W2ldID0ge1xuXHRcdFx0bm9kZTogT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luc1tpXS5ub2RlKSxcblx0XHRcdGxpc3Q6IE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbnNbaV0ubGlzdCksXG5cdFx0XHRibHlkZTogT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luc1tpXS5ibHlkZSlcblx0XHR9XG5cdH1cblx0cmV0dXJuIHtcblx0XHR2ZXJzaW9uOiBgQmx5ZGUgdiR7VkVSU0lPTn1gLFxuXHRcdHBsdWdpbnM6IHBsdWdpblNob3QsXG5cdFx0JG1ldGhvZHM6IG1ldGhvZHNTaG90LFxuXHRcdCRub2RlLFxuXHRcdCRub2RlTGlzdCxcblx0XHQkZ2V0U3ltYm9sLFxuXHRcdHRyYWNlLFxuXHRcdGRlYnVnLFxuXHRcdGluZm8sXG5cdFx0d2Fybixcblx0XHRsb2dsZXZlbCxcblx0XHRlcnJvclxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChwbHVnaW4sIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRyZWdpc3RlcihwbHVnaW4odGFrZVNuYXBzaG90KSwgb3B0aW9ucylcbn1cbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElFX1BST1RPICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbihPKXtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGluZGV4LCB2YWx1ZSl7XG4gIGlmKGluZGV4IGluIG9iamVjdCkkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgcmV0dXJuIHtkb25lOiBzYWZlID0gdHJ1ZX07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIGNhbGwgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpXG4gICwgZ2V0SXRlckZuICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBDICAgICAgID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheVxuICAgICAgLCBhTGVuICAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tOyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZnJvbSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2FycmF5L2Zyb21cIik7XG5cbnZhciBfZnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mcm9tKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgYXJyMltpXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKDAsIF9mcm9tMi5kZWZhdWx0KShhcnIpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuLCBlcnJvciB9IGZyb20gJy4uL2RlYnVnLmpzJ1xuaW1wb3J0IHsgJGNhY2hlLCAkbm9kZSwgJG5vZGVMaXN0IH0gZnJvbSAnLi4vc2hhcmVkLmpzJ1xuXG5jb25zdCBzYWZlWm9uZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdHEoc2VsZWN0b3IpIHtcblx0XHRpZiAoIShzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGUpKSBzZWxlY3RvciA9IHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcblx0XHRpZiAoc2VsZWN0b3IpIHJldHVybiBuZXcgJG5vZGUoc2VsZWN0b3IpXG5cdH0sXG5cblx0cWEoc2VsZWN0b3IpIHtcblx0XHRpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBOb2RlTGlzdCkgcmV0dXJuIG5ldyAkbm9kZUxpc3Qoc2VsZWN0b3IpXG5cdFx0cmV0dXJuIG5ldyAkbm9kZUxpc3QodGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblx0fSxcblxuXHRhZGRDbGFzcyhjbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gY2xhc3NOYW1lLnNwbGl0KCcgJylcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcylcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0Y29uc3QgY2xhc3NlcyA9IGNsYXNzTmFtZS5zcGxpdCgnICcpXG5cdFx0dGhpcy5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzKGNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBjbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNvbnN0IGNsYXNzQXJyID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoJyAnKVxuXHRcdGNsYXNzZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0Y29uc3QgY2xhc3NJbmRleCA9IGNsYXNzQXJyLmluZGV4T2YoaSlcblx0XHRcdGlmIChjbGFzc0luZGV4ID4gLTEpIHtcblx0XHRcdFx0Y2xhc3NBcnIuc3BsaWNlKGNsYXNzSW5kZXgsIDEpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGFzc0Fyci5wdXNoKGkpXG5cdFx0XHR9XG5cdFx0fSlcblx0XHR0aGlzLmNsYXNzTmFtZSA9IGNsYXNzQXJyLmpvaW4oJyAnKS50cmltKClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cmVwbGFjZVdpdGgobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZVxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5yZXBsYWNlQ2hpbGQobm9kZSwgdGhpcylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IodGhpcywgJ21heSBub3QgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIGRvY3VtZW50IHByb3Blcmx5LicpXG5cdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0fVxuXHR9LFxuXG5cdHN3YXAobm9kZSkge1xuXHRcdGlmIChub2RlIGluc3RhbmNlb2YgJG5vZGUpIG5vZGUgPSBub2RlLiRlbFxuXHRcdGNvbnN0IHRoaXNQYXJlbnQgPSB0aGlzLnBhcmVudE5vZGVcblx0XHRjb25zdCBub2RlUGFyZW50ID0gbm9kZS5wYXJlbnROb2RlXG5cdFx0Y29uc3QgdGhpc1NpYmxpbmcgPSB0aGlzLm5leHRTaWJsaW5nXG5cdFx0Y29uc3Qgbm9kZVNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nXG5cdFx0aWYgKHRoaXNQYXJlbnQgJiYgbm9kZVBhcmVudCkge1xuXHRcdFx0dGhpc1BhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgdGhpc1NpYmxpbmcpXG5cdFx0XHRub2RlUGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBub2RlU2libGluZylcblx0XHRcdHJldHVybiBub2RlLiRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IGVyck5vZGVzID0gW11cblx0XHRcdGlmICh0aGlzUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2godGhpcylcblx0XHRcdH1cblx0XHRcdGlmIChub2RlUGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHRcdGVyck5vZGVzLnB1c2gobm9kZSlcblx0XHRcdH1cblx0XHRcdGVycm9yKC4uLmVyck5vZGVzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9XG5cdH0sXG5cblx0YmVmb3JlKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdFx0aWYgKGkgaW5zdGFuY2VvZiAkbm9kZSkgaSA9IGkuJGVsXG5cdFx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdFx0fSlcblx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFmdGVyKC4uLm5vZGVzKSB7XG5cdFx0aWYgKHRoaXMucGFyZW50Tm9kZSkge1xuXHRcdFx0Y29uc3QgdGVtcEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0XHR0ZW1wRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaSlcblx0XHRcdH0pXG5cdFx0XHRpZiAodGhpcy5uZXh0U2libGluZykge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRlbXBGcmFnbWVudCwgdGhpcy5uZXh0U2libGluZylcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5hcHBlbmQodGVtcEZyYWdtZW50KVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvcih0aGlzLCAnbWF5IG5vdCBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gZG9jdW1lbnQgcHJvcGVybHkuJylcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJhcHBlbmRcIi4nKVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdGNvbnN0IHRlbXBGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdG5vZGVzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGlmIChpIGluc3RhbmNlb2YgJG5vZGUpIGkgPSBpLiRlbFxuXHRcdFx0dGVtcEZyYWdtZW50LmFwcGVuZENoaWxkKGkpXG5cdFx0fSlcblx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHRyZXR1cm4gdGhpcy4kXG5cdH0sXG5cblx0cHJlcGVuZCguLi5ub2Rlcykge1xuXHRcdGlmIChbMSw5LDExXS5pbmRleE9mKHRoaXMubm9kZVR5cGUpID09PSAtMSkge1xuXHRcdFx0d2FybignVGhpcyBub2RlIHR5cGUgZG9lcyBub3Qgc3VwcG9ydCBtZXRob2QgXCJwcmVwZW5kXCIuJylcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRjb25zdCB0ZW1wRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHRub2Rlcy5yZXZlcnNlKClcblx0XHRub2Rlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpZiAoaSBpbnN0YW5jZW9mICRub2RlKSBpID0gaS4kZWxcblx0XHRcdHRlbXBGcmFnbWVudC5hcHBlbmRDaGlsZChpKVxuXHRcdH0pXG5cdFx0aWYgKHRoaXMuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGhpcy5pbnNlcnRCZWZvcmUodGVtcEZyYWdtZW50LCB0aGlzLiRlbC5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKHRlbXBGcmFnbWVudClcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGFwcGVuZFRvKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdHByZXBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0aWYgKG5vZGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0bm9kZS5pbnNlcnRCZWZvcmUodGhpcywgbm9kZS5maXJzdENoaWxkKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRub2RlLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLiRcblx0fSxcblxuXHRlbXB0eSgpIHtcblx0XHR0aGlzLmlubmVySFRNTCA9ICcnXG5cdH0sXG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKVxuXHRcdGRlbGV0ZSAkY2FjaGVbdGhpcy4kaWRdXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRzYWZlUmVtb3ZlKCkge1xuXHRcdHNhZmVab25lLmFwcGVuZENoaWxkKHRoaXMpXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9XG5cblx0Ly8gYW5pbWF0ZShuYW1lKSB7XG5cdC8vIFx0dGhpcy4kLmFkZENsYXNzKGAke25hbWV9LXRyYW5zYClcblx0Ly8gXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0Ly8gXHRcdHRoaXMuJC5hZGRDbGFzcyhgJHtuYW1lfS1zdGFydGApXG5cdC8vIFx0XHR0aGlzLiQuYWRkQ2xhc3MoYCR7bmFtZX0tZW5kYClcblx0Ly8gXHR9LCAwKVxuXHQvLyBcdHJldHVybiB0aGlzLiRcblx0Ly8gfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuLi9kZWJ1Zy5qcydcbmltcG9ydCBub2RlTWV0aG9kcyBmcm9tICcuL25vZGUuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4uL3NoYXJlZC5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRhZGRDbGFzcyhjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkuYWRkQ2xhc3MoY2xhc3NOYW1lKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRyZW1vdmVDbGFzcyhjbGFzc05hbWUpIHtcblx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdGkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRhcHBlbmRUbyhub2RlKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0Y29uc3Qgbm9kZXMgPSBbXVxuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0bm9kZXMucHVzaChpLiRlbClcblx0XHR9KVxuXHRcdG5vZGVNZXRob2RzLmFwcGVuZC5jYWxsKG5vZGUsIC4uLm5vZGVzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cHJlcGVuZFRvKG5vZGUpIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRjb25zdCBub2RlcyA9IFtdXG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRub2Rlcy5wdXNoKGkuJGVsKVxuXHRcdH0pXG5cdFx0bm9kZU1ldGhvZHMucHJlcGVuZC5jYWxsKG5vZGUsIC4uLm5vZGVzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0dG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSlcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0ZW1wdHkoKSB7XG5cdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpLmVtcHR5KClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0cmVtb3ZlKCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5yZW1vdmUoKVxuXHRcdH0pXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblxuXHRzYWZlUmVtb3ZlKCkge1xuXHRcdHRoaXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0aS5zYWZlUmVtb3ZlKClcblx0XHR9KVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cblx0b24odHlwZSwgZm4sIHVzZUNhcHR1cmUpIHtcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aGlzLmZvckVhY2goKGkpID0+IHtcblx0XHRcdFx0aS5vbih0eXBlLCBmbiwgISF1c2VDYXB0dXJlKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fSBlbHNlIHdhcm4oZm4sICdpcyBub3QgYSBmdW5jdGlvbiEnKVxuXHR9LFxuXG5cdGF0KHR5cGUsIGZuKSB7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkuYXQodHlwZSwgZm4pXG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0b2ZmKHR5cGUsIGZuLCB1c2VDYXB0dXJlKSB7XG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhpcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdGkub2ZmKHR5cGUsIGZuLCAhIXVzZUNhcHR1cmUpXG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0dHJpZ2dlcihldmVudCwgY29uZmlnKSB7XG5cdFx0aWYgKHR5cGVvZiBldmVudCA9PT0gJ3N0cmluZycpIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50LCBjb25maWcpXG5cdFx0dGhpcy5mb3JFYWNoKGkgPT4gaS50cmlnZ2VyKGV2ZW50KSlcblx0fVxufVxuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGZhaWxzICAgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGV4ZWMpe1xuICB2YXIgZm4gID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG4gICAgLCBleHAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTsiLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgJGtleXMgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmtleXM7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59OyIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0ICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3IgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vZGVidWcuanMnXG5pbXBvcnQgeyAkbm9kZSB9IGZyb20gJy4uL3NoYXJlZC5qcydcblxuY29uc3QgbGlzdGVuZXJzID0ge31cbmNvbnN0IGV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0Y29uc3QgdGFyZ2V0cyA9IFtdXG5cdGUucGF0aC5mb3JFYWNoKChpKSA9PiB7XG5cdFx0aWYgKGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdKSB0YXJnZXRzLnB1c2goaSlcblx0fSlcblx0aWYgKHRhcmdldHMubGVuZ3RoID09PSAwKSByZXR1cm5cblx0Zm9yIChsZXQgaSBvZiB0YXJnZXRzKSB7XG5cdFx0aWYgKGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdW2UudHlwZV0pIHtcblx0XHRcdGxldCBpZkJyZWFrID0gZmFsc2Vcblx0XHRcdGxpc3RlbmVyc1t0aGlzLiRpZF1baS4kaWRdW2UudHlwZV0uZm9yRWFjaCgoaikgPT4ge1xuXHRcdFx0XHRpZiAoai5jYWxsKGksIGUpID09PSBmYWxzZSkgaWZCcmVhayA9IHRydWVcblx0XHRcdH0pXG5cdFx0XHRpZiAoaWZCcmVhaykgcmV0dXJuXG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IGhhbmRsZXJzID0ge1xuXHRvbih0eXBlLCBmbiwgdXNlQ2FwdHVyZSA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0eXBlcy5mb3JFYWNoKGkgPT4gdGhpcy5hZGRFdmVudExpc3RlbmVyKGksIGZuLCB1c2VDYXB0dXJlKSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0bGlzdGVuKHR5cGUsIG5vZGUsIGZuKSB7XG5cdFx0aWYgKG5vZGUgaW5zdGFuY2VvZiAkbm9kZSkgbm9kZSA9IG5vZGUuJGVsXG5cdFx0ZWxzZSBub2RlID0gbm9kZS4kLiRlbFxuXHRcdGNvbnN0IHR5cGVzID0gdHlwZS5zcGxpdCgnICcpXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHRpZiAoaSAhPT0gJycpIHtcblx0XHRcdFx0XHRpZiAoIWxpc3RlbmVyc1t0aGlzLiRpZF0pIGxpc3RlbmVyc1t0aGlzLiRpZF0gPSB7fVxuXHRcdFx0XHRcdGlmICghbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF0pIHtcblx0XHRcdFx0XHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihpLCBldmVudEhhbmRsZXIsIHRydWUpXG5cdFx0XHRcdFx0XHRsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXSA9IHt9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1baV0pIGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdW2ldID0gW11cblx0XHRcdFx0XHRsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXS5wdXNoKGZuKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRhdCh0eXBlLCBmbikge1xuXHRcdGhhbmRsZXJzLmxpc3Rlbi5jYWxsKHdpbmRvdywgdHlwZSwgdGhpcywgZm4pXG5cdFx0cmV0dXJuIHRoaXMuJFxuXHR9LFxuXG5cdGRyb3AodHlwZSwgbm9kZSwgZm4pIHtcblx0XHRpZiAobm9kZSBpbnN0YW5jZW9mICRub2RlKSBub2RlID0gbm9kZS4kZWxcblx0XHRlbHNlIG5vZGUgPSBub2RlLiQuJGVsXG5cdFx0Y29uc3QgdHlwZXMgPSB0eXBlLnNwbGl0KCcgJylcblx0XHRpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRpZiAobGlzdGVuZXJzW3RoaXMuJGlkXSAmJiBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXSkge1xuXHRcdFx0XHR0eXBlcy5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGkgIT09ICcnICYmIGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdW2ldKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmbnMgPSBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0Zm5zLnNwbGljZShmbnMuaW5kZXhPZihmbiksIDEpXG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1baV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy4kaWRdW25vZGUuJGlkXVtpXVxuXHRcdFx0XHRcdFx0XHRpZiAoKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBqIGluIGxpc3RlbmVyc1t0aGlzLiRpZF0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsaXN0ZW5lcnNbdGhpcy4kaWRdW2pdW2ldKSByZXR1cm4gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHRcdFx0fSkoKSkgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGksIGV2ZW50SGFuZGxlciwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0aWYgKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLiRpZF1bbm9kZS4kaWRdKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgbGlzdGVuZXJzW3RoaXMuJGlkXVtub2RlLiRpZF1cblx0XHRcdFx0XHRcdFx0XHRpZiAoT2JqZWN0LmtleXMobGlzdGVuZXJzW3RoaXMuJGlkXSkubGVuZ3RoID09PSAwKSBkZWxldGUgbGlzdGVuZXJzW3RoaXMuJGlkXVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuJFxuXHRcdH0gZWxzZSB3YXJuKGZuLCAnaXMgbm90IGEgZnVuY3Rpb24hJylcblx0fSxcblxuXHRvZmYodHlwZSwgZm4sIHVzZUNhcHR1cmUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHR5cGVzID0gdHlwZS5zcGxpdCgnICcpXG5cdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dHlwZXMuZm9yRWFjaCgoaSkgPT4ge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoaSwgZm4sIHVzZUNhcHR1cmUpXG5cdFx0XHRcdGhhbmRsZXJzLmRyb3AuY2FsbCh3aW5kb3csIGksIHRoaXMsIGZuKVxuXHRcdFx0fSlcblx0XHRcdHJldHVybiB0aGlzLiRcblx0XHR9IGVsc2Ugd2FybihmbiwgJ2lzIG5vdCBhIGZ1bmN0aW9uIScpXG5cdH0sXG5cblx0dHJpZ2dlcihldmVudCwgY29uZmlnKSB7XG5cdFx0aWYgKHR5cGVvZiBldmVudCA9PT0gJ3N0cmluZycpIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50LCBjb25maWcpXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuXHRcdHJldHVybiB0aGlzLiRcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyc1xuIiwiLyogZ2xvYmFsIFZFUlNJT04gKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgcmVnRm4gZnJvbSAnLi4vcmVnaXN0ZXIuanMnXG5pbXBvcnQgbm9kZU1ldGhvZHMgZnJvbSAnLi9ub2RlLmpzJ1xuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSAnLi9ldmVudC5qcydcbmltcG9ydCB7ICRnZXRTeW1ib2wgfSBmcm9tICcuLi9zaGFyZWQuanMnXG5pbXBvcnQgeyB0cmFjZSwgZGVidWcsIGluZm8sIHdhcm4sIGVycm9yLCBsb2dsZXZlbCB9IGZyb20gJy4uL2RlYnVnLmpzJ1xuXG5sZXQgdmVsb2NpdHlVc2VkID0gZmFsc2VcblxuY29uc3QgdXNlVmVsb2NpdHkgPSAodikgPT4ge1xuXHRpZiAodmVsb2NpdHlVc2VkKSByZXR1cm4gd2FybignVmVsb2NpdHkuanMgc3VwcG9ydCBoYXMgYWxyZWFkeSBiZWVuIGVuYWJsZWQhJylcblx0cmVnRm4oKCkgPT4ge1xuXHRcdHZlbG9jaXR5VXNlZCA9IHRydWVcblx0XHRyZXR1cm4ge1xuXHRcdFx0bmFtZTogJ1ZlbG9jaXR5Jyxcblx0XHRcdG5vZGU6IHtcblx0XHRcdFx0dmVsb2NpdHkoLi4uYXJncykge1xuXHRcdFx0XHRcdHYodGhpcywgLi4uYXJncylcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRsaXN0OiB7XG5cdFx0XHRcdHZlbG9jaXR5KC4uLmFyZ3MpIHtcblx0XHRcdFx0XHR0aGlzLmZvckVhY2goaSA9PiB2KGkuJGVsLCAuLi5hcmdzKSlcblx0XHRcdFx0XHRyZXR1cm4gdGhpc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0YXV0b05hbWVTcGFjZTogZmFsc2Vcblx0fSlcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHR2ZXJzaW9uOiBgQmx5ZGUgdiR7VkVSU0lPTn1gLFxuXHRmbjogcmVnRm4sXG5cdHE6IG5vZGVNZXRob2RzLnEuYmluZChkb2N1bWVudCksXG5cdHFhOiBub2RlTWV0aG9kcy5xYS5iaW5kKGRvY3VtZW50KSxcblx0b24oLi4uYXJncykge1xuXHRcdGV2ZW50SGFuZGxlcnMub24uY2FsbCh3aW5kb3csIC4uLmFyZ3MpXG5cdFx0cmV0dXJuIHRoaXNcblx0fSxcblx0bGlzdGVuKC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLmxpc3RlbmNhbGwod2luZG93LCAuLi5hcmdzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cdGF0KC4uLmFyZ3MpIHtcblx0XHRldmVudEhhbmRsZXJzLmF0LmNhbGwod2luZG93LCAuLi5hcmdzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cdGRyb3AoLi4uYXJncykge1xuXHRcdGV2ZW50SGFuZGxlcnMuZHJvcC5jYWxsKHdpbmRvdywgLi4uYXJncylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXHRvZmYoLi4uYXJncykge1xuXHRcdGV2ZW50SGFuZGxlcnMub2ZmLmNhbGwod2luZG93LCAuLi5hcmdzKVxuXHRcdHJldHVybiB0aGlzXG5cdH0sXG5cdHRyaWdnZXIoLi4uYXJncykge1xuXHRcdGV2ZW50SGFuZGxlcnMudHJpZ2dlci5jYWxsKHdpbmRvdywgLi4uYXJncylcblx0XHRyZXR1cm4gdGhpc1xuXHR9LFxuXHQkZ2V0U3ltYm9sLFxuXHR1c2VWZWxvY2l0eSxcblx0dHJhY2UsXG5cdGRlYnVnLFxuXHRpbmZvLFxuXHR3YXJuLFxuXHRlcnJvcixcblx0bG9nbGV2ZWxcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9ibHlkZS5qcydcbmltcG9ydCByZWdGbiBmcm9tICcuL3JlZ2lzdGVyLmpzJ1xuaW1wb3J0IG5vZGVNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9ub2RlLmpzJ1xuaW1wb3J0IGxpc3RNZXRob2RzIGZyb20gJy4vbWV0aG9kcy9saXN0LmpzJ1xuaW1wb3J0IGJseWRlTWV0aG9kcyBmcm9tICcuL21ldGhvZHMvYmx5ZGUuanMnXG5pbXBvcnQgZXZlbnRIYW5kbGVycyBmcm9tICcuL21ldGhvZHMvZXZlbnQuanMnXG5pbXBvcnQgeyAkY2FjaGUsICRub2RlIH0gZnJvbSAnLi9zaGFyZWQuanMnXG5cbnJlZ0ZuKCgpID0+IHtcblx0Y29uc3QgcGx1Z2luID0ge1xuXHRcdG5hbWU6ICdCbHlkZScsXG5cdFx0bm9kZTogT2JqZWN0LmFzc2lnbihub2RlTWV0aG9kcywgZXZlbnRIYW5kbGVycyksXG5cdFx0bGlzdDogbGlzdE1ldGhvZHMsXG5cdFx0Ymx5ZGU6IGJseWRlTWV0aG9kc1xuXHR9XG5cdHJldHVybiBwbHVnaW5cbn0sIHtcblx0YXV0b05hbWVTcGFjZTogZmFsc2Vcbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJyQnLCB7XG5cdGdldCgpIHtcblx0XHRyZXR1cm4gJGNhY2hlW3RoaXMuJGlkXSB8fCBuZXcgJG5vZGUodGhpcylcblx0fVxufSlcblxuZXhwb3J0IGRlZmF1bHQgQmx5ZGVcbiIsIi8qIGdsb2JhbCBkZWZpbmUgKi9cbid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgQmx5ZGUgZnJvbSAnLi9sb2FkZXIuanMnXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi9kZWJ1Zy5qcydcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gQmx5ZGVcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZSgoKSA9PiBCbHlkZSlcbn0gZWxzZSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdCbHlkZScsIHsgdmFsdWU6IEJseWRlIH0pXG5cdGlmICh3aW5kb3cuJCkgd2FybihgXCJ3aW5kb3cuJFwiIG1heSBoYXZlIGJlZW4gdGFrZW4gYnkgYW5vdGhlciBsaWJyYXJ5LCB1c2UgXCJ3aW5kb3cuQmx5ZGVcIiBmb3Igbm9uLWNvbmZsaWN0IHVzYWdlLmApXG5cdGVsc2UgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJyQnLCB7IHZhbHVlOiBCbHlkZSB9KVxufVxuIl0sIm5hbWVzIjpbInJlcXVpcmUkJDAiLCJpc09iamVjdCIsInJlcXVpcmUkJDEiLCJkb2N1bWVudCIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwiZFAiLCJnbG9iYWwiLCIkZXhwb3J0IiwidG9TdHJpbmciLCJJT2JqZWN0IiwidG9JbnRlZ2VyIiwibWluIiwidG9JT2JqZWN0IiwiZGVmaW5lZCIsInJlcXVpcmUkJDUiLCJyZXF1aXJlJCQ0IiwidGhpcyIsImxvZ2dlciIsImxvZ2xldmVsIiwiZ2V0TG9nZ2VyIiwidHJhY2UiLCJiaW5kIiwiZGVidWciLCJpbmZvIiwid2FybiIsImVycm9yIiwiRU5WIiwic2V0TGV2ZWwiLCJpbml0UXVlcnkiLCJsb2FkZWQiLCJCbHlkZSIsImZuIiwiY2FsbCIsIndpbmRvdyIsInB1c2giLCJpIiwiaW5pdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJWZWxvY2l0eSIsInVzZVZlbG9jaXR5IiwiZm9yRWFjaCIsIlZFUlNJT04iLCJhZGRFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsImhhcyIsImNvcmUiLCJ3a3NFeHQiLCJkZWZpbmVQcm9wZXJ0eSIsImdldEtleXMiLCJnT1BTIiwicElFIiwiY29mIiwiYW5PYmplY3QiLCJlbnVtQnVnS2V5cyIsIklFX1BST1RPIiwiUFJPVE9UWVBFIiwiJGtleXMiLCJnT1BOIiwicmVxdWlyZSQkNiIsImNyZWF0ZURlc2MiLCJ0b1ByaW1pdGl2ZSIsIklFOF9ET01fREVGSU5FIiwiZ09QRCIsInJlcXVpcmUkJDI5IiwicmVxdWlyZSQkMjgiLCJyZXF1aXJlJCQyNyIsInJlcXVpcmUkJDI2IiwicmVxdWlyZSQkMjUiLCJyZXF1aXJlJCQyNCIsInJlcXVpcmUkJDIzIiwic2hhcmVkIiwicmVxdWlyZSQkMjIiLCJyZXF1aXJlJCQyMSIsInVpZCIsInJlcXVpcmUkJDIwIiwicmVxdWlyZSQkMTkiLCJyZXF1aXJlJCQxOCIsInJlcXVpcmUkJDE3IiwicmVxdWlyZSQkMTYiLCJyZXF1aXJlJCQxNSIsImlzQXJyYXkiLCJyZXF1aXJlJCQxNCIsInJlcXVpcmUkJDEzIiwicmVxdWlyZSQkMTIiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEwIiwicmVxdWlyZSQkOSIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ3IiwiJGNhY2hlIiwiJG1ldGhvZHMiLCIkZ2V0U3ltYm9sIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG93IiwiJG5vZGUiLCJub2RlIiwiJGVsIiwiRnVuY3Rpb24iLCIkaWQiLCJPYmplY3QiLCJ2YWx1ZSIsIiRub2RlTGlzdCIsImxpc3QiLCIkbGlzdCIsImxlbmd0aCIsIiQiLCJwbHVnaW5zIiwicmVnaXN0ZXIiLCJvcHRpb25zIiwibmFtZSIsImJseWRlIiwiYXV0b05hbWVTcGFjZSIsImZuTmFtZSIsInRha2VTbmFwc2hvdCIsIm1ldGhvZHNTaG90IiwicGx1Z2luU2hvdCIsInBsdWdpbiIsImNyZWF0ZSIsInNldFRvU3RyaW5nVGFnIiwidG9PYmplY3QiLCJPYmplY3RQcm90byIsIkxJQlJBUlkiLCJyZWRlZmluZSIsImhpZGUiLCJJdGVyYXRvcnMiLCJJVEVSQVRPUiIsIiRkZWZpbmVQcm9wZXJ0eSIsIlRBRyIsImN0eCIsInRvTGVuZ3RoIiwic2FmZVpvbmUiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwic2VsZWN0b3IiLCJOb2RlIiwicXVlcnlTZWxlY3RvciIsIk5vZGVMaXN0IiwicXVlcnlTZWxlY3RvckFsbCIsImNsYXNzTmFtZSIsImNsYXNzZXMiLCJzcGxpdCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImNsYXNzQXJyIiwiY2xhc3NJbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJqb2luIiwidHJpbSIsInBhcmVudCIsInBhcmVudE5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJ0aGlzUGFyZW50Iiwibm9kZVBhcmVudCIsInRoaXNTaWJsaW5nIiwibmV4dFNpYmxpbmciLCJub2RlU2libGluZyIsImluc2VydEJlZm9yZSIsImVyck5vZGVzIiwidGVtcEZyYWdtZW50Iiwibm9kZXMiLCJyZXZlcnNlIiwiYXBwZW5kQ2hpbGQiLCJhcHBlbmQiLCJub2RlVHlwZSIsImZpcnN0Q2hpbGQiLCJpbm5lckhUTUwiLCJyZW1vdmVDaGlsZCIsImVtcHR5Iiwic2FmZVJlbW92ZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJwcmVwZW5kIiwidG9nZ2xlQ2xhc3MiLCJ0eXBlIiwidXNlQ2FwdHVyZSIsIm9uIiwiYXQiLCJvZmYiLCJldmVudCIsImNvbmZpZyIsIkV2ZW50IiwidHJpZ2dlciIsImdldCIsImxpc3RlbmVycyIsImV2ZW50SGFuZGxlciIsImUiLCJ0YXJnZXRzIiwicGF0aCIsImoiLCJpZkJyZWFrIiwiaGFuZGxlcnMiLCJ0eXBlcyIsImxpc3RlbiIsImZucyIsImRyb3AiLCJkaXNwYXRjaEV2ZW50IiwidmVsb2NpdHlVc2VkIiwidiIsImFyZ3MiLCJyZWdGbiIsIm5vZGVNZXRob2RzIiwicSIsInFhIiwibGlzdGVuY2FsbCIsImV2ZW50SGFuZGxlcnMiLCJsaXN0TWV0aG9kcyIsImJseWRlTWV0aG9kcyIsInByb3RvdHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSSxNQUFNLEdBQUcsY0FBYyxHQUFHLE9BQU8sTUFBTSxJQUFJLFdBQVcsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUk7SUFDN0UsTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7QUFDaEcsR0FBRyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQzs7OztBQ0h2QyxJQUFJLElBQUksR0FBRyxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0MsR0FBRyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQzs7O0FDRHJDLGNBQWMsR0FBRyxTQUFTLEVBQUUsQ0FBQztFQUMzQixHQUFHLE9BQU8sRUFB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
