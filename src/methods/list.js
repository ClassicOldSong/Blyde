'use strict'

import { warn } from '../debug.js'
import nodeMethods from './node.js'
import { $node } from '../shared.js'

export default {
	addClass(className) {
		this.forEach((i) => {
			i.addClass(className)
		})
		return this
	},

	removeClass(className) {
		this.forEach((i) => {
			i.removeClass(className)
		})
		return this
	},

	appendTo(node) {
		if (node instanceof $node) node = node.$el
		const nodes = []
		this.forEach((i) => {
			nodes.push(i.$el)
		})
		nodeMethods.append.call(node, ...nodes)
		return this
	},

	prependTo(node) {
		if (node instanceof $node) node = node.$el
		const nodes = []
		this.forEach((i) => {
			nodes.push(i.$el)
		})
		nodeMethods.prepend.call(node, ...nodes)
		return this
	},

	toggleClass(className) {
		this.forEach((i) => {
			i.toggleClass(className)
		})
		return this
	},

	empty() {
		this.forEach((i) => {
			i.empty()
		})
		return this
	},

	remove() {
		this.forEach((i) => {
			i.remove()
		})
		return this
	},

	safeRemove() {
		this.forEach((i) => {
			i.safeRemove()
		})
		return this
	},

	on(type, fn, useCapture) {
		if (typeof(fn) === 'function') {
			this.forEach((i) => {
				i.on(type, fn, !!useCapture)
			})
			return this
		} else {
			warn(fn, 'is not a function!')
		}
	},

	off(type, fn, useCapture) {
		if (typeof(fn) === 'function') {
			this.forEach((i) => {
				i.off(type, fn, !!useCapture)
			})
			return this
		} else {
			warn(fn, 'is not a function!')
		}
	}
}
