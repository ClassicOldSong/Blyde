# Blyde
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/Blyde/master/LICENSE) [![npm](https://img.shields.io/npm/dt/blyde.svg?style=flat-square)](https://www.npmjs.com/package/blyde) [![Build status](https://img.shields.io/travis/ClassicOldSong/Blyde.svg?style=flat-square)](https://travis-ci.org/ClassicOldSong/Blyde)

A blade-sharp javascript library that provides several simple jQuery like operations

## Basic Usage
+ `node.$`: Wrap the node with Blyde, return a `$node`
+ `node.$id`: The special id for this node if wrapped by Blyde already (DO NOT MODIFY!!)
+ `Blyde(function)`: Execute the function when document is ready
+ `Blyde.version`: Version of Blyde
+ `Blyde.fn(plugin)`: Register a plugin for Blyde (See Wiki for Plugin usage \**Not Completed*\*)
+ `Blyde.useVelocity(Velocity)`: Add Velocity manually if Velocity is not attached to `window`
+ `$(function)`: Same as `Blyde()`
+ `$.version`: Same as `Blyde.version`
+ `$.fn(plugin)`: Same as `Blyde.fn()`
+ `$.q('selector')`: Wrapper for `document.querySelector()` and return a `$node`
+ `$.qa('selector')`: Wrapper for `document.querySelectorAll()` and return a `$nodeList`
+ `$.on(type, listener[, useCapture])`: Wrapper for `window.addEventListener()`
+ `$.listen(type, node, fn)`: Create a delegate for a node on `window`
+ `$.at(type, fn)`: Create a delegate for window on `window`
+ `$.drop(type, node, fn)`: Remove a delegate for a node on `window`
+ `$.off(type, fn[, useCapture])`: Remove enentListeners for this element with `window.removeEventListener()` & `window.drop()`
+ `$.$getSymbol()`: Get a `Symbol` with a random string
+ `$node.$el`: The original node of this element
+ `$node.q('selector')`: Wrapper for `node.querySelector()` and return a `$node`
+ `$node.qa('selector')`: Wrapper for `node.querySelectorAll()` and return a `$nodeList`
+ `$node.addClass('classe names')`: Add classes to this element, use `space` for multiple class names
+ `$node.removeClass('class names')`: Remove classes from this element, use `space` for multiple class names
+ `$node.toggleClass('class names')`: Toggle classes for this element, use `space` for multiple class names
+ `$node.replaceWith(node)`: Replace this element with a new element
+ `$node.swap(node)`: Swap this element with another
+ `$node.before(node)`: Insert this element before an element
+ `$node.after(node)`: Insert this element after an element
+ `$node.append(nodes)`: Append elements to this element
+ `$node.prepend(nodes)`: Prepend elements to this element
+ `$node.appendTo(node)`: Append this element to an element
+ `$node.prependTo(node)`: Prepend this element to an element
+ `$node.empty()`: Delete all childnodes from this element
+ `$node.remove()`: Delete this element from document and return this element itself *(Not a `$node`!!)*
+ `$node.safeRemove()`: Remove this element from document while all event listeners are still maintained
+ `$node.on(type, fn[, useCapture])`: Wrapper for `Node.addEventListener()`
+ `$node.listen(type, node, fn)`: Create a delegate for a node on this element
+ `$node.at(type, fn)`: Create a delegate for this element on `window`
+ `$node.drop(type, node, fn)`: Remove a delegate for a node on this element
+ `$node.off(type, fn[, useCapture])`: Remove enentListeners for this element with `Node.removeEventListener()` & `$.drop()`

+ `$nodeList.addClass('classe names')`: Add classes to all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.removeClass('class names')`: Remove classes from all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.toggleClass('class names')`: Toggle classes for all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.appendTo(node)`: Append all elements in this nodelist to this element
+ `$nodeList.prependTo(node)`: Prepend all elements in this nodelist to this element
+ `$nodeList.empty()`: Delete all childnodes from elements in this nodelist
+ `$nodeList.remove()`: Delete all elements in this nodelist from document
+ `$nodeList.safeRemove()`: Remove all elements in this nodelist from document while all event listeners are still maintained
+ `$nodeList.on(type, fn[, useCapture])`: Add event listener to all elements in this nodelist
+ `$nodeList.at(type, fn)`: Create delegate to all elements in this nodelist on `window`
+ `$nodeList.off(type, fn[, useCapture])`: Remove event listener for all elements in this nodelist

## Animation
To use animation, simply add [Velocity.js](http://julian.com/research/velocity/) into your HTML before document is ready:

``` javascript
<script src="js/velocity.min.js"></script>
```

or

``` javascript
import Blyde from 'blyde'
import Velocity from 'velocity-animate'

Blyde.useVelocity(Velocity)
```

Then you can use:
+ `$node.velocity(arguments)`: Animate this element
+ `$nodeList.velocity(arguments)`: Animate all elements in this nodelist

Detial usage please read the instruction of [Velocity.js](http://velocityjs.org/)

The usage of Velocity.js with Blyde should be similar to that with jQuery.

## Compatibility
Currently only supports IE10+, if you would like to use Blyde in IE9+, simply add [classlist-polyfill](https://www.npmjs.com/package/classlist-polyfill) into your project.

## Build from source
```
$ git clone https://github.com/ClassicOldSong/Blyde.git
$ cd Blyde
$ npm install
$ npm run build
```
Then you can get the fresh-built `blyde.min.js` at the `dist` folder

**Note:** All debugging messages are disabled in the production version

## License
[MIT](http://cos.mit-license.org/)
