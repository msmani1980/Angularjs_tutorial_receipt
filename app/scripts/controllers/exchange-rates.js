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

    $scope.breadcrumb = 'Daily Exchange Rates';
    $scope.currentCompany = getCompany(374);
    $scope.cashiersDateField = new moment().format('L');
    $scope.currenciesFields = {};
    $scope.payload = {
      'dailyExchangeRate': {
        isSubmitted: false,
        'chCompanyId': '362',
        'chBaseCurrencyId': '8',
        'retailCompanyId': getCompany(374).id,
        'retailBaseCurrencyId': getCompany(374).baseCurrencyId,
        'currenciesFields': []
      }
    };

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      var formattedDateForAPI = moment(cashiersDate, 'L').format('YYYYMMDD').toString();
      $scope.payload.dailyExchangeRate.exchangeRateDate = formattedDateForAPI;
      currencyFactory.getDailyExchangeRates(formattedDateForAPI).then(function (dailyExchangeRates) {
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
          }]
        }
      };

      angular.forEach($scope.companyCurrencies, function (currency) {

        companyId: 374
        countries: Array[1]
        currencyCode: "GBP"
        currencyId: 8
        currencyName: "British Pound"
        currencySymbol: "£"
        denominations: Array[0]
        endDate: "2050-12-31"
        eposDisplayOrder: 1
        id: 203
        isOperatedCurrency: true
        startDate: "2015-04-14"
        console.log('currency', currency);
        //$scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies;
      });
      console.log('currenciesFields', $scope.currenciesFields);
      console.log('payload', $scope.payload);
    };

    $scope.saveAndSubmitDailyExchangeRates = function () {
      $scope.payload.dailyExchangeRate.isSubmitted = true;
      $scope.saveDailyExchangeRates();
    };

  })
;
