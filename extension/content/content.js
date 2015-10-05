console.log("extension/content/content.js");
var clickedEl = null;
var offset = {};

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target;
        offset.x=event.offsetX;
        offset.y=event.offsetY;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        console.dir(clickedEl);
        //Do DOM calc here!!!!
        sendResponse({url:document.URL, x: clickedEl.x+offset.x,y: clickedEl.y+offset.y});
    }
});
