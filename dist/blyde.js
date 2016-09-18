/* global console, define */
/* eslint linebreak-style: ["error", "unix"] */
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
	(function () {
		var $create = function $create(tag) {
			return document.createElement(tag);
		};

		var error = function error() {
			var _console;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return (_console = console).error.apply(_console, ['[Blyde]'].concat(args));
		};
		var warn = function warn() {
			var _console2;

			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return (_console2 = console).warn.apply(_console2, ['[Blyde]'].concat(args));
		};

		var $cache = [];
		var safeZone = document.createDocumentFragment();

		var methods = {
			node: {},
			list: {},
			Blyde: {}
		};
		var $node = function $node(node) {
			_classCallCheck(this, $node);

			this.$el = node;
			node.$id = $cache.length;
			$cache.push(this);
		};
		var $nodeList = function (_Array) {
			_inherits($nodeList, _Array);

			function $nodeList() {
				_classCallCheck(this, $nodeList);

				return _possibleConstructorReturn(this, ($nodeList.__proto__ || Object.getPrototypeOf($nodeList)).apply(this, arguments));
			}

			return $nodeList;
		}(Array);

		var initQuery = [];
		var loaded = false;
		var velocityUsed = false;

		var Blyde = function Blyde(fn) {
			if (typeof fn === 'function') {
				if (loaded) {
					fn.call(window);
				} else {
					initQuery.push(fn);
				}
			} else {
				error(fn, 'is not a function!');
			}
		};

		var regFn = function regFn(name, fns, autoNameSpace) {
			for (var i in fns.node) {
				var fnName = i;
				if (typeof methods.node[i] !== 'undefined') {
					if (autoNameSpace) {
						fnName = name + i;
						warn('Node property "' + i + '" has been set as "' + (name + i) + '".');
					} else {
						warn('Node property "' + i + '" in "' + name + '" conflicts with the original one, set "autoNameSpace" true to get this problem solved.');
					}
				}
				methods.node[fnName] = fns.node[i];
				Object.defineProperty($node.prototype, fnName, { value: fns.node[i] });
			}
			for (var _i in fns.list) {
				var _fnName = _i;
				if (typeof methods.list[_i] !== 'undefined') {
					if (autoNameSpace) {
						_fnName = name + _i;
						warn('Nodelist property "' + _i + '" has been set as "' + (name + _i) + '".');
					} else {
						warn('Nodelist property "' + _i + '" in "' + name + '" conflicts with the original one, set "autoNameSpace" true to get this problem solved.');
					}
				}
				methods.list[_fnName] = fns.list[_i];
				Object.defineProperty($nodeList.prototype, _fnName, { value: fns.list[_i] });
			}
			for (var _i2 in fns.Blyde) {
				var _fnName2 = _i2;
				if (typeof methods.Blyde[_i2] !== 'undefined') {
					if (autoNameSpace) {
						_fnName2 = name + _i2;
						warn('Blyde property "' + _i2 + '" has been set as "' + (name + _i2) + '".');
					} else {
						warn('Blyde property "' + _i2 + '" in "' + name + '" conflicts with the original one, set "autoNameSpace" true to get this problem solved.');
					}
				}
				methods.Blyde[_fnName2] = fns.Blyde[_i2];
				Object.defineProperty(Blyde, _fnName2, { value: fns.Blyde[_i2] });
			}
		};

		var useVelocity = function useVelocity(v) {
			if (velocityUsed) return;
			regFn('Blyde', {
				node: {
					velocity: function velocity() {
						for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
							args[_key3] = arguments[_key3];
						}

						v.apply(undefined, [this].concat(args));
						return this;
					}
				},
				list: {
					velocity: function velocity() {
						for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
							args[_key4] = arguments[_key4];
						}

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var i = _step.value;

								v.apply(undefined, [i].concat(args));
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

						return this;
					}
				}
			}, true);
			velocityUsed = true;
		};

		var nodeMethods = {
			q: function q(selector) {
				var selected = selector;
				if (!(selector instanceof Node)) {
					selected = this.$el.querySelector(selector);
				}
				if (typeof selected.$id !== 'undefined' && selected.$id in $cache) return $cache[selected.$id];else return new $node(selected);
			},
			qa: function qa(selector) {
				if (selector instanceof NodeList) return new (Function.prototype.bind.apply($nodeList, [null].concat(_toConsumableArray(selector))))();
				return new (Function.prototype.bind.apply($nodeList, [null].concat(_toConsumableArray(this.$el.querySelectorAll(selector)))))();
			},
			addClass: function addClass(className) {
				var _$el$classList;

				var classes = className.split(' ');
				(_$el$classList = this.$el.classList).add.apply(_$el$classList, _toConsumableArray(classes));
				return this;
			},
			removeClass: function removeClass(className) {
				var _$el$classList2;

				var classes = className.split(' ');
				(_$el$classList2 = this.$el.classList).remove.apply(_$el$classList2, _toConsumableArray(classes));
				return this;
			},
			toggleClass: function toggleClass(className) {
				var classes = className.split(' ');
				var classArr = this.$el.className.split(' ');
				for (var i in classes) {
					var classIndex = classArr.indexOf(classes[i]);
					if (classIndex > -1) {
						classArr.splice(classIndex, 1);
					} else {
						classArr.push(classes[i]);
					}
				}
				this.$el.className = classArr.join(' ').trim();
				return this;
			},
			replaceWith: function replaceWith(node) {
				if (node instanceof $node) node = node.$el;
				var parent = this.$el.parentNode;
				if (parent) {
					parent.replaceChild(node, this);
					return node;
				} else {
					error(this, 'may not have been attached to document properly.');
					return this;
				}
			},
			swap: function swap(node) {
				if (node instanceof $node) node = node.$el;
				var thisParent = this.$el.parentNode;
				var nodeParent = node.parentNode;
				var thisSibling = this.$el.nextSibling;
				var nodeSibling = node.nextSibling;
				if (thisParent && nodeParent) {
					thisParent.insertBefore(node, thisSibling);
					nodeParent.insertBefore(this.$el, nodeSibling);
					return node;
				} else {
					var errNodes = [];
					if (thisParent === null) {
						errNodes.push(this);
					}
					if (nodeParent === null) {
						errNodes.push(node);
					}
					error.apply(undefined, errNodes.concat(['may not have been attached to document properly.']));
					return this;
				}
			},
			before: function before() {
				if (this.$el.parentNode) {
					var _tempFragment = document.createDocumentFragment();

					for (var _len5 = arguments.length, nodes = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
						nodes[_key5] = arguments[_key5];
					}

					nodes.reverse();
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var i = _step2.value;

							if (i instanceof $node) i = i.$el;
							_tempFragment.appendChild(i);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					this.$el.parentNode.insertBefore(_tempFragment, this);
				} else {
					error(this, 'may not have been attached to document properly.');
				}
				return this;
			},
			after: function after() {
				if (this.$el.parentNode) {
					var _tempFragment2 = document.createDocumentFragment();

					for (var _len6 = arguments.length, nodes = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
						nodes[_key6] = arguments[_key6];
					}

					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var i = _step3.value;

							if (i instanceof $node) i = i.$el;
							_tempFragment2.appendChild(i);
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					if (this.$el.nextSibling) {
						this.$el.parentNode.insertBefore(_tempFragment2, this.$el.nextSibling);
					} else {
						this.$el.parentNode.append(_tempFragment2);
					}
				} else {
					error(this, 'may not have been attached to document properly.');
				}
				return this;
			},
			append: function append() {
				if ([1, 9, 11].indexOf(this.$el.nodeType) === -1) {
					error('This node type does not support method "append".');
					return;
				}
				var tempFragment = document.createDocumentFragment();

				for (var _len7 = arguments.length, nodes = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
					nodes[_key7] = arguments[_key7];
				}

				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var i = _step4.value;

						if (i instanceof $node) i = i.$el;
						tempFragment.appendChild(i);
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				this.$el.appendChild(tempFragment);
				return this;
			},
			prepend: function prepend() {
				if ([1, 9, 11].indexOf(this.$el.nodeType) === -1) {
					error('This node type does not support method "prepend".');
					return;
				}
				var tempFragment = document.createDocumentFragment();

				for (var _len8 = arguments.length, nodes = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
					nodes[_key8] = arguments[_key8];
				}

				nodes.reverse();
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = nodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var i = _step5.value;

						if (i instanceof $node) i = i.$el;
						tempFragment.appendChild(i);
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				if (this.$el.firstChild) {
					this.$el.insertBefore(tempFragment, this.$el.firstChild);
				} else {
					this.$el.appendChild(tempFragment);
				}
				return this;
			},
			appendTo: function appendTo(node) {
				if (node instanceof $node) node = node.$el;
				node.appendChild(this);
				return this;
			},
			prependTo: function prependTo(node) {
				if (node instanceof $node) node = node.$el;
				if (node.firstChild) {
					node.insertBefore(this, node.firstChild);
				} else {
					node.appendChild(this);
				}
				return this;
			},
			empty: function empty() {
				this.$el.innerHTML = '';
			},
			remove: function remove() {
				this.$el.parentNode.removeChild(this.$el);
				return this;
			},
			safeRemove: function safeRemove() {
				safeZone.appendChild(this.$el);
				return this;
			},
			on: function on(type, fn, useCapture) {
				if (typeof fn === 'function') {
					this.$el.addEventListener(type, fn, !!useCapture);
				} else {
					error(fn, 'is not a function!');
				}
			},
			un: function un(type, fn, useCapture) {
				if (typeof fn === 'function') {
					this.$el.removeEventListener(type, fn, !!useCapture);
				} else {
					error(fn, 'is not a function!');
				}
			}
		};

		var listMethods = {
			addClass: function addClass(className) {
				var classes = className.split(' ');
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var _i$classList;

						var i = _step6.value;

						(_i$classList = i.classList).add.apply(_i$classList, _toConsumableArray(classes));
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}

				return this;
			},
			removeClass: function removeClass(className) {
				var classes = className.split(' ');
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var _i$classList2;

						var i = _step7.value;

						(_i$classList2 = i.classList).remove.apply(_i$classList2, _toConsumableArray(classes));
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7.return) {
							_iterator7.return();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}

				return this;
			},
			appendTo: function appendTo(node) {
				var _nodeMethods$append;

				if (node instanceof $node) node = node.$el;
				var nodes = [];
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var i = _step8.value;

						nodes.push(i);
					}
				} catch (err) {
					_didIteratorError8 = true;
					_iteratorError8 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion8 && _iterator8.return) {
							_iterator8.return();
						}
					} finally {
						if (_didIteratorError8) {
							throw _iteratorError8;
						}
					}
				}

				(_nodeMethods$append = nodeMethods.append).call.apply(_nodeMethods$append, [node].concat(nodes));
				return this;
			},
			prependTo: function prependTo(node) {
				var _nodeMethods$prepend;

				if (node instanceof $node) node = node.$el;
				var nodes = [];
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = this[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var i = _step9.value;

						nodes.push(i);
					}
				} catch (err) {
					_didIteratorError9 = true;
					_iteratorError9 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion9 && _iterator9.return) {
							_iterator9.return();
						}
					} finally {
						if (_didIteratorError9) {
							throw _iteratorError9;
						}
					}
				}

				(_nodeMethods$prepend = nodeMethods.prepend).call.apply(_nodeMethods$prepend, [node].concat(nodes));
				return this;
			},
			toggleClass: function toggleClass(className) {
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = this[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var i = _step10.value;

						nodeMethods.toggleClass.call(i, className);
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}

				return this;
			},
			empty: function empty() {
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = this[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var i = _step11.value;

						nodeMethods.empty.call(i);
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				return this;
			},
			remove: function remove() {
				var _iteratorNormalCompletion12 = true;
				var _didIteratorError12 = false;
				var _iteratorError12 = undefined;

				try {
					for (var _iterator12 = this[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
						var i = _step12.value;

						nodeMethods.remove.call(i);
					}
				} catch (err) {
					_didIteratorError12 = true;
					_iteratorError12 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion12 && _iterator12.return) {
							_iterator12.return();
						}
					} finally {
						if (_didIteratorError12) {
							throw _iteratorError12;
						}
					}
				}

				return this;
			},
			safeRemove: function safeRemove() {
				var _iteratorNormalCompletion13 = true;
				var _didIteratorError13 = false;
				var _iteratorError13 = undefined;

				try {
					for (var _iterator13 = this[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
						var i = _step13.value;

						nodeMethods.safeRemove.call(i);
					}
				} catch (err) {
					_didIteratorError13 = true;
					_iteratorError13 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion13 && _iterator13.return) {
							_iterator13.return();
						}
					} finally {
						if (_didIteratorError13) {
							throw _iteratorError13;
						}
					}
				}

				return this;
			},
			on: function on(type, fn, useCapture) {
				if (typeof fn === 'function') {
					var _iteratorNormalCompletion14 = true;
					var _didIteratorError14 = false;
					var _iteratorError14 = undefined;

					try {
						for (var _iterator14 = this[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
							var i = _step14.value;

							this[i].addEventListener(type, fn, !!useCapture);
						}
					} catch (err) {
						_didIteratorError14 = true;
						_iteratorError14 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion14 && _iterator14.return) {
								_iterator14.return();
							}
						} finally {
							if (_didIteratorError14) {
								throw _iteratorError14;
							}
						}
					}
				} else {
					error(fn, 'is not a function!');
				}
			},
			un: function un(type, fn, useCapture) {
				if (typeof fn === 'function') {
					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = this[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var i = _step15.value;

							this[i].removeEventListener(type, fn, !!useCapture);
						}
					} catch (err) {
						_didIteratorError15 = true;
						_iteratorError15 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion15 && _iterator15.return) {
								_iterator15.return();
							}
						} finally {
							if (_didIteratorError15) {
								throw _iteratorError15;
							}
						}
					}
				} else {
					error(fn, 'is not a function!');
				}
			}
		};

		var blydeMethods = {
			version: 'Blyde v0.1.0',
			fn: regFn,
			methods: methods,
			q: nodeMethods.q.bind(new $node(document)),
			qa: nodeMethods.qa.bind(new $node(document)),
			create: $create,
			on: nodeMethods.on.bind(new $node(window)),
			un: nodeMethods.on.bind(new $node(window)),
			useVelocity: useVelocity
		};

		regFn('Blyde', {
			node: nodeMethods,
			list: listMethods,
			Blyde: blydeMethods
		});

		Object.defineProperty(Node.prototype, '$', {
			get: function get() {
				if (this.$id && this.$id in $cache) return $cache[this.$id];else return nodeMethods.q(this);
			}
		});

		var init = function init() {
			document.removeEventListener('DOMContentLoaded', init, false);

			if (window.Velocity) useVelocity(window.Velocity);

			loaded = true;

			for (var i in initQuery) {
				initQuery[i].call(window);
			}
		};

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = Blyde;
		} else if (typeof define === 'function' && define.amd) {
			define(function () {
				return Blyde;
			});
		} else {
			document.addEventListener('DOMContentLoaded', init, false);
			if (document.readyState === "interactive" || document.readyState === "complete") init();
			Object.defineProperties(window, {
				Blyde: {
					value: Blyde
				},
				$: {
					value: Blyde
				}
			});
		}
	})();
}