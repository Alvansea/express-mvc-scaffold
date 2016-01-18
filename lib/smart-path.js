'use strict';

(function() {

var fs = require('fs')
	, path = require('path')
	, async = require('async')

var validateDir = exports.validateDir = function(filepath, cb) {
	var dirs = []
		, dir = ''
		, parts = filepath.split('/')
	for(var i = 0; i < parts.length - 1; i++) {
		dir += parts[i] + '/';
		dirs.push(dir);
	}
	async.eachSeries(dirs, function(dir, next) {
		fs.exists(dir, function(exists) {
			if(exists) {
				return next();
			}
			fs.mkdir(dir, next);
		})
	}, cb);
}

})();