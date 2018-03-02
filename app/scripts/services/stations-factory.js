'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsFactory
 * @description
 * # stationsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('stationsFactory', function (stationsService, globalMenuService) {
    var getGlobalStationList = function() {
      return stationsService.getGlobalStationList();
    };

    var getStationList = function(offset, payload) {
      var companyId = globalMenuService.company.get();
      return stationsService.getStationList(companyId, offset, payload);
    };

    var bulkUpdateStation = function(payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.bulkUpdateStation(companyId, payload);
    };

    var createStation = function (payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.createStation(companyId, payload);
    };

    var updateStation = function (payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.updateStation(companyId, payload);
    };

    var removeStation = function (id) {
      var companyId = globalMenuService.company.get();

      return stationsService.removeStation(companyId, id);
    };

    var getCompanyStation = function(stationId) {
      var companyId = globalMenuService.company.get();
      return stationsService.getCompanyStation(companyId, stationId);
    };

    return {
      getGlobalStationList: getGlobalStationList,
      getStationList: getStationList,
      getCompanyStation: getCompanyStation,
      createStation: createStation,
      updateStation: updateStation,
      removeStation: removeStation,
      bulkUpdateStation: bulkUpdateStation
    };
  });
