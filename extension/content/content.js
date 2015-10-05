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

$(document).ready(function(){

    var extension_id = chrome.runtime.id

    //THIS IS FORWARDING TO BACKGROUND SCRIPT
    document.addEventListener('get-extension-session-status', function (e) {
        chrome.runtime.sendMessage(extension_id, {message: e.type})
    });


    //THIS IS FORWARDING TO EXTERNAL SCRIPTS
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        // console.log('listener message: ', message);

        if (message.command === 'process-logout') {
            document.dispatchEvent(new Event(message.command));
        }

        if (message.command === 'process-login') {
            document.dispatchEvent(new CustomEvent(message.command, {detail: message.payload}))
        }

        if (message.command === 'update-state') {
            document.dispatchEvent(new CustomEvent('update-decryption-state', {detail: message.payload}));
            document.dispatchEvent(new CustomEvent('update-encryption-state', {detail: message.payload}));
        }
    });
});
