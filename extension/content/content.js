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

    thisNote.style.backgroundColor= note.color;
    thisNote.style.left = note.position.x+'px';
    thisNote.style.top = note.position.y+'px';
    thisNote.style.height = note.size.y + 'px';
    thisNote.style.width = note.size.x + 'px';
    thisNote.style.zIndex = note.position.z;
    thisNote.style.position = "absolute";
    this.note = thisNote;

    $("body").append(thisNote);
    return this;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var note = {
        color: "yellow",
        size: {x: 50, y: 50, z: 100},
        position: {x: offset.x, y: offset.y}
    }

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

