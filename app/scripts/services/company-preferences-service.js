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
    var createOrUpdateRequestURL = ENV.apiUrl + '/rsvr/api/company-preferences/create-or-update';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyPreferences: {
        method: 'GET',
        headers: {}
      }
    };

    var createOrUpdateAction = {
      createOrUpdateCompanyPreference: {
        method: 'POST',
        headers: {}
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var createOrUpdateRequestResource = $resource(createOrUpdateRequestURL, requestParameters, createOrUpdateAction);

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

    var createOrUpdateCompanyPreference = function (payload, companyId) {
      if (companyId) {
        createOrUpdateAction.createOrUpdateCompanyPreference.headers.companyId = companyId;
      }

      return createOrUpdateRequestResource.createOrUpdateCompanyPreference(payload).$promise;
    };

    return {
      getCompanyPreferences: getCompanyPreferences,
      createOrUpdateCompanyPreference: createOrUpdateCompanyPreference
    };
  });
