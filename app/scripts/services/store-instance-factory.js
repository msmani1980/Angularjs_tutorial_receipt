'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceFactory',
  function(storeInstanceService, catererStationService, schedulesService, carrierService, GlobalMenuService,
    menuMasterService, storesService, stationsService, itemsService, companyReasonCodesService, recordsService, $q, lodash, dateUtility) {

    function getCompanyId() {
      return GlobalMenuService.company.get();
    }

    function getItemsMasterList(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function getCatererStationList() {
      return catererStationService.getCatererStationList({
        limit: null
      });
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

    function getMenuMasterList(query) {
      return menuMasterService.getMenuMasterList(query);
    }

    function getStoresList(query) {
      return storesService.getStoresList(query);
    }

    function getStore(storeId) {
      return storesService.getStore(storeId);
    }

    function getStoreStatusList() {
      return recordsService.getStoreStatusList();
    }

    function getItemTypes() {
      return recordsService.getItemTypes();
    }

    function getCharacteristics() {
      return recordsService.getCharacteristics();
    }

    function getCountTypes() {
      return recordsService.getCountTypes();
    }

    function formatResponseCollection(responseCollection, storeInstanceAPIResponse, parentStoreInstanceAPIResponse) {
      var storeDetails = {};
      storeDetails.LMPStation = responseCollection[1].code;
      storeDetails.storeNumber = responseCollection[0].storeNumber;
      storeDetails.scheduleDate = dateUtility.formatDateForApp(storeInstanceAPIResponse.scheduleDate);
      storeDetails.scheduleNumber = storeInstanceAPIResponse.scheduleNumber;
      storeDetails.storeInstanceNumber = storeInstanceAPIResponse.id;
      storeDetails.statusList = responseCollection[2];
      storeDetails.menuList = [];
      storeDetails.tampered = storeInstanceAPIResponse.tampered;
      storeDetails.note = storeInstanceAPIResponse.note;
      storeDetails.storeId = storeInstanceAPIResponse.storeId;
      storeDetails.cateringStationId = storeInstanceAPIResponse.cateringStationId;

      if (parentStoreInstanceAPIResponse) {
        storeDetails.replenishStoreInstanceId = storeInstanceAPIResponse.replenishStoreInstanceId;
        storeDetails.parentStoreInstance = parentStoreInstanceAPIResponse;
      }

      if(storeInstanceAPIResponse.prevStoreInstanceId) {
        storeDetails.prevStoreInstanceId = storeInstanceAPIResponse.prevStoreInstanceId;
      }

      var storeMenus = (parentStoreInstanceAPIResponse ? angular.copy(parentStoreInstanceAPIResponse.menus) : angular
        .copy(storeInstanceAPIResponse.menus));
      angular.forEach(storeMenus, function(menu) {
        var menuObject = lodash.findWhere(responseCollection[3].companyMenuMasters, {
          id: menu.menuMasterId
        });
        if (angular.isDefined(menuObject)) {
          storeDetails.menuList.push(menuObject);
        }
      });

      storeDetails.currentStatus = lodash.findWhere(storeDetails.statusList, {
        id: storeInstanceAPIResponse.statusId
      });

      if (responseCollection.length > 4) {
        storeDetails.carrierNumber = responseCollection[4].carrierNumber;
      }
      return storeDetails;
    }

    function getDependenciesForStoreInstance(storeInstanceDataFromAPI, parentStoreInstanceDataFromAPI) {
      var responseData = angular.copy(storeInstanceDataFromAPI);
      var dependenciesArray = [];

      var storeId = (angular.isDefined(parentStoreInstanceDataFromAPI) ? angular.copy(parentStoreInstanceDataFromAPI.storeId) :
        responseData.storeId);
      dependenciesArray.push(getStore(storeId));
      dependenciesArray.push(getStation(responseData.cateringStationId));
      dependenciesArray.push(getStoreStatusList());
      dependenciesArray.push(getMenuMasterList());

      if (responseData.carrierId) {
        dependenciesArray.push(getCarrierNumber(getCompanyId(), responseData.carrierId));
      }

      return dependenciesArray;
    }

    function getRemainingDataForStoreDetails(storeDetailsDeferred, storeInstanceAPIResponse,
      parentStoreInstanceAPIResponse) {
      var storeDetailPromiseArray = getDependenciesForStoreInstance(storeInstanceAPIResponse,
        parentStoreInstanceAPIResponse);
      $q.all(storeDetailPromiseArray).then(function(responseCollection) {
        storeDetailsDeferred.resolve(formatResponseCollection(responseCollection, storeInstanceAPIResponse,
          parentStoreInstanceAPIResponse));
      });
    }

    function getParentStoreInstance(storeDetailsDeferred, storeInstanceAPIResponse) {
      getStoreInstance(storeInstanceAPIResponse.replenishStoreInstanceId).then(function(
        parentStoreInstanceAPIResponse) {
        getRemainingDataForStoreDetails(storeDetailsDeferred, storeInstanceAPIResponse,
          parentStoreInstanceAPIResponse);
      }, storeDetailsDeferred.reject);
      return storeDetailsDeferred.promise;
    }

    // TODO: refactor this! separate out getStoreDetailsForDispatch and getStoreDetailsForReplenish :D
    function getStoreDetails(storeId) {
      var getStoreDetailsDeferred = $q.defer();
      getStoreInstance(storeId).then(function(storeInstanceAPIResponse) {
        if (storeInstanceAPIResponse.replenishStoreInstanceId) {
          getParentStoreInstance(getStoreDetailsDeferred, storeInstanceAPIResponse);
        } else {
          getRemainingDataForStoreDetails(getStoreDetailsDeferred, storeInstanceAPIResponse);
        }
      }, getStoreDetailsDeferred.reject);
      return getStoreDetailsDeferred.promise;
    }

    function updateStoreInstanceStatus(storeId, statusId) {
      return storeInstanceService.updateStoreInstanceStatus(storeId, statusId);
    }

    function getReasonCodeList(payload) {
      return companyReasonCodesService.getAll(payload);
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
      getStoreDetails: getStoreDetails,
      getStoreStatusList: getStoreStatusList,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getItemTypes: getItemTypes,
      getCharacteristics: getCharacteristics,
      getReasonCodeList: getReasonCodeList,
      getCountTypes: getCountTypes
    };

  });
