/* global console, $ */
/* eslint linebreak-style: ["error", "unix"] */
"use strict"
{
	let ExampleFunc = function() {
		console.log('This is an example:', this)
	}

	/**
	node: {
		testFunc: ExampleFunc, // New method to be registered
		toggleClass: 'Namespaced', // Will be namespaced
		addClass(...args) {...}  // Will be namespaced
	},
	list: {
		testFunc: ExampleFunc, // New method to be registered
		toggleClass: 'Namespaced', // Will be namespaced
		addClass(...args) {...} // Will be namespaced
	}
	**/
	$.fn('ExamplePlugin', {
		node: {
			testFunc: ExampleFunc, // New method to be registered
			toggleClass: 'Namespaced', // Will be namespaced
			addClass(...args) {
				this.classList.add(...args)
				return this
			}
		},
		list: {
			testFunc: ExampleFunc, // New method to be registered
			toggleClass: 'Namespaced', // Will be namespaced
			addClass(...args) {
				for (let i = 0; i < this.length; i++) {
					this[i].classList.add(...args)
				}
				return this
			}
		}
	}, true)
}