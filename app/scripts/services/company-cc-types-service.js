'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyCcTypesService
 * @description
 * # companyCcTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyCcTypesService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/companies/:companyId/company-credit-card-types';
    var requestParameters = {};

    var actions = {
      getCCtypes: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCCtypes(companyId) {
      return requestResource.getCCtypes({companyId:companyId}).$promise;
    }

    return {
      getCCtypes: getCCtypes
    };
  });
