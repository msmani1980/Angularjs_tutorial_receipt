'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('cashBagFactory',
  function (cashBagService, globalMenuService, stationsService, schedulesService, companyService, currenciesService, dailyExchangeRatesService, companyPreferencesService,
            companyStoresService, storeInstanceService) {
    var getCompanyId = function () {
      if (globalMenuService.getCompanyData().companyTypeName === 'Retail') {
        return globalMenuService.getCompanyData().id;
      } else {
        return globalMenuService.getCompanyData().chCompany.companyId;
      }
    };

    var getCashBagList = function (id, optionalPayload) {
      if (arguments.length > 1) {
        return cashBagService.getCashBagList(id, optionalPayload);
      } else {
        return cashBagService.getCashBagList(id);
      }
    };

    var getStoreList = function(payload, companyId) {
      return companyStoresService.getStoreList(payload, companyId);
    };

    function getStoreInstanceList(payload, companyId) {
      return storeInstanceService.getStoreInstancesList(payload, companyId);
    }

    function getStoreInstance(storeInstanceId) {
      return storeInstanceService.getStoreInstance(storeInstanceId, getCompanyId());
    }

    var getStationList = function (id) {
      return stationsService.getStationList(id);
    };

    var getCompanyGlobalCurrencies = function (payload) {
      return currenciesService.getCompanyGlobalCurrencies(payload);
    };

    var getSchedulesList = function (id) {
      return schedulesService.getSchedules(id);
    };

    var getSchedulesInDateRange = function(companyId, startDate, endDate) {
      return schedulesService.getSchedulesInDateRange(companyId, startDate, endDate);
    };

    var getDailySchedulesList = function (id, scheduleNumber, scheduleDate) {
      return schedulesService.getDailySchedules(id, scheduleNumber, scheduleDate);
    };

    var getCompany = function (id) {
      return companyService.getCompany(id);
    };

    var updateCashBag = function (id, payload, parameters) {
      return cashBagService.updateCashBag(id, payload, parameters);
    };

    var getCashBag = function (id) {
      return cashBagService.getCashBag(id);
    };

    var deleteCashBag = function (id) {
      return cashBagService.deleteCashBag(id);
    };

    var createCashBag = function (payload) {
      return cashBagService.createCashBag(payload);
    };

    var reallocateCashBag = function (cashBagId, storeInstanceId) {
      return cashBagService.reallocateCashBag(cashBagId, storeInstanceId);
    };

    var mergeCashBag = function (eposCashBag, manualCashBag) {
      return cashBagService.mergeCashBag(eposCashBag, manualCashBag);
    };

    var getCompanyCurrencies = function () {
      return currenciesService.getCompanyCurrencies();
    };

    var getDailyExchangeRates = function (id, cashierDate) {
      return dailyExchangeRatesService.getDailyExchangeRates(id, cashierDate);
    };

    var getDailyExchangeById = function (companyId, dailyExchangeRateId) {
      return dailyExchangeRatesService.getDailyExchangeById(companyId, dailyExchangeRateId);
    };

    var getCompanyPreferences = function (payload, companyId) {
      return companyPreferencesService.getCompanyPreferences(payload, companyId);
    };

    var verifyCashBag = function (cashBagId, type) {
      return cashBagService.verifyCashBag(cashBagId, type);
    };

    var unverifyCashBag = function (cashBagId, type) {
      return cashBagService.unverifyCashBag(cashBagId, type);
    };

    var editCashBagNumber = function (cashBagId, cashBagNumber) {
      return cashBagService.editCashBagNumber(cashBagId, cashBagNumber);
    };

    var overwriteCashBag = function (sourceId, destinationId) {
      return cashBagService.overwriteCashBag(sourceId, destinationId);
    };

    return {
      getCompanyId: getCompanyId,
      getCashBagList: getCashBagList,
      getStationList: getStationList,
      getCompany: getCompany,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag,
      deleteCashBag: deleteCashBag,
      createCashBag: createCashBag,
      reallocateCashBag: reallocateCashBag,
      mergeCashBag: mergeCashBag,
      getCompanyCurrencies: getCompanyCurrencies,
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getSchedulesList: getSchedulesList,
      getSchedulesInDateRange: getSchedulesInDateRange,
      getDailySchedulesList: getDailySchedulesList,
      getDailyExchangeRates: getDailyExchangeRates,
      getDailyExchangeById: getDailyExchangeById,
      getCompanyPreferences: getCompanyPreferences,
      getStoreList: getStoreList,
      getStoreInstanceList: getStoreInstanceList,
      getStoreInstance: getStoreInstance,
      verifyCashBag: verifyCashBag,
      unverifyCashBag: unverifyCashBag,
      editCashBagNumber: editCashBagNumber,
      overwriteCashBag: overwriteCashBag
    };
  });
