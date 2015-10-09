/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Team = Promise.promisifyAll(mongoose.model('Team'));
var Note = Promise.promisifyAll(mongoose.model('Note'));
var Page = Promise.promisifyAll(mongoose.model('Page'));

var seedUsers = function () {
    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password',
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
        }
    ];
    return User.createAsync(users);
};

var seedNotes = function (users) {
    var notes = [];

    for (var i =0; i<users.length; i++) {
        for (var j=0; j<users.length; j++) {
            notes.push({
                owner: users[i]._id,
                message: "Message number " + j
            });
        }
    }
    return Note.createAsync(notes);
};

var seedTeams = function (users) {
    var teams = [];

    for (var i=0; i<users.length; i++) {
        teams.push({
            users: [users[0]._id, users[1]._id],
            name: "Team number " + i
        });
    }
    return Team.createAsync(teams);
};

var seedPages = function (notes, teams) {
    var pages = [];

    for (var i=0; i<teams.length; i++) {
        pages.push({
            notes: [notes[0]._id, notes[1]._id, notes[2]._id, notes[3]._id],
            url: "website number " + i,
            team: teams[i]._id
        });
    }
    return Page.createAsync(pages);
};



connectToDb.then(function () {
    var mongoUsers;
    var mongoNotes;
    var mongoTeams;
    var mongoPages;

    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            //process.kill(0);
            return users;
        }
    }).then(function (users){
        mongoUsers = users;
    }).then(function (){
        return Note.findAsync({});
    }).then(function (notes){
        if (notes.length === 0) {
            return seedNotes(mongoUsers);
        }
        else {
            console.log(chalk.magenta('Seems to already be note data, exiting!'));
            //process.kill(0);
            return notes;
        }
    }).then(function (notes){
        mongoNotes = notes;
    }).then(function (){
        return Team.findAsync({});
    }).then(function (teams){
        if (teams.length === 0) {
            return seedTeams(mongoUsers);
        }
        else {
            console.log(chalk.magenta('Seems to already be team data, exiting!'));
            //process.kill(0);
            return teams;
        }
    }).then(function (teams){
        mongoTeams = teams;
    }).then(function (){
        return Page.findAsync({});
    }).then(function (pages){
        if (pages.length === 0) {
            return seedPages(mongoNotes, mongoTeams);
        }
        else {
            console.log(chalk.magenta('Seems to already be team data, exiting!'));
            //process.kill(0);
            return pages;
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
