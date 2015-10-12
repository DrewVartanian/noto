(function(){
    GLOBALS.getPages = function() {
        return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/page')).then(null, function() {
            return [];
        });
    };

    GLOBALS.getTeams = function(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/team')).then(null,function(){
        return [];
      });
    };

    GLOBALS.teamsProm=GLOBALS.getTeams();
    GLOBALS.teamSelected="All Teams";
    GLOBALS.pagesProm = GLOBALS.getPages();

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch(request.title){
            case "login":
                console.log("hitting teams.js");
                GLOBALS.teamsProm = GLOBALS.getTeams();
                GLOBALS.pagesProm = GLOBALS.getPages();
                GLOBALS.socket.emit('login', {});
                chrome.tabs.getAllInWindow(null, function(tabs){
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                    }
                });
                break;
            case "change teams":
                console.log('changing teams');
                console.log('team:',request.team);
                var data = {team:request.team};
                if(request.userId){
                    data.userId=request.userId;
                }
                GLOBALS.socket.emit('changeTeams', data);
                GLOBALS.teamsProm=GLOBALS.getTeams();
                console.log('done here');
        }
    });
})();