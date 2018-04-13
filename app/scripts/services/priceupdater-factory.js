'use strict';

/**
 * @ngdoc service
 * @name ts5App.priceupdaterFactory
 * @description
 * # priceupdaterFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('priceupdaterFactory', function () {
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
