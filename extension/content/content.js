console.log("content");
var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        console.dir(clickedEl);
        console.dir(JSON.stringify({x:5,y:"hello"}));
        //Do DOM calc here!!!!
        sendResponse({value: JSON.stringify(clickedEl)});
    }
});