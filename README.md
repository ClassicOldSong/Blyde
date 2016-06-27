# Blyde
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/Blyde/master/LICENSE) [![npm](https://img.shields.io/npm/dt/blyde.svg?style=flat-square)](https://www.npmjs.com/package/blyde)

A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
+ `Blyde(function)`: Execute the function when document is ready
+ `Blyde.version`: Blyde v0.0.4
+ `Blyde.fn('name', {node:{node methods}, list:{nodelist methods}}, autonamespace)`: Register a plugin for Blyde (Set autonamespace true to solve conflicts, otherwise the original methods will be maintained)
+ `$(function)`: Same as `Blyde()`
+ `$.version`: Same as `Blyde.version`
+ `$.fn('name', {methods}, override)`: Same as `Blyde.fn()`
+ `window.$create('tag')`: Wrapper for `document.createNode()`
+ `window.$q('selector')`: Wrapper for `document.querySelector()`
+ `window.$qa('selector')`: Wrapper for `document.querySelectorAll()`
+ `window.on(type, listener[, useCapture])`: Wrapper for `window.addEventListener()`
+ `window.un(type, listener[, useCapture])`: Wrapper for `window.removeEventListener()`
+ `document.$q('selector')`: Same as `window.$q('selector')`
+ `document.$qa('selector')`: Same as `window.$qa('selector')`
+ `document.on(type, listener[, useCapture])`: Wrapper for `document.addEventListener()`
+ `document.un(type, listener[, useCapture])`: Wrapper for `document.removeEventListener()`
+ `Node.$q('selector')`: Wrapper for `Node.querySelector()`
+ `Node.$qa('selector')`: Wrapper for `Node.querySelectorAll()`
+ `Node.addClass('classe names')`: Add classes to an element, use `space` for multiple class names
+ `Node.removeClass('class names')`: Remove classes from an element, use `space` for multiple class names
+ `Node.toggleClass('class names')`: Toggle classes for an element, use `space` for multiple class names
+ `Node.replaceWith(node)`: Replace element with a new element
+ `Node.swap(node)`: Swap an element with another
+ `Node.before(node)`: Insert an element before this element
+ `Node.after(node)`: Insert an element after this element
+ `Node.append(nodes)`: Append elements to this element
+ `Node.prepend(nodes)`: Prepend elements to this element
+ `Node.appendTo(node)`: Append this element to an element
+ `Node.prependTo(node)`: Prepend this element to an element
+ `Node.empty()`: Delete all childnodes from an element
+ `Node.remove()`: Delete an element from document
+ `Node.safeRemove()`: Remove an element from document while all event listeners are still maintained
+ `Node.on(type, listener[, useCapture])`: Wrapper for `Node.addEventListener()`
+ `Node.un(type, listener[, useCapture])`: Wrapper for `Node.removeEventListener()`

+ `NodeList.addClass('classe names')`: Add classes to all elements in this nodelist, use `space` for multiple class names
+ `NodeList.removeClass('class names')`: Remove classes from all elements in this nodelist, use `space` for multiple class names
+ `NodeList.toggleClass('class names')`: Toggle classes for all elements in this nodelist, use `space` for multiple class names
+ `NodeList.appendTo(node)`: Append all elements in this nodelist to an element
+ `NodeList.prependTo(node)`: Prepend all elements in this nodelist to an element
+ `NodeList.empty()`: Delete all childnodes from elements in this nodelist
+ `NodeList.remove()`: Delete all elements in this nodelist from document
+ `NodeList.safeRemove()`: Remove all elements in this nodelist from document while all event listeners are still maintained
+ `NodeList.on(type, listener[, useCapture])`: Add event listener to all elements in this nodelist
+ `NodeList.un(type, listener[, useCapture])`: Remove event listener for all elements in this nodelist

## Animation
To use animation, simply add [Velocity.js](http://julian.com/research/velocity/) into your HTML before document is ready:

``` javascript
<script src="js/velocity.min.js"></script>
```
Then you can use:
+ `Node.velocity(arguments)`: Animate this element
+ `NodeList.velocity(arguments)`: Animate all elements in this nodelist

Detail usage please read the instruction of [Velocity.js](http://julian.com/research/velocity/)

The usage of Velocity.js with Blyde should be similar to that with jQuery.

## Build from source
```
$ git clone https://github.com/ClassicOldSong/Blyde.git
$ cd Blyde
$ npm install
$ gulp
```
Then you can get the fresh-built ES5lized `blyde.js` and minified `blyde.min.js` at the `dist` folder

**Note:** Warning and error messages were removed from the minified version

## TBD
- [x] Plugin API
- [x] Events handler

## License
[MIT](http://cos.mit-license.org/)
