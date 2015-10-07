'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


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

// POST new team
router.post('/', function(req, res, next) {
  console.log("what is post team req body ", req.body);
  Team.create(req.body)
    .then(function(team) {
      res.status(201).json(team);
    })
    .then(null, next);
});

// PUT update team (name, users)
router.put('/:id', function(req, res, next) {
  if(req.body.userEmail){
    User.findOne({email: req.body.userEmail}).then(function(user){
      console.log(user);
      console.log("second!", req.team.users);
    if(user && req.team.users.indexOf(user._id) === -1) req.team.users.push(user._id);


     //if user does not exist, put invitation to email logic here.

      req.team.save()
      .then(function(team) {
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
    .then(function() {
      res.status(204).json(req.team);
    })
    .then(null, next);
});


