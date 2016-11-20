/* global VERSION */
'use strict'

import { log } from '../debug.js'
import regFn from '../register.js'
import nodeMethods from './node.js'

let velocityUsed = false

const useVelocity = (v) => {
	if (velocityUsed) return
	regFn(() => {
		velocityUsed = true
		log('Velocity support added!')
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
	on: nodeMethods.on.bind(window),
	off: nodeMethods.off.bind(window),
	useVelocity
}
