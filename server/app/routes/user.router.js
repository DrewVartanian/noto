'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports = router;

var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');


// fsa-pre-built has: /login, /logout

router.get('/:userId', function (req, res, next){

    var userId = req.params.userId;

    Team.find({users: userId}).exec().then(function(teams){
        // res.status(200).json(teams);
        return teams;
    }).then(function(teams){
    	Page.find({team: {$in: teams}}).exec().then(function(pages){
            res.status(200).json(pages);
        });
    }).then(null, next);



});













