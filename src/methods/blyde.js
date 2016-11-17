'use strict'

import log from '../debug.js'
import regFn from '../register.js'
import nodeMethods from './node.js'
import { methods } from '../shared.js'

let velocityUsed = false

const useVelocity = (v) => {
	if (velocityUsed) return
	regFn('Velocity', {
		node: {
			velocity(...args) {
				v(this, ...args)
				return this.$
			}
		},
		list: {
			velocity(...args) {
				this.forEach(i => v(i.$el, ...args))
				return this
			}
		}
	}, true)
	velocityUsed = true
	log('Velocity support added.')
}

export default {
	version: 'Blyde v0.1.0-alpha12',
	fn: regFn,
	methods,
	q: nodeMethods.q.bind(document),
	qa: nodeMethods.qa.bind(document),
	create: tag => document.createElement(tag),
	on: nodeMethods.on.bind(window),
	off: nodeMethods.off.bind(window),
	useVelocity
}
