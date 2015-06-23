'use strict';

/**
 * @ngdoc service
 * @name ts5App.employeeCommissionFactory
 * @description
 * # employeeCommissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('employeeCommissionFactory', function (itemsService, priceTypesService) {

    var getItemsList = function (payload) {
      return itemsService.getItemsList(payload);
    };

    var getPriceTypesList = function (payload) {
      return priceTypesService.getPriceTypesList(payload);
    };

    return {
      getItemsList: getItemsList,
      getPriceTypesList: getPriceTypesList
    };
  });
