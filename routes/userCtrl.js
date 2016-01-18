'use strcit';

var db = require('../models');
var User = db.models.User;
var upload = require('../upload');
var page = require('../lib/smart-page');
var validator = require('../lib/smart-validator');
var message = require('../message');

exports.routes = {
  '/register':  { get: 'register', post: 'doRegister' },
  '/login':     { get: 'login', post: 'doLogin' },
  '/logout':    { get: 'logout' },

  '/home':      { get: ['auth', 'home'] },

  '/admin/users':               { get: 'manage' },
  '/admin/users/:userId(\\d+)': { post: 'update', delete: 'toTrash' },
}

var startSession =
exports.startSession = function(req, res, user) {
  delete user.pwd;
  req.session.user = user;
}

var stopSession =
exports.stopSession = function(req, res) {
  req.session.user = null;
}

exports.auth = function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/login');
  }
  return next();
}

exports.isAdmin = function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/login');
  }
  if(req.session.user.role != 'admin') {
    return page.error(req, res, message.Forbidden, '/login');
  }
  return next();
}

exports.register = function(req, res) {
  res.render('user/register', {
    title: '用户注册'
  })
}

exports.doRegister = function(req, res) {
  var form = req.body;
  var options = {
    name: validator.removeBad(form.name),
    email: validator.removeBad(form.email),
    pwd: form.pwd,
  };
  if(!options.name 
    || !options.email 
    || !options.pwd 
    || options.pwd.length < 6) {
    return page.error(req, res, message.BadRequest);
  }
  User.all({
    or: [
      {name: options.name},
      {email: options.email}
    ]
  }, function(err, users) {
    if(err) {
      return page.error(req, res, err);
    }
    if(users.length) {
      return page.error(req, res, message.UserConflicted);
    }
    var user = new User(options);
    user.save(function(err) {
      if(err) {
        return page.error(req, res, err);
      }
      startSession(req, res, user);
      res.send({
        user: user
      })
    })
  })
}

exports.login = function(req, res) {
  res.render('user/login', {
    title: '用户登录'
  })
}

exports.doLogin = function(req, res) {

  var form = req.body;
  var name = validator.removeBad(form.name);
  var pwd = User.calcHash(form.pwd);

  User.findOne({
    where: {
      or: [
        {name: name, pwd: pwd},
        {email: name, pwd: pwd},
      ]
    }
  }, function(err, user) {

    if(err) {
      return page.error(req, res, err);
    }
    if(!user) {
      return page.error(req, res, message.LoginFailed)
    }

    startSession(req, res, user);

    var login = user.logins.build();
    login.ipAddress = page.getIpAddress(req);
    login.save(function(err) {
      res.send({
        message: 'OK'
      })
    })
  })
}

exports.logout = function(req, res) {
  stopSession(req, res);
  res.redirect('/');
}

exports.home = function(req, res) {
  res.render('user/home', {
    title: '个人中心'
  })
}

exports.manage = function(req, res) {
  page.paging(req, res, User, {
    where: {
      deleted: false
    },
    include: 'logins'
  }, function(err, users) {
    if(err) {
      return page.error(rqe, res, err);
    }
    res.render('user/manage', {
      title: '用户管理',
      ViewModels: {
        users: users
      }
    })
  })
}

exports.update = function(req, res) {
  User.findOne({
    where: {
      id: req.params.userId
    }
  }, function(err, user) {
    if(err) {
      return page.error(req, res, err);
    }
    if(!user) {
      return page.error(req, res, message.UserNotFound);
    }
    var form  = req.body;
    var options = {
      name: validator.removeBad(form.name),
      email: validator.removeBad(form.email),
      mobile: validator.removeBad(form.mobile)
    }
    user.updateAttributes(options, function(err, user) {
      if(err) {
        return page.error(req, res, err);
      }
      res.send({
        data: user
      })
    })
  })
}

exports.toTrash = function(req, res) {
  User.findOne({
    where: {
      id: req.params.userId
    }
  }, function(err, user) {
    if(err) {
      return page.error(req, res, err);
    }
    if(!user) {
      return page.error(req, res, message.UserNotFound);
    }
    var form  = req.body;
    user.updateAttributes({
      deleted: !user.deleted
    }, function(err, user) {
      if(err) {
        return page.error(req, res, err);
      }
      res.send({
        data: user
      })
    })
  })
}