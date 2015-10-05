// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Page = mongoose.model('Page');
var User = mongoose.model('User');
var Team = mongoose.model('Team');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Page Router', function() {
  beforeEach('Establish DB connection', function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function(done) {
    clearDB(done);
  });

  var userOne = {
    email: "karen@gmail.com",
    password: "karen"
  }

  var userTwo = {
    email: "connie@gmail.com",
    password: "connie"
  }


  var teamInfo = {
    name: 'powerRanger',
  }

  var pageInfo = {
    url: 'http://webnote.com',
  };

  var page;

  beforeEach('Create a page', function(done) {
    User.create([userOne, userTwo]).then(function(users) {
      teamInfo.users = [users[0]._id, users[1]._id];
      Team.create(teamInfo)
        .then(function(team) {
          pageInfo.team = team._id;
          Page.create(pageInfo)
            .then(function(pageCreated) {
              page = pageCreated;
              done();
            })
            .then(null, done);
        });
    });
  });

  var guestAgent;

  beforeEach('Create guest agent', function() {
    guestAgent = supertest.agent(app);
  });

  describe('GET /', function() {
    it('should return all the pages', function(done) {
      guestAgent.get('/api/page/').expect(200).end(function(err, response) {
        if (err) return done(err);
        expect(response.body).to.have.length(1);
        done();
      });
    });
  });

  // describe('GET /api/page/user', function() {
  // it('should get all the pages that belong to the user', function (done) {
  //   guestAgent.get('/api/page/user').expect(200).end(function (err, response) {
  //     if (err) return done(err);
  //     expect(response.body._id).to.equal(page._id.toString());
  //     done();
  //   });
  // });

  //  describe('GET /api/page/user/:pageURL', function() {
  //   it('should get all notes on a specific page for current user', function (done) {
  //    guestAgent.get('/api/page/user/' + 'http://webnote.com').expect(200).end(function (err, response) {
  //      if (err) return done(err);
  //      expect(response.body._id).to.equal(page._id.toString());
  //      done();
  //    });
  //  });
  // });

});
