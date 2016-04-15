"use strict";
{
	const $create = tag => document.createElement(tag);

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
			}
			return node;
		},

		swap(node) {
			let tempDiv = document.createElement('div');
			methods.replaceWith.call(node, tempDiv);
			methods.replaceWith.call(this, node);
			methods.replaceWith.call(tempDiv, this);
			return node;
		},

		before(...nodes) {
			let tempFragment = new DocumentFragment();
			nodes.reverse();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			this.parentNode.insertBefore(tempFragment, this);
			return this;
		},

		after(...nodes) {
			let tempFragment = new DocumentFragment();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			if (this.nextSibling) {
				this.parentNode.insertBefore(tempFragment, this.nextSibling);
			} else {
				this.parentNode.append(tempFragment);
			}
			return this;
		},

		append(...nodes) {
			let tempFragment = new DocumentFragment();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			this.appendChild(tempFragment);
			return this;
		},

		prepend(...nodes) {
			let tempFragment = new DocumentFragment();
			nodes.reverse();
			for (let i in nodes) {
				tempFragment.appendChild(nodes[i]);
			}
			if (this.firstChild) {
				this.insertBefore(tempFragment, this.firstChild);
			} else {
				this.append(tempFragment);
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