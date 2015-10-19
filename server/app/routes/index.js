'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/note', require('./note.router'));
router.use('/page', require('./page.router'));
router.use('/team', require('./team.router'));
router.use('/user', require('./user.router'));



router.use(function(req, res) {
  res.status(404).end();
});
