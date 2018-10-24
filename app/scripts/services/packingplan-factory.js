'use strict';

/**
 * @ngdoc service
 * @name ts5App.packingplanFactory
 * @description
 * # packingplanFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('packingplanFactory', function () {
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
