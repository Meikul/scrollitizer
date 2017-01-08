# Scrollitizer
Small script to make scrolling more interesting.

## Features
- Parallax tools for vertical scrolling
- Parallax tools for horizontal scrolling

## Including
It's just a script file so download the file, put it in your project folder and include it via a script tag in any html you use it in.<br/>
`<script src="scrollitizer.js"></script>`

## Usage
Scrollitizer uses html attributes to determine what you want your DOM elements to do when you scroll.
### Vertical Parallax
Parallax is the effect you get when you move your head and closer objects seem to move faster than further objects. There's a similar effect used in web development. It's a good way to make your website more visually engaging. Scrollitizer makes parallax effects easy. You simply include the "vertParallax" attribute in your html tag to give parallax powers when you scroll vertically. <br/>
The syntax of the vertParallax attribute is as follows: <br/>
`vertParallax="[vertical scroll speed] [horizontal scroll speed]"` e.g. `vertParallax="0.5 -2"`<br/>
The "vertical scroll speed" is the speed the element moves up and down when you scroll.
It's the proportion of it's normal scroll speed you want it to move at.
- `vertParallax="1"` the element would scroll normally.
- `vertParallax="0.5"` the element would move at half the speed it normally would.
- `vertParallax="0"` the element it wouldn't move at all.
- `vertParallax="-1"` the element would move the opposite direction.
