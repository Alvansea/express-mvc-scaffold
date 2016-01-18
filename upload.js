'use strict';

var path = require('path');
var crypto = require('crypto');
var fileLogger = require('./logger');
var multer = require('multer');

module.exports = multer({
  dest: path.join(__dirname, './assets/tmp/'),
  rename: function(fieldname, filename) {
    var raw = Date.now() + filename;
    return crypto.createHash('md5').update(raw).digest('hex');
  },
  onError: function (error, next) {
    fileLoggers.upload.error(JSON.stringify(error));
    next(error)
  }
});