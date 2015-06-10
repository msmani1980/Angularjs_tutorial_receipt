'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stationsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/company-station-globals';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getGlobalStationList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getGlobalStationList = function (payload) {
      return requestResource.getGlobalStationList(payload).$promise;
    };

    return {
      getGlobalStationList: getGlobalStationList
    };

});
