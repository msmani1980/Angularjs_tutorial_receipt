'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($resource, currenciesService, dailyExchangeRatesService, companyExchangeRateService, companyService, companyPreferencesService, featureThresholdsService, recordsService) {

    var getCompany = function (companyId) {
      return companyService.getCompany(companyId);
    };

    var getCompanyGlobalCurrencies = function (payload) {
      return currenciesService.getCompanyGlobalCurrencies(payload);
    };

    var getPreviousExchangeRates = function (companyId, cashierDate) {
      return dailyExchangeRatesService.getPreviousExchangeRates(companyId, cashierDate);
    };

    var getDailyExchangeRates = function (companyId, cashierDate) {
      return dailyExchangeRatesService.getDailyExchangeRates(companyId, cashierDate);
    };

    var getCompanyCurrencies = function (payload) {
      return currenciesService.getCompanyCurrencies(payload);
    };

    var getDetailedCompanyCurrencies = function (payload) {
      return currenciesService.getDetailedCompanyCurrencies(payload);
    };

    var deleteDetailedCompanyCurrency = function (currencyId) {
      return currenciesService.deleteDetailedCompanyCurrency(currencyId);
    };

    var createDetailedCompanyCurrency = function (payload) {
      return currenciesService.createDetailedCompanyCurrency(payload);
    };

    var updateDetailedCompanyCurrency = function (payload) {
      return currenciesService.updateDetailedCompanyCurrency(payload);
    };

    var saveDailyExchangeRates = function (payload) {
      return dailyExchangeRatesService.saveDailyExchangeRates(payload);
    };

    var getCompanyPreferences = function (payload, companyId) {
      return companyPreferencesService.getCompanyPreferences(payload, companyId);
    };

    var getCompanyExchangeRates = function (payload) {
      return companyExchangeRateService.getCompanyExchangeRates(payload);
    };

    var deleteCompanyExchangeRate = function (currencyId) {
      return companyExchangeRateService.deleteCompanyExchangeRate(currencyId);
    };

    var createCompanyExchangeRate = function (payload) {
      return companyExchangeRateService.createCompanyExchangeRate(payload);
    };

    var updateCompanyExchangeRate = function (payload) {
      return companyExchangeRateService.updateCompanyExchangeRate(payload);
    };

    var getDailyExchangeRatesForCmp = function (companyId, retailCompanyId, exchangeRateDate) {
      return dailyExchangeRatesService.getDailyExchangeRatesForCmp(companyId, retailCompanyId, exchangeRateDate);
    };

    var getExchangeRateThresholdList = function (payload) {
      return featureThresholdsService.getThresholdList('DAILYEXCHANGERATE', payload);
    };

    var getExchangeRateTypes = function () {
      return recordsService.getExchangeRateTypes();
    };

    return {
      getCompany: getCompany,
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getCompanyCurrencies: getCompanyCurrencies,
      getDetailedCompanyCurrencies: getDetailedCompanyCurrencies,
      deleteDetailedCompanyCurrency: deleteDetailedCompanyCurrency,
      createDetailedCompanyCurrency: createDetailedCompanyCurrency,
      updateDetailedCompanyCurrency: updateDetailedCompanyCurrency,
      getDailyExchangeRates: getDailyExchangeRates,
      getPreviousExchangeRates: getPreviousExchangeRates,
      saveDailyExchangeRates: saveDailyExchangeRates,
      getCompanyPreferences: getCompanyPreferences,
      getCompanyExchangeRates: getCompanyExchangeRates,
      deleteCompanyExchangeRate: deleteCompanyExchangeRate,
      createCompanyExchangeRate: createCompanyExchangeRate,
      updateCompanyExchangeRate: updateCompanyExchangeRate,
      getDailyExchangeRatesForCmp: getDailyExchangeRatesForCmp,
      getExchangeRateThresholdList: getExchangeRateThresholdList,
      getExchangeRateTypes: getExchangeRateTypes
    };
  });
