'use strict'

import log from './debug.js'

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
		log(fn, 'is not a function!')
	}
}

const init = function() {
	document.removeEventListener('DOMContentLoaded', init, false)
	if (window.Velocity) Blyde.useVelocity(window.Velocity)
	loaded = true
	initQuery.forEach(i => initQuery[i].call(window))
	log('Blyde initlized!')
}

document.addEventListener('DOMContentLoaded', init, false)
if (document.readyState === "interactive" || document.readyState === "complete") init()

export default Blyde
