(function () {
  GLOBALS.socket = io(GLOBALS.serverUrl);
  GLOBALS.teamsProm.then(function(teams){
    GLOBALS.socket.emit('setupTeams', {
      "teams": teams
    });
  });

  GLOBALS.socket.on('noteChanged',function(data){
    GLOBALS.pagesProm.then(function(pages){
      pages.some(function(page){
        if(page.url!==data.url||page.team._id!==data.team) return false;
        return page.notes.some(function(note,index){
          if(note._id===data.note){
            page.notes.splice(index,1);
            return true;
          }
          return false;
        });
      });
      chrome.tabs.getAllInWindow(null, function(tabs){
          for (var i = 0; i < tabs.length; i++) {
            if(tabs[i].url===data.url){
              chrome.tabs.sendMessage(tabs[i].id, {title: "noteChangedOnBackground", data: data});
            }
          }
      });
    });
  });
})();

