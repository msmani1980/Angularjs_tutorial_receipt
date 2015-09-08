'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceFactory',
  function (storeInstanceService, catererStationService, schedulesService, carrierService, GlobalMenuService,
            menuMasterService, storesService, stationsService, itemsService, $q) {

    function getCompanyId() {
      return GlobalMenuService.company.get();
    }

    function getItemsMasterList(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function getCatererStationList() {
      return catererStationService.getCatererStationList({limit: null});
    }

    function getStation(catererStationId) {
      return stationsService.getStation(catererStationId);
    }

    function getSchedules(companyId) {
      return schedulesService.getSchedules(companyId);
    }

    function getCarrierNumbers(companyId, carrierTypeId) {
      return carrierService.getCarrierNumbers(companyId, carrierTypeId);
    }

    function getCarrierNumber(companyId, carrierNumberId) {
      return carrierService.getCarrierNumber(companyId, carrierNumberId);
    }

    function getAllCarrierNumbers(companyId) {
      return getCarrierNumbers(companyId, 0);
    }

    function getStoreInstancesList(query) {
      return storeInstanceService.getStoreInstancesList(query);
    }

    function getStoreInstance(id) {
      return storeInstanceService.getStoreInstance(id);
    }

    function createStoreInstance(payload) {
      return storeInstanceService.createStoreInstance(payload);
    }

    function updateStoreInstance(id, payload) {
      return storeInstanceService.updateStoreInstance(id, payload);
    }

    function deleteStoreInstance(id) {
      return storeInstanceService.deleteStoreInstance(id);
    }

    function getStoreInstanceMenuItems(id, payload) {
      return storeInstanceService.getStoreInstanceMenuItems(id, payload);
    }

    function getStoreInstanceItemList(id, payload) {
      return storeInstanceService.getStoreInstanceItemList(id, payload);
    }

    function getStoreInstanceItem(id, itemId) {
      return storeInstanceService.getStoreInstanceItem(id, itemId);
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

    function getMenuMasterList() {
      return menuMasterService.getMenuMasterList();
    }

    function getStoresList(query) {
      return storesService.getStoresList(query);
    }

    function getStore(storeId) {
      return storesService.getStore(storeId);
    }

    function getDependenciesForStoreInstance(dataFromAPI) {
      var responseData = angular.copy(dataFromAPI);
      var dependenciesArray = [];

      dependenciesArray.push(getStore(responseData.storeId));
      dependenciesArray.push(getStation(responseData.cateringStationId));

      if (responseData.carrierId) {
        dependenciesArray.push(getCarrierNumber(getCompanyId(), responseData.carrierId));
      }

      return dependenciesArray;
    }

    function formatResponseCollection(responseCollection, dataFromAPI) {
      var storeDetails = {};
      storeDetails.LMPStation = responseCollection[1].code;
      storeDetails.storeNumber = responseCollection[0].storeNumber;
      storeDetails.scheduleDate = dataFromAPI.scheduleDate;
      storeDetails.scheduleNumber = dataFromAPI.scheduleNumber;
      storeDetails.storeInstanceNumber = dataFromAPI.id;
      if(responseCollection.length > 2) {
        storeDetails.carrierNumber = responseCollection[2].carrierNumber;
      }
      return storeDetails;
    }

    function getStoreDetails(storeId) {
      var getStoreDetailsDeferred = $q.defer();

      getStoreInstance(storeId).then(function (dataFromAPI) {
        var storeDetailPromiseArray = getDependenciesForStoreInstance(dataFromAPI);
        $q.all(storeDetailPromiseArray).then(function (responseCollection) {
          getStoreDetailsDeferred.resolve(formatResponseCollection(responseCollection, dataFromAPI));
        });
      });

      return getStoreDetailsDeferred.promise;
    }

    return {
      getCompanyId: getCompanyId,
      getItemsMasterList: getItemsMasterList,
      getCatererStationList: getCatererStationList,
      getStation: getStation,
      getSchedules: getSchedules,
      getCarrierNumbers: getCarrierNumbers,
      getCarrierNumber: getCarrierNumber,
      getAllCarrierNumbers: getAllCarrierNumbers,
      getStoreInstancesList: getStoreInstancesList,
      getStoreInstance: getStoreInstance,
      createStoreInstance: createStoreInstance,
      updateStoreInstance: updateStoreInstance,
      deleteStoreInstance: deleteStoreInstance,
      getStoreInstanceMenuItems: getStoreInstanceMenuItems,
      getStoreInstanceItemList: getStoreInstanceItemList,
      getStoreInstanceItem: getStoreInstanceItem,
      createStoreInstanceItem: createStoreInstanceItem,
      updateStoreInstanceItem: updateStoreInstanceItem,
      updateStoreInstanceItemsBulk: updateStoreInstanceItemsBulk,
      deleteStoreInstanceItem: deleteStoreInstanceItem,
      getMenuMasterList: getMenuMasterList,
      getStoresList: getStoresList,
      getStore: getStore,
      getStoreDetails: getStoreDetails
    };

  });
