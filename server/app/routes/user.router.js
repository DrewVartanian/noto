'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


// set req.requestedUser to specific user
router.param('id', function(req, res, next, id) {
  User.findById(id).exec()
    .then(function(user) {
      if (!user) throw new Error("User not found");
      req.requestedUser = user;
      next();
    })
    .then(null, next);
});

// GET all users
router.get('/', function(req, res, next) {
  User.find().exec()
    .then(function(users) {
      res.status(200).json(users);
      next();
    }).then(null, next);
});

// GET one user
















