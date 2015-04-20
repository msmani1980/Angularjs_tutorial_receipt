'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ExchangeRatesCtrl
 * @description
 * # ExchangeRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExchangeRatesCtrl', function ($scope, $http, currencyFactory) {
    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

    $scope.breadcrumb = 'Cash Management / Daily Exchange Rates';
    $scope.currentCompany = getCompany(326);

    currencyFactory.getCompanyBaseCurrency().then(function (companyBaseCurrency) {
      $scope.companyBaseCurrency = companyBaseCurrency;
    });

    currencyFactory.getCompanyCurrencies().then(function (companyCurrency) {
      $scope.companyCurrencies = companyCurrency;
    });

    currencyFactory.getDailyExchangeRates().then(function (dailyExchangeRates) {
      $scope.dailyExchangeRates = dailyExchangeRates;
    });

    currencyFactory.getPreviousExchangeRates().then(function (previousExchangeRates) {
      $scope.previousExchangeRates = previousExchangeRates;
    });

  });
