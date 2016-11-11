/* global console, define */
/* eslint linebreak-style: ["error", "unix"] */
"use strict"

// Debug configuration
import debug from "debug"
const log = debug('[Blyde]')

if (ENV === 'production') debug.disable()
else {
	debug.enable('[Blyde]')
	log('Logging is enabled!')
}

// Polyfills
import 'classlist-polyfill'

const $create = tag => document.createElement(tag)

const $cache = []
const safeZone = document.createDocumentFragment()

const methods = {
	node: {},
	list: {},
	Blyde: {}
}
const $node = class {
	constructor(node) {
		this.$el = node
		Object.defineProperty(node, '$id', {value: $cache.length})
		let $nodeMethods = {}
		for (let i in methods.node) {
			$nodeMethods[i] = methods.node[i].bind(node)
		}
		Object.assign(this, $nodeMethods)
		$cache.push(this)
	}
}
const $nodeList = class {
	constructor(list) {
		this.$list = []
		for (let i = 0; i < list.length; i++) this.$list.push(list[i].$)
		let $listMethods = {}
		for (let i in methods.list) {
			$listMethods[i] = methods.list[i].bind(this.$list)
		}
		Object.assign(this, $listMethods)
	}
}

const initQuery = []
let loaded = false
let velocityUsed = false

const Blyde = (fn) => {
	if (typeof(fn) === 'function') {
		if (loaded) {
			fn.call(window)
		} else {
			initQuery.push(fn)
		}
	} else {
		log(fn, 'is not a function!')
	}
}

