'use strict';
var socketio = require('socket.io');
var socketLedger = require('./socketLedger');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.use(function(socket,next){
      require('../app/configure/authentication/session.js')(
        socket.request, socket.request.res, next);
    });

    io.on('connection', function (socket) {
        var user=undefined;
        console.log(socket.request.session.passport.user);
        socket.on('setupTeams', function(data){
          data.teams.forEach(function(team){
            console.log('joined: ', team._id);
            socket.join(team._id);
          });
        });

        socket.on('addSelf', function(data){
          user = data.userId;
          socketLedger.addUser(user,socket);
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

        socket.on('disconnect', function () {
          if(user){
            socketLedger.removeUser(user);
          }
        });
    });

    return io;

};
