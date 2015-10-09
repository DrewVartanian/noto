(function(){
  // create rightclick context menu "Add New Note" option
  chrome.contextMenus.create({
      "title": "Add New Note",
      "contexts":["all"],
      "onclick": onClickHandler
  });

  function findPageMatch(page, url, team){
    if(page.url!==url) return false;
    if(team==='personal'&&page.team.name===team) return true;
    return (page.team._id===team);
  }

  // context menu onclick callback function
  function onClickHandler(info, tab) {
    chrome.tabs.sendRequest(tab.id, "newNoteClick", function(noteInfo) {
          Promise.resolve($.post(GLOBALS.serverUrl+'/api/note',noteInfo)).then(function(res){
            GLOBALS.pagesProm.then(function(pages){
              if(!res.page){
                pages.some(function(page){
                  if(findPageMatch(page,noteInfo.url,noteInfo.team)){
                    page.notes.push(res.note);
                    return true;
                  }
                  return false;
                });
              }else{
                res.page.notes[0] = res.note;
                pages.push(res.page);
              }
              chrome.tabs.sendMessage(tab.id, {title: "newNote", note: res.note, teamId:res.teamId});
              return pages;
            });
          }).then(null,function(){});
      });
  }
})();