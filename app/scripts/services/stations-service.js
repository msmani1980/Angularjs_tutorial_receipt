'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App').service('stationsService', function ($resource, ENV, dateUtility, Upload) {

  var globalRequestURL = ENV.apiUrl + '/rsvr/api/company-station-globals';
  var stationListRequestURL = ENV.apiUrl + '/rsvr/api/companies/:id/stations/:stationId';
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
      },
      getCompanyStation: {
        method: 'GET'
      },
      removeStation: {
        method: 'DELETE'
      },
      bulkUpdateStation: {
        method: 'PUT'
      },
      createStation: {
        method: 'POST'
      },
      updateStation: {
        method: 'PUT'
      }
    };
  var globalRequestResource = $resource(globalRequestURL, null, actions);
  var stationListRequestResource = $resource(stationListRequestURL, stationListRequestParameters, actions);
  var stationRequestResource = $resource(stationRequestURL, stationRequestParameters, actions);

  // Global Station

  var getGlobalStationList = function (payload) {
    return globalRequestResource.getGlobalStationList(payload).$promise;
  };

  var getStation = function (stationId) {
    return stationRequestResource.getStation({ stationId: stationId }).$promise;
  };

  // Company Station

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

    if (customPayload) {
      angular.extend(customPayload, {
        id: companyId
      });
    }

    actions.getStationList.headers.companyId = companyId;
    return stationListRequestResource.getStationList(customPayload || payload).$promise;
  };

  var getCompanyStation = function (companyId, id) {
    return stationListRequestResource.getCompanyStation({ stationId: id, id: companyId }).$promise;
  };

  var bulkUpdateStation = function (companyId, payload) {
    payload.id = companyId;

    return stationListRequestResource.bulkUpdateStation(payload).$promise;
  };

  var createStation = function (companyId, payload) {
    payload.id = companyId;

    return stationListRequestResource.createStation(payload).$promise;
  };

  var updateStation = function (companyId, id, payload) {
    return stationListRequestResource.updateStation({ stationId: id, id: companyId }, payload).$promise;
  };

  var removeStation = function (companyId, id) {
    return stationListRequestResource.removeStation({ stationId: id, id: companyId }).$promise;
  };

  var importFromExcel = function (companyId, file) {
    var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/station';
    return Upload.upload({
      url: uploadRequestURL,
      file: file
    });
  };

  return {
    getGlobalStationList: getGlobalStationList,
    getStationList: getStationList,
    getStation: getStation,
    getCompanyStation: getCompanyStation,
    bulkUpdateStation: bulkUpdateStation,
    removeStation: removeStation,
    createStation: createStation,
    updateStation: updateStation,
    importFromExcel: importFromExcel
  };

});
