'use strict';

/**
 * @ngdoc service
 * @name ts5App.currency
 * @description
 * # currency
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currency', function () {
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
