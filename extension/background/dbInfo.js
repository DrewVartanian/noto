(function(){
    GLOBALS.teamsProm=getTeams();
    GLOBALS.teamSelected="All Teams";
    GLOBALS.pagesProm = getPages();

    function getPages() {
        return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/page')).then(null, function() {
            return [];
        });
    }

    function getTeams(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/team')).then(null,function(){
        return [];
      });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.title){
            case "login":
                console.log("hitting teams.js");
                GLOBALS.teamsProm = getTeams();
                GLOBALS.pagesProm = getPages();
                GLOBALS.socket.emit('login', {});
                chrome.tabs.getAllInWindow(null, function(tabs){
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                    }
                });
                break;
            case "change teams":
                GLOBALS.socket.emit('changeTeams', {team:request.team});
                GLOBALS.teamsProm=getTeams();
                GLOBALS.teamsProm.then(console.log);
        }
    });

    // GLOBALS.socket.on('teamChanged',function(){
    //     var numTeams;
    //     GLOBALS.teamsProm.then(function(teams){
    //         numTeams=teams.length;
    //         GLOBALS.teamsProm=getTeams();
    //         return GLOBALS.teamsProm;
    //     }).then(function(teams){
    //         if(teams.length===numTeams) return;
    //     });
    // });

})();