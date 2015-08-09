'use strict';

/**
 * @ngdoc filter
 * @name ts5App.filter:index
 * @function
 * @description
 * # index
 * Filter in the ts5App.
 */
angular.module('ts5App')
  .filter('index', function() {
    return function(array, index) {
      if (array) {
        index = 'index';
        for (var i = 0; i < array.length; ++i) {
          array[i][index] = i;
        }
        return array;
      }
    };
  });
