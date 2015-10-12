(function(){
    GLOBALS.teamsProm=getTeams();
    GLOBALS.teamSelected="All Teams";

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
                GLOBALS.socket.emit('login', {});
                chrome.tabs.getAllInWindow(null, function(tabs){
                    for (var i = 0; i < tabs.length; i++) {
                        chrome.tabs.sendMessage(tabs[i].id, {title: "login content"});
                    }
                });
                break;
            case "change teams":
                // GLOBALS.teamsProm.then(function(teams){
                //     console.log(teams);
                //     if(teams.every(function(team,index){
                //         if(team._id!==request.team.id){
                //             teams.slice(index,1,request.team);
                //             return true;
                //         }
                //         return false;
                //     })){
                //         teams.push(request.team);
                //         GLOBALS.teamsProm=Promise.resolve(teams);
                //     }
                // });
                GLOBALS.teamsProm=getTeams();
                GLOBALS.teamsProm.then(console.log);
        }
    });

})();