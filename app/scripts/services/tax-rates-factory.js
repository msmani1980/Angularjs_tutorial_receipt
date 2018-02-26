'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxRatesFactory
 * @description
 * # taxRatesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('taxRatesFactory', function(taxRateTypesService, taxTypesService, countriesService, stationsService,
    currenciesService, taxRatesService, globalMenuService) {

    var getTaxTypesList = function() {
      var payload = {};
      payload.companyId = globalMenuService.company.get();
      return taxTypesService.getTaxTypesList(payload);
    };

    var getTaxRateTypes = function() {
      var companyId = globalMenuService.company.get();
      return taxRateTypesService.getTaxRateTypes(companyId);
    };

    var getCountriesList = function() {
      var companyId = globalMenuService.company.get();
      return countriesService.getCountriesList(companyId);
    };

    var getStationsList = function() {
      var companyId = globalMenuService.company.get();
      return stationsService.getStationList(companyId, 0);
    };

    var getCompanyCurrencies = function(payload) {
      return currenciesService.getCompanyCurrencies(payload);
    };

    var getCompanyTaxRatesList = function(companyId) {
      return taxRatesService.getCompanyTaxRatesList(companyId);
    };

    var getCompanyTaxRate = function(companyId) {
      return taxRatesService.getCompanyTaxRate(companyId);
    };

    var removeCompanyTaxRate = function(id) {
      return taxRatesService.removeCompanyTaxRate(id);
    };

    var updateCompanyTaxRate = function(payload) {
      return taxRatesService.updateCompanyTaxRate(payload);
    };

    var createCompanyTaxRate = function(payload) {
      return taxRatesService.createCompanyTaxRate(payload);
    };

    return {
      getTaxTypesList: getTaxTypesList,
      getTaxRateTypes: getTaxRateTypes,
      getCountriesList: getCountriesList,
      getStationsList: getStationsList,
      getCompanyCurrencies: getCompanyCurrencies,
      getCompanyTaxRatesList: getCompanyTaxRatesList,
      getCompanyTaxRate: getCompanyTaxRate,
      removeCompanyTaxRate: removeCompanyTaxRate,
      updateCompanyTaxRate: updateCompanyTaxRate,
      createCompanyTaxRate: createCompanyTaxRate
    };

  });
