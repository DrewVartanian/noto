// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Note = mongoose.model('Note');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Note Router', function() {

  var note1ID,
      note2ID,
      userID,
      loggedInAgent;

  beforeEach('Establish DB connection', function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function(done) {
    clearDB(done);
  });


  beforeEach('Create note and user database entries', function(done) {

    var userInfo = {
      email: 'test@test',
      password: 'test'
    };

    User.create(userInfo)
      .then(function(user) {
        userID = user._id;
      });
    // console.log("userID ", userID);

    loggedInAgent = supertest.agent(app);
    loggedInAgent.post('/login')
    .send(userInfo)
    .end(function(err, response) {
      // console.log("response.body.user ", response.body.user);
      done();
    });

    var note1 = {
      owner: userID,
      message: "note message 1",
      position: {
        x: 200,
        y: 100,
        z: 120
      },
      size: {
        x: 50,
        y: 50
      },
      association: "dom elem 1",
      action: "click 1"
    };

    var note2 = {
      owner: userID,
      message: "note message 2",
      position: {
        x: 200,
        y: 100,
        z: 120
      },
      size: {
        x: 50,
        y: 50
      },
      association: "dom elem 2",
      action: "click 2"
    };

    Note.create(note1)
      .then(function(note) {
        note1ID = note._id;
      });

    Note.create(note2)
      .then(function(note) {
        note2ID = note._id;
      });
  }); //END beforeEach()


  // describe('GET /api/note/user', function() {
  //   it('should get all notes written by current user', function(done) {
  //     loggedInAgent.get('/api/note/user')
  //       .expect(200)
  //       .end(function(err, response) {
  //         if (err) return done(err);
  //         expect(response.body).to.have.length(2);
  //         expect(response.body[0].message).to.equal("note message 1");
  //         expect(response.body[1].message).to.equal("note message 2");
  //         done();
  //       });
  //   });
  // });

  describe('GET /:id', function() {
    it('should get a specific note', function(done) {
      loggedInAgent.get('/api/note/' + note1ID)
        .expect(200)
        .end(function(err, response) {
          if (err) return done(err);
          // expect(response.body.owner).to.equal(userID.toString());
          expect(response.body.message).to.equal("note message 1");
          done();
        });
    });
  });

  describe('POST /', function() {
    it('should create a new note', function(done) {
      var note3 = {
        message: "note message 3",
        association: "dom elem 3",
        action: "click 3",
        url: "url.com"
      };

      loggedInAgent.post('/api/note')
        .send(note3)
        .expect(200)
        .end(function(err, response) {
          if (err) return done(err);

          Note.findOne({
            message: response.body.message
          })
          .then(function(note) {
            expect(note.association).to.equal("dom elem 3");
            expect(note.action).to.equal("click 3");
            done();
          });
        });
    });
  });

  describe('PUT /:id', function() {
    it('should update a note', function(done) {
      loggedInAgent.put('/api/note/' + note1ID)
        .send({
          message: "updated message"
        })
        .expect(200)
        .end(function(err, response) {
          if (err) return done(err);
          Note.findOne({
              message: "updated message"
            })
            .then(function(note) {
              expect(note.association).to.equal("dom elem 1");
              expect(note.action).to.equal("click 1");
              done();
            });
        });
    });
  });


  describe('DELETE /:id', function() {
    it('should delete a note', function(done) {
      loggedInAgent.delete('/api/note/' + note2ID)
        .expect(204)
        .end(function(err, response) {
          if (err) return done(err)
          Note.findById(note2ID)
            .then(function(note2) {
              expect(note2).to.be.null;
              done();
            });
        });
    });
  });

});
