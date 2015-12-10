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
    currenciesService) {

    var getTaxTypesList = function(payload) {
      return taxTypesService.getTaxTypesList(payload);
    };

    var getTaxRateTypes = function(payload) {
      return taxRateTypesService.getTaxRateTypes(payload);
    };

    var getCountriesList = function(payload) {
      return countriesService.getCountriesList(payload);
    };

    var getStationsList = function(companyId, offset) {
      return stationsService.getStationList(companyId, offset);
    };

    var getCompanyCurrencies = function(payload) {
      return currenciesService.getCompanyCurrencies(payload);
    };

    return {
      getTaxTypesList: getTaxTypesList,
      getTaxRateTypes: getTaxRateTypes,
      getCountriesList: getCountriesList,
      getStationsList: getStationsList,
      getCompanyCurrencies: getCompanyCurrencies
    };

  });
