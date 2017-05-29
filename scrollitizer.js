var last_known_scroll_position = 0;
var ticking = false;
var vhPerPx = 100/window.innerHeight;
var vwPerPx = 100/window.innerWidth;
var hParElements = [];
var vParElements = [];
var firstPar = true;
handleScroll.vLastScroll = 0;
handleScroll.hLastScroll = 0;
var scrollableHeight;
var scrollableWidth;

window.addEventListener('load', function(){ // set total scrollable height
  scrollableHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
  )-window.innerHeight;
  scrollableWidth = Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
  )-window.innerWidth;
});

function ParElemParser(par){
  pack = {};
  pack.forEach((str, i)=>{
    if(i===0){
      pack.prim = parseFloat(str);
    }
    else{
      if(str.match(/->/)){ // Bounds (assuming lone start bound has ->)
        hasBounds = true;
        pack.bounds.start = str.match(/.+?(?=->)/) ? str.match(/.+?(?=->)/)[0] : "0px";
        pack.bounds.end = str.match(/->(.+)$/) ? str.match(/->(.+)$/)[1] : "100%";
      }
      else{ // horizontal move
        pack.sec = parseFloat(str);
        elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*arg))+lUnit;
      }
    }
  });
}

function ParElem(elem){
  this.elem = elem;
  let vPar = elem.getAttribute('vPar').split(" ");
  let hPar = elem.getAttribute('hPar').split(" ");
  vPar.forEach();
}

function isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  }
  catch(e){
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

function updateScrollitizer(arg='all'){
  if(typeof arg === 'string'){
    if(arg === 'vertical'){
      vParElements = [];
      document.querySelectorAll('[vPar]').forEach((node)=>{
        vParElements.push(ParElem(node));
      });
    }
    else if(arg === 'horizontal'){
      hParElements = [];
      document.querySelectorAll('[hPar]').forEach((node)=>{
        hParElements.push(ParElem(node));
      });
    }
    else if(arg === 'all'){
      vParElements = [];
      document.querySelectorAll('[vPar]').forEach((node)=>{
        vParElements.push(ParElem(node));
      });
      hParElements = [];
      document.querySelectorAll('[hPar]').forEach((node)=>{
        hParElements.push(ParElem(node));
      });
    }
  }
  else if(typeof arg === 'object'){
    if(isElement(arg)){
      if(arg.getAttribute('vPar')){
        let i=0;
        for(let vParElem of vParElements){
          i++;
          if(vParElem.elem === arg){
            vParElements[i] = ParElem(arg);
            break;
          }
        }
      }
      if(arg.getAttribute('hPar')){
        let i=0;
        for(let hParElem of hParElements){
          i++;
          if(hParElem.elem === arg){
            hParElements[i] = ParElem(arg);
            break;
          }
        }
      }
    }
    else if(Array.isArray(arg)){
      arg.forEach((ArrElem)=>{
        if(isElement(ArrElem)){
          if(arg.getAttribute('vPar')){
            let i=0;
            for(let vParElem of vParElements){
              i++;
              if(vParElem.elem === arg){
                vParElements[i] = ParElem(arg);
                break;
              }
            }
          }
          if(arg.getAttribute('hPar')){
            let i=0;
            for(let hParElem of hParElements){
              i++;
              if(hParElem.elem === arg){
                hParElements[i] = ParElem(arg);
                break;
              }
            }
          }
        }
      });
    }
  }
}

function updatevPar(){
  vParElements = document.querySelectorAll('[vPar]');
}

function updatehPar(){
  hParElements = document.querySelectorAll('[hPar]');
}

function getUnit(str){
  //return str.charAt(str.length-1) == "%" ? str.charAt(str.length-1) : str.substr(str.length-2, str.length-1);
  return str.match(/\D+$/);
}

function getValue(str){
  return parseFloat(str.match(/[\d, -]+/));
}

function vinBounds(start, end){
  const curPos = vLastScroll;
  const curPct = curPos/scrollableHeight;
  let fitsStart;
  let fitsEnd;
  let beforeStart;
  // fitsStart AND fitsEnd  =  in bounds
  // not in bounds AND beforeStart  =  currently above start
  // not in bounds AND not beforeStart  =  currently below end
  if(getUnit(start) == '%'){
    start = getValue(start)/scrollableHeight;
    fitsStart = curPct > start;
    beforeStart = curPct < start;
  }
  else{
    start = getValue(start);
    fitsStart = curPos > start;
    beforeStart = curPos < start;
  }
  if(getUnit(end) == '%'){
    end = getValue(end)/scrollableHeight;
    fitsEnd = curPct < end;
  }
  else{
    end = getValue(end);
    fitsEnd = curPos < end;
  }

  return [(fitsStart && fitsEnd), beforeStart];

}

function hinBounds(start, end){
  const curPos = hLastScroll;
  const curPct = curPos/scrollableWidth;
  let fitsStart;
  let fitsEnd;
  if(getUnit(start) == '%'){
    start = getValue(start)/scrollableWidth;
    fitsStart = curPct > start;
  }
  else{
    start = getValue(start);
    fitsStart = curPos > start;
  }
  if(getUnit(end) == '%'){
    end = getValue(end)/scrollableWidth;
    fitsStart = curPct > end;
  }
  else{
    end = getValue(end);
    fitsStart = curPos > end;
  }
  return (fitsStart && fitsEnd);

}

function vPar(pxDeltaScroll){
  vParElements.forEach(elem=>{
    if (elem.style.top == "" || elem.style.left == ""){
      let style = window.getComputedStyle(elem);
      elem.style.top = style.getPropertyValue("top");
      elem.style.left = style.getPropertyValue("left");
    }
    let vertParallax = elem.getAttribute('vPar').split(" ");
    let l = elem.style.left;
    let t = elem.style.top;
    let lUnit = getUnit(l);
    let tUnit = getUnit(t);
    let hasBounds = false;
    let startBound;
    let endBound;
    vertParallax.forEach((arg, i)=>{
      if(i>0 && i<3){
        if(arg.match(/->/)){ // Bounds (assuming lone start bound has ->)
          hasBounds = true;
          startBound = arg.match(/.+?(?=->)/) ? arg.match(/.+?(?=->)/)[0] : "0px";
          endBound = arg.match(/->(.+)$/) ? arg.match(/->(.+)$/)[1] : "100%";
        }
        else if(arg){ // horizontal move

          elem.style.left = (l.substring(0, l.length-2)-(pxDeltaScroll*arg))+lUnit;
        }
      }
    });
    if (vertParallax[0]){ // vertical move
      let inBoundsInfo;
      if(hasBounds) inBoundsInfo = vinBounds(startBound, endBound);
      if(hasBounds && inBoundsInfo[0]){
        elem.style.top = (getValue(t)-(pxDeltaScroll*vertParallax[0]))+tUnit;
      }
      else if(hasBounds && !inBoundsInfo[0]){
        // implementing this after object revision
        if(inBoundsInfo[1]){
          //set to startBound position
        }
        else{
          //set to endBound position
        }
      }
      else if(!hasBounds){
        elem.style.top = (getValue(t)-(pxDeltaScroll*vertParallax[0]))+tUnit;
      }
    }
  });
  firstPar = false;
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


window.onload = updateScrollitizer;

function handleScroll(vScrollPos, hScrollPos) {
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
