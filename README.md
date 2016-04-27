# Blyde
A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
+ `Blyde(function)`: Execute the function when document is ready
+ `Blyde.version`: Blyde v0.0.3 beta
+ `Blyde.fn('name', {node:{node methods}, list:{nodelist methods}}, autonamespace)`: Register a plugin for Blyde (Set autonamespace true to solve conflicts, otherwise the original methods will be maintained)
+ `$(function)`: Same as `Blyde()`
+ `$.version`: Same as `Blyde.version`
+ `$.fn('name', {methods}, override)`: Same as `Blyde.fn()`
+ `window.$create('tag')`: Wrapper for `document.createElement()`
+ `window.$q('selector')`: Wrapper for `document.querySelector()`
+ `window.$qa('selector')`: Wrapper for `document.querySelectorAll()`
+ `document.$q('selector')`: Same as `window.$q('selector')`
+ `document.$qa('selector')`: Same as `window.$qa('selector')`
+ `Element.$q('selector')`: Wrapper for `Element.querySelector()`
+ `Element.$qa('selector')`: Wrapper for `Element.querySelectorAll()`
+ `Element.addClass('classes')`: Add classes to an element, use `space` for multiple class names
+ `Element.removeClass('class names')`: Remove classes from an element, use `space` for multiple class names
+ `Element.toggleClass('class names')`: Toggle classes for an element, use `space` for multiple class names
+ `Element.replaceWith(node)`: Replace element with a new element
+ `Element.swap(node)`: Swap an element with another
+ `Element.before(node)`: Insert an element before this element
+ `Element.after(node)`: Insert an element after this element
+ `Element.append(nodes)`: Append elements to this element
+ `Element.prepend(nodes)`: Prepend elements to this element
+ `Element.appendTo(node)`: Append this element to an element
+ `Element.prependTo(node)`: Prepend this element to an element
+ `Element.empty()`: Delete all childnodes from an element
+ `Element.remove()`: Delete an element from document
+ `Element.on(type, listener[, useCapture])`: Wrapper for `Element.addEventListener()`
+ `Element.un(type, listener[, useCapture])`: Wrapper for `Element.removeEventListener()`

+ `NodeList.addClass('classes')`: Add classes to all elements in this nodelist, use `space` for multiple class names
+ `NodeList.removeClass('class names')`: Remove classes from all elements in this nodelist, use `space` for multiple class names
+ `NodeList.toggleClass('class names')`: Toggle classes for all elements in this nodelist, use `space` for multiple class names
+ `NodeList.appendTo(node)`: Append all elements in this nodelist to an element
+ `NodeList.prependTo(node)`: Prepend all elements in this nodelist to an element
+ `NodeList.empty()`: Delete all childnodes from elements in this nodelist
+ `NodeList.remove()`: Delete all elements in this nodelist from document
+ `NodeList.on(type, listener[, useCapture])`: Add event listener to all elements in this nodelist
+ `NodeList.un(type, listener[, useCapture])`: Remove event listener for all elements in this nodelist

## WARNING
Plugin API is still under development, be careful when trying to make a new plugin before Blyde commits its first release.

## TBD
- [x] Plugin API
- [x] Events handler

## License
[MIT](http://cos.mit-license.org/)