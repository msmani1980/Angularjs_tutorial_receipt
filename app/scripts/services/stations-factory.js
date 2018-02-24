'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsFactory
 * @description
 * # stationsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('stationsFactory', function (stationsService) {
    var getGlobalStationList = function() {
      return stationsService.getGlobalStationList();
    };

    return {
      getGlobalStationList: getGlobalStationList
    };
  });
