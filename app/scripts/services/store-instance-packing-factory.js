 'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstancePackingFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstancePackingFactory',
  function(storeInstanceFactory, storeInstanceService, recordsService, companyReasonCodesService, itemsService, featureThresholdsService, companyPreferencesService) {

    function getStoreDetails (storeInstanceId) {
      return storeInstanceFactory.getStoreDetails(storeInstanceId);
    }

    function updateStoreInstanceStatus(storeInstanceId, statusNum, packingListSortOrderType) {
      return storeInstanceService.updateStoreInstanceStatus(storeInstanceId, statusNum, null, null, null, packingListSortOrderType);
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

    function createStoreInstanceItems(id, payload) {
      return storeInstanceService.createStoreInstanceItems(id, payload);
    }

    function updateStoreInstanceItems(id, payload) {
      return storeInstanceService.updateStoreInstanceItems(id, payload);
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

    function getThresholdList(featureCode) {
      return featureThresholdsService.getThresholdList(featureCode, {});
    }

    function getCompanyPreferences(payload, companyId) {
      return companyPreferencesService.getCompanyPreferences(payload, companyId);
    }

    function getCalculatedInboundQuantities(id, payload) {
      payload = payload || {};
      return storeInstanceService.getStoreInstanceCalculatedInbounds(id, payload);
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
      getItemsMasterList: getItemsMasterList,
      getThresholdList: getThresholdList,
      getCompanyPreferences: getCompanyPreferences,
      getCalculatedInboundQuantities: getCalculatedInboundQuantities,
      createStoreInstanceItems: createStoreInstanceItems,
      updateStoreInstanceItems: updateStoreInstanceItems
    };

  });
