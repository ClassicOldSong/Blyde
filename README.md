# Blyde
A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
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
+ `Element.swap(node)`: Swap the element with a given one
+ `Element.remove()`: Delete an element

##License
[MIT](http://cos.mit-license.org/)