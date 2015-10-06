console.log("Content Script");

var clickedEl = null;
var offset = {};
var pages;

chrome.runtime.sendMessage("newPage",function(backgroundPages){
    pages=backgroundPages;
    console.log(pages);
    pages.forEach(function(page){
        page.notes.forEach(function(note){
            renderNote(note);
        });
    });
});
// chrome.runtime.sendMessage({greeting: 'hello'});

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target;
        offset.x = event.x;
        offset.y = event.y;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        sendResponse({url:document.URL, x: offset.x,y: offset.y});
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.title){
        case 'newNote':
            renderNote(request.note);
            break;
    }
});

