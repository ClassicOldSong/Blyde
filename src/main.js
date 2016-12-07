/* global define */
'use strict'

import Blyde from './loader.js'
import { log } from './debug.js'

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Blyde
} else if (typeof define === 'function' && define.amd) {
	define(() => Blyde)
} else {
	Object.defineProperty(window, 'Blyde', { value: Blyde })
	if (window.$) log(`"window.$" may have been taken by another library, use "window.Blyde" for non-conflict usage.`)
	else Object.defineProperty(window, '$', { value: Blyde })
}