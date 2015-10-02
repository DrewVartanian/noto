'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


// GET all pages for current user (user's teams)
// /api/page/user
router.get('/user', function(req, res, next) {
  // find all teams of user

  // find all notes of teams

  // find all pages of notes
});

// page populate notes
// note populate team
// team populate user


// GET all notes for a page+team combination

