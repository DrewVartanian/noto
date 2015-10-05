'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var team = mongoose.model('Team');
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
// /api/note/user/
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
  res.send(req.note)
  .then(null, next);
});

// POST new note to a page
router.post('/', function(req, res, next) {
<<<<<<< HEAD
  // req.body to send current tab's URL as req.body.url
  // look up current page by url
  Page.find({url: req.body.url})
  .then(function(page) {
    // If page does not exist, create new page entry in database
    if(!page) {
      Page.create({url: req.body.url})
        .then(function(page) {
          var newPage = page;
          // create note
          Note.create({
            owner: req.user._id,
            page: page,
          })
          .then(function(note) {
            // add req.body properties to new note
            _.extend(note, req.body);
            note.save()
            .then(function(note) {
              // add note to new page's notes array
              newPage.notes.push(note);
              res.status(201).json(note);
            });
          });
        });
    }
    // END if

    // If page exists, add note to page's notes array
    else {
      var currentPage = page;
      // create note
      Note.create({
        owner: req.user._id,
        page: page
      })
      // add req.body properties to new note
      .then(function(note) {
        _.extend(note, req.body);
        note.save()
        .then(function(note) {
          currentPage.notes.push(note);
          res.status(201).json(note);
        });
      });
    }
    // END else
  })
  .then(null, next);
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

