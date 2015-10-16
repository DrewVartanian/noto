'use strict';
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

schema.plugin(deepPopulate);
mongoose.model('Team', schema);
