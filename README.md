# Scrollitizer
Small script that makes scrolling more interesting.

## Features
- Parallax tools for vertical scrolling
- Parallax tools for horizontal scrolling

## Including
It's just a script file with no dependencies, so kinda however you want. You can just download it, put it in your project folder and include it via a script tag in any html you use it in.<br/>
`<script src=".js"></script>`
<br/>
It's also probably a good idea to put it above any of your script tags. The [update](#updating-scrollitizers-dom) functions won't work otherwise. Everything else will work wherever you put it.

## Documentation
Scrollitizer uses html attributes to determine what you want your DOM elements to do when you scroll.
### Parallax
Parallax is the effect you get when you move and closer objects seem to move faster than further objects. There's a similar effect used in web development. It's a good way to make your website more visually engaging. Scrollitizer makes parallax effects super easy.

##### Requirements
* Elements you want to use parallax with must have position other than static which is default.

#### Vertical Parallax
Vertical parallax is a parallax effect that takes place when you scroll up or down. To use it in your project just include the "vPar" attribute in your html tag to give parallax powers when you scroll vertically. <br/><br/>
The syntax of the vPar attribute is as follows: <br/>
`vPar="[vertical scroll speed] [horizontal scroll speed]"` e.g. `vPar="0.5 -2"`<br/>
The [vertical scroll speed] is the speed the element moves up and down when you scroll.
It's the proportion of it's normal scroll speed you want it to move at.
- `vPar="1"` the element would scroll normally.
- `vPar="0.5"` the element would move at half the speed it normally would.
- `vPar="0"` the element it wouldn't move at all.
- `vPar="-1"` the element would move the opposite direction.

<span style="color: grey;"> Note: This assumes position is `fixed`. If not the element will scroll normally plus the Scrollitizer effect. So, if the element's position is `absolute` and it has `vPar="1"` it will scroll at twice its normal speed.</span>

You can also make elements move sideways when you scroll vertically (positive makes it go left when you scroll down). That's what the [horizontal scroll speed] is about. Just add a space and type in the horizontal speed. For example, and element with `vPar="0.5 -0.5"` would go up and right at half speed.
#### Horizontal Parallax
Horizontal Parallax is essentially the same as vertical parallax, except the effect is controlled by scrolling sideways, and the horizontal scroll speed is the first number.
The syntax is as follows:<br/>
`hPar="[horizontal scroll speed] [vertical scroll speed]"`

### Updating Scrollitizer's DOM
Scrollitizer finds all elements with vPar or hPar attributes when the page initially loads and doesn't look again. If you create elements any time after the page loads Scrollitizer doesn't know they exist. Use the update functions to make Scrollitizer find them.<br/>
&nbsp;&nbsp; `updatevPar()` looks for elements with the vPar attribute<br/>
&nbsp;&nbsp; `updatehPar()` looks for elements with the hPar attribute<br/>
&nbsp;&nbsp; `updateScrollitizer()` looks for both<br/>
Just put these functions in your JS files when you want to update Scrollitizer.
For example:<br/>
```js
var element = document.createElement('div');
element.setAttribute('vPar', '1.0');
body.appendChild(document.createElement('div'));
// We just created a div with a vPar attribute and stuck it in "body", but Scrollitizer
// doesn't know that. We have to update it.
updateScrollitizer();
// We could also do this
updatevPar();
// since what we added only had a vPar attribute.
```
