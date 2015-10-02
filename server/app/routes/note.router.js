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

// GET all
router.get('/', function(req, res, next) {
  Note.find().exec()
    .then(function(notes) {
      res.status(200).json(notes);
      next();
    })
    .then(null, next);
});

// GET all notes for a user
// /api/note/user/123
router.get('/user/:userID', function(req, res, next) {
  Note.find({owner: req.params.userID}).exec()
    .then(function(notes) {
      res.status(200).json(notes);
      next();
    }, function(err) {
      throw new Error("User not found");
    })
    .then(null, next);
});

// GET one
router.get('/:noteID', function(req, res, next) {
  res.send(req.note);
});

// POST one
router.post('/', function(req, res, next) {
  Note.create(req.body)
    .then(function(note) {
        res.status(201).json(note);
    })
    .then(null, next);
});

// PUT one



// DELETE one



