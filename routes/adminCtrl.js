'use strict';

var db = require('../models');

exports.routes = {
  '/admin': { get: 'dashboard' },
}

exports.dashboard = function(req, res) {
  res.render('admin/dashboard', {
    title: '控制台'
  })
}