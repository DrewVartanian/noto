chrome.runtime.sendMessage({title: "newPage"},function(pages){
    pages.forEach(function(page){
        page.notes.forEach(function(note){
            GLOBALS_WEB_NOTES.renderNote(note);
        });
    });
});

document.addEventListener("mousedown", function(event){
    //right clickteam
    if(event.button == 2) {
        GLOBALS_WEB_NOTES.clickedEl = event.target;
        GLOBALS_WEB_NOTES.offset.x = event.x;
        GLOBALS_WEB_NOTES.offset.y = event.y;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "newNoteClick") {
        sendResponse({team: GLOBALS_WEB_NOTES.team,
            url:document.URL,
            x: GLOBALS_WEB_NOTES.offset.x,
            y: GLOBALS_WEB_NOTES.offset.y});
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.title){
        case 'newNote':
            GLOBALS_WEB_NOTES.renderNoteForm(request.note);
            break;
    }
});