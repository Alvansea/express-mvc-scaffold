'use strict';

var Schema = require('jugglingdb').Schema;

var newDate = function() {
  return new Date();
}

exports.models = {

  'User': {
    name:         { type: String, index: true, allownulls: false },
    email:        { type: String, index: true, allownulls: false },
    pwd:          { type: String, allownulls: false },
    role:         { type: String, default: 'user' },
    mobile:       { type: String },
    createdAt:    { type: Date, default: newDate },
    deleted:      { type: Boolean, default: false },

    __relations: {
      logins:     { model: 'UserLogin', as: 'user' },
    }
  },

  'UserLogin': {
    loginAt:      { type: Date, default: newDate },
    ipAddress:    { type: String },
  },

  'Domain': {
    name:         { type: String },
  },

}