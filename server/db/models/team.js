'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
      type: mongoose.Schema.Type.ObjectId,
      ref: 'User'
    }]
});

mongoose.model('Team', schema);