var last_known_scroll_position = 0;
var ticking = false;
var vhPerPx = 100/window.innerHeight;
var vwPerPx = 100/window.innerWidth;
var hParElements = [];
var vParElements = [];
handleScroll.vLastScroll = 0;
handleScroll.hLastScroll = 0;

function getUnit(str){
  return str.charAt(str.length-1) == "%" ? str.charAt(str.length-1) : str.substr(str.length-2, str.length-1);
}

window.onload = ()=>{
  vParElements = document.querySelectorAll('[vPar]');
  hParElements = document.querySelectorAll('[hPar]');
};

function vPar(pxDeltaScroll){
  vParElements.forEach(elem=>{
    let style = window.getComputedStyle(elem);
    if (elem.style.top == "" || elem.style.left == ""){
      elem.style.top = style.getPropertyValue("top");
      elem.style.left = style.getPropertyValue("left");
    }
    let vertParallax = elem.getAttribute('vPar').split(" ");
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if (vertParallax[0]){
      elem.style.top = (t.substring(0, t.length-2)-(pxDeltaScroll*vertParallax[0]))+tUnit;
    }
    if(vertParallax[1]){
      elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*vertParallax[1]))+lUnit;
    }
  });
}

function hPar(pxDeltaScroll){
  hParElements.forEach(elem=>{
    let style = window.getComputedStyle(elem);
    if (elem.style.top == "" || elem.style.left == ""){
      elem.style.top = style.getPropertyValue("top");
      elem.style.left = style.getPropertyValue("left");
    }
    let horParallax = elem.getAttribute('hPar').split(" ");
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if(horParallax[0]){
        elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*horParallax[0]))+lUnit;
    }
    if(horParallax[1]){
        elem.style.top = (t.substring(0, t.length-2)-(pxDeltaScroll*horParallax[1]))+tUnit;
    }
  });
}

function handleScroll(vScrollPos, hScrollPos) {
  // let vscrollPct = scrollPos/(document.body.scrollHeight-window.innerHeight);
  let vDeltaScroll = vScrollPos - handleScroll.vLastScroll;
  let hDeltaScroll = hScrollPos - handleScroll.hLastScroll;
  if(vDeltaScroll) vPar(vDeltaScroll);
  if(hDeltaScroll) hPar(hDeltaScroll);
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
