//TODO: Write tests

'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyFactory
 * @description
 * # companyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyFactory', ['companyService', function (companyService) {
    var getCompany = function (id) {
      return companyService.getCompany(id);
    };

    var getCompanyList = function (payload) {
      return companyService.getCompanyList(payload);
    };

    return {
      getCompany: getCompany,
      getCompanyList: getCompanyList
    };

  }]);
