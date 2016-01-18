(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var ezimg = require('easyimage');

  exports.rescrop = function(src, scale, cb) {
    fs.exists(src, function(exists) {
      if(!exists) {
        return cb('404');
      }
      var dirname = path.dirname(src);
      var extname = path.extname(src);
      var basename = path.basename(src, extname);
      var dest = path.join(dirname, basename + '-' + scale.width + 'x' + scale.height + extname);
      fs.exists(dest, function(exists) {
        if(exists) {
          return cb(null, dest); 
        }
        ezimg.info(src).then(function(img) {
          var params = {
            src: src,
            dst: dest,
            width: 0,
            height: 0,
            cropwidth: scale.width,
            cropheight: scale.height,
            x: 0,
            y: 0
          };
          if(img.width * scale.height > img.height * scale.width) {
            params.height = scale.height;
            params.width = params.height * img.width / img.height;
          } else {
            params.width  = scale.width;
            params.height = params.width * img.height / img.width;
          }
          ezimg.rescrop(params).then(function(img) {
            return cb(null, img.path);
          }, function(err) {
            return cb(err);
          })
        }, function(err) {
          return cb(err);
        });
      })
    })
  }

})();