console.log("extension/content/content.js");
var clickedEl = null;
var offset = {};

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target;
        //offset.x=event.offsetX;
        //offset.y=event.offsetY;
        offset.x = event.x;
        offset.y = event.y;
    }
}, true);

// function Note(){
//     var self = this;
 
//     var note = document.createElement('div');
//     note.className = 'note-anywhere';
//     // note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
//     // note.addEventListener('click', function() { return self.onNoteClick() }, false);
//     this.note = note;
 
//     document.body.appendChild(note);
//     return this;
// }
  function onNoteClick(e)
    {
        // this.editField.focus();
        getSelection().collapseToEnd();
    }

function renderNote(note)
{
    var self = this;

    var thisNote = document.createElement('div');
    thisNote.addEventListener('click', function() { return self.onNoteClick() }, false);

    var edit = document.createElement('div');
    edit.className = 'edit';
    edit.setAttribute('contenteditable', true);
    edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    thisNote.appendChild(edit);
    thisNote.editField = edit;

    console.log(thisNote);
    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.zIndex = note.size.z;
    thisNote.style.position = "absolute";
     this.note = thisNote;
 
    $("body").append(thisNote);
    console.log(this);
    return this;

    // console.log("was i invoked?", note);
    // thisNote.timestamp = new Date().getTime();
    // thisNote.left = (window.pageXOffset + Math.round(Math.random() * (window.innerWidth - 150))) + 'px';
    // thisNote.top = (window.pageYOffset + Math.round(Math.random() * (window.innerHeight - 200))) + 'px';
    // thisNote.zIndex = ++highestZ;
    // thisNote.saveAsNew();
    // notes[notes.length] = thisNote.id;
    //chrome.extension.sendRequest({command:"updateCount",data:notes.length});
    //thisNote.editField.focus();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var note = {
        color: "yellow",
        size: {x: 50, y: 50, z: 100},
        position: {x: offset.x, y: offset.y}
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
