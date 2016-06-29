'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyFormatService
 * @description
 * # companyFormatService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyFormatService', function ($resource, ENV) {

    var companyFormatRequestURL = ENV.apiUrl + '/rsvr/api/company-formats/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getCompanyFormat: {
        method: 'GET'
      },
      createCompanyFormat: {
        method: 'POST'
      },
      updateCompanyFormat: {
        method: 'PUT'
      },
      deleteCompanyFormat: {
        method: 'DELETE'
      }
    };

    var companyFormatRequestResources = $resource(companyFormatRequestURL, requestParameters, actions);

    var getCompanyFormatList = function (payload) {
      requestParameters.id = '';
      var requestPayload = payload || {};
      return companyFormatRequestResources.getCompanyFormat(requestPayload).$promise;
    };

    var getCompanyFormat = function (id) {
      requestParameters.id = id;
      return companyFormatRequestResources.getCompanyFormat().$promise;
    };

    var createCompanyFormat = function (payload) {
      requestParameters.id = '';
      return companyFormatRequestResources.createCompanyFormat(payload).$promise;
    };

    var updateCompanyFormat = function (id, payload) {
      requestParameters.id = id;
      return companyFormatRequestResources.updateCompanyFormat(payload).$promise;
    };

    var deleteCompanyFormat = function (id) {
      requestParameters.id = id;
      return companyFormatRequestResources.deleteCompanyFormat().$promise;
    };

    return {
      getCompanyFormatList: getCompanyFormatList,
      getCompanyFormat: getCompanyFormat,
      createCompanyFormat: createCompanyFormat,
      updateCompanyFormat: updateCompanyFormat,
      deleteCompanyFormat: deleteCompanyFormat
    };

  });
