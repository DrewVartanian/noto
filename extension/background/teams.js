(function(){
    GLOBALS.teamsProm=getTeams();
    GLOBALS.teamSelected="All Teams";

    function getTeams(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/team')).then(null,function(){
        return [];
      });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.title === "login") {
            console.log("hitting teams.js");
            GLOBALS.teamsProm = getTeams();
            GLOBALS.socket.emit('login', {});
            chrome.tabs.getAllInWindow(null, function(tabs){
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                }
            });
        }
    });

})();