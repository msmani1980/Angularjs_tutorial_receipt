'use strict';
/*global moment:false */
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

    function formatDateForAPI(cashiersDate) {
      return moment(cashiersDate, 'L').format('YYYYMMDD').toString();
    }

    function getExchangeRateFromCompanyCurrencies(currenciesArray, currencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.retailCompanyCurrencyId === currencyId;
      })[0];
    }

    function serializeCoinAndPaperExchangeRate(currencyCode, coinExchangeRate, paperExchangeRate) {
      $scope.currenciesFields[currencyCode] = {
        coinExchangeRate: coinExchangeRate,
        paperExchangeRate: paperExchangeRate
      };
    }

    function setBaseExchangeRateModel() {
      if ($scope.companyBaseCurrency && $scope.dailyExchangeRates) {
        serializeCoinAndPaperExchangeRate($scope.companyBaseCurrency.currencyCode, '1.0000', '1.0000');
      }
    }

    function setExchangeRatesModel() {
      if ($scope.dailyExchangeRates && angular.isArray($scope.dailyExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function (companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies, companyCurrency.id);
          serializeCoinAndPaperExchangeRate(companyCurrency.currencyCode, exchangeRate.coinExchangeRate, exchangeRate.paperExchangeRate);
        });
      }
    }

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      var formattedDateForAPI = formatDateForAPI(cashiersDate);
      currencyFactory.getDailyExchangeRates(formattedDateForAPI).then(function (dailyExchangeRates) {
        $scope.dailyExchangeRates = dailyExchangeRates[0] || {};
      });
    });

    $scope.$watchGroup(['companyBaseCurrency', 'dailyExchangeRates'], function () {
      $scope.currenciesFields = {};
      setBaseExchangeRateModel();
      setExchangeRatesModel();
    });

    function clearExchangeRateCurrencies() {
      $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies = [];
    }

    function serializeExchangeRate(currency) {
      var coinExchangeRate = '1.0000',
        paperExchangeRate = '1.0000';

      if ($scope.currenciesFields[currency.currencyCode]) {
        coinExchangeRate = $scope.currenciesFields[currency.currencyCode].coinExchangeRate;
        paperExchangeRate = $scope.currenciesFields[currency.currencyCode].paperExchangeRate;
      }

      return {
        retailCompanyCurrencyId: currency.id,
        coinExchangeRate: coinExchangeRate,
        paperExchangeRate: paperExchangeRate
      };
    }

    function resolvePayloadDependencies() {
      clearExchangeRateCurrencies();
      angular.forEach($scope.companyCurrencies, function (currency) {
        if ($scope.currenciesFields[currency.currencyCode]) {
          var companyCurrency = serializeExchangeRate(currency);
          $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.push(companyCurrency);
        }
      });
    }

    function createPayload(shouldSubmit) {
      $scope.payload = {
        dailyExchangeRate: {
          id: $scope.dailyExchangeRates.id || null,
          isSubmitted: shouldSubmit || false,
          exchangeRateDate: formatDateForAPI($scope.cashiersDateField),
          chCompanyId: '362',
          chBaseCurrencyId: '8',
          retailCompanyId: getCompany(374).id,
          retailBaseCurrencyId: getCompany(374).baseCurrencyId,
          dailyExchangeRateCurrencies: []
        }
      };
      resolvePayloadDependencies();
    }

    $scope.saveDailyExchangeRates = function (shouldSubmit) {
      createPayload(shouldSubmit);
      currencyFactory.saveDailyExchangeRates($scope.payload);
    };

    currencyFactory.getCompanyBaseCurrency().then(function (companyBaseCurrency) {
      $scope.companyBaseCurrency = companyBaseCurrency;
    });

    currencyFactory.getCompanyCurrencies().then(function (companyCurrency) {
      $scope.companyCurrencies = companyCurrency;
    });

  });
