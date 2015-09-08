'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:storeInstanceHeader
 * @description
 * # storeInstanceHeader
 */
angular.module('ts5App')
  .directive('storeInstanceHeader', function () {
    return {
      templateUrl: '/views/directives/store-instance-header.html'
    };
  });
