/* global VERSION */
'use strict'

import { info, warn } from './debug.js'

const initQuery = []
let loaded = false

const Blyde = (fn) => {
	if (typeof(fn) === 'function') {
		if (loaded) {
			fn.call(window)
		} else {
			initQuery.push(fn)
		}
	} else {
		warn(fn, 'is not a function!')
	}
}

const init = function() {
	document.removeEventListener('DOMContentLoaded', init, false)
	if (window.Velocity) Blyde.useVelocity(window.Velocity)
	loaded = true
	initQuery.forEach(i => i.call(window))
	info(`Blyde v${VERSION} initlized!`)
}

document.addEventListener('DOMContentLoaded', init, false)
if (document.readyState === "interactive" || document.readyState === "complete") init()

export default Blyde
