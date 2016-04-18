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
		}
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
		}
	};

	const regFn = (name, fns, override) => {
		for (let i in fns) {
			let ifOverride = !!override;
			if (typeof(fns[i].override) !== 'undefined') {
				ifOverride = fns[i].override;
			}
			if (typeof(nodeMethods[i]) !== 'undefined') {
				if (ifOverride) {
					nodeMethods[i] = fns[i].value;
					warn(`Property "${i}" has been overrided by "${name}".`);
				} else {
					warn(`Property "${i}" has already been registered, set "override: true" to override.`);
				}
			}
		}
	};

	const Blyde = {
		get version() {return 'v0.0.2';},
		get fn() {return regFn}
	};

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

	document.addEventListener('DOMContentLoaded', () => {
		document.removeEventListener('DOMContentLoaded',false);

		Object.defineProperties(Element.prototype, (() => {
			let properties = {};
			for (let i in nodeMethods) {
				properties[i] = {
					value: nodeMethods[i]
				};
			}
			return properties;
		})());

		Object.defineProperties(NodeList.prototype, (() => {
			let properties = {};
			for (let i in listMethods) {
				properties[i] = {
					value: listMethods[i]
				};
			}
			return properties;
		})());
	}, false);
}