(function(){
    GLOBALS.teamsProm=getTeams();

    function getTeams(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/team')).then(null,function(){
        return [];
      });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.title === "login") {
            console.log("hitting teams.js")
            GLOBALS.teamsProm = getTeams();
        }
    });

})();