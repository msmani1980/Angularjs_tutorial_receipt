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

    function getCompanyData() {
      return $localStorage.companyObject || {};
    }

    function getCompany() {
      return getCompanyData().companyId || 0;
    }

    return {
      getCompanyData: getCompanyData,
      company: {
        get: getCompany
      }
    };
  });
