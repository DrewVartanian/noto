(function () {
  GLOBALS.socket = io(GLOBALS.serverUrl);
  GLOBALS.teamsProm.then(function(teams){
    GLOBALS.socket.emit('setupTeams', {
      "teams": teams
    });
  });

  GLOBALS.socket.on('noteChanged',function(data){
    console.log('note changed');
    GLOBALS.pagesProm.then(function(pages){
      pages.some(function(page){
        console.log('searching page');
        if(page.url!==data.url||page.team._id!==data.team) return false;
        console.log('page match');
        page.notes.some(function(note,index){
          if(note._id===data.note){
            console.log('note match');
            page.notes.splice(index,1);
            return true;
          }
          return false;
        });
      });
    });
  });
})();

