'use strict';

/**
 * @ngdoc service
 * @name ts5App.discountFactory
 * @description
 * # discountFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('discountFactory', function (discountService, discountTypesService) {
    var getDiscountList = function (payload) {
      return discountService.getDiscountList(payload);
    };

    var getDiscountTypesList = function (payload) {
      return discountTypesService.getDiscountTypesList(payload);
    };

    return {
      getDiscountList: getDiscountList,
      getDiscountTypesList: getDiscountTypesList
    };
  });
