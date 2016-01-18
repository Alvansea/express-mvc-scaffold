'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var ect = require('ect');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');

var conf = require('./conf');
var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('port', conf.server.port);
app.engine('html', ect({
  watch: true,
  root: app.get('views')
}).render);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var loggerConfig = {
  type: 'dev',
  options: {
    skip: function(req, res) {
      return res.statusCode < 400;
    }
  }
};
app.use(logger(loggerConfig.type, loggerConfig.options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  secret: conf.server.sessionSecret
}));
app.use(session({
  secret: conf.server.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true
  },
  store: new RedisStore(conf.redis)
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  res.locals.serverTitle = conf.server.title;
  res.locals.keywords = conf.server.keywords;
  res.locals.description = conf.server.description;

  res.locals.alert = req.flash('alert');
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if(err.status != 404) {
      console.log(err.stack);
    }
    res.status(err.status || 500);
    if(req.xhr) {
      res.send({
        message: err.message,
        error: err
      })
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

if(!module.parent) {
  app.listen(app.get('port'));
}