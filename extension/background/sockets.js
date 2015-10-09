(function () {
  var socket = io('http://127.0.0.1:1337');
  GLOBALS.teamsProm.then(function(teams){
    socket.emit('setupTeams', {
      "teams": teams
    });
  });
})();

