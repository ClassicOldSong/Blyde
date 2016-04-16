/* global console */
"use strict";
{
	const $create = tag => document.createElement(tag);

	const error = (...args) => console.error('[Blyde]', ...args);

	const methods = {
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

	for (let i in methods) {
		Element.prototype[i] = methods[i];
	}

	document.$q = methods.$q;
	document.$qa = methods.$qa;

	window.$q = selector => methods.$q.call(document, selector);
	window.$qa = selector => methods.$qa.call(document, selector);
	window.$create = $create;
}