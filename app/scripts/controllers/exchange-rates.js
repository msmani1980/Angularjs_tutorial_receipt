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
  .controller('ExchangeRatesCtrl', function ($scope, $http, currencyFactory, GlobalMenuService, $q) {
    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Daily Exchange Rates';
    $scope.currentCompany = 'Delta';
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

    var getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

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

    function setPreviousExchangeRatesModel() {
      if (!$scope.dailyExchangeRates.dailyExchangeRateCurrencies) {
        $scope.dailyExchangeRates = angular.extend($scope.previousExchangeRates,
          {
            isSubmitted: false,
            exchangeRateDate: formatDateForAPI($scope.cashiersDateField)
          });
      }
    }

    function setCurrentExchangeRatesModel() {
      if ($scope.companyCurrencies && $scope.dailyExchangeRates && angular.isArray($scope.dailyExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function (companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies, companyCurrency.id);
          if (exchangeRate) {
            serializeCoinAndPaperExchangeRate(companyCurrency.code, exchangeRate.coinExchangeRate, exchangeRate.paperExchangeRate);
          }
        });
      }
    }

    function shouldShowActionButtons() {
      var isToday = moment($scope.cashiersDateField, 'L').format('L') === moment().format('L');
      if (!isToday) {
        return false;
      }

      if (isToday && $scope.dailyExchangeRates.isSubmitted) {
        return false;
      }

      return true;
    }

    function setupModels() {
      $scope.currenciesFields = {};
      setBaseExchangeRateModel();
      setPreviousExchangeRatesModel();
      setCurrentExchangeRatesModel();
      $scope.showActionButtons = shouldShowActionButtons();
    }

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      var formattedDateForAPI = formatDateForAPI(cashiersDate);
      var companyCurrenciesPayload = {
        startDate: formattedDateForAPI,
        endDate: formattedDateForAPI,
        isOperatedCurrency: true
      };
      var companyCurrencyPromise = currencyFactory.getCompanyCurrencies(companyCurrenciesPayload);
      var previousRatePromise = currencyFactory.getPreviousExchangeRates(companyId, formattedDateForAPI);
      var currentRatePromise = currencyFactory.getDailyExchangeRates(companyId, formattedDateForAPI);

      $q.all([companyCurrencyPromise, previousRatePromise, currentRatePromise]).then(function (apiData) {
        $scope.companyCurrencies = apiData[0].response;
        $scope.previousExchangeRates = apiData[1] || {};
        $scope.dailyExchangeRates = apiData[2].dailyExchangeRates[0] || {};
        setupModels();
      });
    });

    function clearExchangeRateCurrencies() {
      $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies = [];
    }

    function serializeExchangeRate(currency) {
      var coinExchangeRate = '1.0000',
        paperExchangeRate = '1.0000';

      if ($scope.currenciesFields[currency.code]) {
        coinExchangeRate = $scope.currenciesFields[currency.code].coinExchangeRate;
        paperExchangeRate = $scope.currenciesFields[currency.code].paperExchangeRate;
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
        if ($scope.currenciesFields[currency.code]) {
          var companyCurrency = serializeExchangeRate(currency);
          $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.push(companyCurrency);
        }
      });
    }

    function createPayload(shouldSubmit) {
      $scope.payload = {
        dailyExchangeRate: angular.extend($scope.dailyExchangeRates,
          {
            isSubmitted: shouldSubmit || false,
            exchangeRateDate: formatDateForAPI($scope.cashiersDateField)
          })
      };
      resolvePayloadDependencies();
    }

    function showErrors(dataFromAPI) {
      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      setupModels();
    }

    $scope.saveDailyExchangeRates = function (shouldSubmit) {
      createPayload(shouldSubmit);
      currencyFactory.saveDailyExchangeRates($scope.payload).then(function (dailyExchangeRatesData) {
        $scope.dailyExchangeRates = dailyExchangeRatesData || {};
        angular.element('#success-modal').modal('show');
        setupModels();
      }, showErrors);
    };


    function getCompanyBaseCurrency(baseCurrencyId) {
      currencyFactory.getCompanyGlobalCurrencies().then(function (companyBaseCurrencyData) {
        $scope.companyBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response, baseCurrencyId);
      });
    }

    currencyFactory.getCompany(companyId).then(function (companyDataFromAPI) {
      getCompanyBaseCurrency(companyDataFromAPI.baseCurrencyId);
      $scope.company = companyDataFromAPI;
    });

    currencyFactory.getCompany(362).then(function (companyDataFromAPI) {
      $scope.cashHandlerCompany = companyDataFromAPI;
    });

  });
