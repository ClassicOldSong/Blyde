'use strict'

import Blyde from './blyde.js'
import regFn from './register.js'
import nodeMethods from './methods/node.js'
import listMethods from './methods/list.js'
import blydeMethods from './methods/blyde.js'
import { $cache } from './shared.js'

regFn(() => {
	const plugin = {
		name: 'Blyde',
		node: nodeMethods,
		list: listMethods,
		blyde: blydeMethods
	}
	return plugin
}, {
	autoNameSpace: false
})

Object.defineProperty(Node.prototype, '$', {
	get() {
		if (this.$id && this.$id in $cache) return $cache[this.$id]
		else return nodeMethods.q.call(this, this)
	}
})

export default Blyde
