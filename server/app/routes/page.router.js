'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');



// GET all pages populated with notes
router.get('/', function(req, res, next) {
  Page.find()
  .populate('notes')
  .then(function(pages) {
    res.json(pages);
  })
  .then(null, next);
});


// GET all pages for current user
// /api/page/user
router.get('/user', function(req, res, next) {
  Page.find()
  .then(function(pages) {
    var pagesOfUser = [];
    pages.forEach(function(page) {
      if (page.team.indexOf(req.user._id) > -1) {
        pagesOfUser.push(page);
      }
    });
    return pagesOfUser;
  })
  // check syntax / populate placement is valid
  .populate('notes team')
  .then(function(pagesOfUser) {
    res.json(pagesOfUser);
  })
  .then(null, next);
});


// GET all notes on a specific page for current user
// /api/page/user/:pageURL
router.get('/user/:pageURL', function(req, res, next) {
  Page.find({url: req.params.pageURL})
  .then(function(pages) {
    var pagesOfUser = [];
    pages.forEach(function(page) {
      if (page.team.indexOf(req.user._id) > -1) {
        pagesOfUser.push(page);
      }
    });
    return pagesOfUser;
  })
  .populate('notes team')
  .then(function(pagesOfUser) {
    res.json(pagesOfUser);
  })
  .then(null, next);
});



