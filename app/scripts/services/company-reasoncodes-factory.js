'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReasoncodesFactory
 * @description
 * # companyReasoncodesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyReasoncodesFactory', function () {
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
