'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyPreferencesService
 * @description
 * # companyPreferences
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyPreferencesService', function ($http, $resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/company-preferences/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyPreferences: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyPreferences = function (payload) {
      return requestResource.getCompanyPreferences(payload).$promise;
    };

    return {
      getCompanyPreferences: getCompanyPreferences
    };
  });
