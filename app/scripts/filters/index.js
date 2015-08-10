'use strict';

/**
 * @ngdoc filter
 * @name ts5App.filter:index
 * @function
 * @description Gives a dynamic index, that does not change due to a search filter or orderBy event
 * # index
 * Filter in the ts5App.
 */
angular.module('ts5App')
  .filter('index', function() {
    return function(array, index) {
      if (!array) {
        return;
      }
      index = 'index';
      for (var i = 0; i < array.length; ++i) {
        array[i][index] = i;
      }
      return array;
    };
  });
