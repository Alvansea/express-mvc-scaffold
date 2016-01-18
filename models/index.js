'use strict';

var conf = require('../conf')
var jdb = require('../lib/jugglingdb-fix');
var smartData = require('../lib/smart-data');
var logger = require('../logger').db;
var schemaDef = require('./_schema');

var schema = 
module.exports = new jdb.Schema('mysql', conf.db.mysql);

schema.logger = logger;

// extend mysql adapter to support 'and' parameter in where object
smartData.extendAdapter(schema);

// load predefined models
smartData.loadSchema(schema, schemaDef);

// extend schema models
smartData.loadModels(schema, __dirname);

// jdb.test(module.exports, schema);