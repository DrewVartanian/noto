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
    GLOBALS.counts = 0;
    GLOBALS.getUnreadPages = function(){
      return Promise.resolve($.get(GLOBALS.serverUrl+'/api/user/unreadpage')).then(null,function(res){
        res.forEach(function(page){
            GLOBALS.counts += page.notes.length;
        });
        GLOBALS.unreadCounts = GLOBALS.counts;
        return res;
      });
    };
    GLOBALS.teamsProm=GLOBALS.getTeams();
    GLOBALS.teamSelected="All Teams";
    GLOBALS.pagesProm = GLOBALS.getPages();
    GLOBALS.unreadProm = GLOBALS.getUnreadPages();
})();