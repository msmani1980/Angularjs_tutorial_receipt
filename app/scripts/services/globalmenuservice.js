'use strict';

/**
 * @ngdoc service
 * @name ts5App.AuthService
 * @description
 * # AuthService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('GlobalMenuService', function ($localStorage) {

    function getCompany() {
      return $localStorage.company || 0;
    }

    return {
      company: {
        get: getCompany
      }
    };
  });
