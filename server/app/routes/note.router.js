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
  Note.find({
      owner: req.user._id
    }).exec()
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
  var newPageNeeded = false;

  // look up current page by url
  console.log('note post');
  if (req.body.team === 'personal') {
    console.log('personal');
    teamFind = Team.findOne({
      name: 'personal',
      users: [req.user._id]
    }).then(function(team) {
      return team ? team : Team.create({
        name: 'personal',
        users: [req.user._id]
      });
    }).then(function(team) {
      teamId = team._id;
    });
  } else {
    //ELSE STATMENT IS UNTESTED
    console.log('team id provided: ', req.body.team);
    teamId = req.body.team;
    teamFind = Promise.resolve();
  }

  teamFind.then(function() {
      return Page.findOne({
        url: req.body.url,
        team: teamId
      });
    }).then(function(page) {
      // If page does not exist, create new page entry in database
      if (page) return page;
      newPageNeeded = true;
      return Page.create({
        url: req.body.url,
        team: teamId
      });
    })
    .then(function(page) {
      currentPage = page;
      return Note.create(newNote);
    })
    .then(function(note) {
      retNote = note;
      currentPage.notes.push(note._id);
      return currentPage.save();
    })
    .then(function(page) {
      return newPageNeeded ? (page.populate('team').execPopulate()) : page;
    }).then(function(page) {
      console.log('new posted note: ', retNote);
      res.json({
        page: newPageNeeded ? page : false,
        note: retNote,
        teamId: teamId
      });
    })
    .then(null, next);
});


// PUT update note
router.put('/:id', function(req, res, next) {
  _.extend(req.note, req.body);
  var retNote;
  var newPageNeeded = true;
  var pageCheck;

  //saving position
  if (req.body.position) {
    req.note.save().then(function(note) {
      console.log("put with req.body.position ", note);
      res.status(200).json({
        note: note
      });

    });
  }
  // saving size
  else if (req.body.size) {
    req.note.save().then(function(note) {
      console.log("put with req.body.size ", note);
      res.status(200).json({
        note: note
      });
    });
  } else { // save the note
    req.note.save().then(function(note) {
        retNote = note;
        // check if there has been a team change
        if (req.body.oldTeam === req.body.newTeam) {

          //Add note to unread pages if the note was updated but there was no team change
          Page.findOne({
              url: req.body.url,
              team: req.body.newTeam
            })
            .then(function(page) {
              pageCheck = page;
              Team.findOne({
                  _id: req.body.oldTeam
                }).deepPopulate('users.unreadPages')
                .then(function(team) {
                  team.users.forEach(function(user) {
                    console.log("User: ", user._id)
                    console.log("Req.user: ", req.user._id)
                    if ((user._id.toString() !== req.user._id.toString())) {
                      if (!user.unreadPages.some(function(page) {
                          return (page.url.toString() === req.body.url.toString())
                        })) {
                        console.log("page being pushed inside 1st case ", pageCheck)
                        user.unreadPages.push(pageCheck);
                        user.save();
                      }
                    }
                  })
                }).then(null, next);
            }).then(null, next);

          return ['stay'];
        }
        // if there has been a team change find pages affected
        else {
          console.log("in the situation im looking for");
          return Page.find({
            $and: [{
              url: req.body.url
            }, {
              $or: [{
                team: req.body.oldTeam
              }, {
                team: req.body.newTeam
              }]
            }]
          });

        }
      }).then(function(pages) {
        console.log("Pages that were affected by team change: ", pages);
        if (pages[0] === 'stay') { // if no page is affected continue
          newPageNeeded = false;
          return;
        }
        var pageSaves = pages.map(function(page) { //find old team and remove note from it
          var keep = true;
          if (page.team.toString() === req.body.oldTeam) {
            page.notes.splice(page.notes.indexOf(req.note._id), 1);
            console.log("Removing note from: ", req.body.oldTeam);
            if (page.notes.length <= 0) {
              keep = false;
            }
          } else if (page.team.toString() === req.body.newTeam) { // find new team if exists and add note to it
            newPageNeeded = false; // mark that page for new team was found
            page.notes.push(req.note._id);

            //Add note to unread pages when team has been changed but it wasnt a new page

            console.log("FINDADD note to unread page when team has been changed but it wasnt a new page")
            pageCheck = page;
            Team.findOne({
                _id: req.body.oldTeam
              }).deepPopulate('users.unreadPages')
              .then(function(team) {
                team.users.forEach(function(user) {
                  console.log("User: ", user._id)
                  console.log("Req.user: ", req.user._id)
                  if ((user._id.toString() !== req.user._id.toString())) {
                    if (!user.unreadPages.some(function(page) {
                        return (page.url.toString() === req.body.url.toString())
                      })) {
                      console.log("page being pushed inside 2nd case ", pageCheck)
                      user.unreadPages.push(pageCheck);
                      user.save();
                    }
                  }
                })
              }).then(null, next);

          }
          if (keep) {
            return page.save();
          } else {
            return page.remove();
          }
        });
        return Promise.all(pageSaves);
      }).then(function() {
        if (newPageNeeded) { // if page for new team wasnt found create new page
          return Page.create({
            url: req.body.url,
            team: req.body.newTeam,
            notes: [req.note._id]
          });
        }
        return false;
      }).then(function(page) {
        // add page to unreadpages when a new page is created for a user

        if (page) {

          console.log("FINDADD unread page when a new page is created for a user");
          console.log("In if statement so page exists");
          pageCheck = page;
          console.log("Page: ", page)
          console.log("req.body.oldteam ", req.body.oldTeam);
          console.log("req.body.newteam ", req.body.newTeam);

          return Team.findOne({
              _id: req.body.newTeam
            }).deepPopulate('users.unreadPages')
            .then(function(team) {
              console.log("team, ", team);

              team.users.forEach(function(user) {
                console.log("User: ", user._id)
                console.log("Req.user: ", req.user._id)
                if ((user._id.toString() !== req.user._id.toString())) {
                  console.log("Found match")
                  if (!user.unreadPages.some(function(page) {
                      console.log("page url", page)
                      console.log("req.body.url ", req.body.url)
                      return (page.url.toString() === req.body.url.toString())
                    })) {
                    console.log("page being pushed inside 3rd case ", pageCheck)
                    user.unreadPages.push(pageCheck);
                    user.save();
                  }
                }
              })
              return {
                note: retNote,
                page: newPageNeeded ? page : false
              };
            })

        }
        return {
          note: retNote,
          page: newPageNeeded ? page : false
        };
      }).then(function(obj) {

        res.status(200).json(obj);

      })
      .then(null, next);
  }

});

// DELETE specific note
// TODO: only owner can delete note
router.delete('/:id', function(req, res, next) {
  var pageSaves = [];
  Page.find({
    notes: req.note._id
  }).then(function(pages) {
    pages.forEach(function(page) {
      page.notes.splice(page.notes.indexOf(req.note._id), 1);
      if (page.notes.length > 0) {
        pageSaves.push(page.save());
      } else {
        pageSaves.push(page.remove());
      }
    });
    return Promise.all(pageSaves);
  }).then(function() {
    return req.note.remove();
  }).then(function() {
    res.sendStatus(204);
  }).then(null, next);
});
