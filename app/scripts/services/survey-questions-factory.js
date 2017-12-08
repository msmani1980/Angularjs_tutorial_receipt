'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyQuestionsFactory
 * @description
 * # surveyQuestionsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyQuestionsFactory', function () {
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
