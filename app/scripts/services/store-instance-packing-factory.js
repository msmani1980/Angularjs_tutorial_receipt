'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstancePackingFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstancePackingFactory',
  function(storeInstanceFactory, storeInstanceService, recordsService, companyReasonCodesService, itemsService) {

    function getStoreDetails (storeInstanceId) {
      return storeInstanceFactory.getStoreDetails(storeInstanceId);
    }

    function updateStoreInstanceStatus(storeInstanceId, statusNum) {
      return storeInstanceService.updateStoreInstanceStatus(storeInstanceId, statusNum);
    }

    function getItemTypes () {
      return recordsService.getItemTypes();
    }

    function getCharacteristics () {
      return recordsService.getCharacteristics();
    }

    function getReasonCodeList (payload) {
      return companyReasonCodesService.getAll(payload);
    }

    function getCountTypes () {
      return recordsService.getCountTypes();
    }

    function createStoreInstanceItem(id, payload) {
      return storeInstanceService.createStoreInstanceItem(id, payload);
    }

    function updateStoreInstanceItem(id, itemId, payload) {
      return storeInstanceService.updateStoreInstanceItem(id, itemId, payload);
    }

    function updateStoreInstanceItemsBulk(id, payload) {
      return storeInstanceService.updateStoreInstanceItemsBulk(id, payload);
    }

    function deleteStoreInstanceItem(id, itemId) {
      return storeInstanceService.deleteStoreInstanceItem(id, itemId);
    }

    function getStoreInstanceMenuItems(id, payload) {
      return storeInstanceService.getStoreInstanceMenuItems(id, payload);
    }

    function getStoreInstanceItemList(id, payload) {
      return storeInstanceService.getStoreInstanceItemList(id, payload);
    }

    function getItemsMasterList(payload) {
      return itemsService.getItemsList(payload, true);
    }


    return {
      getStoreDetails: getStoreDetails,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics,
      getReasonCodeList: getReasonCodeList,
      getCountTypes: getCountTypes,
      createStoreInstanceItem: createStoreInstanceItem,
      updateStoreInstanceItem: updateStoreInstanceItem,
      updateStoreInstanceItemsBulk: updateStoreInstanceItemsBulk,
      deleteStoreInstanceItem: deleteStoreInstanceItem,
      getStoreInstanceMenuItems: getStoreInstanceMenuItems,
      getStoreInstanceItemList: getStoreInstanceItemList,
      getItemsMasterList: getItemsMasterList
    };

  });
