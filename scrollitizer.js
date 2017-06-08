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
  par.forEach((str, i)=>{
    if(i===0){
      pack.prim = parseFloat(str);
    }
    else{
      if(str.match(/->/)){ // Bounds (assuming lone start bound has ->)
        pack.bounds = {};
        let start = str.match(/.+?(?=->)/);
        let end = str.match(/->(.+)$/);
        if(start){
          pack.bounds.start = getValue(start[0]);
          pack.bounds.startUnit = getUnit(start[0]);
        }
        if(end){
          pack.bounds.end = getValue(end[1]);
          pack.bounds.endUnit = getUnit(end[1]);
        }
        // pack.bounds.start = str.match(/.+?(?=->)/) ? str.match(/.+?(?=->)/)[0] : "0px";
        // pack.bounds.end = str.match(/->(.+)$/) ? str.match(/->(.+)$/)[1] : "100%";
      }
      else{ // horizontal move
        pack.sec = parseFloat(str);
      }
    }
  });
  return pack;
}

function vParElem(elem){
  this.elem = elem;
  let vPar = elem.getAttribute('vPar').split(" ");
  let vpack = ParElemParser(vPar);
  if (this.elem.style.top == "" || this.elem.style.left == ""){
    let compStyle = window.getComputedStyle(this.elem);
    this.elem.style.top = compStyle.getPropertyValue("top");
    this.elem.style.left = compStyle.getPropertyValue("left");
  }
  this.par = {};
  this.par.y = vpack.prim;
  this.par.x = vpack.sec;
  this.bounds = vpack.bounds;
  if(this.bounds){
    if(!this.bounds.end){
      this.bounds.end = 100;
      this.bounds.endUnit = '%';
    }
    if(!this.bounds.start){
      this.bounds.start = 0;
      this.bounds.startUnit = 'px';
    }
    this.bounds.startPos = {};
    this.bounds.endPos = {};
    this.bounds.startPos.top = this.elem.style.top;
    this.bounds.startPos.left = this.elem.style.left;
    const pxstart = this.bounds.startUnit === 'px' ? this.bounds.start : (this.bounds.start/100.0)*scrollableHeight;
    const pxend = this.bounds.endUnit === 'px' ? this.bounds.end : (this.bounds.end/100.0)*scrollableHeight;
    const boundRange = pxend-pxstart;
    console.log('pxstart: '+pxstart+' pxend: '+pxend+' boundRange: '+boundRange);
    if(boundRange > 0){
      this.bounds.endPos.top = getValue(this.bounds.startPos.top) - (boundRange*this.par.y) +'px';
      this.bounds.endPos.left = this.par.x ? getValue(this.bounds.startPos.left) - (boundRange*this.par.x) +'px' : this.bounds.startPos.left;
    }
  }
}

function hParElem(elem){
  this.elem = elem;
  let hPar = elem.getAttribute('hPar').split(" ");
  let hpack = ParElemParser(hPar);
  if (this.elem.style.top == "" || this.elem.style.left == ""){
    let compStyle = window.getComputedStyle(this.elem);
    this.elem.style.top = compStyle.getPropertyValue("top");
    this.elem.style.left = compStyle.getPropertyValue("left");
  }
  this.par = {};
  this.par.x = hpack.prim;
  this.par.y = hpack.sec;
  this.bounds = hpack.bounds;
  if(this.bounds){
    if(!this.bounds.end){
      this.bounds.end = 100;
      this.bounds.endUnit = '%';
    }
    if(!this.bounds.start){
      this.bounds.start = 0;
      this.bounds.startUnit = 'px';
    }
    this.bounds.startPos = {};
    this.bounds.endPos = {};
    this.bounds.startPos.top = this.elem.style.top;
    this.bounds.startPos.left = this.elem.style.left;
    const pxstart = this.bounds.startUnit === 'px' ? this.bounds.start : (this.bounds.start/100.0)*scrollableWidth;
    const pxend = this.bounds.endUnit === 'px' ? this.bounds.end : (this.bounds.end/100.0)*scrollableWidth;
    const boundRange = pxend-pxstart;
    console.log('pxstart: '+pxstart+' pxend: '+pxend+' boundRange: '+boundRange);
    if(boundRange > 0){
      this.bounds.endPos.top = getValue(this.bounds.startPos.top) - (boundRange*this.par.y) +'px';
      this.bounds.endPos.left = this.par.x ? getValue(this.bounds.startPos.left) - (boundRange*this.par.x) +'px' : this.bounds.startPos.left;
    }
  }
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
    if(arg === 'vpar'){
      vParElements = [];
      document.querySelectorAll('[vPar]').forEach((node)=>{
        vParElements.push(new vParElem(node));
      });
    }
    else if(arg === 'hpar'){
      hParElements = [];
      document.querySelectorAll('[hPar]').forEach((node)=>{
        hParElements.push(new hParElem(node));
      });
    }
    else if(arg === 'all'){
      vParElements = [];
      document.querySelectorAll('[vPar]').forEach((node)=>{
        console.log(new vParElem(node));
        vParElements.push(new vParElem(node));
      });
      hParElements = [];
      document.querySelectorAll('[hPar]').forEach((node)=>{
        hParElements.push(new hParElem(node));
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
            vParElements[i] = new vParElem(arg);
            break;
          }
        }
      }
      if(arg.getAttribute('hPar')){
        let i=0;
        for(let hParElem of hParElements){
          i++;
          if(hParElem.elem === arg){
            hParElements[i] = new hParElem(arg);
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
                vParElements[i] = new vParElem(arg);
                break;
              }
            }
          }
          if(arg.getAttribute('hPar')){
            let i=0;
            for(let hParElem of hParElements){
              i++;
              if(hParElem.elem === arg){
                hParElements[i] = new hParElem(arg);
                break;
              }
            }
          }
        }
      });
    }
  }
}

