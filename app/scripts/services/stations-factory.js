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

    // Global stations
    var getGlobalStationList = function(payload) {
      return stationsService.getGlobalStationList(payload);
    };

    // Stations
    var getStations = function(payload) {
      return stationsService.getStations(payload);
    };

    // Company stations
    var getStationList = function(offset, payload) {
      var companyId = globalMenuService.company.get();
      return stationsService.getStationList(companyId, offset, payload);
    };

    var getStationListWithUsageValidation = function(offset, payload) {
      var companyId = globalMenuService.company.get();
      return stationsService.getStationListWithUsageValidation(companyId, offset, payload);
    };

    var bulkUpdateStation = function(payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.bulkUpdateStation(companyId, payload);
    };

    var createStation = function (payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.createStation(companyId, payload);
    };

    var updateStation = function (id, payload) {
      var companyId = globalMenuService.company.get();

      return stationsService.updateStation(companyId, id, payload);
    };

    var removeStation = function (id) {
      var companyId = globalMenuService.company.get();

      return stationsService.removeStation(companyId, id);
    };

    var getCompanyStation = function(stationId) {
      var companyId = globalMenuService.company.get();
      return stationsService.getCompanyStation(companyId, stationId);
    };

    var getCompanyStationValidationDates = function(stationId) {
      var companyId = globalMenuService.company.get();
      return stationsService.getCompanyStationValidationDates(companyId, stationId);
    };

    return {
      getGlobalStationList: getGlobalStationList,
      getStations: getStations,
      getStationList: getStationList,
      getStationListWithUsageValidation: getStationListWithUsageValidation,
      getCompanyStation: getCompanyStation,
      createStation: createStation,
      updateStation: updateStation,
      removeStation: removeStation,
      bulkUpdateStation: bulkUpdateStation,
      getCompanyStationValidationDates: getCompanyStationValidationDates
    };
  });
