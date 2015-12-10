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

    var getScheduleMockData = function (searchQuery) {
      var getScheduleMockData = [{
        scheduleDate: (searchQuery)? searchQuery.scheduleDate : '10/20/2015',
        scheduleNumber: (searchQuery) ? searchQuery.scheduleNumber : '105',
        departureStation: 'ORD',
        arrivalStation: 'LAX'
      }, {
        scheduleDate: (searchQuery)? searchQuery.scheduleDate : '10/30/2015',
        scheduleNumber: (searchQuery) ? searchQuery.scheduleNumber : '111',
        departureStation: 'CPH',
        arrivalStation: 'ORD'
      }];
      var scheduleMockResponseDeferred = $q.defer();
      scheduleMockResponseDeferred.resolve(getScheduleMockData);
      return scheduleMockResponseDeferred.promise;
    };

    var getStoreInstancesMockData = function (searchQuery) {
      var getStoreInstancesMockData = [{
        storeInstance: 123,
        scheduleDate: (searchQuery)? searchQuery.scheduleDate : '10/20/2015',
        storeNumber: (searchQuery) ? searchQuery.storeNumber : 'str123',
        warehouse: 'ORD'
      }, {
        storeInstance: 145,
        scheduleDate: (searchQuery)? searchQuery.scheduleDate : '10/20/2015',
        storeNumber: (searchQuery) ? searchQuery.storeNumber : 'str123',
        warehouse: 'LAX'
      }];
      var storeInstanceMockResponseDeferred = $q.defer();
      storeInstanceMockResponseDeferred.resolve(getStoreInstancesMockData);
      return storeInstanceMockResponseDeferred.promise;
    };

    var getCashBagListMockData = function (searchQuery) {
      var mockCashBag = [{
        id: 10,
        cashBag: (searchQuery) ? searchQuery.cashBag : '123',
        bankRefNumber: (searchQuery) ? searchQuery.bankRefNumber : 'AB45',
        storeNumber: '123',
        isManual: true,
        isDeleted: false,
        isVerified: false,
        regularItemSales: 20.00,
        virtualItemSales: 10.00,
        voucherItemSales: 15.00,
        promotionDiscounts: 5.00,
        cashRevenue: 10.00,
        creditRevenue: 5.00,
        discountRevenue: 11.50,
        scheduleNumber: '105',
        scheduleDate: '10/20/2015',
        flightSectors: [{
          id: 1,
          scheduleDate: '10/20/2015',
          scheduleNumber: '105',
          route: 'AB456',
          departureStationCode: 'ORD',
          arrivalStationCode: 'LAX',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionCount: 7,
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
          id: 2,
          scheduleDate: '10/20/2015',
          scheduleNumber: '106',
          route: '784',
          departureStationCode: 'LAX',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionCount: 3,
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
        id: 20,
        cashBag: '789',
        bankRefNumber: 'CB12',
        isManual: false,
        isDeleted: false,
        isVerified: true,
        regularItemSales: 5.00,
        virtualItemSales: 15.00,
        voucherItemSales: 10.00,
        promotionDiscounts: 5.00,
        cashRevenue: 15.00,
        creditRevenue: 10.00,
        discountRevenue: 5.00,
        flightSectors: [{
          id: 3,
          scheduleDate: '11/20/2015',
          scheduleNumber: '112',
          route: 'AB768',
          departureStationCode: 'SAN',
          arrivalStationCode: 'GNV',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionCount: 7,
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
          id: 4,
          scheduleDate: '11/20/2015',
          scheduleNumber: '113',
          route: 'AB456',
          departureStationCode: 'CPH',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionCount: 3,
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
        id: 30,
        cashBag: '567',
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
          id: 5,
          scheduleDate: '11/20/2015',
          scheduleNumber: '145',
          route: '7836',
          departureStationCode: 'SAN',
          arrivalStationCode: 'GNV',
          passengerCount: 123,
          tailNumber: 'ABC-123',
          transactionCount: 7,
          transactionTotal: 15.00,
          isManual: true,
          crewData: []
        }, {
          id :6,
          scheduleDate: '11/30/2015',
          scheduleNumber: '146',
          route: '7834',
          departureStationCode: 'CPH',
          arrivalStationCode: 'ORD',
          passengerCount: 123,
          tailNumber: 'GAD-123',
          transactionCount: 3,
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

      if (searchQuery) {
        cashBagMockResponseDeferred.resolve([mockCashBag[0]]);
      } else {
        cashBagMockResponseDeferred.resolve(mockCashBag);
      }
      return cashBagMockResponseDeferred.promise;
    };

    return {
      getCashBagListMockData: getCashBagListMockData,
      getStoreInstancesMockData: getStoreInstancesMockData,
      getScheduleMockData: getScheduleMockData
    };
  });
