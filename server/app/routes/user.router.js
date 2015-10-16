'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var nodemailer = require('nodemailer');
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


router.get('/allUsers/', function (req,res,next) {
    var allUserEmails = [];
    User.find().exec()
    .then(function(allUsers) {
         allUsers.forEach(function(user) {
         allUserEmails.push(user.email);
        });
    })
    .then(function() {
        res.status(200).json(allUserEmails);
        })
    .then(null, next);

});
//Get unread pages for a user
router.get('/unreadpage', function (req,res,next){
    User.findOne({_id: req.user._id}).populate('unreadPages')
    .then(function(user){
        res.status(200).json(user.unreadPages);
    }).then(null, next);
});

//remove page from unreadPages array
router.put('/unreadpage', function (req,res,next){

    if (req.user) {
        User.findOne({_id: req.user._id}).populate('unreadPages')
        .then(function(user){




            // user.unreadPages.forEach(function(page,index){
            //     if (page.url === req.body.url) {
            //         console.log("splicing index number: ", index)
            //         user.unreadPages.splice(index,1);
            //     }
            // });

            if (user.unreadPages.length) {
                for (var i=user.unreadPages.length-1; i>=0; i--) {
                    if (user.unreadPages[i].url === req.body.url) {
                        console.log("splicing index number: ", i);
                        user.unreadPages.splice(i,1);

                    }
                }
                
            }

            return user;
            // console.log("in unread pages route, user: ", user);
        }).then(function(user){
            user.save().then(function (){
                res.sendStatus(201);
            }).then(null, next);

        });
        
    }
});













