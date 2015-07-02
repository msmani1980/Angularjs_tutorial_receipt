'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuFactory
 * @description
 * # menuFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
