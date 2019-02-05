'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationFactory
 * @description
 * # reconciliationFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('reconciliationFactory',
    function ($q, storeInstanceService, storesService, stationsService, reconciliationService, itemTypesService, recordsService, currenciesService, companyService, itemsService,
              promotionsService, companyPreferencesService, cashBagService, carrierInstancesService, menuService) {

      function getStoreStatusList(payload) {
        return recordsService.getStoreStatusList(payload);
      }

      function getReconciliationDataList(payload) {
        return storeInstanceService.getStoreInstancesList(payload);
      }

      function getPaymentReport(storeInstanceId, cashBagNumber) {
        return reconciliationService.getPaymentReport(storeInstanceId, cashBagNumber);
      }

      function getStoreInstanceItemList(storeInstanceId, payload) {
        return storeInstanceService.getStoreInstanceItemList(storeInstanceId, payload);
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

      function getCompanyGlobalCurrencies(payload) {
        return currenciesService.getCompanyGlobalCurrencies(payload);
      }

      function getCompany(companyId) {
        return companyService.getCompany(companyId);
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

      function getItem(itemId) {
        return itemsService.getItem(itemId);
      }

      function getMasterItem(itemId) {
        return itemsService.getMasterItem(itemId);
      }

      function getPromotion(promotionId) {
        return promotionsService.getPromotion(promotionId);
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

      function getCrewDiscountTotals(storeInstanceId) {
        return reconciliationService.getCrewDiscountTotals(storeInstanceId);
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

      var getCompanyPreferences = function (payload) {
        return companyPreferencesService.getCompanyPreferences(payload);
      };

      var getStockItemCounts = function (storeInstanceId) {
        return reconciliationService.getStockItemCounts({ storeInstanceId: storeInstanceId });
      };

      var saveStockItemsCounts = function (payload) {
        return reconciliationService.saveStockItemsCounts(payload);
      };

      var saveCashBagCurrency = function (currencyId, payload) {
        return cashBagService.updateCashBagCurrency(currencyId, payload);
      };

      var getCarrierInstanceList = function (storeInstanceId) {
        var payload = { storeInstanceId: storeInstanceId };
        return carrierInstancesService.getCarrierInstances(payload);
      };

      var getMenuList = function (payload) {
        var payloadToSend = payload || {};
        return menuService.getMenuList(payloadToSend, false);
      };

      var getCashBagVerifications = function (storeInstanceId) {
        var payload = { storeInstanceId: storeInstanceId };
        return cashBagService.getCashBagVerifications(payload);
      };

      var getCashBagManualData = function (manualDataType, payload) {
        if (manualDataType === 'cash') {
          return cashBagService.getAllManualCashList(payload);
        }

        return cashBagService.getManualCashBagList(manualDataType, payload);
      };

      return {
        getStoreInstanceDetails: getStoreInstanceDetails,
        getStoreInstanceItemList: getStoreInstanceItemList,
        getCountTypes: getCountTypes,
        getStockTotals: getStockTotals,
        getPromotionTotals: getPromotionTotals,
        getCrewDiscountTotals: getCrewDiscountTotals,
        getItemTypesList: getItemTypesList,
        getItem: getItem,
        getMasterItem: getMasterItem,
        getPromotion: getPromotion,
        getPaymentReport: getPaymentReport,
        getCHRevenue: getCHRevenue,
        getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
        getCompany: getCompany,
        getEPOSRevenue: getEPOSRevenue,
        getStoreStatusList: getStoreStatusList,
        getReconciliationDataList: getReconciliationDataList,
        getReconciliationPrecheckDevices: getReconciliationPrecheckDevices,
        getReconciliationPrecheckSchedules: getReconciliationPrecheckSchedules,
        getReconciliationPrecheckCashbags: getReconciliationPrecheckCashbags,
        getCompanyPreferences: getCompanyPreferences,
        getStockItemCounts: getStockItemCounts,
        saveStockItemsCounts: saveStockItemsCounts,
        saveCashBagCurrency: saveCashBagCurrency,
        getCarrierInstanceList: getCarrierInstanceList,
        getMenuList: getMenuList,
        getCashBagVerifications: getCashBagVerifications,
        getCashBagManualData: getCashBagManualData
      };
    });
