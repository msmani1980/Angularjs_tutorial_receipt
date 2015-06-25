'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeCommissionFactory', function (itemsService, priceTypesService, taxRateTypesService, currenciesService) {

    var getItemsList = function (payload) {
      return itemsService.getItemsList(payload);
    };

    var getPriceTypesList = function (payload) {
      return priceTypesService.getPriceTypesList(payload);
    };

    var getTaxRateTypes = function (payload) {
      return taxRateTypesService.getTaxRateTypes(payload);
    };

    var getCompanyCurrencies = function (payload) {
      return currenciesService.getCompanyCurrencies(payload);
    };

    return {
      getItemsList: getItemsList,
      getPriceTypesList: getPriceTypesList,
      getTaxRateTypes: getTaxRateTypes,
      getCompanyCurrencies: getCompanyCurrencies
    };
  });
