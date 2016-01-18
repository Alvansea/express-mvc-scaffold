'use strict';

var winston = require('winston');
var moment = require('moment');
var path = require('path');
var DailyRotateFile = require('winston-daily-rotate-file');

var getTransport = function(name, level) {

  var transport = new DailyRotateFile({
    name: name,
    colorize: false,
    filename: path.join(__dirname, './logs/' + name + '.log'),
    datePattern: '.yyyy-MM-dd',
    maxsize: 500000,
    level: level || 'info',
    json: false,
    timestamp: function() {
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }
  });

  return transport;
}

module.exports = {

  default: new (winston.Logger)({
    transports: [
      getTransport('info'),
      getTransport('error', 'error')
    ]
  }),

  access: new (winston.Logger)({
    transports: [
      getTransport('access')
    ]
  }),

  db: new (winston.Logger)({
    transports: [
      getTransport('db')
    ]
  }),

  maintain: new (winston.Logger)({
    transports: [
      getTransport('maintain')
    ]
  }),

  upload: new (winston.Logger)({
    transports: [
      getTransport('upload')
    ]
  }),
};