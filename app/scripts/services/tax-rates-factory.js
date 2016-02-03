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
    currenciesService, taxRatesService, GlobalMenuService) {

    var getTaxTypesList = function() {
      var payload = {};
      payload.companyId = GlobalMenuService.company.get();
      return taxTypesService.getTaxTypesList(payload);
    };

    var getTaxRateTypes = function() {
      var companyId = GlobalMenuService.company.get();
      return taxRateTypesService.getTaxRateTypes(companyId);
    };

    var getCountriesList = function() {
      var companyId = GlobalMenuService.company.get();
      return countriesService.getCountriesList(companyId);
    };

    var getStationsList = function() {
      var companyId = GlobalMenuService.company.get();
      return stationsService.getStationList(companyId, 0);
    };

    var getCompanyCurrencies = function() {
      var companyId = GlobalMenuService.company.get();
      return currenciesService.getCompanyCurrencies(companyId);
    };

    var getCompanyTaxRatesList = function(companyId) {
      return taxRatesService.getCompanyTaxRatesList(companyId);
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
      removeCompanyTaxRate: removeCompanyTaxRate,
      updateCompanyTaxRate: updateCompanyTaxRate,
      createCompanyTaxRate: createCompanyTaxRate
    };

  });
