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


//Get all pages that a user should be able to see/edit
router.get('/page/', function (req, res, next){

    if(!req.user) return res.status(200).json([]);
    var userId = req.user._id;

    Team.find({users: userId}).exec().then(function(teams){
        // res.status(200).json(teams);
        return teams;
    }).then(function(teams){
    	Page.find({team: {$in: teams}}).populate('team notes').exec()
    	.then(function(pages){
            res.status(200).json(pages);
        });
    }).then(null, next);



});


//Get all teams that a user is on
router.get('/team/', function (req,res,next){
    if(!req.user) return res.status(200).json([]);
    var userId = req.user._id;

    Team.find({users: userId}).exec().then(function(teams){
        res.status(200).json(teams);
    }).then(null, next);

});













