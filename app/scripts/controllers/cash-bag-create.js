'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagCreateCtrl
 * @description
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagCreateCtrl', function ($scope, cashBagService) {

    $scope.viewName = "Cash Bag";

    var mockFlight = {
      airline: 'FPO Delta',
      number: 'E2Y56',
      date: new Date()
    };
    var mockCashBag = {
      cashiersEntryDate: new Date(),
      baseCurrency: 'TODO: DATA',
      flightSchedules: [{id: 1, name: 'test'}, {id: 2, name: 'test 2'}]
    };
    var mockExchangeRates = [
      ['CHF', 1400.75, 10.00, 13.75, 0.1844, 0.1844],
      ['USD', 6.66, 6.00, 0.66, 0.1844, 0.1844]
    ];

    $scope.cashBag = mockCashBag;
    $scope.flight = mockFlight;
    $scope.exchangeRates = mockExchangeRates;
  });
