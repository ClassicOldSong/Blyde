# Blyde
A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
+ `Blyde(function)`: Execute the function when document is ready
+ `Blyde.version`: v0.0.2
+ `Blyde.fn('name', {methods}, override)`: Register a plugin for Blyde
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
+ `Element.removeClass('classes')`: Remove classes from an element, use `space` for multiple class names
+ `Element.toggleClass('classes')`: Toggle classes for an element, use `space` for multiple class names
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
+ `NodeList.addClass('classes')`: Add classes to all elements in this nodelist, use `space` for multiple class names
+ `NodeList.removeClass('classes')`: Remove classes from all elements in this nodelist, use `space` for multiple class names
+ `NodeList.toggleClass('classes')`: Toggle classes for all elements in this nodelist, use `space` for multiple class names
+ `NodeList.appendTo(node)`: Append all elements in this nodelist to an element
+ `NodeList.prependTo(node)`: Prepend all elements in this nodelist to an element
+ `NodeList.empty()`: Delete all childnodes from elements in this nodelist
+ `NodeList.remove()`: Delete all elements in this nodelist from document

## WARNING
Plugin API is still under development, usage and behavior may vary from versions. Be careful when trying to make a new plugin before Blyde commits its first release.

## TBD
- [ ] Plugin API
- [ ] Events handler

##License
[MIT](http://cos.mit-license.org/)