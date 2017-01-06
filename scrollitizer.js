var last_known_scroll_position = 0;
var ticking = false;
doSomething.lastScroll = 0;

function fetch(id){
  return document.getElementById(id);
}

function doSomething(scrollPos) {
  let scrollPct = scrollPos/(document.body.scrollHeight-window.innerHeight);
  let elements = document.querySelectorAll('[scrollSpeed]');
  elements.forEach(elem=>{
    let deltaScroll = scrollPos - doSomething.lastScroll;
    let scrollSpeed = elem.getAttribute('scrollSpeed').split(" ");
    if(scrollSpeed[0]) elem.style.top = (elem.style.top.substring(0, elem.style.top.length-2)-(deltaScroll*scrollSpeed[0]))+'vh';
    if(scrollSpeed[1]) elem.style.left = (elem.style.left.substring(0, elem.style.left.length-2)-(deltaScroll*scrollSpeed[1]))+'vw';
  });
  doSomething.lastScroll = scrollPos;
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});
