# Blyde
A blade-sharp javascript library that provides serval simple jQuery like operations

## Usage
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
+ `Element.append(nodes)`: Append given elements at the end of the element
+ `Element.prepend(nodes)`: Append given elements at the bignning of the element
+ `Element.empty()`: Delete all childnodes from an element
+ `Element.remove()`: Delete an element

##License
[MIT](http://cos.mit-license.org/)