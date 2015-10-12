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

  GLOBALS.socket.on('teamChanged',function(data){
        console.log('team has changed');
        var numTeams;
        GLOBALS.teamsProm.then(function(teams){
            numTeams=teams.length;
            GLOBALS.teamsProm=GLOBALS.getTeams();
            return GLOBALS.teamsProm;
        }).then(function(teams){
          console.log(teams.length+' == '+numTeams);
            if(teams.length===numTeams) return "same teams";
            GLOBALS.pagesProm = GLOBALS.getPages();
            return GLOBALS.pagesProm;
        }).then(function(pages){
            console.log('pages:',pages);
            if(pages!=="same teams"){
                if(GLOBALS.teamSelected===data.team.name){
                    GLOBALS.teamSelected="All Teams";
                }
                if(GLOBALS.teamSelected==="All Teams"){
                    chrome.tabs.getAllInWindow(null, function(tabs){
                      console.log('refreshing pages:');
                      for (var i = 0; i < tabs.length; i++) {
                          console.log(tabs[i]);
                          chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                      }
                  });
                }
            }
        });
    });
})();

