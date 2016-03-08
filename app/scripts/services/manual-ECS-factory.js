'use strict';

/**
 * @ngdoc service
 * @name ts5App.manualECSFactory
 * @description
 * # exciseDutyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('manualECSFactory', function (catererStationService, storeInstanceService, carrierInstancesService) {

    var getCarrierInstanceList = function (payload) {
      return carrierInstancesService.getCarrierInstances(payload);
    };

    var updateCarrierInstance = function (id, payload) {
      return carrierInstancesService.updateCarrierInstance(id, payload);
    };

    var getCatererStationList = function (payload) {
      return catererStationService.getCatererStationList(payload);
    };

    var getStoreInstanceList = function (payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    };

    return {
      getCarrierInstanceList: getCarrierInstanceList,
      updateCarrierInstance: updateCarrierInstance,
      getCatererStationList: getCatererStationList,
      getStoreInstanceList: getStoreInstanceList
    };
  });
