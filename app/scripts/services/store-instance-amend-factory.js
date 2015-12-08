'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceAmendFactory
 * @description
 * # storeInstanceAmendFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('storeInstanceAmendFactory', function ($q) {

    var getCashBagListMockData = function () {
      var mockCashBag = [{
        cashBagNumber: '123',
        bankRefNumber: 'AB45',
        isManual: true,
        isDeleted: false,
        isVerified: true,
        regularItemSales: 20.00,
        virtualItemSales: 10.00,
        voucherItemSales: 15.00,
        promotionDiscounts: 5.00,
        cashRevenue: 10.00,
        creditRevenue: 5.00,
        discountRevenue: 11.50,
        flightSectors: [{
          scheduleDate: '10/20/2015',
          scheduleNumber: '123',
          departureStationCode: 'ORD',
          arrivalStationCode: 'LAX',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionsCount: 7,
          transactionTotal: 15.00,
          isManual: false,
          crewData: [{
            crewId: 1,
            firstName: 'John',
            lastName: 'Smith'
          }, {
            crewId: 2,
            firstName: 'Mary',
            lastName: 'Jane'
          }]
        }, {
          scheduleDate: '10/24/2015',
          scheduleNumber: '105',
          departureStationCode: 'LAX',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionsCount: 3,
          transactionTotal: 11.00,
          isManual: true,
          crewData: [{
            crewId: 1,
            firstName: 'John',
            lastName: 'Smith'
          }, {
            crewId: 2,
            firstName: 'Mary',
            lastName: 'Jane'
          }]
        }]
      }, {
        cashBagNumber: '789',
        bankRefNumber: 'CB12',
        isManual: false,
        isDeleted: false,
        isVerified: false,
        regularItemSales: 5.00,
        virtualItemSales: 15.00,
        voucherItemSales: 10.00,
        promotionDiscounts: 5.00,
        cashRevenue: 15.00,
        creditRevenue: 10.00,
        discountRevenue: 5.00,
        flightSectors: [{
          scheduleDate: '11/20/2015',
          scheduleNumber: '145',
          departureStationCode: 'SAN',
          arrivalStationCode: 'GNV',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionsCount: 7,
          transactionTotal: 15.00,
          isManual: true,
          crewData: [{
            crewId: 1,
            firstName: 'John',
            lastName: 'Smith'
          }, {
            crewId: 2,
            firstName: 'Mary',
            lastName: 'Jane'
          }]
        }, {
          scheduleDate: '12/30/2015',
          scheduleNumber: '105',
          departureStationCode: 'CPH',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionsCount: 3,
          transactionTotal: 11.00,
          isManual: false,
          crewData: [{
            crewId: 1,
            firstName: 'John',
            lastName: 'Smith'
          }, {
            crewId: 2,
            firstName: 'Mary',
            lastName: 'Jane'
          }]
        }]
      }, {
        cashBagNumber: '567',
        bankRefNumber: '1278',
        isManual: true,
        isDeleted: true,
        isVerified: false,
        regularItemSales: 3.00,
        virtualItemSales: 20.00,
        voucherItemSales: 12.00,
        promotionDiscounts: 1.00,
        cashRevenue: 10.00,
        creditRevenue: 7.00,
        discountRevenue: 3.00,
        flightSectors: [{
          scheduleDate: '11/20/2015',
          scheduleNumber: '145',
          departureStationCode: 'SAN',
          arrivalStationCode: 'GNV',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionsCount: 7,
          transactionTotal: 15.00,
          isManual: true,
          crewData: []
        }, {
          scheduleDate: '12/30/2015',
          scheduleNumber: '105',
          departureStationCode: 'CPH',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionsCount: 3,
          transactionTotal: 11.00,
          isManual: false,
          crewData: [{
            crewId: 1,
            firstName: 'John',
            lastName: 'Smith'
          }]
        }]
      }];

      var cashBagMockResponseDeferred = $q.defer();
      cashBagMockResponseDeferred.resolve(mockCashBag);
      return cashBagMockResponseDeferred.promise;
    };

    return {
      getCashBagListMockData: getCashBagListMockData
    };
  });
