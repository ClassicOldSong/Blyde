/* global console */
"use strict";
{
	const $q = function(selector) {
		return this.querySelector(selector);
	};

	const $qa = function(selector) {
		return this.querySelectorAll(selector);
	};

	const addClass = function(className) {
		let classes = className.split(' ');
		this.classList.add(...classes);
		return this;
	};

	const removeClass = function(className) {
		let classes = className.split(' ');
		this.classList.remove(...classes);
		return this;
	};

	const toggleClass = function(className) {
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
	};

	const replaceWith = function(node) {
		this.parentNode.replaceChild(node, this);
		return node;
	};

	const swap = function(node) {
		let tempDiv = document.createElement('div');
		replaceWith.call(node, tempDiv);
		replaceWith.call(this, node);
		replaceWith.call(tempDiv, this);
		return node;
	};

	const remove = function() {
		this.parentNode.removeChild(this);
		return this;
	};

	Element.prototype.$q = $q;
	Element.prototype.$qa = $qa;
	Element.prototype.addClass = addClass;
	Element.prototype.removeClass = removeClass;
	Element.prototype.toggleClass = toggleClass;
	Element.prototype.replaceWith = replaceWith;
	Element.prototype.swap = swap;
	Element.prototype.remove = remove;

	document.$q = $q;
	document.$qa = $qa;

	window.$q = selector => $q.call(document, selector);
	window.$qa = selector => $qa.call(document, selector);
}