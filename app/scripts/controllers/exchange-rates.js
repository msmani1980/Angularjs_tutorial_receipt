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
  .controller('ExchangeRatesCtrl', function ($scope, $http, currencyFactory, GlobalMenuService) {
    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Daily Exchange Rates';
    $scope.currentCompany = getCompany(companyId);
    $scope.cashiersDateField = new moment().format('L');
    $scope.currenciesFields = {};
    $scope.showActionButtons = false;

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
      if ($scope.companyCurrencies && $scope.dailyExchangeRates && angular.isArray($scope.dailyExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function (companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies, companyCurrency.id);
          if (exchangeRate) {
            serializeCoinAndPaperExchangeRate(companyCurrency.code, exchangeRate.coinExchangeRate, exchangeRate.paperExchangeRate);
          }
        });
      }
    }

    function hideShowActionButtons() {
      $scope.showActionButtons = moment($scope.cashiersDateField, 'L').format('L') === moment().format('L');
    }

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      var formattedDateForAPI = formatDateForAPI(cashiersDate);
      var companyCurrenciesPayload = {
        startDate: formattedDateForAPI,
        endDate: formattedDateForAPI,
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(companyCurrenciesPayload).then(function (companyCurrency) {
        $scope.companyCurrencies = companyCurrency.response;
      });
      currencyFactory.getDailyExchangeRates(formattedDateForAPI).then(function (dailyExchangeRates) {
        $scope.dailyExchangeRates = dailyExchangeRates || {};
      });
    });

    $scope.$watchGroup(['companyBaseCurrency', 'dailyExchangeRates', 'companyCurrencies'], function () {
      $scope.currenciesFields = {};
      setBaseExchangeRateModel();
      setExchangeRatesModel();
      hideShowActionButtons();
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
      debugger;
      clearExchangeRateCurrencies();
      angular.forEach($scope.companyCurrencies, function (currency) {
        if ($scope.currenciesFields[currency.code]) {
          var companyCurrency = serializeExchangeRate(currency);
          $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.push(companyCurrency);
        }
      });
    }

    function createPayload(shouldSubmit) {
      var dailyExchangeRateId;
      if ($scope.dailyExchangeRates && $scope.dailyExchangeRates.id) {
        dailyExchangeRateId = $scope.dailyExchangeRates.id;
      }
      $scope.payload = {
        dailyExchangeRate: {
          id: dailyExchangeRateId,
          isSubmitted: shouldSubmit || false,
          exchangeRateDate: formatDateForAPI($scope.cashiersDateField),
          chCompanyId: '362',
          chBaseCurrencyId: '8',
          retailCompanyId: companyId,
          retailBaseCurrencyId: getCompany(companyId).baseCurrencyId,
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

  });
