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

    var globalRequestURL = ENV.apiUrl + '/api/company-station-globals';
    var stationRequestURL = ENV.apiUrl + '/api/companies/:id/stations';

    var stationRequestParameters = {
      id: '@id'
    };

    var globalActions = {
      getGlobalStationList: {
        method: 'GET'
      }
    };
    var stationActions = {
      getStationList: {
        method: 'GET'
      }
    };
    var globalRequestResource = $resource(globalRequestURL, null, globalActions);
    var stationRequestResource = $resource(stationRequestURL, stationRequestParameters, stationActions);

    var getGlobalStationList = function (payload) {
      return globalRequestResource.getGlobalStationList(payload).$promise;
    };

    var getStationList = function (companyId, offset) {
      var payload = {id:companyId};
      if(offset) {
        payload.offset = offset;
      }
      return stationRequestResource.getStationList(payload).$promise;
    };

    return {
      getGlobalStationList: getGlobalStationList,
      getStationList: getStationList
    };

});
