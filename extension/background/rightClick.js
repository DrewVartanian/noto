// create rightclick context menu "Add New Note" option
chrome.contextMenus.create({
    "title": "Add New Note",
    "contexts":["all"],
    "onclick": onClickHandler
});

// context menu onclick callback function
function onClickHandler(info, tab) {
  chrome.tabs.sendRequest(tab.id, "newNoteClick", function(noteInfo) {
        Promise.resolve($.post('http://127.0.0.1:1337/api/note',noteInfo)).then(function(res){
          pagesProm=pagesProm.then(function(pages){
            if(!res.page){
              pages.some(function(page){
                if(page.url===noteInfo.url&&(noteInfo.team==='personal'?page.team.name===noteInfo.team:page.team._id===noteInfo.team)){
                  page.notes.push(res.note);
                  return true;
                }
                return false;
              });
            }else{
              res.page.notes[0] = res.note;
              pages.push(res.page);
            }
            chrome.tabs.sendMessage(tab.id, {title: "newNote", note: res.note, team:noteInfo.team});
            return pages;
          });
        }).then(null,function(){});
    });
}