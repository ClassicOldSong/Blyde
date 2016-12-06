'use strict'

import Blyde from './blyde.js'
import regFn from './register.js'
import nodeMethods from './methods/node.js'
import listMethods from './methods/list.js'
import blydeMethods from './methods/blyde.js'
import { $cache, $node } from './shared.js'

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
		if (this.$id && $cache[this.$id]) return $cache[this.$id]
		else return new $node(this)
	}
})

export default Blyde
