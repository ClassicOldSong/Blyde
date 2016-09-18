/* global console, define */
/* eslint linebreak-style: ["error", "unix"] */
"use strict"

{
	const $create = tag => document.createElement(tag)

	const error = (...args) => console.error('[Blyde]', ...args)
	const warn = (...args) => console.warn('[Blyde]', ...args)

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
			node.$id = $cache.length
			$cache.push(this)
		}
	}
	const $nodeList = class extends Array {}

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
			error(fn, 'is not a function!')
		}
	}

	const regFn = (name, fns, autoNameSpace) => {
		for (let i in fns.node) {
			let fnName = i
			if (typeof(methods.node[i]) !== 'undefined') {
				if (autoNameSpace) {
					fnName = name + i
					warn(`Node property "${i}" has been set as "${name + i}".`)
				} else {
					warn(`Node property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to get this problem solved.`)
				}
			}
			methods.node[fnName] = fns.node[i]
			Object.defineProperty($node.prototype, fnName, {value: fns.node[i]})
		}
		for (let i in fns.list) {
			let fnName = i
			if (typeof(methods.list[i]) !== 'undefined') {
				if (autoNameSpace) {
					fnName = name + i
					warn(`Nodelist property "${i}" has been set as "${name + i}".`)
				} else {
					warn(`Nodelist property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to get this problem solved.`)
				}
			}
			methods.list[fnName] = fns.list[i]
			Object.defineProperty($nodeList.prototype, fnName, {value: fns.list[i]})
		}
		for (let i in fns.Blyde) {
			let fnName = i
			if (typeof(methods.Blyde[i]) !== 'undefined') {
				if (autoNameSpace) {
					fnName = name + i
					warn(`Blyde property "${i}" has been set as "${name + i}".`)
				} else {
					warn(`Blyde property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to get this problem solved.`)
				}
			}
			methods.Blyde[fnName] = fns.Blyde[i]
			Object.defineProperty(Blyde, fnName, {value: fns.Blyde[i]})
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
			let selected = selector
			if (!(selector instanceof Node)) {
				selected = this.$el.querySelector(selector)
			}
			if (typeof selected.$id !== 'undefined' && selected.$id in $cache) return $cache[selected.$id]
			else return new $node(selected)
		},

		qa(selector) {
			if (selector instanceof NodeList) return new $nodeList(...selector)
			return new $nodeList(...this.$el.querySelectorAll(selector))
		},

		addClass(className) {
			let classes = className.split(' ')
			this.$el.classList.add(...classes)
			return this
		},

		removeClass(className) {
			let classes = className.split(' ')
			this.$el.classList.remove(...classes)
			return this
		},

		toggleClass(className) {
			let classes = className.split(' ')
			let classArr = this.$el.className.split(' ')
			for (let i in classes) {
				let classIndex = classArr.indexOf(classes[i])
				if (classIndex > -1) {
					classArr.splice(classIndex, 1)
				} else {
					classArr.push(classes[i])
				}
			}
			this.$el.className = classArr.join(' ').trim()
			return this
		},

		replaceWith(node) {
			if (node instanceof $node) node = node.$el
			let parent = this.$el.parentNode
			if (parent) {
				parent.replaceChild(node, this)
				return node
			} else {
				error(this, 'may not have been attached to document properly.')
				return this
			}
		},

		swap(node) {
			if (node instanceof $node) node = node.$el
			let thisParent = this.$el.parentNode
			let nodeParent = node.parentNode
			let thisSibling = this.$el.nextSibling
			let nodeSibling = node.nextSibling
			if (thisParent && nodeParent) {
				thisParent.insertBefore(node, thisSibling)
				nodeParent.insertBefore(this.$el, nodeSibling)
				return node
			} else {
				let errNodes = []
				if (thisParent === null) {
					errNodes.push(this)
				}
				if (nodeParent === null) {
					errNodes.push(node)
				}
				error(...errNodes, 'may not have been attached to document properly.')
				return this
			}
		},

		before(...nodes) {
			if (this.$el.parentNode) {
				let tempFragment = document.createDocumentFragment()
				nodes.reverse()
				for (let i of nodes) {
					if (i instanceof $node) i = i.$el
					tempFragment.appendChild(i)
				}
				this.$el.parentNode.insertBefore(tempFragment, this)
			} else {
				error(this, 'may not have been attached to document properly.')
			}
			return this
		},

		after(...nodes) {
			if (this.$el.parentNode) {
				let tempFragment = document.createDocumentFragment()
				for (let i of nodes) {
					if (i instanceof $node) i = i.$el
					tempFragment.appendChild(i)
				}
				if (this.$el.nextSibling) {
					this.$el.parentNode.insertBefore(tempFragment, this.$el.nextSibling)
				} else {
					this.$el.parentNode.append(tempFragment)
				}
			} else {
				error(this, 'may not have been attached to document properly.')
			}
			return this
		},

		append(...nodes) {
			if ([1,9,11].indexOf(this.$el.nodeType) === -1) {
				error('This node type does not support method "append".')
				return
			}
			let tempFragment = document.createDocumentFragment()
			for (let i of nodes) {
				if (i instanceof $node) i = i.$el
				tempFragment.appendChild(i)
			}
			this.$el.appendChild(tempFragment)
			return this
		},

		prepend(...nodes) {
			if ([1,9,11].indexOf(this.$el.nodeType) === -1) {
				error('This node type does not support method "prepend".')
				return
			}
			let tempFragment = document.createDocumentFragment()
			nodes.reverse()
			for (let i of nodes) {
					if (i instanceof $node) i = i.$el
					tempFragment.appendChild(i)
				}
			if (this.$el.firstChild) {
				this.$el.insertBefore(tempFragment, this.$el.firstChild)
			} else {
				this.$el.appendChild(tempFragment)
			}
			return this
		},

		appendTo(node) {
			if (node instanceof $node) node = node.$el
			node.appendChild(this)
			return this
		},

		prependTo(node) {
			if (node instanceof $node) node = node.$el
			if (node.firstChild) {
				node.insertBefore(this, node.firstChild)
			} else {
				node.appendChild(this)
			}
			return this
		},

		empty() {
			this.$el.innerHTML = ''
		},

		remove() {
			this.$el.parentNode.removeChild(this.$el)
			return this
		},

		safeRemove() {
			safeZone.appendChild(this.$el)
			return this
		},

		on(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				this.$el.addEventListener(type, fn, !!useCapture)
			} else {
				error(fn, 'is not a function!')
			}
		},

		un(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				this.$el.removeEventListener(type, fn, !!useCapture)
			} else {
				error(fn, 'is not a function!')
			}
		},
	}

	const listMethods = {
		addClass(className) {
			let classes = className.split(' ')
			for (let i of this) {
				i.classList.add(...classes)
			}
			return this
		},

		removeClass(className) {
			let classes = className.split(' ')
			for (let i of this) {
				i.classList.remove(...classes)
			}
			return this
		},

		appendTo(node) {
			if (node instanceof $node) node = node.$el
			let nodes = []
			for (let i of this) {
				nodes.push(i)
			}
			nodeMethods.append.call(node, ...nodes)
			return this
		},

		prependTo(node) {
			if (node instanceof $node) node = node.$el
			let nodes = []
			for (let i of this) {
				nodes.push(i)
			}
			nodeMethods.prepend.call(node, ...nodes)
			return this
		},

		toggleClass(className) {
			for (let i of this) {
				nodeMethods.toggleClass.call(i, className)
			}
			return this
		},

		empty() {
			for (let i of this) {
				nodeMethods.empty.call(i)
			}
			return this
		},

		remove() {
			for (let i of this) {
				nodeMethods.remove.call(i)
			}
			return this
		},

		safeRemove() {
			for (let i of this) {
				nodeMethods.safeRemove.call(i)
			}
			return this
		},

		on(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				for (let i of this) {
					this[i].addEventListener(type, fn, !!useCapture)
				}
			} else {
				error(fn, 'is not a function!')
			}
		},

		un(type, fn, useCapture) {
			if (typeof(fn) === 'function') {
				for (let i of this) {
					this[i].removeEventListener(type, fn, !!useCapture)
				}
			} else {
				error(fn, 'is not a function!')
			}
		}
	}

	const blydeMethods = {
		version: 'Blyde v0.1.0',
		fn: regFn,
		methods,
		q: nodeMethods.q.bind(new $node(document)),
		qa: nodeMethods.qa.bind(new $node(document)),
		create: $create,
		on: nodeMethods.on.bind(new $node(window)),
		un: nodeMethods.on.bind(new $node(window)),
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
			else return nodeMethods.q(this)
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

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Blyde
	} else if (typeof define === 'function' && define.amd) {
		define(() => Blyde)
	} else {
		document.addEventListener('DOMContentLoaded', init, false)
		if (document.readyState === "interactive" || document.readyState === "complete") init()
		Object.defineProperties(window, {
			Blyde: {
				value: Blyde
			},
			$: {
				value: Blyde
			}
		})
	}
}