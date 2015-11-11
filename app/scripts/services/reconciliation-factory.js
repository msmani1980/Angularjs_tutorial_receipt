'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationFactory
 * @description
 * # reconciliationFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('reconciliationFactory', function ($q, storeInstanceService, storesService) {

    var getLMPStockMockData = function () {
      var mockLMPData = [
        {
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
      var mockCashBag = [
        {
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

    var getMockReconciliationDataList = function () {
      var mockReconciliationDataList = [
        {
          dispatchedStation: 'LGW',
          receivedStation: 'LTN',
          storeNumber: '7321',
          storeInstanceId: 91,
          scheduleDate: '10/08/2015',
          ePOSStatus: 'No',
          postTripStatus: '3/3',
          cashHandlerStatus: '4/4',
          ePOSCreatedStore: 'Yes',
          status: 'Inbounded',
          updatedDate: '9/10/2015 4:30',
          updatedBy: 'rabraham',
          actions: ['Validate', 'Report']
        },
        {
          dispatchedStation: 'LTN',
          receivedStation: 'LGW',
          storeNumber: '123',
          storeInstanceId: 54,
          scheduleDate: '12/08/2015',
          ePOSStatus: '3/3',
          postTripStatus: '2/3',
          cashHandlerStatus: '4/6',
          ePOSCreatedStore: 'No',
          status: 'Confirmed',
          updatedDate: '11/10/2015 4:30',
          updatedBy: 'rabraham',
          actions: ['Review', 'Pay Commission', 'Unconfirm', 'Report']

        },
        {
          dispatchedStation: 'STN',
          receivedStation: 'ORD',
          storeNumber: '7325',
          storeInstanceId: 103,
          scheduleDate: '11/21/2015',
          ePOSStatus: 'No',
          postTripStatus: '3/3',
          cashHandlerStatus: '4/4',
          ePOSCreatedStore: 'Yes',
          status: 'Discrepancies',
          updatedDate: '9/30/2015 4:30',
          updatedBy: 'tgunderson',
          actions: ['Review', 'Confirm', 'Report']
        },
        {
          dispatchedStation: 'LHR',
          receivedStation: 'GVA',
          storeNumber: '1132456',
          storeInstanceId: 91,
          scheduleDate: '08/10/2015',
          ePOSStatus: 'No',
          postTripStatus: '1/4',
          cashHandlerStatus: '4/5',
          ePOSCreatedStore: 'No',
          status: 'Commission Paid',
          updatedDate: '7/13/2015 4:30',
          updatedBy: 'tgunderson',
          actions: ['Report']
        }
      ];
      var reconciliationListMockResponseDeferred = $q.defer();
      reconciliationListMockResponseDeferred.resolve(mockReconciliationDataList);
      return reconciliationListMockResponseDeferred.promise;
    };

    function getStore(storeId) {
      return storesService.getStore(storeId);
    }

    function getStoreInstance(storeInstanceId) {
      return storeInstanceService.getStoreInstance(storeInstanceId);
    }

    return {
      getStore: getStore,
      getStoreInstance: getStoreInstance,
      getLMPStockMockData: getLMPStockMockData,
      getCashBagMockData: getCashBagMockData,
      getMockReconciliationDataList: getMockReconciliationDataList
    };
  });
