'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDashboardFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceDashboardFactory',
  function (catererStationService, stationsService, storeInstanceService) {

    function getCatererStationList() {
      return catererStationService.getCatererStationList({limit: null});
    }

    function getStationList() {
      return stationsService.getGlobalStationList({limit: null});
    }

    function getStoreInstanceList(payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    }

    return {
      getCatererStationList: getCatererStationList,
      getStationList: getStationList,
      getStoreInstanceList: getStoreInstanceList
    };

  });
