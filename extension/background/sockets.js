(function () {
  GLOBALS.socket = io(GLOBALS.serverUrl);
  GLOBALS.teamsProm.then(function(teams){
    GLOBALS.socket.emit('setupTeams', {
      "teams": teams
    });
  });

  GLOBALS.socket.on('noteChanged',function(data){
    console.log('socket event');
    GLOBALS.pagesProm.then(function(pages){
      switch(data.oper){
        case 'delete':
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
          break;
        case 'put':
          pages.some(function(page){
            if(page.url!==data.url||page.team._id!==data.team) return false;
            if(!page.notes.some(function(note,index){
              if(note._id===data.note._id){
                page.notes[index] = data.note;
                return true;
              }
              return false;
            })){
              page.notes.push(data.note);
            }
            return true;
          });
          break;
      }
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

