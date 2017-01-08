var last_known_scroll_position = 0;
var ticking = false;
handleScroll.lastScroll = 0;

function fetch(id){
  return document.getElementById(id);
}

function handleScroll(scrollPos) {
  let scrollPct = scrollPos/(document.body.scrollHeight-window.innerHeight);
  let vertParallax = document.querySelectorAll('[vertParallax]');
  let horParallax  = document.querySelectorAll('[horParallax]');
  elements.forEach(elem=>{
    let deltaScroll = scrollPos - handleScroll.lastScroll;
    let vertParallax = elem.getAttribute('vertParallax').split(" ");
    if(vertParallax[0]) elem.style.top = (elem.style.top.substring(0, elem.style.top.length-2)-(deltaScroll*vertParallax[0]))+'vh';
    if(vertParallax[1]) elem.style.left = (elem.style.left.substring(0, elem.style.left.length-2)-(deltaScroll*vertParallax[1]))+'vw';
  });
  handleScroll.lastScroll = scrollPos;
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      handleScroll(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});
