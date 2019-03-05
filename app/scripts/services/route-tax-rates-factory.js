'use strict';

/**
 * @ngdoc service
 * @name ts5App.routeTaxRatesFactory
 * @description
 * # routeTaxRatesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('routeTaxRatesFactory', function (routeTaxRatesService, globalMenuService, taxRateTypesService,
      taxTypesService, countriesService, stationsService, currenciesService) {
    this.getRouteTaxRate = function (id) {
      return routeTaxRatesService.getRouteTaxRate(globalMenuService.company.get(), id);
    };

    this.getRouteTaxRates = function (payload) {
      return routeTaxRatesService.getRouteTaxRates(payload);
    };

    this.createRouteTaxRate = function (payload) {
      return routeTaxRatesService.createRouteTaxRate(payload);
    };

    this.updateRouteTaxRate = function (id, payload) {
      return routeTaxRatesService.updateRouteTaxRate(id, payload);
    };

    this.removeRouteTaxRate = function (id) {
      return routeTaxRatesService.removeRouteTaxRate(id);
    };

    this.getCompanyId = function () {
      return globalMenuService.company.get();
    };

    this.getTaxTypesList = function() {
      var payload = {};
      payload.companyId = globalMenuService.company.get();
      return taxTypesService.getTaxTypesList(payload);
    };

    this.getTaxRateTypes = function() {
      var companyId = globalMenuService.company.get();
      return taxRateTypesService.getTaxRateTypes(companyId);
    };

    this.getCountriesList = function() {
      var companyId = globalMenuService.company.get();
      return countriesService.getCountriesList(companyId);
    };

    this.getStationsList = function(payload) {
      var companyId = globalMenuService.company.get();
      return stationsService.getStationList(companyId, 0, payload);
    };

    this.getCompanyCurrencies = function(payload) {
      return currenciesService.getCompanyCurrencies(payload);
    };

    return {
      getRouteTaxRate: this.getRouteTaxRate,
      getRouteTaxRates: this.getRouteTaxRates,
      createRouteTaxRate: this.createRouteTaxRate,
      updateRouteTaxRate: this.updateRouteTaxRate,
      removeRouteTaxRate: this.removeRouteTaxRate,
      getCompanyId: this.getCompanyId,
      getTaxTypesList: this.getTaxTypesList,
      getTaxRateTypes: this.getTaxRateTypes,
      getCountriesList: this.getCountriesList,
      getStationsList: this.getStationsList,
      getCompanyCurrencies: this.getCompanyCurrencies
    };
  });
