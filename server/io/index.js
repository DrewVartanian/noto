'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
       socket.on('setupTeams', function(data){
          data.teams.forEach(function(team){
            console.log(team._id);
            socket.join(team._id);
          });
        });

       socket.on('changeNote', function(data){
          console.log(socket.id);
          socket.broadcast.to(data.team).emit('noteChanged');
        });
    });

    return io;

};
