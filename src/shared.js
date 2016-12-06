'use strict'

const methods = {
	node: {},
	list: {},
	blyde: {}
}

const $node = class {
	constructor(node) {
		this.$el = node
		for (let i in methods.node) {
			if (methods.node[i] instanceof Function) this[i] = methods.node[i].bind(node)
			else this[i] = methods.node[i]
		}
		if (!node.$id) Object.defineProperty(node, '$id', {value: Math.floor(Math.random() * Math.pow(10, 16)).toString(36)})
	}
}
const $nodeList = class {
	constructor(list) {
		this.$list = []
		for (let i = 0; i < list.length; i++) this.$list.push(list[i].$)
		for (let i in methods.list) {
			if (methods.list[i] instanceof Function) this[i] = methods.list[i].bind(this.$list)
			else this[i] = methods.node[i]
		}
	}
}

export { methods, $node, $nodeList }
