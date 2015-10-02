'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


// GET all notes for a page+team combination
// /api/page/
// router.get('/page')

// GET all pages for a user
// router.get('/', function(req, res, next) {
//     Page.find()
//     {owner: req.user._id}
// })

// given req.user_id
// get all teams
// Team has array of users

// then look up Pages for all those teams
// page has 1 team


