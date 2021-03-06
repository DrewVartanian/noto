'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    default: ''
  },
  // page: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Page'
  // },
  // team: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Team'
  // }],
  color: {
    type: String,
    default: 'yellow'
  },
  position: {
    x: Number,
    y: Number,
    z: {
      type: Number,
      default: 100
    }
  },
  size: {
    x: {
      type: Number,
      default: 200
    },
    y: {
      type: Number,
      default: 200
    }
  },
  // // DOM element association
  // association: String,
  actions: { type : Array , "default" : [] }
});

mongoose.model('Note', schema);
