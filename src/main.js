/* global define */
'use strict'

import Blyde from './blyde.js'
import regFn from './register.js'
import nodeMethods from './methods/node.js'
import listMethods from './methods/list.js'
import blydeMethods from './methods/blyde.js'
import { $cache } from './shared.js'

regFn('Blyde', {
	node: nodeMethods,
	list: listMethods,
	blyde: blydeMethods
}, false)

Object.defineProperty(Node.prototype, '$', {
	get() {
		if (this.$id && this.$id in $cache) return $cache[this.$id]
		else return nodeMethods.q.call(this, this)
	}
})

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