'use strict'

import Blyde from './blyde.js'
import regFn from './register.js'
import nodeMethods from './methods/node.js'
import listMethods from './methods/list.js'
import blydeMethods from './methods/blyde.js'
import eventHandlers from './methods/event.js'
import { $cache, $node } from './shared.js'

regFn(() => {
	const plugin = {
		name: 'Blyde',
		node: Object.assign(nodeMethods, eventHandlers),
		list: listMethods,
		blyde: blydeMethods
	}
	return plugin
}, {
	autoNameSpace: false
})

Object.defineProperty(Node.prototype, '$', {
	get() {
		return $cache[this.$id] || new $node(this)
	}
})

export default Blyde
