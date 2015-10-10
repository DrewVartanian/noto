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
            GLOBALS.socket.emit('login', {});
            GLOBALS.teamsProm = getTeams();
        }
    });

})();