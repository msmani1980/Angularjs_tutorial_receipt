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
    var requestURL = ENV.apiUrl + 'api/companies/403/company-credit-card-types';
    var requestParameters = {
      limit: 50
    };

    var actions = {
      getCCtypes: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCCtypes() {
      return requestResource.getCCtypes().$promise;
    }

    return {
      getCCtypes: getCCtypes
    }
  });
