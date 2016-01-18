/* jugglingdb schema/models loader */

(function() {
  'use strict';

  var async = require('async');
  var _ = require('underscore');
  var path = require('path');
  var fs = require('fs');

  var loadSchema = exports.loadSchema = function(schema, conf) {
    // init models
    for (var name in conf.models) {
      var model = conf.models[name];
      var prop = _.omit(model, ['__settings', '__relations']);
      schema.define(name, prop, model.__settings);
    }
    // init relations
    for (var name in conf.models) {
      var relations = conf.models[name].__relations;
      if (!relations) {
        continue;
      }
      for (var type in relations) {
        var rel = relations[type];
        if (rel.model && rel.as && schema.models[rel.model]) {
          schema.models[name].hasMany(type, {
            model: schema.models[rel.model],
            foreignKey: rel.as + 'Id'
          });
          schema.models[rel.model].belongsTo(rel.as, {
            model: schema.models[name],
            foreignKey: rel.as + 'Id'
          })
        } else {
          console.log('ERROR model ' + rel.model + ' does not exist!');
        }
      }
    }

    // add prefetch method for all the models in the schema
    for (var i in schema.models) {
      this.extendModel(schema.models[i]);
    }
  }

  /**
   *  extend model methods, including: prefetch, mergeTo & destroyWithLinks 
   */
  var extendModel = exports.extendModel = function(model) {

    model.prototype.prefetch = function(options, cb) {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      if (args.length == 1) {
        cb = options;
        options = []
        for (var i in model.relations) {
          options.push(i);
        }
      }
      async.each(options, function(name, next) {
        self[name](function(err, val) {
          next(err);
        })
      }, cb);
    }

    model.prototype.mergeTo = function(itemId, cb) {
      var self = this;
      if(self.id == itemId) {
        return cb();
      }
      self.currentFunc = 0;

      var links = [];
      for (var name in model.relations) {
        var relation = model.relations[name];
        if (relation.type != 'hasMany') {
          continue;
        }
        links.push(name);
      }

      var funcs = [];
      for (var i = 0; i < links.length; i++) {
        var func = function(next) {
          var name = links[self.currentFunc];
          relation = model.relations[name];
          self.currentFunc++;
          self[name](function(err, items) {
            if (err) {
              return next(err);
            }
            async.each(items, function(item, next2) {
              var attrs = {};
              attrs[relation.keyTo] = itemId;
              item.updateAttributes(attrs, function(err, item) {
                return next2();
              })
            }, next)
          })
        }
        funcs.push(func);
      }

      async.parallel(funcs, function(err) {
        if (err) {
          return cb(err);
        }
        self.destroy(cb);
      })
    }

    model.prototype.destroyWithLinks = function(cb) {
      var self = this;
      self.currentFunc = 0;

      var links = [];
      for (var name in model.relations) {
        var relation = model.relations[name];
        if (relation.type != 'hasMany') {
          continue;
        }
        links.push(name);
      }

      var funcs = [];
      for (var i = 0; i < links.length; i++) {
        var func = function(next) {
          var name = links[self.currentFunc];
          relation = model.relations[name];
          self.currentFunc++;
          self[name](function(err, items) {
            if (err) {
              return next(err);
            }
            async.each(items, function(item, next2) {
              console.log('destroy ' + name + ': ', item.id);
              item.destroyWithLinks(next2);
            }, next)
          })
        }
        funcs.push(func);
      }

      async.parallel(funcs, function(err) {
        if (err) {
          return cb(err);
        }
        self.destroy(cb);
      })
    }
  }

  var loadModels = exports.loadModels = function(schema, folder) {
    fs.readdirSync(folder)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
      })
      .forEach(function(file) {
        require(path.join(folder, file));
      })
  }

  var extendAdapter = exports.extendAdapter = function(schema) {
    schema.adapter._buildWhere = function(model, conds) {
      if (!conds) {
        return "";
      }
      var self = this;
      var cs = [];
      var props = this._models[model].properties;
      Object.keys(conds).forEach(function(key) {
        var keyEscaped = '`' + key.replace(/\./g, '`.`') + '`'
        var val = self.toDatabase(props[key], conds[key]);
        if (conds[key] === null || conds[key] === undefined) {
          cs.push(keyEscaped + ' IS NULL');
        } else if (key.toLowerCase() === 'or' && conds[key] && conds[key].constructor.name === 'Array') {
          var queries = [];
          conds[key].forEach(function(cond) {
            queries.push(self._buildWhere(model, cond));
          });
          cs.push('(' + queries.join(' OR ') + ')');
        } else if (key.toLowerCase() === 'and' && conds[key] && conds[key].constructor.name === 'Array') {
          var queries = [];
          conds[key].forEach(function(cond) {
            queries.push(self._buildWhere(model, cond));
          });
          cs.push('(' + queries.join(' AND ') + ')');
        } else if (conds[key] && conds[key].constructor.name === 'Array') {
          cs.push(keyEscaped + ' IN (' + val.join(', ') + ')');

        } else if (conds[key] && conds[key].constructor.name === 'Object') {
          var condType = Object.keys(conds[key])[0];
          var sqlCond = keyEscaped;
          if ((condType == 'inq' || condType == 'nin') && val.length == 0) {
            cs.push(condType == 'inq' ? 0 : 1);
            return true;
          }
          switch (condType) {
            case 'gt':
              sqlCond += ' > ';
              break;
            case 'gte':
              sqlCond += ' >= ';
              break;
            case 'lt':
              sqlCond += ' < ';
              break;
            case 'lte':
              sqlCond += ' <= ';
              break;
            case 'between':
              sqlCond += ' BETWEEN ';
              break;
            case 'inq':
              sqlCond += ' IN ';
              break;
            case 'nin':
              sqlCond += ' NOT IN ';
              break;
            case 'neq':
              sqlCond += ' != ';
              break;
            case 'like':
              sqlCond += ' LIKE ';
              break;
          }
          sqlCond += (condType == 'inq' || condType == 'nin') ? '(' + val + ')' : val;
          cs.push(sqlCond);
        } else {
          cs.push(keyEscaped + ' = ' + val);
        }
      });
      if (cs.length === 0) {
        return '';
      }
      return cs.join(' AND ');
    }
  }

})();
