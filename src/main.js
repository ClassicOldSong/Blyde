/* global define */
'use strict'

import Blyde from './loader.js'

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Blyde
} else if (typeof define === 'function' && define.amd) {
	define(() => Blyde)
} else {
	Object.defineProperties(window, {
		Blyde: {
			value: Blyde
		},
		$: {
			value: Blyde
		}
	})
}