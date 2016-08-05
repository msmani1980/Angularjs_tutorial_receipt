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
    var requestURL = ENV.apiUrl + '/rsvr/api/company-preferences/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyPreferences: {
        method: 'GET',
        headers: {}
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyPreferences = function (payload, companyId) {
      if (companyId) {
        actions.getCompanyPreferences.headers.companyId = companyId;
      }

      if (payload && angular.isDefined(payload.date)) {
        payload.startDate = payload.date;
        delete payload.date;
      }

      return requestResource.getCompanyPreferences(payload).$promise;
    };

    return {
      getCompanyPreferences: getCompanyPreferences
    };
  });
