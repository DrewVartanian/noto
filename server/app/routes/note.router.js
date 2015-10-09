'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var bluebird = require('bluebird');
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
  var teamFind;
  var teamId;
  var newPageNeeded=false;

  // look up current page by url
  // error note: multiple pages can have same URL
  console.log('note post');
  if(req.body.team==='personal'){
    console.log('personal');
    teamFind = Team.findOne({name:'personal',users:[req.user._id]}).then(function(team){
      return team?team:Team.create({name:'personal',users:[req.user._id]});
    }).then(function(team){
      teamId=team._id;
    });
  }else{
    //ELSE STATMENT IS UNTESTED
    console.log('team id provided: ',req.body.team);
    teamId = req.body.team;
    teamFind = Promise.resolve();
  }

  teamFind.then(function(){
    return Page.findOne({url: req.body.url,team:teamId});
  }).then(function(page) {
    // If page does not exist, create new page entry in database
    if(page) return page;
    newPageNeeded=true;
    return Page.create({url: req.body.url,team:teamId});
    // return page?page:Page.create({url: req.body.url,team:teamId});
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
    return newPageNeeded?(page.populate('team').execPopulate()):page;
  }).then(function(page){
    console.log('new posted note: ', retNote);
    res.json({page: newPageNeeded?page:false, note: retNote, teamId: teamId});
  })
  .then(null,next);
});


// PUT update note
// TODO: only owner can edit note
router.put('/:id', function(req, res, next) {
  _.extend(req.note, req.body);
  var retNote;
  var newPageNeeded = true;
  req.note.save().then(function(note) {
      retNote=note;
      if(req.body.oldTeam===req.body.newTeam) return ['stay'];
      return Page.find({
        $and: [
            {url: req.body.url},
            {$or: [{team: req.body.oldTeam}, {team: req.body.newTeam}]}
        ]
      });
  }).then(function(pages){
    console.log(pages);
    if(pages[0]==='stay'){
      newPageNeeded=false;
      return;
    }
    var pageSaves=pages.map(function(page){
      if(page.team.toString()===req.body.oldTeam){
        page.notes.splice(page.notes.indexOf(req.note._id),1);
      }else if(page.team.toString()===req.body.newTeam){
        newPageNeeded = false;
        page.notes.push(req.note._id);
      }
      return page.save();
    });
    return Promise.all(pageSaves);
  }).then(function(){
    if(newPageNeeded){
      return Page.create({
        url: req.body.url,
        team: req.body.newTeam,
        notes: [req.note._id]
      });
    }
    return false;
  }).then(function(page){
    res.status(200).json({note: retNote,page: newPageNeeded?page:false});
  }).then(null, next);
});

// DELETE specific note
// TODO: only owner can delete note
router.delete('/:id', function(req, res, next) {
  var pageSaves=[];
  Page.find({notes: req.note._id}).then(function(pages){
    pages.forEach(function(page){
      page.notes.splice(page.notes.indexOf(req.note._id),1);
      pageSaves.push(page.save());
    });
    return Promise.all(pageSaves);
  }).then(function(){
    return req.note.remove();
  }).then(function(){
    res.sendStatus(204);
  }).then(null, next);
});