function getUnit(str){
  //return str.charAt(str.length-1) == "%" ? str.charAt(str.length-1) : str.substr(str.length-2, str.length-1);
  return str.match(/\D+$/)[0];
}

function getValue(str){
  return parseFloat(str.match(/[\d, -]+/));
}

function vinBounds(obj){
  if(!obj.bounds) return true;
  let bounds = obj.bounds;
  const curPos = vLastScroll;
  const curPct = curPos/scrollableHeight;
  let fitsStart;
  let fitsEnd;
  // fitsStart AND fitsEnd  =  in bounds
  // not in bounds AND !fitsStart  =  currently above start
  // not in bounds AND fitsStart  =  currently below end
  if(bounds.startUnit == '%'){
    fitsStart = curPct >= bounds.start;
  }
  else{
    fitsStart = curPos >= bounds.start;
  }
  if(bounds.endUnit == '%'){
    fitsEnd = curPct <= bounds.end;
  }
  else{
    fitsEnd = curPos <= bounds.end;
  }

  return [(fitsStart && fitsEnd), !fitsStart];
}

function hinBounds(obj){
  if(!obj.bounds) return true;
  let bounds = obj.bounds;
  const curPos = hLastScroll;
  const curPct = curPos/scrollableWidth;
  let fitsStart;
  let fitsEnd;
  // fitsStart AND fitsEnd  =  in bounds
  // not in bounds AND !fitsStart  =  currently above start
  // not in bounds AND fitsStart  =  currently below end
  if(bounds.startUnit == '%'){
    fitsStart = curPct >= bounds.start;
  }
  else{
    fitsStart = curPos >= bounds.start;
  }
  if(bounds.endUnit == '%'){
    fitsEnd = curPct <= bounds.end;
  }
  else{
    fitsEnd = curPos <= bounds.end;
  }

  return [(fitsStart && fitsEnd), !fitsStart];
}

function vPar(pxDeltaScroll){
  vParElements.forEach(obj=>{
    const elem = obj.elem;
    let top = elem.style.top;
    if(obj.bounds){
      let inbounds = vinBounds(obj);
      if(inbounds && inbounds[0]){
        console.log('in bounds');
        elem.style.top = (getValue(top)-(pxDeltaScroll*obj.par.y))+getUnit(top);
        if(obj.par.x){
          let left = elem.style.left;
          elem.style.left = (getValue(left)-(pxDeltaScroll*obj.par.x))+getUnit(left);
        }
      }
      else{
        if(inbounds[1]){
          console.log('before start');
          elem.style.top = obj.bounds.startPos.top;
          elem.style.left = obj.bounds.startPos.left;
        }
        else{
          console.log('after end');
          elem.style.top = obj.bounds.endPos.top;
          elem.style.left = obj.bounds.endPos.left;
        }
      }
    }
    else{
      elem.style.top = (getValue(top)-(pxDeltaScroll*obj.par.y))+getUnit(top);
      if(obj.par.x){
        let left = elem.style.left;
        elem.style.left = (getValue(left)-(pxDeltaScroll*obj.par.x))+getUnit(left);
      }
    }
  });
}


function hPar(pxDeltaScroll){
  hParElements.forEach(obj=>{
    const elem = obj.elem;
    let left = elem.style.left;
    if(obj.bounds){
      let inbounds = hinBounds(obj);
      if(inbounds && inbounds[0]){
        console.log('in bounds');
        elem.style.left = (getValue(left)-(pxDeltaScroll*obj.par.x))+getUnit(left);
        if(obj.par.y){
          let top = elem.style.top;
          elem.style.top = (getValue(top)-(pxDeltaScroll*obj.par.y))+getUnit(top);
        }
      }
      else{
        if(inbounds[1]){
          console.log('before start');
          elem.style.top = obj.bounds.startPos.top;
          elem.style.left = obj.bounds.startPos.left;
        }
        else{
          console.log('after end');
          elem.style.top = obj.bounds.endPos.top;
          elem.style.left = obj.bounds.endPos.left;
        }
      }
    }
    else{
      elem.style.top = (getValue(top)-(pxDeltaScroll*obj.par.y))+getUnit(top);
      if(obj.par.y){
        let top = elem.style.top;
        elem.style.top = (getValue(top)-(pxDeltaScroll*obj.par.y))+getUnit(top);
      }
    }
  });
}


window.onload = ()=>{
  updateScrollitizer();
};

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
