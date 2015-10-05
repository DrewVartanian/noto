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

describe('Products Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('Unauthenticated request', function () {

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


    var team;
    beforeEach('Create a page', function (done) {
      User.create([userOne, userTwo]).then(function(users){
        teamInfo.users = users;
        Team.create({teamInfo}).then(function(createdTeam){
            team = createdTeam;
            done();
        }).then(null, done);
      })
    });

    var guestAgent;

    beforeEach('Create guest agent', function () {
      guestAgent = supertest.agent(app);
    });

    it('should GET all users in a team', function (done) {
      guestAgent.get('/api/team/' + team._id + 'users').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body.name).to.equal("powerRanger");
        done();
      });
    });

    it('should post a new team', function (done) {
      var newTeam = {
        name: "new team"
      }

      guestAgent.post('/api/team/', newTeam).expect(201).end(function (err, response) {
        if (err) return done(err);
        expect(response.body.name).to.equal("new team");
        done();
      });
    });

     it('PUT update team (name, users)', function (done) {
      team.name = "modified team";
      guestAgent.put('/api/team/' + team._id, team).expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body.name).to.equal("modified team");
        done();
      });
    });

     it('DELETE specific team', function (done) {
      guestAgent.delete('/api/team/' + team._id).expect(204).end(function (err, response) {
        if (err) return done(err);
        // expect(response.body.name).to.equal("modified team");
        done();
      });
    });

  });
});