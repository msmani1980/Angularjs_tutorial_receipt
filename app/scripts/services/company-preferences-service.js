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
      getList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getList = function (payload) {
      return requestResource.getList(payload).$promise;
    };

    return {
      getList: getList
    };
  });
