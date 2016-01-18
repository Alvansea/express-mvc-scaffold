'use strict';

var express = require('express');
var router = express.Router();
var SmartRoute = require('../lib/smart-route');
var userCtrl = require('./userCtrl');

router.all('/home*', userCtrl.auth);
router.all('/admin*', userCtrl.isAdmin);

var sr = new SmartRoute(router);
sr.scan(__dirname);

module.exports = router;