const regFn = (name, fns, autoNameSpace) => {
	for (let i in fns.node) {
		let fnName = i
		if (methods.node[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Node property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Node property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.node[fnName] = fns.node[i]
	}
	for (let i in fns.list) {
		let fnName = i
		if (methods.list[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Nodelist property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Nodelist property "${i}" in "${name}" has replaced the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.list[fnName] = fns.list[i]
	}
	for (let i in fns.Blyde) {
		let fnName = i
		if (methods.Blyde[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Blyde property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Blyde property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.Blyde[fnName] = fns.Blyde[i]
		Blyde[fnName] = fns.Blyde[i]
	}
}

const useVelocity = (v) => {
	if (velocityUsed) return
	regFn('Blyde', {
		node: {
			velocity(...args) {
				v(this, ...args)
				return this
			}
		},
		list: {
			velocity(...args) {
				for (let i of this) {
					v(i, ...args)
				}
				return this
			}
		}
	}, true)
	velocityUsed = true
}

const nodeMethods = {
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
		let classes = className.split(' ')
		this.classList.add(...classes)
		return this.$
	},

	removeClass(className) {
		let classes = className.split(' ')
		this.classList.remove(...classes)
		return this.$
	},

	toggleClass(className) {
		let classes = className.split(' ')
		let classArr = this.className.split(' ')
		for (let i in classes) {
			let classIndex = classArr.indexOf(classes[i])
			if (classIndex > -1) {
				classArr.splice(classIndex, 1)
			} else {
				classArr.push(classes[i])
			}
		}
		this.className = classArr.join(' ').trim()
		return this.$
	},

	replaceWith(node) {
		if (node instanceof $node) node = node.$el
		let parent = this.parentNode
		if (parent) {
			parent.replaceChild(node, this)
			return node.$
		} else {
			log(this, 'may not have been attached to document properly.')
			return this.$
		}
	},

	swap(node) {
		if (node instanceof $node) node = node.$el
		let thisParent = this.parentNode
		let nodeParent = node.parentNode
		let thisSibling = this.nextSibling
		let nodeSibling = node.nextSibling
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
			log(...errNodes, 'may not have been attached to document properly.')
			return this.$
		}
	},

	before(...nodes) {
		if (this.parentNode) {
			let tempFragment = document.createDocumentFragment()
			nodes.reverse()
			for (let i of nodes) {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			}
			this.parentNode.insertBefore(tempFragment, this)
		} else {
			log(this, 'may not have been attached to document properly.')
		}
		return this.$
	},

	after(...nodes) {
		if (this.parentNode) {
			let tempFragment = document.createDocumentFragment()
			for (let i of nodes) {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			}
			if (this.nextSibling) {
				this.parentNode.insertBefore(tempFragment, this.nextSibling)
			} else {
				this.parentNode.append(tempFragment)
			}
		} else {
			log(this, 'may not have been attached to document properly.')
		}
		return this.$
	},

	append(...nodes) {
		if ([1,9,11].indexOf(this.nodeType) === -1) {
			log('This node type does not support method "append".')
			return
		}
		let tempFragment = document.createDocumentFragment()
		for (let i of nodes) {
			if (i instanceof $node) i = i.$el
			tempFragment.appendChild(i)
		}
		this.appendChild(tempFragment)
		return this.$
	},

	prepend(...nodes) {
		if ([1,9,11].indexOf(this.nodeType) === -1) {
			log('This node type does not support method "prepend".')
			return
		}
		let tempFragment = document.createDocumentFragment()
		nodes.reverse()
		for (let i of nodes) {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			}
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
		if (typeof(fn) === 'function') {
			this.addEventListener(type, fn, !!useCapture)
		} else {
			log(fn, 'is not a function!')
		}
	},

	un(type, fn, useCapture) {
		if (typeof(fn) === 'function') {
			this.$el.removeEventListener(type, fn, !!useCapture)
		} else {
			log(fn, 'is not a function!')
		}
	},

	animate(name) {
		this.$.addClass(`${name}-trans`)
		setTimeout(() => {
			this.$.addClass(`${name}-start`)
			this.$.addClass(`${name}-end`)
		}, 0)
	}
}

const listMethods = {
	addClass(className) {
		for (let i of this) {
			i.addClass(className)
		}
		return this
	},

	removeClass(className) {
		for (let i of this) {
			i.removeClass(className)
		}
		return this
	},

	appendTo(node) {
		if (node instanceof $node) node = node.$el
		let nodes = []
		for (let i of this) {
			nodes.push(i.$el)
		}
		nodeMethods.append.call(node, ...nodes)
		return this
	},

	prependTo(node) {
		if (node instanceof $node) node = node.$el
		let nodes = []
		for (let i of this) {
			nodes.push(i.$el)
		}
		nodeMethods.prepend.call(node, ...nodes)
		return this
	},

	toggleClass(className) {
		for (let i of this) {
			i.toggleClass(className)
		}
		return this
	},

	empty() {
		for (let i of this) {
			i.empty()
		}
		return this
	},

	remove() {
		for (let i of this) {
			i.remove()
		}
		return this
	},

	safeRemove() {
		for (let i of this) {
			i.safeRemove()
		}
		return this
	},

	on(type, fn, useCapture) {
		if (typeof(fn) === 'function') {
			for (let i of this) {
				this[i].on(type, fn, !!useCapture)
			}
		} else {
			log(fn, 'is not a function!')
		}
	},

	un(type, fn, useCapture) {
		if (typeof(fn) === 'function') {
			for (let i of this) {
				this[i].un(type, fn, !!useCapture)
			}
		} else {
			log(fn, 'is not a function!')
		}
	}
}

const blydeMethods = {
	version: 'Blyde v0.1.0',
	fn: regFn,
	methods,
	q: nodeMethods.q.bind(document),
	qa: nodeMethods.qa.bind(document),
	create: $create,
	on: nodeMethods.on.bind(window),
	un: nodeMethods.on.bind(window),
	useVelocity
}

regFn('Blyde', {
	node: nodeMethods,
	list: listMethods,
	Blyde: blydeMethods
})

Object.defineProperty(Node.prototype, '$', {
	get() {
		if (this.$id && this.$id in $cache) return $cache[this.$id]
		else return nodeMethods.q.call(this, this)
	}
})

const init = function() {
	document.removeEventListener('DOMContentLoaded', init, false)

	if (window.Velocity) useVelocity(window.Velocity)

	loaded = true

	for (let i in initQuery) {
		initQuery[i].call(window)
	}
}

document.addEventListener('DOMContentLoaded', init, false)
if (document.readyState === "interactive" || document.readyState === "complete") init()

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Blyde
} else if (typeof define === 'function' && define.amd) {
	define(() => Blyde)
} else {
	Object.defineProperties(window, {
		Blyde: {
			value: Blyde
		},
		$: {
			value: Blyde
		}
	})
}