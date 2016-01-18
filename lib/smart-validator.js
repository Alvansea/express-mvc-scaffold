'use strict';

exports.removeBad = function(text) {
  if(!text || typeof(text) != 'string') {
    return '';
  }
  var newText = text.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+/g,""); 
  return newText;
}

exports.validateEmail = function(email) {
  return true;
}

exports.validateUrl = function(url) {
  if(!url) {
    return '';
  }
  var newUrl = url.replace(/.*:\/*/g, '');
  if(newUrl[0] != '/') {
    newUrl = '/' + newUrl;
  }
  return newUrl;
}