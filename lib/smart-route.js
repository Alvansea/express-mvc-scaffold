'use strict';

(function() {

  var fs = require('fs');
  var path = require('path');

  var SmartRouter = function(router) {
    this.router = router;
  }

  SmartRouter.prototype.scan = function(dir, options) {
    var router = this.router;
    var verbose = options ? options.verbose : null;
    var filter = (options && options.filter) ? options.filter : function(file) {
      return file.indexOf('.') !== 0;
    }
    fs.readdirSync(dir)
      .filter(filter)
      .forEach(function(file) {
        verbose && console.log('\n   %s:', file);
        var ctrl = require(path.join(dir, file));
        var name = ctrl.name || file;
        if (ctrl.routes) {
          for (var route in ctrl.routes) {
            var methods = ctrl.routes[route];
            for (var method in methods) {
              var handler = methods[method];
              if (typeof handler == 'string') {
                if (ctrl[handler]) {
                  router[method](route, ctrl[handler]);
                }
              } else {
                var handlers = [];
                for (var i in handler) {
                  if (ctrl[handler[i]]) {
                    handlers.push(ctrl[handler[i]])
                  }
                }
                if (handlers.length) {
                  router[method](route, handlers);
                }
              }
            }
          }
        }
      });
    return router;
  }

  module.exports = SmartRouter;

})();
