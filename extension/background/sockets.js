(function () {
  GLOBALS.socket = io('http://127.0.0.1:1337');
  GLOBALS.teamsProm.then(function(teams){
    GLOBALS.socket.emit('setupTeams', {
      "teams": teams
    });
  });

  GLOBALS.socket.on('noteChanged',function(data){
    GLOBALS.pagesProm.then(function(pages){
      pages.some(function(page){
        if(page.url!==data.url||page.team._id!==data.team) return false;
        pages.notes.some(function(note,index){
          if(note._id===data.note){
            notes.splice(index,1);
            return true;
          }
          return false;
        });
      });
    });
  });
})();

