/* global VERSION */
'use strict'

import { log, warn, error } from './debug.js'
import Blyde from './blyde.js'
import { methods, $node, $nodeList } from './shared.js'

const register = ({name, node, list, blyde}, config) => {
	if (!name) {
		error('Plugin name not precent!')
		return
	}
	for (let i in node) {
		let fnName = i
		if (methods.node[i]) {
			if (config.autoNameSpace === 'rename') {
				fnName = name + i
				log(`Node property "${i}" has been set as "${name + i}".`)
			} else {
				warn(`Node property "${i}" in "${name}" conflicts with the original one, set "config.autoNameSpace" to "rename" to keep both.`)
			}
		}
		methods.node[fnName] = node[i]
	}
	for (let i in list) {
		let fnName = i
		if (methods.list[i]) {
			if (config.autoNameSpace === 'rename') {
				fnName = name + i
				log(`Nodelist property "${i}" has been set as "${name + i}".`)
			} else {
				warn(`Nodelist property "${i}" in "${name}" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.`)
			}
		}
		methods.list[fnName] = list[i]
	}
	for (let i in blyde) {
		let fnName = i
		if (methods.blyde[i]) {
			if (config.autoNameSpace === 'rename') {
				fnName = name + i
				log(`Blyde property "${i}" has been set as "${name + i}".`)
			} else {
				warn(`Blyde property "${i}" in "${name}" conflicts with the original one, set "config.autoNameSpace" to "rename" to keep both.`)
			}
		}
		methods.blyde[fnName] = blyde[i]
		Blyde[fnName] = blyde[i]
	}
	log(`Plugin "${name}" loaded.`)
}

const takeSnapshot = () => {
	const methodsShot = {
		node: Object.assign({}, methods.node),
		list: Object.assign({}, methods.list),
		blyde: Object.assign({}, methods.blyde)
	}
	return {
		version: `Blyde v${VERSION}`,
		methods: methodsShot,
		$node,
		$nodeList,
		log,
		warn,
		error
	}
}

export default (plugin, config = {}) => register(plugin(takeSnapshot()), config)
