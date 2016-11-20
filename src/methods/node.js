'use strict'

import { warn, error } from '../debug.js'
import { $cache, $node, $nodeList } from '../shared.js'

const safeZone = document.createDocumentFragment()

export default {
	q(selector) {
		if (!(selector instanceof Node)) {
			selector = this.querySelector(selector)
		}
		if (typeof selector.$id !== 'undefined' && selector.$id in $cache) return $cache[selector.$id]
		else return new $node(selector)
	},

	qa(selector) {
		if (selector instanceof NodeList) return new $nodeList(selector)
		return new $nodeList(this.querySelectorAll(selector))
	},

	addClass(className) {
		const classes = className.split(' ')
		this.classList.add(...classes)
		return this.$
	},

	removeClass(className) {
		const classes = className.split(' ')
		this.classList.remove(...classes)
		return this.$
	},

	toggleClass(className) {
		const classes = className.split(' ')
		const classArr = this.className.split(' ')
		classes.forEach((i) => {
			const classIndex = classArr.indexOf(i)
			if (classIndex > -1) {
				classArr.splice(classIndex, 1)
			} else {
				classArr.push(i)
			}
		})
		this.className = classArr.join(' ').trim()
		return this.$
	},

	replaceWith(node) {
		if (node instanceof $node) node = node.$el
		const parent = this.parentNode
		if (parent) {
			parent.replaceChild(node, this)
			return node.$
		} else {
			error(this, 'may not have been attached to document properly.')
			return this.$
		}
	},

	swap(node) {
		if (node instanceof $node) node = node.$el
		const thisParent = this.parentNode
		const nodeParent = node.parentNode
		const thisSibling = this.nextSibling
		const nodeSibling = node.nextSibling
		if (thisParent && nodeParent) {
			thisParent.insertBefore(node, thisSibling)
			nodeParent.insertBefore(this, nodeSibling)
			return node.$
		} else {
			let errNodes = []
			if (thisParent === null) {
				errNodes.push(this)
			}
			if (nodeParent === null) {
				errNodes.push(node)
			}
			error(...errNodes, 'may not have been attached to document properly.')
			return this.$
		}
	},

	before(...nodes) {
		if (this.parentNode) {
			const tempFragment = document.createDocumentFragment()
			nodes.reverse()
			nodes.forEach((i) => {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			})
			this.parentNode.insertBefore(tempFragment, this)
		} else {
			error(this, 'may not have been attached to document properly.')
		}
		return this.$
	},

	after(...nodes) {
		if (this.parentNode) {
			const tempFragment = document.createDocumentFragment()
			nodes.forEach((i) => {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			})
			if (this.nextSibling) {
				this.parentNode.insertBefore(tempFragment, this.nextSibling)
			} else {
				this.parentNode.append(tempFragment)
			}
		} else {
			error(this, 'may not have been attached to document properly.')
		}
		return this.$
	},

	append(...nodes) {
		if ([1,9,11].indexOf(this.nodeType) === -1) {
			warn('This node type does not support method "append".')
			return
		}
		const tempFragment = document.createDocumentFragment()
		nodes.forEach((i) => {
			if (i instanceof $node) i = i.$el
			tempFragment.appendChild(i)
		})
		this.appendChild(tempFragment)
		return this.$
	},

	prepend(...nodes) {
		if ([1,9,11].indexOf(this.nodeType) === -1) {
			warn('This node type does not support method "prepend".')
			return
		}
		const tempFragment = document.createDocumentFragment()
		nodes.reverse()
		nodes.forEach((i) => {
			if (i instanceof $node) i = i.$el
			tempFragment.appendChild(i)
		})
		if (this.firstChild) {
			this.insertBefore(tempFragment, this.$el.firstChild)
		} else {
			this.appendChild(tempFragment)
		}
		return this.$
	},

	appendTo(node) {
		if (node instanceof $node) node = node.$el
		node.appendChild(this)
		return this.$
	},

	prependTo(node) {
		if (node instanceof $node) node = node.$el
		if (node.firstChild) {
			node.insertBefore(this, node.firstChild)
		} else {
			node.appendChild(this)
		}
		return this.$
	},

	empty() {
		this.innerHTML = ''
	},

	remove() {
		this.parentNode.removeChild(this)
		return this.$
	},

	safeRemove() {
		safeZone.appendChild(this)
		return this.$
	},

	on(type, fn, useCapture) {
		const types = type.split(' ')
		if (typeof(fn) === 'function') {
			types.forEach(i => this.addEventListener(i, fn, !!useCapture))
			return this.$
		} else warn(fn, 'is not a function!')
	},

	off(type, fn, useCapture) {
		const types = type.split(' ')
		if (typeof(fn) === 'function') {
			types.forEach(i => this.$el.removeEventListener(i, fn, !!useCapture))
			return this.$
		} else warn(fn, 'is not a function!')
	},

	animate(name) {
		this.$.addClass(`${name}-trans`)
		setTimeout(() => {
			this.$.addClass(`${name}-start`)
			this.$.addClass(`${name}-end`)
		}, 0)
		return this.$
	}
}
