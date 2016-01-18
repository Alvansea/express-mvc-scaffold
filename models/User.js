'use strict';

var crypto = require('crypto');

var db = require('./');
var User = db.models.User;
var conf = require('../conf');

User.setter.pwd = function(pwd) {
  this._pwd = User.calcHash(pwd);
}

User.calcHash = function(pass) {
  if(!pass) {
    return '';
  }

  var sha = crypto.createHash('sha256');
  sha.update(pass);
  sha.update(conf.server.userSalt);
  var hash = sha.digest('base64');
  return hash;
}