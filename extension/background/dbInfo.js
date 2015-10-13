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

    GLOBALS.getUnreadPages = function(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/unreadpage')).then(null,function(res){
        return res;
      });
    };
    GLOBALS.teamsProm=GLOBALS.getTeams();
    GLOBALS.teamSelected="All Teams";
    GLOBALS.pagesProm = GLOBALS.getPages();
    GLOBALS.unreadProm = GLOBALS.getUnreadPages();
})();