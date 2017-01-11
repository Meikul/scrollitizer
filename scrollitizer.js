var last_known_scroll_position = 0;
var ticking = false;
var vhPerPx = 100/window.innerHeight;
var vwPerPx = 100/window.innerWidth;
handleScroll.vLastScroll = 0;
handleScroll.hLastScroll = 0;

function getUnit(str){
  return str.charAt(str.length-1) == "%" ? str.charAt(str.length-1) : str.substr(str.length-2, str.length-1);
}

function vPar(elements, pxDeltaScroll){
  elements.forEach(elem=>{
    let vertParallax = elem.getAttribute('vPar').split(" ");
    let vhDeltaScroll = pxDeltaScroll * vhPerPx;
    let vwDeltaScroll = pxDeltaScroll * vwPerPx;
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if (vertParallax[0]){
      if (tUnit == "vh" || tUnit == "%")
        elem.style.top = (t.substring(0, t.length-2)-(vhDeltaScroll*vertParallax[0]))+tUnit;
      else if (tUnit == "vw")
        elem.style.top = (t.substring(0, t.length-2)-(vwDeltaScroll*vertParallax[0]))+tUnit;
      else
        elem.style.top = (t.substring(0, t.length-2)-(pxDeltaScroll*vertParallax[0]))+tUnit;
    }
    if(vertParallax[1]){
      if (lUnit == "vw" || lUnit == "%")
        elem.style.left = (l.substring(0, l.length-2)-(vwDeltaScroll*vertParallax[1]))+lUnit;
      else if (lUnit == "vh")
        elem.style.left = (l.substring(0, l.length-2)-(vhDeltaScroll*vertParallax[1]))+lUnit;
      else
        elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*vertParallax[1]))+lUnit;
    }
  });
}

function hPar(elements, pxDeltaScroll){
  elements.forEach(elem=>{
    let horParallax = elem.getAttribute('hPar').split(" ");
    let vhDeltaScroll = pxDeltaScroll * vhPerPx;
    let vwDeltaScroll = pxDeltaScroll * vwPerPx;
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    if(horParallax[0]){
      if (lUnit == "vw" || lUnit == "%")
        elem.style.left = (l.substring(0, l.length-2)-(vwDeltaScroll*horParallax[0]))+lUnit;
      else if (lUnit == "vh")
        elem.style.left = (l.substring(0, l.length-2)-(vhDeltaScroll*horParallax[0]))+lUnit;
      else
        elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*horParallax[0]))+lUnit;
    }
    if(horParallax[1]){
      if (tUnit == "vh" || tUnit == "%")
        elem.style.top = (t.substring(0, t.length-2)-(vhDeltaScroll*horParallax[1]))+tUnit;
      else if (tUnit == "vw")
        elem.style.top = (t.substring(0, t.length-2)-(vwDeltaScroll*horParallax[1]))+tUnit;
      else
        elem.style.top = (t.substring(0, t.length-2)-(pxDeltaScroll*horParallax[1]))+tUnit;
    }
  });
}

function handleScroll(vScrollPos, hScrollPos) {
  // let vscrollPct = scrollPos/(document.body.scrollHeight-window.innerHeight);
  let vDeltaScroll = vScrollPos - handleScroll.vLastScroll;
  let hDeltaScroll = hScrollPos - handleScroll.hLastScroll;
  if(vDeltaScroll) vPar(document.querySelectorAll('[vPar]'), vDeltaScroll);
  if(hDeltaScroll) hPar(document.querySelectorAll('[hPar]'), hDeltaScroll);
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
