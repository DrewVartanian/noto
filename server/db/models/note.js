'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Type.ObjectId,
      ref: 'User'
    },
    message: String,
    color: {
      type: String,
      default: '#FFFF00'
    },
    position: {
        x: {
          type: Number
        },
        y: {
          type: Number
        },
        z: {
          type: Number
        }
    },
    size: {
      x: {
        type: Number
      },
      y: {
        type: Number
      }
    },
    association: String,
    action: String,
});

mongoose.model('Note', schema);
