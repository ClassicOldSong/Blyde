"use strict";
{
	const $q = selector => document.querySelector(selector),
		$qa = selector => document.querySelectorAll(selector);

	const addClass = function(className) {
		let classes = className.split(' ');
		let classArr = this.className.split(' ');
		for (let i in classes) {
			if (classArr.indexOf(classes[i]) === -1) {
				classArr.push(classes[i]);
			}
		}
		this.className = classArr.join(' ').trim();
		return this;
	};

	const removeClass = function(className) {
		let classes = className.split(' ');
		let classArr = this.className.split(' ');
		for (let i in classes) {
			let classIndex = classArr.indexOf(classes[i]);
			if (classIndex > -1) {
				classArr.splice(classIndex, 1);
			}
		}
		this.className = classArr.join(' ').trim();
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

	Element.prototype.addClass = addClass;
	Element.prototype.removeClass = removeClass;
	Element.prototype.toggleClass = toggleClass;
	Element.prototype.replaceWith = replaceWith;
	Element.prototype.swap = swap;
	Element.prototype.remove = remove;

	window.$q = $q;
	window.$qa = $qa;
}