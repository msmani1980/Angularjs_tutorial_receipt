'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeCommissionFactory', function (itemsService, priceTypesService, taxRateTypesService, currenciesService, employeeCommissionService) {

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

    var getCommissionList = function (payload) {
      return employeeCommissionService.getCommissionList(payload);
    };
    var getCommission = function (payload) {
      return employeeCommissionService.getCommission(payload);
    };
    var createCommission = function (payload) {
      return employeeCommissionService.createCommission(payload);
    };
    var updateCommission = function (payload) {
      return employeeCommissionService.updateCommission(payload);
    };
    var deleteCommission = function (payload) {
      return employeeCommissionService.deleteCommission(payload);
    };

    return {
      getItemsList: getItemsList,
      getPriceTypesList: getPriceTypesList,
      getTaxRateTypes: getTaxRateTypes,
      getCompanyCurrencies: getCompanyCurrencies,
      getCommissionList: getCommissionList,
      getCommission: getCommission,
      createCommission: createCommission,
      updateCommission: updateCommission,
      deleteCommission: deleteCommission
    };
  });
