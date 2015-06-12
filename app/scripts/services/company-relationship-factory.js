// TODO:
// Add CRUD methods for items
// Write tests for this factory

'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyRelationshipFactory
 * @description
 * # companyRelationshipFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyRelationshipFactory', function ($resource, ENV, companyRelationshipService, companyService) {

    var getCompany = function (id) {
      return companyService.getCompany(id);
    };

    var getCompanyRelationshipListByCompany = function (id) {
      return companyRelationshipService.getCompanyRelationshipListByCompany(id);
    };

    var getCompanyRelationshipTypeList = function (type) {
      return companyRelationshipService.getCompanyRelationshipTypeList(type);
    };

    return {
      getCompany: getCompany,
      getCompanyRelationshipListByCompany: getCompanyRelationshipListByCompany,
      getCompanyRelationshipTypeList: getCompanyRelationshipTypeList
    };

  });
