'use strict'

import { warn } from '../debug.js'
import { $node } from '../shared.js'

const listeners = {}
const eventHandler = function(e) {
	const targets = []
	e.path.forEach((i) => {
		if (listeners[this.$id][i.$id]) targets.push(i)
	})
	if (targets.length === 0) return
	for (let i of targets) {
		if (listeners[this.$id][i.$id][e.type]) {
			let ifBreak = false
			listeners[this.$id][i.$id][e.type].forEach((j) => {
				if (j.call(i, e) === false) ifBreak = true
			})
			if (ifBreak) return
		}
	}
}

const handlers = {
	on(type, fn, useCapture = false) {
		const types = type.split(' ')
		if (typeof fn === 'function') {
			types.forEach(i => this.addEventListener(i, fn, useCapture))
			return this.$
		} else warn(fn, 'is not a function!')
	},

	listen(type, node, fn) {
		if (node instanceof $node) node = node.$el
		else node = node.$.$el
		const types = type.split(' ')
		if (typeof fn === 'function') {
			types.forEach((i) => {
				if (i !== '') {
					if (!listeners[this.$id]) listeners[this.$id] = {}
					if (!listeners[this.$id][node.$id]) {
						this.addEventListener(i, eventHandler, true)
						listeners[this.$id][node.$id] = {}
					}
					if (!listeners[this.$id][node.$id][i]) listeners[this.$id][node.$id][i] = []
					listeners[this.$id][node.$id][i].push(fn)
				}
			})
			return this.$
		} else warn(fn, 'is not a function!')
	},

	at(type, fn) {
		handlers.listen.call(window, type, this, fn)
		return this.$
	},

	drop(type, node, fn) {
		if (node instanceof $node) node = node.$el
		else node = node.$.$el
		const types = type.split(' ')
		if (typeof fn === 'function') {
			if (listeners[this.$id] && listeners[this.$id][node.$id]) {
				types.forEach((i) => {
					if (i !== '' && listeners[this.$id][node.$id][i]) {
						const fns = listeners[this.$id][node.$id][i]
						fns.splice(fns.indexOf(fn), 1)
						if (listeners[this.$id][node.$id][i].length === 0) {
							delete listeners[this.$id][node.$id][i]
							if ((() => {
								for (let j in listeners[this.$id]) {
									if (listeners[this.$id][j][i]) return false
								}
								return true
							})()) this.removeEventListener(i, eventHandler, true)
							if (Object.keys(listeners[this.$id][node.$id]).length === 0) {
								delete listeners[this.$id][node.$id]
								if (Object.keys(listeners[this.$id]).length === 0) delete listeners[this.$id]
							}
						}
					}
				})
			}
			return this.$
		} else warn(fn, 'is not a function!')
	},

	off(type, fn, useCapture = false) {
		const types = type.split(' ')
		if (typeof fn === 'function') {
			types.forEach((i) => {
				this.removeEventListener(i, fn, useCapture)
				handlers.drop.call(window, i, this, fn)
			})
			return this.$
		} else warn(fn, 'is not a function!')
	},

	trigger(event, config) {
		if (typeof event === 'string') event = new Event(event, config)
		this.dispatchEvent(event)
		return this.$
	}
}

export default handlers
