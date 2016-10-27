'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceFactory
 * @description
 * # storeInstanceFactory
 * Service in the ts5App.
 */
angular.module('ts5App').service('storeInstanceFactory',
  function(storeInstanceService, catererStationService, schedulesService, carrierService, globalMenuService, menuMasterService,
           storesService, stationsService, itemsService, companyReasonCodesService, recordsService, storeInstanceValidationService,
           featureThresholdsService, $q, lodash, dateUtility) {

    function getCompanyId() {
      return globalMenuService.company.get();
    }

    function getItemsMasterList(payload) {
      return itemsService.getItemsList(payload, true);
    }

    function getCatererStationList(optionalPayload) {
      var payload = optionalPayload || {};
      payload.limit = null;
      return catererStationService.getCatererStationList(payload);
    }

    function getStation(catererStationId) {
      return stationsService.getStation(catererStationId);
    }

    function getSchedules(companyId) {
      return schedulesService.getSchedules(companyId);
    }

    function getCarrierNumbers(companyId, carrierTypeId, optionalPayload) {
      var payload = optionalPayload || {};
      return carrierService.getCarrierNumbers(companyId, carrierTypeId, payload);
    }

    function getCarrierNumber(companyId, carrierNumberId) {
      return carrierService.getCarrierNumber(companyId, carrierNumberId);
    }

    function getAllCarrierNumbers(companyId, optionalPayload) {
      var payload = optionalPayload || {};
      return getCarrierNumbers(companyId, 0, payload);
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

    function getCountTypes() {
      return recordsService.getCountTypes();
    }

    function setCarrierInstanceAndInboundStation (responseCollection, storeDetailsToSet) {
      if (responseCollection.length <= 4) {
        storeDetailsToSet.inboundLMPStation = '';
        storeDetailsToSet.carrierNumber = '';
        return;
      }

      if (responseCollection.length === 6) {
        storeDetailsToSet.carrierNumber = responseCollection[4].carrierNumber;
        storeDetailsToSet.inboundLMPStation = responseCollection[5].code;

      }

      if (responseCollection.length === 5 && angular.isDefined(responseCollection[4].carrierNumber)) {
        storeDetailsToSet.inboundLMPStation = '';
        storeDetailsToSet.carrierNumber = responseCollection[4].carrierNumber;
      } else if (responseCollection.length === 5 && angular.isDefined(responseCollection[4].code)) {
        storeDetailsToSet.inboundLMPStation = responseCollection[4].code;
        storeDetailsToSet.carrierNumber = '';
      }
    }

    function formatResponseCollection(responseCollection, storeInstanceAPIResponse, parentStoreInstanceAPIResponse) {
      var storeDetails = {};
      storeDetails.LMPStation = responseCollection[1].code;
      storeDetails.displayLMPStation = storeDetails.LMPStation;
      storeDetails.storeNumber = responseCollection[0].storeNumber;
      storeDetails.scheduleDate = dateUtility.formatDateForApp(storeInstanceAPIResponse.scheduleDate);
      storeDetails.scheduleNumber = storeInstanceAPIResponse.scheduleNumber;
      storeDetails.scheduleId = storeInstanceAPIResponse.scheduleId;
      storeDetails.storeInstanceNumber = storeInstanceAPIResponse.id;
      storeDetails.c208SerialNo = storeInstanceAPIResponse.c208SerialNo;
      storeDetails.canisterQty = storeInstanceAPIResponse.canisterQty;
      storeDetails.cartQty = storeInstanceAPIResponse.cartQty;
      storeDetails.statusList = responseCollection[2];
      storeDetails.menuList = [];
      storeDetails.tampered = storeInstanceAPIResponse.tampered;
      storeDetails.note = storeInstanceAPIResponse.note;
      storeDetails.storeId = storeInstanceAPIResponse.storeId;
      storeDetails.cateringStationId = storeInstanceAPIResponse.cateringStationId;
      storeDetails.carrierId = storeInstanceAPIResponse.carrierId;

      if (parentStoreInstanceAPIResponse) {
        storeDetails.replenishStoreInstanceId = storeInstanceAPIResponse.replenishStoreInstanceId;
        storeDetails.parentStoreInstance = parentStoreInstanceAPIResponse;
      }

      if (storeInstanceAPIResponse.prevStoreInstanceId) {
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

      setCarrierInstanceAndInboundStation(responseCollection, storeDetails);
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

      if (responseData.inboundStationId) {
        dependenciesArray.push(getStation(responseData.inboundStationId));
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

    function updateStoreInstanceStatus(storeId, statusId, isManual) {
      isManual = !!isManual || false;
      return storeInstanceService.updateStoreInstanceStatus(storeId, statusId, undefined, isManual);
    }

    function getReasonCodeList(payload) {
      return companyReasonCodesService.getAll(payload);
    }

    function validateStoreInstance(payload) {
      return storeInstanceValidationService.validateStoreInstance(payload);
    }

    function updateStoreInstanceStatusForceReconcile(storeId, statusId) {
      return storeInstanceService.updateStoreInstanceStatusForceReconcile(storeId, statusId, undefined, true, true);
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
      updateStoreInstanceItem: updateStoreInstanceItem,
      updateStoreInstanceItemsBulk: updateStoreInstanceItemsBulk,
      deleteStoreInstanceItem: deleteStoreInstanceItem,
      getMenuMasterList: getMenuMasterList,
      getStoresList: getStoresList,
      getStore: getStore,
      getStoreDetails: getStoreDetails,
      getStoreStatusList: getStoreStatusList,
      updateStoreInstanceStatus: updateStoreInstanceStatus,
      getReasonCodeList: getReasonCodeList,
      getCountTypes: getCountTypes,
      validateStoreInstance: validateStoreInstance,
      updateStoreInstanceStatusForceReconcile: updateStoreInstanceStatusForceReconcile
    };

  });
