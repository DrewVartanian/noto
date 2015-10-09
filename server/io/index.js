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
          console.log('send to team: ',data.team);
          socket.broadcast.to(data.team).emit('noteChanged',data);
        });
    });

    return io;

};
