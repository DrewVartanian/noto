console.log("content.js");
var clickedEl = null;
var offset = {};

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target;
        offset.x = event.x;
        offset.y = event.y;
    }
}, true);


function renderNote(note)
{
    var self = this;

    var thisNote = document.createElement('div');
    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = offset.x+'px';
    thisNote.style.top = offset.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.position = "absolute";
    this.note = thisNote;

    $("body").append(thisNote);
    console.log(this);
    return this;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var note = {
        color: "yellow",
        size: {x: 50, y: 50}
    }

    if(request == "getClickedEl") {
        console.dir(clickedEl);
        // var div = document.createElement("div");
        // var st = div.style;
        // st.background = "black";
        // st.color = "grey";
        // st.position = "fixed";
        // st.left = offset.x+'px';
        // st.top = offset.y+'px';
        //Do DOM calc here!!!!
        // document.documentElement.appendChild(div);
        // sendResponse({url:document.URL, x: clickedEl.x+offset.x,y: clickedEl.y+offset.y});
        renderNote(note);
        sendResponse({url:document.URL, x: offset.x,y: offset.y});
    }
});


// Cryptoveil modified copypasta below
    var extension_id = chrome.runtime.id

    //THIS IS FORWARDING TO BACKGROUND SCRIPT
    document.addEventListener('get-extension-session-status', function (e) {
        chrome.runtime.sendMessage(extension_id, {message: e.type})
    });


    //THIS IS FORWARDING TO EXTERNAL SCRIPTS
    chrome.runtime.onMessage.addListener(function (message, sender) {

        if (message.command === 'process-logout') {
            document.dispatchEvent(new Event(message.command));
        }

        if (message.command === 'process-login') {
            document.dispatchEvent(new CustomEvent(message.command, {detail: message.payload}));
        }
    });

