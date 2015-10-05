'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  // team: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Team',
  //   required: true
  // },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notes'
  }],
  pub: Boolean //?
});

mongoose.model('Page', schema);
