'use strict';

(function(angular) {

angular
  .module('arroyo', [
    'ngResource',
    'ngSanitize'
  ])
  .config([
    '$httpProvider',
    '$locationProvider',
    function($httpProvider, $locationProvider) {
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
      $locationProvider.html5Mode(true);
    }
  ])

})(window.angular)