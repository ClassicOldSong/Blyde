/* global console, $ */
"use strict";
{
	let ExampleFunc = function() {
		console.log('This is an example:', this);
	};
	$.fn('ExamplePlugin', {
		testFunc: {
			value: ExampleFunc // New method to be registered
		},
		toggleClass: {
			value: 'Not overrided',
			override: false // Not overrided
		},
		addClass: {
			value: function(...args) {
				this.classList.add(...args);
				return this;
			},
			override: true // Overrided the original method
		}
	}, true);
}