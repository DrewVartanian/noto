'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
       socket.on('setupTeams', function(data){
          data.teams.forEach(function(team){
            socket.join(team._id);
          });
        });
    });

    return io;

};
