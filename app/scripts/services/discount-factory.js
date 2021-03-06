'use strict';

/**
 * @ngdoc service
 * @name ts5App.discountFactory
 * @description
 * # discountFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('discountFactory', function (discountService, discountTypesService, stationsService) {
    var getDiscountList = function (payload) {
      return discountService.getDiscountList(payload);
    };

    var getDiscountTypesList = function (payload) {
      return discountTypesService.getDiscountTypesList(payload);
    };

    var getDiscount = function (discountId) {
      return discountService.getDiscount(discountId);
    };

    var createDiscount = function (payload) {
      return discountService.createDiscount(payload);
    };

    var updateDiscount = function (discountId, payload) {
      return discountService.updateDiscount(discountId, payload);
    };

    var deleteDiscount = function (discountId) {
      return discountService.deleteDiscount(discountId);
    };

    function getStationGlobals(payload) {
      return stationsService.getGlobalStationList(payload);
    }

    return {
      getDiscountList: getDiscountList,
      getDiscountTypesList: getDiscountTypesList,
      deleteDiscount: deleteDiscount,
      getDiscount: getDiscount,
      createDiscount: createDiscount,
      updateDiscount: updateDiscount,
      getStationGlobals: getStationGlobals,
    };
  });
