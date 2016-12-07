/* global VERSION */
'use strict'

import { log, warn, error } from './debug.js'
import Blyde from './blyde.js'
import { methods, $node, $nodeList } from './shared.js'

const plugins = {}

const register = ({name, node, list, blyde}, config) => {
	if (!name) {
		error('Plugin name not precent! Registration aborted.')
		return
	}
	for (let i in node) {
		if (methods.node[i]) {
			if (config.autoNameSpace === 'keep') log(`$node property "${i}" has been kept.`)
			else {
				let fnName = i
				if (config.autoNameSpace === 'rename') {
					fnName = name + i
					log(`$node property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`$node property "${i}" in "${name}" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.`)
				}
				methods.node[fnName] = node[i]
			}
		} else methods.node[i] = node[i]
	}
	for (let i in list) {
		if (methods.list[i]) {
			if (config.autoNameSpace === 'keep') log(`$nodeList property "${i}" has been kept.`)
			else {
				let fnName = i
				if (config.autoNameSpace === 'rename') {
					fnName = name + i
					log(`$nodeList property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`$nodeList property "${i}" in "${name}" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.`)
				}
				methods.list[fnName] = list[i]
			}
		} else methods.list[i] = list[i]
	}
	for (let i in blyde) {
		if (methods.blyde[i]) {
			if (config.autoNameSpace === 'keep') log(`Blyde property "${i}" has been kept.`)
			else {
				let fnName = i
				if (config.autoNameSpace === 'rename') {
					fnName = name + i
					log(`Blyde property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`Blyde property "${i}" in "${name}" has replaced the original one, set "config.autoNameSpace" to "rename" to keep both.`)
				}
				methods.blyde[fnName] = blyde[i]
				Blyde[fnName] = blyde[i]
			}
		} else {
			methods.blyde[i] = blyde[i]
			Blyde[i] = blyde[i]
		}
	}
	plugins[name] = { node, list, blyde }
	log(`Plugin "${name}" loaded.`)
}

const takeSnapshot = () => {
	const methodsShot = {
		node: Object.assign({}, methods.node),
		list: Object.assign({}, methods.list),
		blyde: Object.assign({}, methods.blyde)
	}
	const pluginShot = {}
	for (let i in plugins) {
		pluginShot[i] = {
			node: Object.assign({}, plugins[i].node),
			list: Object.assign({}, plugins[i].list),
			blyde: Object.assign({}, plugins[i].blyde)
		}
	}
	return {
		version: `Blyde v${VERSION}`,
		methods: methodsShot,
		plugins: pluginShot,
		$node,
		$nodeList,
		log,
		warn,
		error,
		takeSnapshot
	}
}

export default (plugin, config = {}) => {
	register(plugin(takeSnapshot()), config)
}
