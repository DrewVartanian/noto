'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  // page: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Page'
  // },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  color: {
    type: String,
    default: '#FFFF00'
  },
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  size: {
    x: Number,
    y: Number
  },
  // DOM element association
  association: String,
  action: String
});

mongoose.model('Note', schema);
