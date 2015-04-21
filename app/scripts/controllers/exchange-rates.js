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
    $scope.cashiersDateField = new moment().format('L');
    $scope.dailyExchangeRateCurrencies = {};

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      var searchDate = moment(cashiersDate, 'L').format('YYYYMMDD').toString();
      currencyFactory.getDailyExchangeRates(searchDate).then(function (dailyExchangeRates) {
        $scope.dailyExchangeRates = dailyExchangeRates;
      });
    });

    currencyFactory.getCompanyBaseCurrency().then(function (companyBaseCurrency) {
      $scope.companyBaseCurrency = companyBaseCurrency;
    });

    currencyFactory.getCompanyCurrencies().then(function (companyCurrency) {
      $scope.companyCurrencies = companyCurrency;
    });

    $scope.saveDailyExchangeRates = function () {
      var dummyPayload = {
        'dailyExchangeRate': {
          'exchangeRateDate': '20150420',
          'isSubmitted': false,
          'chCompanyId': '362',
          'retailCompanyId': '326',
          'chBaseCurrencyId': '8',
          'retailBaseCurrencyId': '1',
          'dailyExchangeRateCurrencies': [{
            'id': '206',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.0000',
            'paperExchangeRate': '1.0000',
            'retailCompanyCurrencyId': '168'
          }, {
            'id': '207',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.8285',
            'paperExchangeRate': '1.6157',
            'retailCompanyCurrencyId': '174'
          }, {
            'id': '208',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.6777',
            'paperExchangeRate': '1.1136',
            'retailCompanyCurrencyId': '175'
          }, {
            'id': '209',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.0062',
            'paperExchangeRate': '1.7230',
            'retailCompanyCurrencyId': '177'
          }, {
            'id': '210',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.0000',
            'paperExchangeRate': '1.0000',
            'retailCompanyCurrencyId': '179'
          }, {
            'id': '211',
            'bankExchangeRate': null,
            'coinExchangeRate': '1.1193',
            'paperExchangeRate': '1.1234',
            'retailCompanyCurrencyId': '185'
          }]
        }
      };
      console.log($scope.dailyExchangeRateCurrencies);
    };

    $scope.saveAndSubmitDailyExchangeRates = function () {
      $scope.fields.isSubmitted = true;
      $scope.saveDailyExchangeRates();
    };

  });
