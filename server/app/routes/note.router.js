'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


// set req.note to specific note
router.param('id', function(req, res, next, id) {
  Note.findById(id).exec()
    .then(function(note) {
      if (!note) throw new Error("Note not found");
      req.note = note;
      next();
    })
    .then(null, next);
});

// GET all notes written by current user
// /api/note/user
router.get('/user', function(req, res, next) {
  Note.find({owner: req.user._id}).exec()
    .then(function(notes) {
      res.status(200).json(notes);
      next();
    }, function(err) {
      throw new Error(err);
    })
    .then(null, next);
});

// GET specific note
router.get('/:id', function(req, res, next) {
  res.status(200).json(req.note);
  // .then(null, next);
});

// POST new note to a page
// TODO: need to add to default team
router.post('/', function(req, res, next) {
  var newNote = {
    owner: req.user._id,
    message: req.body.message,
    // req.body to send current tab's URL as req.body.url
    url: req.body.url,
    position: {
      x: req.body.x,
      y: req.body.y
    },
    association: req.body.association,
    action: req.body.action
  };

  var currentPage;
  var retNote;

  // look up current page by url
  // error note: multiple pages can have same URL
  Page.findOne({url: req.body.url})
  .then(function(page) {
    // If page does not exist, create new page entry in database
    return page?page:Page.create({url: req.body.url,team:'56129acb5fc3ffc54d05e202'});
    })
  .then(function(page) {
    currentPage = page;
    return Note.create(newNote);
  })
  .then(function(note){
    retNote = note;
    currentPage.notes.push(note._id);
    return currentPage.save();
  })
  .then(function(page){
    console.log('new posted note: ', retNote);
    res.json(retNote);
  })
  .then(null,next);

  //         var newPage = page;
  //         // create note
  //         Note.create({
  //           owner: req.user._id,
  //         })
  //         .then(function(note) {
  //           // add req.body properties to new note
  //           _.extend(note, req.body);
  //           note.save()
  //           .then(function(note) {
  //             // add note to new page's notes array
  //             newPage.notes.push(note);
  //             res.status(201).json(note);
  //           });
  //         });
  //       });
  //   }
  //   // END if

  //   // If page exists, add note to page's notes array
  //   else {
  //     var currentPage = page;
  //     // create note
  //     Note.create({
  //       owner: req.user._id,
  //     })
  //     // add req.body properties to new note
  //     .then(function(note) {
  //       _.extend(note, req.body);
  //       note.save()
  //       .then(function(note) {
  //         currentPage.notes.push(note);
  //         res.status(201).json(note);
  //       });
  //     });
  //   }
  //   // END else

});


// PUT update note
// TODO: only owner can edit note
router.put('/:id', function(req, res, next) {
  _.extend(req.note, req.body);
  req.note.save()
    .then(function(note) {
      res.status(200).json(note);
    })
    .then(null, next);
});

// DELETE specific note
// TODO: only owner can delete note
router.delete('/:id', function(req, res, next) {
  req.note.remove()
    .then(function() {
      res.sendStatus(204);
    })
    .then(null, next);
});

