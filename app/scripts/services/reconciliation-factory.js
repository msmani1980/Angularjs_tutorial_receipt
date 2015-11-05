'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationFactory
 * @description
 * # reconciliationFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('reconciliationFactory', function ($q) {

    var getLMPStockMockData = function () {
      var mockLMPData = [{
        itemName: 'Chocolate',
        itemDescription: 'Food: Chocolate',
        dispatchedCount: 50,
        inboundCount: 50,
        ePOSSales: 20,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 7.0,
        isDiscrepancy: true
      }, {
        itemName: 'Pepsi',
        itemDescription: 'Drink: Pepsi',
        dispatchedCount: 150,
        inboundCount: 30,
        ePOSSales: 25,
        varianceQuantity: 11,
        retailValue: 6,
        varianceValue: 12.0,
        isDiscrepancy: false
      }, {
        itemName: 'Coke',
        itemDescription: 'Drink: Coke',
        dispatchedCount: 20,
        inboundCount: 35,
        ePOSSales: 12,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 14.0,
        isDiscrepancy: false
      }];

      var LMPStockMockResponseDeferred = $q.defer();
      LMPStockMockResponseDeferred.resolve(mockLMPData);
      return LMPStockMockResponseDeferred.promise;
    };

    var getCashBagMockData = function () {
      var mockCashBag = [{
        cashBag: 'CB123',
        currency: 'GBP',
        exchangeAmount: 12,
        crewAmount: 14,
        paperAmount: 34,
        coinAmount: 12.00,
        varianceValue: 5,
        bankExchangeRate: 7.0,
        totalBand: 100,
        isDiscrepancy: true
      }, {
        cashBag: 'CB345',
        currency: 'GBP',
        exchangeAmount: 15,
        crewAmount: 34,
        paperAmount: 23,
        coinAmount: 15.00,
        varianceValue: 12,
        bankExchangeRate: 16.0,
        totalBand: 200,
        isDiscrepancy: false
      }];

      var cashBagMockResponseDeferred = $q.defer();
      cashBagMockResponseDeferred.resolve(mockCashBag);
      return cashBagMockResponseDeferred.promise;
    };

    return {
      getLMPStockMockData: getLMPStockMockData,
      getCashBagMockData: getCashBagMockData
    };
  });
