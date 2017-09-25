'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuAssignmentFactory
 * @description
 * # menuAssignmentFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('menuAssignmentFactory', function () {
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
