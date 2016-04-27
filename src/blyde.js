/* global console */
"use strict";
{
	const $create = tag => document.createElement(tag);

	const error = (...args) => console.error('[Blyde]', ...args);
	const warn = (...args) => console.warn('[Blyde]', ...args);

	const nodeMethods = {
		$q(selector) {
			return this.querySelector(selector);
		},

		$qa(selector) {
			return this.querySelectorAll(selector);
		},

		addClass(className) {
			let classes = className.split(' ');
			this.classList.add(...classes);
			return this;
		},

		removeClass(className) {
			let classes = className.split(' ');
			this.classList.remove(...classes);
			return this;
		},

		toggleClass(className) {
			let classes = className.split(' ');
			let classArr = this.className.split(' ');
			for (let i in classes) {
				let classIndex = classArr.indexOf(classes[i]);
				if (classIndex > -1) {
					classArr.splice(classIndex, 1);
				} else {
					classArr.push(classes[i]);
				}
			}
			this.className = classArr.join(' ').trim();
			return this;
		},

		replaceWith(node) {
			let parent = this.parentNode;
			if (parent) {
				parent.replaceChild(node, this);
				return node;
			} else {
				error(this, 'may not have been attached to document properly.');
				return this;
			}
		},

		swap(node) {
			let thisParent = this.parentNode;
			let nodeParent = node.parentNode;
			let thisSibling = this.nextSibling;
			let nodeSibling = node.nextSibling;
			if (thisParent && nodeParent) {
				thisParent.insertBefore(node, thisSibling);
				nodeParent.insertBefore(this, nodeSibling);
				return node;
			} else {
				let errNodes = [];
				if (thisParent === null) {
					errNodes.push(this);
				}
				if (nodeParent === null) {
					errNodes.push(node);
				}
				error(...errNodes, 'may not have been attached to document properly.');
				return this;
			}
		},

		before(...nodes) {
			if (this.parentNode) {
				let tempFragment = document.createDocumentFragment();
				nodes.reverse();
				for (let i in nodes) {
					tempFragment.appendChild(nodes[i]);
				}
				this.parentNode.insertBefore(tempFragment, this);
			} else {
				error(this, 'may not have been attached to document properly.');
			}
			return this;
		},

		after(...nodes) {
			if (this.parentNode) {
				let tempFragment = document.createDocumentFragment();
				for (let i in nodes) {
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

		append(...nodes) {
			let tempFragment = document.createDocumentFragment();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			this.appendChild(tempFragment);
			return this;
		},

		prepend(...nodes) {
			let tempFragment = document.createDocumentFragment();
			nodes.reverse();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			if (this.firstChild) {
				this.insertBefore(tempFragment, this.firstChild);
			} else {
				this.appendChild(tempFragment);
			}
			return this;
		},

		appendTo(node) {
			node.appendChild(this);
			return this;
		},

		prependTo(node) {
			if (node.firstChild) {
				node.insertBefore(this, node.firstChild);
			} else {
				node.appendChild(this);
			}
			return this;
		},

		empty() {
			this.innerHTML = '';
		},

		remove() {
			this.parentNode.removeChild(this);
			return this;
		},

		on(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				this.addEventListener(type, fn, !!useCapture);
			} else {
				error(fn, 'is not a function!');
			}
		},

		un(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				this.removeEventListener(type, fn, !!useCapture);
			} else {
				error(fn, 'is not a function!');
			}
		},
	};

	const listMethods = {
		addClass(className) {
			let classes = className.split(' ');
			for (let i = 0; i < this.length; i++) {
				this[i].classList.add(...classes);
			}
			return this;
		},

		removeClass(className) {
			let classes = className.split(' ');
			for (let i = 0; i < this.length; i++) {
				this[i].classList.remove(...classes);
			}
			return this;
		},

		appendTo(node) {
			let nodes = [];
			for (let i = 0; i < this.length; i++) {
				nodes.push(this[i]);
			}
			nodeMethods.append.call(node, ...nodes);
			return this;
		},

		prependTo(node) {
			let nodes = [];
			for (let i = 0; i < this.length; i++) {
				nodes.push(this[i]);
			}
			nodeMethods.prepend.call(node, ...nodes);
			return this;
		},

		toggleClass(className) {
			for (let i = 0; i < this.length; i++) {
				nodeMethods.toggleClass.call(this[i], className);
			}
			return this;
		},

		empty() {
			for (let i = 0; i < this.length; i++) {
				nodeMethods.empty.call(this[i]);
			}
			return this;
		},

		remove() {
			for (let i = 0; i < this.length; i++) {
				nodeMethods.remove.call(this[i]);
			}
			return this;
		},

		on(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				for (let i = 0; i < this.length; i++) {
					this[i].addEventListener(type, fn, !!useCapture);
				}
			} else {
				error(fn, 'is not a function!');
			}
		},

		un(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				for (let i = 0; i < this.length; i++) {
					this[i].removeEventListener(type, fn, !!useCapture);
				}
			} else {
				error(fn, 'is not a function!');
			}
		}
	};

	const methods = [];
	const methodList = {
		node: [],
		list: []
	};
	Object.defineProperties(methods, {
		node: {
			value: (() => {
				let nodeContainer = [];
				for (let i in nodeMethods) {
					Object.defineProperty(nodeContainer, i, {
						value: nodeMethods[i]
					});
					methodList.node.push(i);
				}
				return nodeContainer;
			})()
		},
		list: {
			value: (() => {
				let listContainer = [];
				for (let i in listMethods) {
					Object.defineProperty(listContainer, i, {
						value: listMethods[i]
					});
					methodList.list.push(i);
				}
				return listContainer;
			})()
		}
	});

	const regFn = (name, fns, autoNameSpace) => {
		for (let i in fns.node) {
			if (typeof(methods.node[i]) !== 'undefined') {
				if (autoNameSpace) {
					Object.defineProperty(methods.node, name + i, {value: fns.node[i]});
					methodList.node.push(name + i);
					warn(`Node property "${i}" has been set as "${name + i}".`);
				} else {
					warn(`Node property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to get this problem solved.`);
				}
			} else {
				Object.defineProperty(methods.node, i, {value: fns.node[i]});
				methodList.node.push(i);
			}
		}
		for (let i in fns.list) {
			if (typeof(methods.list[i]) !== 'undefined') {
				if (autoNameSpace) {
					Object.defineProperty(methods.list, name + i, {value: fns.list[i]});
					methodList.node.push(name + i);
					warn(`Nodelist property "${i}" has been set as "${name + i}".`);
				} else {
					warn(`Nodelist property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to get this problem solved.`);
				}
			} else {
				Object.defineProperty(methods.list, i, {value: fns.list[i]});
				methodList.node.push(i);
			}
		}
	};

	let loaded = false;

	const initFns = [];

	const Blyde = (fn) => {
		if (typeof(fn) === 'function') {
			if (loaded) {
				fn.call(window);
			} else {
				initFns.push(fn);
			}
		} else {
			error(fn, 'is not a function!');
		}
	};

	const init = function() {
		document.removeEventListener('DOMContentLoaded', init, false);

		Object.defineProperties(Element.prototype, (() => {
			let properties = {};
			for (let i in methodList.node) {
				properties[methodList.node[i]] = {
					value: methods.node[methodList.node[i]]
				};
			}
			return properties;
		})());

		Object.defineProperties(NodeList.prototype, (() => {
			let properties = {};
			for (let i in methodList.list) {
				properties[methodList.list[i]] = {
					value: methods.list[methodList.list[i]]
				};
			}
			return properties;
		})());

		for (let i in initFns) {
			initFns[i].call(window);
		}
		loaded = true;
	};

	Object.defineProperties(Blyde, {
		'version': {
			value: 'Blyde v0.0.2'
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
}