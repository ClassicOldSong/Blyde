/* global console, Blyde, define */
"use strict"
{
	const plugin = ($) => {
		let ExampleFunc = function() {
			$.log('This should not show up in procduction enviroment.')
			$.warn('This also should not show up in procduction enviroment.')
			$.error('This SHOULD show up in procduction enviroment!')
		}

		return {
			name: 'Example',
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
				version: `fake ${$.version}`
			}
		}
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = plugin
	} else if (typeof define === 'function' && define.amd) {
		define(() => plugin)
	} else if (window.Blyde) {
		Blyde.fn(plugin, { autoNameSpace: 'rename' })
	}
}
