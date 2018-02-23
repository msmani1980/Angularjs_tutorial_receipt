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
    var getStationsList = function() {
      var companyId = globalMenuService.company.get();
      return stationsService.getGlobalStationList();
    };

    return {
      getStationsList: getStationsList
    };
  });
