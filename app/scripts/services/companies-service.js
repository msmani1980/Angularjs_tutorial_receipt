// TODO: Add delete method
'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesService
 * @description
 * # companiesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companiesService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/companies/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getCompaniesList: {
        method: 'GET'
      },
      getCompany: {
        method: 'GET'
      },
      createCompany: {
        method: 'POST'
      },
      updateCompany: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompaniesList = function (payload) {
      return requestResource.getCompaniesList(payload).$promise;
    };

    var getCompany = function (id) {
      return requestResource.getCompany({id: id}).$promise;
    };

    var createCompany = function (payload) {
      return requestResource.createCompany(payload).$promise;
    };

    var updateCompany = function (payload) {
      return requestResource.updateCompany(payload).$promise;
    };

    return {
      getCompaniesList: getCompaniesList,
      getCompany: getCompany,
      createCompany:createCompany,
      updateCompany: updateCompany
    };

});
