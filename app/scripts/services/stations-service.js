'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App').service('stationsService', function ($resource, ENV) {

    var globalRequestURL = ENV.apiUrl + '/api/company-station-globals';
    var stationListRequestURL = ENV.apiUrl + '/api/companies/:id/stations';
    var stationRequestURL = ENV.apiUrl + '/api/stations/:stationId';

    var stationListRequestParameters = {
      id: '@id'
    };

    var stationRequestParameters = {
      stationId: '@stationId'
    };

    var actions = {
      getGlobalStationList: {
        method: 'GET'
      },
      getStationList: {
        method: 'GET'
      },
      getStation: {
        method: 'GET'
      }
    };
    var globalRequestResource = $resource(globalRequestURL, null, actions);
    var stationListRequestResource = $resource(stationListRequestURL, stationListRequestParameters, actions);
    var stationRequestResource = $resource(stationRequestURL, stationRequestParameters, actions);

    var getGlobalStationList = function (payload) {
      return globalRequestResource.getGlobalStationList(payload).$promise;
    };


    var getStationList = function (companyId, offset) {
      var payload = {id: companyId};
      if (offset) {
        payload.offset = offset;
      }
      return stationListRequestResource.getStationList(payload).$promise;
    };

    var getStation = function (stationId) {
      return stationRequestResource.getStation({stationId: stationId}).$promise;
    };

    return {
      getGlobalStationList: getGlobalStationList,
      getStationList: getStationList,
      getStation: getStation
    };

  });
