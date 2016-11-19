/* global console, Blyde, define */
"use strict"
{
	let ExampleFunc = function() {
		console.log('This is an example:', this)
	}

	const plugin = {
		name: 'ExamplePlugin',
		node: {
			// New method to be registered
			testFunc: ExampleFunc,
			// Will be renamed
			toggleClass: 'Renamed',
			addClass(...args) {
				this.classList.add(...args)
				return this
			}
		},
		list: {
			// New method to be registered
			testFunc: ExampleFunc,
			// Will be renamed
			toggleClass: 'Renamed',
			addClass(...args) {
				for (let i = 0; i < this.length; i++) {
					this[i].classList.add(...args)
				}
				return this
			}
		},
		blyde: {
			// New method to be registered
			testFunc: ExampleFunc,
			// Will be renamed
			version: 'wtfBlyde v0.1.0'
		},
		config: {
			autoNameSpace: 'rename'
		}
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = plugin
	} else if (typeof define === 'function' && define.amd) {
		define(() => plugin)
	} else if (window.Blyde) {
		Blyde.fn(plugin)
	}
}
