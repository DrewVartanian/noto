'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
       socket.on('setupTeams', function(data){
          data.teams.forEach(function(team){
            console.log('joined: ', team._id);
            socket.join(team._id);
          });
        });

       socket.on('changeNote', function(data){
          console.log(socket.id);
          if(data.oper==="put"){
            socket.broadcast.to(data.newTeam).emit('noteChanged',{
              "url": data.url,
              "team": data.newTeam,
              "note": data.note,
              "oper": data.oper
            });
            if(data.newTeam!==data.oldTeam){
              data.team = data.oldTeam;
              data.oper = "delete";
              data.note = data.note._id;
              delete data.newTeam;
              delete data.oldTeam;
            }
          }
          if(data.oper==="delete"){
            socket.broadcast.to(data.team).emit('noteChanged',data);
          }
        });
    });

    return io;

};
