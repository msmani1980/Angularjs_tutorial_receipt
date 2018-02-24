'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App').service('stationsService', function ($resource, ENV, dateUtility) {

  var globalRequestURL = ENV.apiUrl + '/rsvr/api/company-station-globals';
  var stationListRequestURL = ENV.apiUrl + '/rsvr/api/companies/:id/stations';
  var stationRequestURL = ENV.apiUrl + '/rsvr/api/stations/:stationId';

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
        method: 'GET',
        headers: {}
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

  var getStationList = function (companyId, offset, customPayload) {
      var nowDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      var payload = {
        id: companyId,
        startDate: nowDate,
        endDate: nowDate
      };
      if (offset) {
        payload.offset = offset;
      }

      actions.getStationList.headers.companyId = companyId;
      return stationListRequestResource.getStationList(customPayload || payload).$promise;
    };

  var getStation = function (stationId) {
      return stationRequestResource.getStation({ stationId: stationId }).$promise;
    };

  return {
      getGlobalStationList: getGlobalStationList,
      getStationList: getStationList,
      getStation: getStation
    };

});
