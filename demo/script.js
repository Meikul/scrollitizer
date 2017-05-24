var blurred = false;
window.onblur = ()=> blurred = true;
window.onfocus = ()=> blurred && (location.reload());
