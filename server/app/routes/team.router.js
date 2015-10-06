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
  _.extend(req.team, req.body);
  req.team.save()
    .then(function(team) {
      res.status(200).json(team);
    })
    .then(null, next);
});

// DELETE specific team
router.delete('/:id', function(req, res, next) {
  req.team.remove()
    .then(function() {
      res.sendStatus(204);
    })
    .then(null, next);
});


