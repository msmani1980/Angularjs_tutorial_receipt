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

    var removeStation = function (id) {
      var companyId = globalMenuService.company.get();

      return stationsService.removeStation(companyId, id);
    };

    return {
      getGlobalStationList: getGlobalStationList,
      getStationList: getStationList,
      removeStation: removeStation,
      bulkUpdateStation: bulkUpdateStation
    };
  });
