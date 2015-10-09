(function(){
    GLOBALS.teamsProm=getTeams();

    function getTeams(){
      return Promise.resolve($.get('http://127.0.0.1:1337/api/user/team')).then(null,function(){
        return [];
      });
    }
})();