'use strict'

const methods = {
	node: {},
	list: {},
	blyde: {}
}

const $node = class {
	constructor(node) {
		this.$el = node
		let $nodeMethods = {}
		for (let i in methods.node) {
			if (methods.node[i] instanceof Function) $nodeMethods[i] = methods.node[i].bind(node)
			else $nodeMethods[i] = methods.node[i]
		}
		Object.assign(this, $nodeMethods)
		if (!node.$id) Object.defineProperty(node, '$id', {value: Math.floor(Math.random() * Math.pow(10, 16)).toString(36)})
	}
}
const $nodeList = class {
	constructor(list) {
		this.$list = []
		for (let i = 0; i < list.length; i++) this.$list.push(list[i].$)
		let $listMethods = {}
		for (let i in methods.list) {
			if (methods.list[i] instanceof Function) $listMethods[i] = methods.list[i].bind(this.$list)
			else $listMethods[i] = methods.node[i]
		}
		Object.assign(this, $listMethods)
	}
}

export { methods, $node, $nodeList }
