'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationService
 * @description
 * # reconciliationService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('reconciliationService', function ($resource, ENV) {

    var stockURL = ENV.apiUrl + '/api/reconciliation/stock-totals';
    var promotionURL = ENV.apiUrl + '/api/reconciliation/promotion-totals';

    var revenueURL = {
      basePath: ENV.apiUrl + '/api/reconciliation/revenue-totals/',
      cashBag: '-cashbags',
      creditCard: '-credit-cards',
      discount: '-discounts'
    };

    var requestParameters = {
      storeInstanceId: '@storeInstanceId'
    };

    var actions = {
      getStockTotals: {
        method: 'GET'
      },
      getPromotionTotals: {
        method: 'GET'
      },
      getRevenue: {
        method: 'GET'
      }
    };

    var stockResource = $resource(stockURL, requestParameters, actions);
    var promotionResource = $resource(promotionURL, requestParameters, actions);

    function getStockTotals(storeInstanceId) {
      var payload = {
        storeInstanceId: storeInstanceId
      };
      return stockResource.getStockTotals(payload).$promise;
    }

    function getPromotionTotals(storeInstanceId) {
      var payload = {
        storeInstanceId: storeInstanceId
      };
      return promotionResource.getPromotionTotals(payload).$promise;
    }

    function getResource(storeInstanceId, revenueType, origin) {
      if (!revenueURL[revenueType]) {
        return false;
      }
      var payload = {storeInstanceId: storeInstanceId};
      var path = revenueURL.basePath + origin + revenueURL[revenueType];
      var revenueResource = $resource(path, requestParameters, actions);
      return revenueResource.getRevenue(payload).$promise;
    }

    function getCHCashBagRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'cashBag', 'ch');
    }

    function getCHCreditCardRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'creditCard', 'ch');

    }

    function getCHDiscountRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'discount', 'ch');
    }

    function getEPOSCashBagRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'cashBag', 'epos');
    }

    function getEPOSCreditCardRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'creditCard', 'epos');
    }

    function getEPOSDiscountRevenue(storeInstanceId) {
      return getResource(storeInstanceId, 'discount', 'epos');
    }

    return {
      getStockTotals: getStockTotals,
      getPromotionTotals: getPromotionTotals,
      getCHCashBagRevenue: getCHCashBagRevenue,
      getCHCreditCardRevenue: getCHCreditCardRevenue,
      getCHDiscountRevenue: getCHDiscountRevenue,
      getEPOSCashBagRevenue: getEPOSCashBagRevenue,
      getEPOSCreditCardRevenue: getEPOSCreditCardRevenue,
      getEPOSDiscountRevenue: getEPOSDiscountRevenue
    };
  });
