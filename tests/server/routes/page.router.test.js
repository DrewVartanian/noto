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
    url: 'webnote.com',
  };

  // var userInfo = {
  //  email: 'obama@gmail.com',
  //  password: 'potus'
  // };

  var page;
  //var mongoUser;

  beforeEach('Create a page', function(done) {
    User.create([userOne, userTwo]).then(function(users) {
      //mongoUser = user[0];
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
  var loggedInAgent;


  beforeEach('Create loggedIn user agent and authenticate', function(done) {
      loggedInAgent = supertest.agent(app);
      loggedInAgent.post('/login').send(userOne).end(done);
  });

  // var loggedInAgent;

  // beforeEach('Create guest agent', function(done) {
  //   //loggedInAgent = supertest.agent(app);
  //   loggedInAgent = supertest.agent(app);
  //   loggedInAgent.post('/login').send(userInfo).end(done);
  // });

  describe('GET /', function() {
    it('should return all the pages', function(done) {
      loggedInAgent.get('/api/page/').expect(200).end(function(err, response) {
        if (err) return done(err);
        expect(response.body).to.have.length(1);
        done();
      });
    });
  });

  describe('GET /api/page/user', function() {
  it('should get all the pages that belong to the user', function (done) {
    loggedInAgent.get('/api/page/user').expect(200).end(function (err, response) {
      if (err) return done(err);
      expect(response.body[0]._id).to.equal(page._id.toString());
      done();
    });
  });

  //  describe('GET /api/page/user/:pageURL', function() {
  //   it('should get all notes on a specific page for current user', function (done) {
  //    loggedInAgent.get('/api/page/user/' + 'webnote.com').expect(200).end(function (err, response) {
  //      if (err) return done(err);
  //      expect(response.body[0]._id).to.equal(page._id.toString());
  //      done();
  //    });
  //  });
  // });

});
});