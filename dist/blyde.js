/* global console, Velocity */
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

		var nodeMethods = {
			$q: function $q(selector) {
				return this.querySelector(selector);
			},
			$qa: function $qa(selector) {
				return this.querySelectorAll(selector);
			},
			addClass: function addClass(className) {
				var _classList;

				var classes = className.split(' ');
				(_classList = this.classList).add.apply(_classList, _toConsumableArray(classes));
				return this;
			},
			removeClass: function removeClass(className) {
				var _classList2;

				var classes = className.split(' ');
				(_classList2 = this.classList).remove.apply(_classList2, _toConsumableArray(classes));
				return this;
			},
			toggleClass: function toggleClass(className) {
				var classes = className.split(' ');
				var classArr = this.className.split(' ');
				for (var i in classes) {
					var classIndex = classArr.indexOf(classes[i]);
					if (classIndex > -1) {
						classArr.splice(classIndex, 1);
					} else {
						classArr.push(classes[i]);
					}
				}
				this.className = classArr.join(' ').trim();
				return this;
			},
			replaceWith: function replaceWith(node) {
				var parent = this.parentNode;
				if (parent) {
					parent.replaceChild(node, this);
					return node;
				} else {
					error(this, 'may not have been attached to document properly.');
					return this;
				}
			},
			swap: function swap(node) {
				var thisParent = this.parentNode;
				var nodeParent = node.parentNode;
				var thisSibling = this.nextSibling;
				var nodeSibling = node.nextSibling;
				if (thisParent && nodeParent) {
					thisParent.insertBefore(node, thisSibling);
					nodeParent.insertBefore(this, nodeSibling);
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
				if (this.parentNode) {
					var tempFragment = document.createDocumentFragment();

					for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
						nodes[_key3] = arguments[_key3];
					}

					nodes.reverse();
					for (var i in nodes) {
						tempFragment.appendChild(nodes[i]);
					}
					this.parentNode.insertBefore(tempFragment, this);
				} else {
					error(this, 'may not have been attached to document properly.');
				}
				return this;
			},
			after: function after() {
				if (this.parentNode) {
					var tempFragment = document.createDocumentFragment();

					for (var _len4 = arguments.length, nodes = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
						nodes[_key4] = arguments[_key4];
					}

					for (var i in nodes) {
						tempFragment.appendChild(nodes[i]);
					}
					if (this.nextSibling) {
						this.parentNode.insertBefore(tempFragment, this.nextSibling);
					} else {
						this.parentNode.append(tempFragment);
					}
				} else {
					error(this, 'may not have been attached to document properly.');
				}
				return this;
			},
			append: function append() {
				var tempFragment = document.createDocumentFragment();

				for (var _len5 = arguments.length, nodes = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
					nodes[_key5] = arguments[_key5];
				}

				for (var i in nodes) {
					tempFragment.appendChild(nodes[i]);
				}
				this.appendChild(tempFragment);
				return this;
			},
			prepend: function prepend() {
				var tempFragment = document.createDocumentFragment();

				for (var _len6 = arguments.length, nodes = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
					nodes[_key6] = arguments[_key6];
				}

				nodes.reverse();
				for (var i in nodes) {
					tempFragment.appendChild(nodes[i]);
				}
				if (this.firstChild) {
					this.insertBefore(tempFragment, this.firstChild);
				} else {
					this.appendChild(tempFragment);
				}
				return this;
			},
			appendTo: function appendTo(node) {
				node.appendChild(this);
				return this;
			},
			prependTo: function prependTo(node) {
				if (node.firstChild) {
					node.insertBefore(this, node.firstChild);
				} else {
					node.appendChild(this);
				}
				return this;
			},
			empty: function empty() {
				this.innerHTML = '';
			},
			remove: function remove() {
				this.parentNode.removeChild(this);
				return this;
			},
			on: function on(type, fn, useCapture) {
				if (typeof fn === 'function') {
					this.addEventListener(type, fn, !!useCapture);
				} else {
					error(fn, 'is not a function!');
				}
			},
			un: function un(type, fn, useCapture) {
				if (typeof fn === 'function') {
					this.removeEventListener(type, fn, !!useCapture);
				} else {
					error(fn, 'is not a function!');
				}
			}
		};

		var listMethods = {
			addClass: function addClass(className) {
				var classes = className.split(' ');
				for (var i = 0; i < this.length; i++) {
					var _i$classList;

					(_i$classList = this[i].classList).add.apply(_i$classList, _toConsumableArray(classes));
				}
				return this;
			},
			removeClass: function removeClass(className) {
				var classes = className.split(' ');
				for (var i = 0; i < this.length; i++) {
					var _i$classList2;

					(_i$classList2 = this[i].classList).remove.apply(_i$classList2, _toConsumableArray(classes));
				}
				return this;
			},
			appendTo: function appendTo(node) {
				var _nodeMethods$append;

				var nodes = [];
				for (var i = 0; i < this.length; i++) {
					nodes.push(this[i]);
				}
				(_nodeMethods$append = nodeMethods.append).call.apply(_nodeMethods$append, [node].concat(nodes));
				return this;
			},
			prependTo: function prependTo(node) {
				var _nodeMethods$prepend;

				var nodes = [];
				for (var i = 0; i < this.length; i++) {
					nodes.push(this[i]);
				}
				(_nodeMethods$prepend = nodeMethods.prepend).call.apply(_nodeMethods$prepend, [node].concat(nodes));
				return this;
			},
			toggleClass: function toggleClass(className) {
				for (var i = 0; i < this.length; i++) {
					nodeMethods.toggleClass.call(this[i], className);
				}
				return this;
			},
			empty: function empty() {
				for (var i = 0; i < this.length; i++) {
					nodeMethods.empty.call(this[i]);
				}
				return this;
			},
			remove: function remove() {
				for (var i = 0; i < this.length; i++) {
					nodeMethods.remove.call(this[i]);
				}
				return this;
			},
			on: function on(type, fn, useCapture) {
				if (typeof fn === 'function') {
					for (var i = 0; i < this.length; i++) {
						this[i].addEventListener(type, fn, !!useCapture);
					}
				} else {
					error(fn, 'is not a function!');
				}
			},
			un: function un(type, fn, useCapture) {
				if (typeof fn === 'function') {
					for (var i = 0; i < this.length; i++) {
						this[i].removeEventListener(type, fn, !!useCapture);
					}
				} else {
					error(fn, 'is not a function!');
				}
			}
		};

		var methods = [];
		var methodList = {
			node: [],
			list: []
		};
		Object.defineProperties(methods, {
			node: {
				value: function () {
					var nodeContainer = [];
					for (var i in nodeMethods) {
						Object.defineProperty(nodeContainer, i, {
							value: nodeMethods[i]
						});
						methodList.node.push(i);
					}
					return nodeContainer;
				}()
			},
			list: {
				value: function () {
					var listContainer = [];
					for (var i in listMethods) {
						Object.defineProperty(listContainer, i, {
							value: listMethods[i]
						});
						methodList.list.push(i);
					}
					return listContainer;
				}()
			}
		});

		var regFn = function regFn(name, fns, autoNameSpace) {
			for (var i in fns.node) {
				if (typeof methods.node[i] !== 'undefined') {
					if (autoNameSpace) {
						Object.defineProperty(methods.node, name + i, { value: fns.node[i] });
						methodList.node.push(name + i);
						warn('Node property "' + i + '" has been set as "' + (name + i) + '".');
					} else {
						warn('Node property "' + i + '" in "' + name + '" conflicts with the original one, set "autoNameSpace" true to get this problem solved.');
					}
				} else {
					Object.defineProperty(methods.node, i, { value: fns.node[i] });
					methodList.node.push(i);
				}
			}
			for (var _i in fns.list) {
				if (typeof methods.list[_i] !== 'undefined') {
					if (autoNameSpace) {
						Object.defineProperty(methods.list, name + _i, { value: fns.list[_i] });
						methodList.list.push(name + _i);
						warn('Nodelist property "' + _i + '" has been set as "' + (name + _i) + '".');
					} else {
						warn('Nodelist property "' + _i + '" in "' + name + '" conflicts with the original one, set "autoNameSpace" true to get this problem solved.');
					}
				} else {
					Object.defineProperty(methods.list, _i, { value: fns.list[_i] });
					methodList.list.push(_i);
				}
			}
		};

		var loaded = false;

		var initQuery = [];

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

		var init = function init() {
			document.removeEventListener('DOMContentLoaded', init, false);

			if (window.Velocity) {
				regFn('blyde', {
					node: {
						velocity: function velocity() {
							for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
								args[_key7] = arguments[_key7];
							}

							Velocity.apply(undefined, [this].concat(args));
							return this;
						}
					},
					list: {
						velocity: function velocity() {
							for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
								args[_key8] = arguments[_key8];
							}

							for (var i = 0; i < this.length; i++) {
								Velocity.apply(undefined, [this[i]].concat(args));
							}
							return this;
						}
					}
				}, true);
			}

			Object.defineProperties(Element.prototype, function () {
				var properties = {};
				for (var i in methodList.node) {
					properties[methodList.node[i]] = {
						value: methods.node[methodList.node[i]]
					};
				}
				return properties;
			}());

			Object.defineProperties(NodeList.prototype, function () {
				var properties = {};
				for (var i in methodList.list) {
					properties[methodList.list[i]] = {
						value: methods.list[methodList.list[i]]
					};
				}
				return properties;
			}());

			for (var i in initQuery) {
				initQuery[i].call(window);
			}
			loaded = true;
		};

		Object.defineProperties(Blyde, {
			'version': {
				value: 'Blyde v0.0.2 beta'
			},
			'fn': {
				value: regFn
			},
			'methods': {
				value: methods
			}
		});

		Object.defineProperties(document, {
			'$q': {
				value: nodeMethods.$q
			},
			'$qa': {
				value: nodeMethods.$qa
			}
		});

		Object.defineProperties(window, {
			'Blyde': {
				value: Blyde
			},
			'$': {
				value: Blyde
			},
			'$q': {
				value: nodeMethods.$q.bind(document)
			},
			'$qa': {
				value: nodeMethods.$qa.bind(document)
			},
			'$create': {
				value: $create
			}
		});

		document.addEventListener('DOMContentLoaded', init, false);
		if (document.readyState === "interactive" || document.readyState === "complete") {
			init();
		}
	})();
}