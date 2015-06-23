'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeComissionFactory
 * @description
 * # employeeComissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeComissionFactory', function () {
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
