'use strict'

import log from './debug.js'
import Blyde from './blyde.js'
import { methods } from './shared.js'

export default (name, fns, autoNameSpace) => {
	for (let i in fns.node) {
		let fnName = i
		if (methods.node[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Node property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Node property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.node[fnName] = fns.node[i]
	}
	for (let i in fns.list) {
		let fnName = i
		if (methods.list[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Nodelist property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Nodelist property "${i}" in "${name}" has replaced the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.list[fnName] = fns.list[i]
	}
	for (let i in fns.blyde) {
		let fnName = i
		if (methods.blyde[i]) {
			if (autoNameSpace === 'rename') {
				fnName = name + i
				log(`Blyde property "${i}" has been set as "${name + i}".`)
			} else {
				log(`Blyde property "${i}" in "${name}" conflicts with the original one, set "autoNameSpace" true to keep both.`)
			}
		}
		methods.blyde[fnName] = fns.blyde[i]
		Blyde[fnName] = fns.blyde[i]
	}
}
