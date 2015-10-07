// create rightclick context menu "Add New Note" option
chrome.contextMenus.create({
    "title": "Add New Note",
    "contexts":["all"],
    "onclick": onClickHandler
});

// context menu onclick callback function
function onClickHandler(info, tab) {
  chrome.tabs.sendRequest(tab.id, "newNoteClick", function(noteInfo) {
        var team = noteInfo.team;
        delete noteInfo.team;
        Promise.resolve($.post('http://127.0.0.1:1337/api/note',noteInfo)).then(function(res){
          pagesProm=pagesProm.then(function(pages){
            pages.some(function(page){
              if(page.url===noteInfo.url&&page.team._id===team){
                page.notes.push(res);
                return true;
              }
              return false;
            });
            chrome.tabs.sendMessage(tab.id, {title: "newNote", note: res});
            return pages;
          });
        }).then(null,function(){});
    });
}