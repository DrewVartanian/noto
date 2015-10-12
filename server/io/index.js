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
        var user = require('./user.js');
        var userExists = socket.request&&
                          socket.request.session&&
                          socket.request.session.passport&&
                          socket.request.session.passport.user;
        if(userExists){
          user._id = socket.request.session.passport.user,socket;
          console.log('connecting',user._id);
          socketLedger.addUser(user._id,socket);
        }
        socket.on('setupTeams', function(data){
          data.teams.forEach(function(team){
            console.log('joined: ', team._id);
            socket.join(team._id);
          });
        });

        socket.on('changeTeams', function(data){
          socket.broadcast.to(team._id).emit('teamChanged',data);
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

        socket.on('login', function () {
          console.log('login');
          if(user._id){
            socketLedger.addUser(user._id,socket);
          }
        });

        socket.on('logout', function () {
          console.log('logout');
          if(user._id){
            socketLedger.removeUser(user._id);
            user._id=null;
          }
        });

        socket.on('disconnect', function () {
          if(user._id){
            socketLedger.removeUser(user._id);
            user._id=null;
          }
        });
    });

    return io;

};
