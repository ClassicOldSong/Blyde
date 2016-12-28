/* global VERSION */
'use strict'

import Blyde from './blyde.js'
import { $getSymbol, $methods, $node, $nodeList } from './shared.js'
import { log, trace, debug, info, warn, error, logger } from './debug.js'

const plugins = {}

const register = ({name, node, list, blyde}, options) => {
	if (!name) return error('Plugin name not precent! Registration aborted.')
	if (name in plugins) return warn(`Plugin "${name}" has already been registered.`)
	for (let i in node) {
		if ($methods.node[i]) {
			if (options.autoNameSpace === 'keep') info(`$node property "${i}" has been kept.`)
			else {
				let fnName = i
				if (options.autoNameSpace === 'rename') {
					fnName = name + i
					info(`$node property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`$node property "${i}" in "${name}" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.`)
				}
				$methods.node[fnName] = node[i]
			}
		} else $methods.node[i] = node[i]
	}
	for (let i in list) {
		if ($methods.list[i]) {
			if (options.autoNameSpace === 'keep') info(`$nodeList property "${i}" has been kept.`)
			else {
				let fnName = i
				if (options.autoNameSpace === 'rename') {
					fnName = name + i
					info(`$nodeList property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`$nodeList property "${i}" in "${name}" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.`)
				}
				$methods.list[fnName] = list[i]
			}
		} else $methods.list[i] = list[i]
	}
	for (let i in blyde) {
		if ($methods.blyde[i]) {
			if (options.autoNameSpace === 'keep') info(`Blyde property "${i}" has been kept.`)
			else {
				let fnName = i
				if (options.autoNameSpace === 'rename') {
					fnName = name + i
					info(`Blyde property "${i}" has been renamed to "${fnName}".`)
				} else {
					warn(`Blyde property "${i}" in "${name}" has replaced the original one, set "options.autoNameSpace" to "rename" to keep both.`)
				}
				$methods.blyde[fnName] = blyde[i]
				Blyde[fnName] = blyde[i]
			}
		} else {
			$methods.blyde[i] = blyde[i]
			Blyde[i] = blyde[i]
		}
	}
	info(`Plugin "${name}" loaded.`)
}

const takeSnapshot = () => {
	const methodsShot = {
		node: Object.assign({}, $methods.node),
		list: Object.assign({}, $methods.list),
		blyde: Object.assign({}, $methods.blyde)
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
		plugins: pluginShot,
		$methods: methodsShot,
		$node,
		$nodeList,
		$getSymbol,
		log,
		trace,
		debug,
		info,
		warn,
		logger,
		error
	}
}

export default (plugin, options = {}) => {
	register(plugin(takeSnapshot), options)
}
