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
  console.log("Getting into /page route ");
  Page.find()
  .populate('notes').exec()
  .then(function(pages) {
    res.json(pages);
  })
  .then(null, next);
});


// GET all pages for current user
// /api/page/user
router.get('/user', function(req, res, next) {
  Page.find()
   .populate('notes team').exec()
  .then(function(pages) {
    var pagesOfUser = [];
    pages.forEach(function(page) {
      if (page.team.users.indexOf(req.user._id) > -1) {
        pagesOfUser.push(page);
      }
    });
    return pagesOfUser;
  })
  // check syntax / populate placement is valid
 
  .then(function(pagesOfUser) {
    console.log("where are my users??", pagesOfUser);
    res.json(pagesOfUser);
  })
  .then(null, next);
});


// GET all notes on a specific page for current user
// /api/page/user/:pageURL
// router.get('/user/:pageURL', function(req, res, next) {
//   Page.find({url: req.params.pageURL})
//     .populate('notes team').exec()
//   .then(function(pages) {
//     var pagesOfUser = [];
//     pages.forEach(function(page) {
//       if (page.team.indexOf(req.user._id) > -1) {
//         pagesOfUser.push(page);
//       }
//     });
//     return pagesOfUser;
//   })
//   .then(function(pagesOfUser) {
//     console.log("here are the pages of user for url route!!!!!", pagesOfUser);
//     res.json(pagesOfUser);
//   })
//   .then(null, next);
// });



