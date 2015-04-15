'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ExchangeRatesCtrl
 * @description
 * # ExchangeRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExchangeRatesCtrl', function ($scope, $http) {
    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

    var getCompanyBaseCurrency = function (currencyList, baseCurrencyId) {
      var companyCurrency = currencyList.filter(function(currencyItem) {
        return currencyItem.id === baseCurrencyId; // filter out appropriate one
      })[0];
      $scope.companyCurrency = companyCurrency;
    };

    var getCurrencies = function () {
      var url = 'https://54.87.153.42/api/currencies';
      var request = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'userId': 1,
          'companyId': 326
        }
      };

      $http(request).success(function (data) {
        getCompanyBaseCurrency(data.response, getCompany(326).baseCurrencyId);
      }).error(function (data, status) {
        console.log('error on request', data, status);
      });
    };

    getCurrencies();
    $scope.breadcrumb = 'Cash Management / Daily Exchange Rates';
    $scope.currentCompany = getCompany(326);

  });
