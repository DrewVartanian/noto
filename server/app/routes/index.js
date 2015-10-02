'use strict';
var router = require('express').Router();
module.exports = router;

// Mount routers
router.use('/note', require('./note.router'));
router.use('/page', require('./page.router'));
router.use('/team', require('./team.router'));
router.use('/user', require('./user.router'));
// router.use('/member', require('./member.router'));

// Database models
var Note = mongoose.model('Note');
var Page = mongoose.model('Page');
var Team = mongoose.model('Team');
var User = mongoose.model('User');




// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
