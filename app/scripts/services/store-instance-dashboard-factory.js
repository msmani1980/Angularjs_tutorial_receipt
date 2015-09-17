'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDashboardFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceDashboardFactory',
  function (catererStationService, storeInstanceService, storesService) {

    function getCatererStationList() {
      return catererStationService.getCatererStationList({limit: null});
    }

    function getStoreInstanceList(payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    }

    function getStoresList(payload) {
      return storesService.getStoresList(payload);
    }

    return {
      getCatererStationList: getCatererStationList,
      getStoreInstanceList: getStoreInstanceList,
      getStoresList: getStoresList
    };

  });
