console.log("Content Script");

// var clickedEl = null;
// var offset = {};
// var pages;
// var team;

chrome.runtime.sendMessage({title: "newPage"},function(backgroundPages){
    pages=backgroundPages;
    pages.forEach(function(page){
        team=page.team._id;
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
    if(request == "newNoteClick") {
        sendResponse({team:'personal',url:document.URL, x: offset.x,y: offset.y});
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.title){
        case 'newNote':
            pages.some(function(page){
              if(request.team==='personal'?page.team.name===request.team:page.team._id===request.team){
                page.notes.push(request.note);
                return true;
              }
              return false;
            });
            renderNoteForm(request.note);
            break;
    }
});

