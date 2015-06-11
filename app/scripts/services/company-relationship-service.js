// TODO: Complete
'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyRelationshipService
 * @description
 * # companyRelationshipService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyRelationshipService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/companies/:id/relationships';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyRelationshipList: {
        method: 'GET',
        //transformResponse: function (data/*, headers*/) {
        //  data = angular.fromJson(data);
        //  data.companyRelationships.forEach(function (company) {
        //  });
        //
        //  return data;
        //}
      }/*,
      getCompanyRelationship: {
        method: 'GET'
      },
      createCompanyRelationship: {
        method: 'POST'
      },
      updateCompanyRelationship: {
        method: 'PUT'
      }*/
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyRelationshipList = function (id) {
      return requestResource.getCompanyRelationshipList({id: id}).$promise;
    };

    //var getCompany = function (id) {
    //  return requestResource.getCompany({id: id}).$promise;
    //};
    //
    //var createCompany = function (payload) {
    //  return requestResource.createCompany(payload).$promise;
    //};
    //
    //var updateCompany = function (payload) {
    //  return requestResource.updateCompany(payload).$promise;
    //};

    return {
      getCompanyRelationshipList: getCompanyRelationshipList/*,
      createCompanyRelationship: createCompanyRelationship,
      updateCompanyRelationship: updateCompanyRelationship*/
    };
  });
