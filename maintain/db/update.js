'use strict';

var db = require('../../models');

console.log('auto update...');

db.autoupdate(function(err) {
  console.log(err || 'done!');
  process.exit();
});