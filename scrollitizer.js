var last_known_scroll_position = 0;
var ticking = false;
handleScroll.vLastScroll = 0;
handleScroll.hLastScroll = 0;

function getUnit(str){
  return str.charAt(str.length-1) == "%" ? str.charAt(str.length-1) : str.substr(str.length-2, str.length-1);
}

function vPar(elements, deltaScroll){
  elements.forEach(elem=>{
    let vertParallax = elem.getAttribute('vertParallax').split(" ");
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if(vertParallax[0]) elem.style.top = (t.substring(0, t.length-2)-(deltaScroll*vertParallax[0]))+tUnit;
    if(vertParallax[1]) elem.style.left = (l.substring(0, l.length-2)-(deltaScroll*vertParallax[1]))+lUnit;
  });
}

function hPar(elements, deltaScroll){
  elements.forEach(elem=>{
    let horParallax = elem.getAttribute('horParallax').split(" ");
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if(horParallax[0]) elem.style.left = (l.substring(0, l.length-2)-(deltaScroll*horParallax[0]))+lUnit;
    if(horParallax[1]) elem.style.top = (t.substring(0, t.length-2)-(deltaScroll*horParallax[1]))+tUnit;
  });
}

function handleScroll(vScrollPos, hScrollPos) {
  // let vscrollPct = scrollPos/(document.body.scrollHeight-window.innerHeight);
  let vDeltaScroll = vScrollPos - handleScroll.vLastScroll;
  let hDeltaScroll = hScrollPos - handleScroll.hLastScroll;
  if(vDeltaScroll) vPar(document.querySelectorAll('[vertParallax]'), vDeltaScroll);
  if(hDeltaScroll) hPar(document.querySelectorAll('[horParallax]'), hDeltaScroll);
  handleScroll.vLastScroll = vScrollPos;
  handleScroll.hLastScroll = hScrollPos;
}

window.addEventListener('scroll', function(e) {
  vLastScroll = e.currentTarget.scrollY;
  hLastScroll = e.currentTarget.scrollX;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      handleScroll(vLastScroll, hLastScroll);
      ticking = false;
    });
  }
  ticking = true;
});
