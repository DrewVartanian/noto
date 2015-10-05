// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Note = mongoose.model('Note');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Notes Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Notes requests', function () {

		var noteInfo = {
			user: '123',
			message: "This is a testing note",
			position: {x: 200, y: 100, z: 120},
			size: {x: 50, y: 50},
			association: "dom elem",
			action: "click"
		};

		var noteInfo2 = {
			user: '456',
			message: "This is a testing note 2",
			position: {x: 200, y: 100, z: 120},
			size: {x: 50, y: 50},
			association: "dom elem",
			action: "click"
		};

		var userInfo = {
            email: 'obama@gmail.com',
            password: 'potus'
        };

        var noteObj;
        var noteObj2
        var loggedInAgent;
		beforeEach('Create a note', function(done) {
            Note.create(noteInfo).then(function(note) {
                noteObj = note;
                done();
            }).then(null, done);
        });

		beforeEach('Create a second note', function(done) {
            Note.create(noteInfo2).then(function(note) {
                noteObj2 = note;
                done();
            }).then(null, done);
        });

		beforeEach('Create loggedIn user agent and authenticate', function(done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

        describe('Notes', function (){

            it('should get notes', function(done) {
                loggedInAgent.get('/api/note/' + noteObj._id).expect(200).end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body[0]._id).to.equal(noteObj._id.toString());
                    done();
                });
            });

            it('should get all notes', function(done) {
                loggedInAgent.get('/api/note').expect(200).end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body.length).to.equal(2);
                    done();
                });
            });
            it('should create a new note', function(done) {
            	var newNote = {
            		user: '789',
					message: "This is a testing note 3",
					position: {x: 200, y: 100, z: 120},
					size: {x: 50, y: 50},
					association: "dom elem",
					action: "click"
            	};

                loggedInAgent.post('/api/note').expect(200).end(function(err, response) {
                    if (err) return done(err);
                    expect(response.body[0].message).to.equal("This is a testing note 3");
                    done();
                });
            });

	});

});
});