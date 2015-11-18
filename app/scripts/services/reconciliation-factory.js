'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationFactory
 * @description
 * # reconciliationFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('reconciliationFactory', function ($q, storeInstanceService, storesService, stationsService, reconciliationService, itemTypesService, recordsService) {

    function getStoreStatusList(payload) {
      return recordsService.getStoreStatusList(payload);
    }

    function getReconciliationDataList(payload) {
      return storeInstanceService.getStoreInstancesList(payload);
    }

    function getStoreInstanceItemList(storeInstanceId) {
      return storeInstanceService.getStoreInstanceItemList(storeInstanceId);
    }

    function getCountTypes() {
      return recordsService.getCountTypes();
    }

    function getReconciliationPrecheckDevices(payload) {
      return reconciliationService.getReconciliationPrecheckDevices(payload);
    }

    function getReconciliationPrecheckSchedules(payload) {
      return reconciliationService.getReconciliationPrecheckSchedules(payload);
    }

    function getReconciliationPrecheckCashbags(payload) {
      return reconciliationService.getReconciliationPrecheckCashbags(payload);
    }

    function formatResponseCollection(responseCollection) {
      var storeDetails = angular.copy(responseCollection[0]);
      storeDetails.storeDetails = angular.copy(responseCollection[1]);
      storeDetails.warehouseDetails = angular.copy(responseCollection[2]);
      return storeDetails;
    }

    function getStoreData(storeInstanceDeferred, storeInstanceDataFromAPI) {
      var promiseArray = [
        storesService.getStore(storeInstanceDataFromAPI.storeId),
        stationsService.getStation(storeInstanceDataFromAPI.cateringStationId)
      ];
      $q.all(promiseArray).then(function (responseCollection) {
        responseCollection.unshift(storeInstanceDataFromAPI);
        storeInstanceDeferred.resolve(formatResponseCollection(responseCollection));
      }, storeInstanceDeferred.reject);
    }

    function getStoreInstanceDetails(storeInstanceId) {
      var storeInstanceDeferred = $q.defer();
      storeInstanceService.getStoreInstance(storeInstanceId).then(function (storeInstanceDataFromAPI) {
        getStoreData(storeInstanceDeferred, storeInstanceDataFromAPI);
      }, storeInstanceDeferred.reject);
      return storeInstanceDeferred.promise;
    }

    function getStockTotals(storeInstanceId) {
      return reconciliationService.getStockTotals(storeInstanceId);
    }

    function getPromotionTotals(storeInstanceId) {
      return reconciliationService.getPromotionTotals(storeInstanceId);
    }

    function getItemTypesList() {
      return itemTypesService.getItemTypesList();
    }

    function getCHRevenue(storeInstanceId) {
      var getCHRevenueDeferred = $q.defer();
      var promiseArray = [
        reconciliationService.getCHCashBagRevenue(storeInstanceId),
        reconciliationService.getCHCreditCardRevenue(storeInstanceId),
        reconciliationService.getCHDiscountRevenue(storeInstanceId)
      ];
      $q.all(promiseArray).then(getCHRevenueDeferred.resolve, getCHRevenueDeferred.reject);
      return getCHRevenueDeferred.promise;
    }

    function getEPOSRevenue(storeInstanceId) {
      var getEPOSRevenueDeferred = $q.defer();
      var promiseArray = [
        reconciliationService.getEPOSCashBagRevenue(storeInstanceId),
        reconciliationService.getEPOSCreditCardRevenue(storeInstanceId),
        reconciliationService.getEPOSDiscountRevenue(storeInstanceId)
      ];
      $q.all(promiseArray).then(getEPOSRevenueDeferred.resolve, getEPOSRevenueDeferred.reject);
      return getEPOSRevenueDeferred.promise;
    }

    var getCashBagMockData = function () {
      var mockCashBag = [{
        cashBag: 'CB123',
        currency: 'GBP',
        exchangeAmount: 12,
        crewAmount: 14,
        paperAmount: 34,
        coinAmount: 12.00,
        varianceValue: 5,
        bankExchangeRate: 7.0,
        totalBand: 100,
        isDiscrepancy: true
      }, {
        cashBag: 'CB345',
        currency: 'GBP',
        exchangeAmount: 15,
        crewAmount: 34,
        paperAmount: 23,
        coinAmount: 15.00,
        varianceValue: 12,
        bankExchangeRate: 16.0,
        totalBand: 200,
        isDiscrepancy: false
      }];

      var cashBagMockResponseDeferred = $q.defer();
      cashBagMockResponseDeferred.resolve(mockCashBag);
      return cashBagMockResponseDeferred.promise;
    };

    return {
      getStoreInstanceDetails: getStoreInstanceDetails,
      getStoreInstanceItemList: getStoreInstanceItemList,
      getCountTypes: getCountTypes,
      getStockTotals: getStockTotals,
      getPromotionTotals: getPromotionTotals,
      getItemTypesList: getItemTypesList,
      getCHRevenue: getCHRevenue,
      getEPOSRevenue: getEPOSRevenue,
      getStoreStatusList: getStoreStatusList,
      getReconciliationDataList: getReconciliationDataList,
      getReconciliationPrecheckDevices: getReconciliationPrecheckDevices,
      getReconciliationPrecheckSchedules: getReconciliationPrecheckSchedules,
      getReconciliationPrecheckCashbags: getReconciliationPrecheckCashbags,

      getCashBagMockData: getCashBagMockData
    };
  });
