# Blyde
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/Blyde/master/LICENSE) [![npm](https://img.shields.io/npm/dt/blyde.svg?style=flat-square)](https://www.npmjs.com/package/blyde) [![Build status](https://img.shields.io/travis/ClassicOldSong/Blyde.svg?style=flat-square)](https://travis-ci.org/ClassicOldSong/Blyde)

A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
+ `node.$`: Wrap the node with Blyde, return a `$node`
+ `node.$id`: The special id for this node if wrapped by Blyde already (DO NOT MODIFY!!)
+ `Blyde(function)`: Execute the function when document is ready
+ `Blyde.version`: Version of Blyde
+ `Blyde.fn(plugin)`: Register a plugin for Blyde (See Wiki for Plugin usage \**Not Completed*\*)
+ `Blyde.useVelocity(Velocity)`: Add Velocity manually if Velocity is not attached to `window`
+ `$(function)`: Same as `Blyde()`
+ `$.version`: Same as `Blyde.version`
+ `$.fn(plugin)`: Same as `Blyde.fn()`
+ `$.create('tag')`: Create an element and return a `$node`
+ `$.q('selector')`: Wrapper for `document.querySelector()` and return a `$node`
+ `$.qa('selector')`: Wrapper for `document.querySelectorAll()` and return a `$nodeList`
+ `$.on(type, listener[, useCapture])`: Wrapper for `window.addEventListener()`
+ `$.off(type, listener[, useCapture])`: Wrapper for `window.removeEventListener()`
+ `$node.$el`: The original node of this element
+ `$node.q('selector')`: Wrapper for `node.querySelector()` and return a `$node`
+ `$node.qa('selector')`: Wrapper for `node.querySelectorAll()` and return a `$nodeList`
+ `$node.addClass('classe names')`: Add classes to an element, use `space` for multiple class names
+ `$node.removeClass('class names')`: Remove classes from an element, use `space` for multiple class names
+ `$node.toggleClass('class names')`: Toggle classes for an element, use `space` for multiple class names
+ `$node.replaceWith(node)`: Replace element with a new element
+ `$node.swap(node)`: Swap an element with another
+ `$node.before(node)`: Insert an element before this element
+ `$node.after(node)`: Insert an element after this element
+ `$node.append(nodes)`: Append elements to this element
+ `$node.prepend(nodes)`: Prepend elements to this element
+ `$node.appendTo(node)`: Append this element to an element
+ `$node.prependTo(node)`: Prepend this element to an element
+ `$node.empty()`: Delete all childnodes from an element
+ `$node.remove()`: Delete an element from document
+ `$node.safeRemove()`: Remove an element from document while all event listeners are still maintained
+ `$node.on(type, listener[, useCapture])`: Wrapper for `Node.addEventListener()`
+ `$node.off(type, listener[, useCapture])`: Wrapper for `Node.removeEventListener()`

+ `$nodeList.addClass('classe names')`: Add classes to all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.removeClass('class names')`: Remove classes from all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.toggleClass('class names')`: Toggle classes for all elements in this nodelist, use `space` for multiple class names
+ `$nodeList.appendTo(node)`: Append all elements in this nodelist to an element
+ `$nodeList.prependTo(node)`: Prepend all elements in this nodelist to an element
+ `$nodeList.empty()`: Delete all childnodes from elements in this nodelist
+ `$nodeList.remove()`: Delete all elements in this nodelist from document
+ `$nodeList.safeRemove()`: Remove all elements in this nodelist from document while all event listeners are still maintained
+ `$nodeList.on(type, listener[, useCapture])`: Add event listener to all elements in this nodelist
+ `$nodeList.off(type, listener[, useCapture])`: Remove event listener for all elements in this nodelist

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

**Note:** All debugging messages were removed from the production version

## TBD
- [ ] Top level Events handler

## License
[MIT](http://cos.mit-license.org/)
