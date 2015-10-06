'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceDashboardFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceDashboardFactory',
  function (catererStationService, stationsService, storeInstanceService, storesService, recordsService) {

    function getCatererStationList() {
      return catererStationService.getCatererStationList({limit: null});
    }

    function getStationList() {
      return stationsService.getGlobalStationList({limit: null});
    }

    function getStoreInstanceList(payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    }

    function getStoresList(payload) {
      return storesService.getStoresList(payload);
    }

    function getStatusList () {
      return recordsService.getStoreStatusList();
    }

    function getFeaturesList () {
      return recordsService.getFeatures();
    }

    function updateStoreInstanceStatus (storeId, statusId) {
      return storeInstanceService.updateStoreInstanceStatus(storeId, statusId);
    }

    return {
      getCatererStationList: getCatererStationList,
      getStationList: getStationList,
      getStoreInstanceList: getStoreInstanceList,
      getStoresList: getStoresList,
      getStatusList: getStatusList,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getFeaturesList: getFeaturesList
    };
  });
