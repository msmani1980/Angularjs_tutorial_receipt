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

    var getCompanyList = function (payload) {
      return companyService.getCompanyList(payload);
    };

    var getCompanyRelationshipListByCompany = function (id) {
      return companyRelationshipService.getCompanyRelationshipListByCompany(id);
    };

    var getCompanyRelationshipTypeList = function (type) {
      return companyRelationshipService.getCompanyRelationshipTypeList(type);
    };

    var createCompanyRelationship = function (payload) {
      return companyRelationshipService.createCompanyRelationship(payload);
    };

    var updateCompanyRelationship = function (payload) {
      return companyRelationshipService.updateCompanyRelationship(payload);
    };

    return {
      getCompanyList: getCompanyList,
      getCompanyRelationshipListByCompany: getCompanyRelationshipListByCompany,
      getCompanyRelationshipTypeList: getCompanyRelationshipTypeList,
      createCompanyRelationship: createCompanyRelationship,
      updateCompanyRelationship: updateCompanyRelationship
    };

  });
