/* global console, define */
"use strict"
{
	const plugin = ($) => {
		$.log('Examin all properties that Blyde pass to a plugin here:\n', $)
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
		window.Blyde.fn(plugin, { autoNameSpace: 'rename' })
	} else {
		window.ExamplePlugin = plugin
		console.warn(`Blyde not found! If Blyde is loaded later, use "Blyde.fn(widnow.ExamplePlugin, yourConfig)" to load this plugin.`)
	}
}
