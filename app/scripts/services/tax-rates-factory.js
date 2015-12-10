'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxRatesFactory
 * @description
 * # taxRatesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('taxRatesFactory', function(taxRateTypesService, taxTypesService, countriesService) {

    var getTaxTypesList = function(payload) {
      return taxTypesService.getTaxTypesList(payload);
    };

    var getTaxRateTypes = function(payload) {
      return taxRateTypesService.getTaxRateTypes(payload);
    };

    var getCountriesList = function(payload) {
      return countriesService.getCountriesList(payload);
    };

    return {
      getTaxTypesList: getTaxTypesList,
      getTaxRateTypes: getTaxRateTypes,
      getCountriesList: getCountriesList
    };

  });
