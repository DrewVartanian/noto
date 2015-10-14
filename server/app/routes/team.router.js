'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var nodemailer = require('nodemailer');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');

var socketLedger=require('../../io/socketLedger.js');


// set req.team
router.param('id', function(req, res, next, id) {
  Team.findById(id).exec()
    .then(function(team) {
      if (!team) throw new Error('Team not found');
      req.team = team;
      next();
    })
    .then(null, next);
});

// GET all users in a team
// api/team/:id/users
router.get('/:id/users', function(req, res, next) {
  console.log("what is req.team", req.team);
  Team.findById(req.team._id)
    .populate('users')
    .then(function(team) {
      res.status(200).json(team);
    })
    .then(null, next);
});


// Get all teams populated with all users
router.get('/users', function(req, res, next) {
  console.log("what is req.team", req.team);
  Team.find({users: req.user._id})
    .populate('users')
    .then(function(team) {
      console.log(team);
      res.status(200).json(team);
    })
    .then(null, next);
});

// POST new team
router.post('/', function(req, res, next) {
  console.log("what is post team req body ", req.body);
  Team.create({name: req.body.teamName, users: [req.user._id]})
    .then(function(team) {
        res.status(201).json(team);
    })
    .then(null, next);
});

// PUT update team (name, users)
router.put('/:id', function(req, res, next) {

  var userId;
  console.log("what is the request body", req.body);
  if(req.body.userEmail){
    User.findOne({email: req.body.userEmail}).then(function(user){
    if(!user) {
        console.log('req.body.email:',req.body.userEmail);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'websharepostit@gmail.com',
                pass: 'capstone'
            }
        });
        transporter.sendMail({
            from: 'do-not-reply@noto.com',
            to: req.body.userEmail,
            subject: req.user.email + ' has added you to team '+ req.body.name + ' on Noto!',
            html: `<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="20" background="http://s3.postimg.org/fjnpfxlvn/postit_background.png" style="background-repeat:no-repeat;">
                   <tr>
                   <td>
                   <div style="height: 600px; width: 600px"><div>
                   <div style="height: 1px; padding: 0; margin: 0"></div>
                   <div style="text-align: center; margin-top: 250px; padding-left: 75px;"><h1 style="font-family: cursive; padding-bottom: 20px">Noto</h1>
                   <p style="font-weight: 900">Hello ${req.body.userEmail},</p><p>${req.user.email} has added you to their team on Noto! 
                   <p>Have you heard about Noto yet?</p> <p>get the wonderful Chrome extension today!</p>
                   </p><p><a>insert link to extension here!</a></p></div></div></div>
                   </td>
                   </tr>
                   </table>`
        });
        User.create({
          email: req.body.userEmail,
          password: Math.floor((Math.random()*9999999999)+1).toString(32),
          isPending: true
        })
        .then(function(user){
           req.team.users.push(user._id);
           req.team.save()
        .then(function() {
        res.status(201).send("user emailed and created!");
        });
        });
        return;
      } 
    userId=user._id;
    if(user && req.team.users.indexOf(user._id) === -1) req.team.users.push(user._id);
    if(req.body.name) req.team.name = req.body.name;

     //if user does not exist, put invitation to email logic here
      req.team.save()
      .then(function(team) {
        if(userId){
          console.log('adding user to socket');
          var socket = socketLedger.getSocket(userId)
          if (socket) socket.join(team._id.toString());
        }
        res.status(200).json(team);
      })
      .then(null, next);
    });
  }


  else{
     _.extend(req.team, req.body);  
    req.team.save()
    .then(function(team) {
      res.status(200).json(team);
    })
    .then(null, next);
  }

     
});
  
     
  //})
  //req.team.users.push(req.body.)
  

// DELETE specific team
router.delete('/:id', function(req, res, next) {
  req.team.remove()
    .then(function() {
      res.sendStatus(204);
    })
    .then(null, next);
});

router.delete('/:id/users/:userId', function(req, res, next) {


  var users = req.team.users;
  console.log("what are the users", users);
   console.log("params ", req.params.userId);
  users = users.filter(function(user){
    return user != req.params.userId;
  });


  console.log("what happened to the users after delete", users);
  req.team.users = users;
  req.team.save()
    .then(function(team) {
      res.json(team);
    })
    .then(null, next);
});


