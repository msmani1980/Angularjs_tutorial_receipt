'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReceiptEmailFactory
 * @description
 * # companyReceiptEmailFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyReceiptEmailFactory', function () {
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
