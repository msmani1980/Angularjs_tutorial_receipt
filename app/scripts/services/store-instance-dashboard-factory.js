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
      return catererStationService.getCatererStationList({ limit: null });
    }

    function getStationList() {
      return stationsService.getGlobalStationList({ limit: null });
    }

    function getStoreInstanceList(payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    }

    function getStoreInstance(id) {
      return storeInstanceService.getStoreInstance(id);
    }

    function deleteStoreInstance(id) {
      return storeInstanceService.deleteStoreInstance(id);
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

    function updateStoreInstanceStatusUnreceive (storeId, statusId) {
      return storeInstanceService.updateStoreInstanceStatusUnreceive(storeId, statusId);
    }

    function updateStoreInstanceStatusUndispatch (storeId, statusId, undispatch) {
      return storeInstanceService.updateStoreInstanceStatusUndispatch(storeId, statusId, undispatch);
    }

    return {
      getCatererStationList: getCatererStationList,
      getStationList: getStationList,
      getStoreInstanceList: getStoreInstanceList,
      getStoreInstance: getStoreInstance,
      deleteStoreInstance: deleteStoreInstance,
      getStoresList: getStoresList,
      getStatusList: getStatusList,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getFeaturesList: getFeaturesList,
      updateStoreInstanceStatusUndispatch: updateStoreInstanceStatusUndispatch,
      updateStoreInstanceStatusUnreceive: updateStoreInstanceStatusUnreceive
    };
  });
