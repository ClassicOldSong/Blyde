/* global VERSION */
'use strict'

import regFn from '../register.js'
import nodeMethods from './node.js'
import eventHandlers from './event.js'

let velocityUsed = false

const useVelocity = (v) => {
	if (velocityUsed) return
	regFn(() => {
		velocityUsed = true
		return {
			name: 'Velocity',
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
		}
	}, {
		autoNameSpace: false
	})
}

export default {
	version: `Blyde v${VERSION}`,
	fn: regFn,
	q: nodeMethods.q.bind(document),
	qa: nodeMethods.qa.bind(document),
	on(...args) {
		eventHandlers.on.call(window, ...args)
		return this
	},
	listen(...args) {
		eventHandlers.listencall(window, ...args)
		return this
	},
	at(...args) {
		eventHandlers.at.call(window, ...args)
		return this
	},
	drop(...args) {
		eventHandlers.drop.call(window, ...args)
		return this
	},
	off(...args) {
		eventHandlers.off.call(window, ...args)
		return this
	},
	trigger(...args) {
		eventHandlers.trigger.call(window, ...args)
		return this
	},
	useVelocity
}
