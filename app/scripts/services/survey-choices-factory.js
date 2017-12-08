'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyChoicesFactory
 * @description
 * # surveyChoicesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyChoicesFactory', function () {
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
