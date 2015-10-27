'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyExchangeRateEditCtrl
 * @description
 * # CompanyExchangeRateEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyExchangeRateEditCtrl', function ($scope, GlobalMenuService, currencyFactory, dateUtility, payloadUtility) {
    var companyId = GlobalMenuService.company.get();

    var $this = this;
    $scope.viewName = 'Manage Retail Company Exchange Rate';
    $scope.search = {};
    $scope.globalCurrencies = [];
    $scope.currencyDenominations = {};
    $scope.companyBaseCurrency = {};
    $scope.companyExchangeRates = [];
    $scope.detailedCompanyCurrenciesForSearch = [];

    $scope.companyExchangeRateFilter = function (exchangeRate) {
      if (!$scope.search.acceptedCurrencies || $scope.search.acceptedCurrencies.length === 0) {
        return true;
      }

      return $scope.search.acceptedCurrencies.filter(function (acceptedCurrency) {
        return acceptedCurrency.currencyCode === exchangeRate.acceptedCurrencyCode;
      })
      .length > 0;
    };

    this.getDenominations = function () {
      angular.forEach($scope.globalCurrencies, function (currency){
        angular.forEach(currency.currencyDenominations, function (denomination) {
          $scope.currencyDenominations[denomination.id] = denomination ;
        });
      });
    };

    this.getDenominationById = function (denominationId) {
      return $scope.currencyDenominations[denominationId];
    };

    this.sortDenominationByValue = function (a, b) {
      return parseFloat(a) - parseFloat(b);
    };

    this.getDetailedCompanyCurrenciesForSearch = function () {
      currencyFactory.getDetailedCompanyCurrencies().then(function (companyCurrencyListFromAPI) {
        $scope.detailedCompanyCurrenciesForSearch = payloadUtility.deserializeDates(companyCurrencyListFromAPI.companyCurrencies);
      });
    };

    this.createFinalCompanyExchangeRatesList = function (companyExchangeRatesFromAPI) {
      var companyExchangeRates = payloadUtility.deserializeDates(companyExchangeRatesFromAPI);
      var companyCurrencies = {};

      currencyFactory.getDetailedCompanyCurrencies(payloadUtility.serializeDates($scope.search)).then(function (companyCurrenciesFromAPI) {
        // Create company currencies map
        angular.forEach(companyCurrenciesFromAPI.companyCurrencies, function (companyCurrency) {
          companyCurrencies[companyCurrency.currencyCode] = companyCurrency;
        });

        // Populate company exchange rates with denomination info
        angular.forEach(companyExchangeRates, function (exchangeRate) {
          exchangeRate.denominations = companyCurrencies[exchangeRate.acceptedCurrencyCode].denominations
            .map(function (denomination) {
              return parseFloat($this.getDenominationById(denomination.currencyDenominationId).denomination);
            })
            .sort($this.sortDenominationByValue)
            .join(", ");


          exchangeRate.easyPayDenominations = companyCurrencies[exchangeRate.acceptedCurrencyCode].denominations
            .filter(function (denomination) {
              return denomination.isEasyPay === 'true';
            })
            .map(function (denomination) {
              return parseFloat($this.getDenominationById(denomination.currencyDenominationId).denomination);
            })
            .sort($this.sortDenominationByValue)
            .join(", ");
        });

        // Add exchange rate rows which are not defined yet

        $scope.companyExchangeRates = companyExchangeRates;
      });
    };

    $scope.isExchangeRateDisabled = function (exchangeRate) {
      if ($scope.isExchangeRateReadOnly(exchangeRate))
      {
        return true;
      }
      if (exchangeRate.acceptedCurrencyCode === $scope.search.operatingCurrencyCode)
      {
        exchangeRate.exchangeRate = '1.0000';
        return true;
      }
    };

    $scope.isExchangeRateReadOnly = function (exchangeRate) {
      if (!exchangeRate.startDate || $scope.isExchangeRateNewOne(exchangeRate)) {
        return false;
      }
      return !(dateUtility.isAfterToday(exchangeRate.startDate));
    };

    $scope.isExchangeRatePartialReadOnly = function (exchangeRate) {
      if (!exchangeRate.endDate || $scope.isExchangeRateNewOne(exchangeRate)) {
        return false;
      }
      return !(dateUtility.isToday(exchangeRate.endDate) || dateUtility.isAfterToday(exchangeRate.endDate));
    };

    $scope.isExchangeRateNewOne = function (exchangeRate) {
      return (exchangeRate.id) ? false : true;
    };

    $scope.searchCompanyExchangeRates = function () {
      $scope.companyExchangeRates = [];
      currencyFactory.getCompanyExchangeRates(payloadUtility.serializeDates($scope.search)).then(function (companyExchangeRatesFromAPI) {
        $this.createFinalCompanyExchangeRatesList(companyExchangeRatesFromAPI.response)
      });
    };

    $scope.isSearchFormValid = function () {
      if($scope.search && $scope.search.operatingCurrencyCode) {
        return true;
      }
      return false;
    }


    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.companyExchangeRates = [];
    };

    this.getCompanyGlobalCurrencies = function () {
      currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencyList) {
        $scope.globalCurrencies = globalCurrencyList.response;
        $this.getDenominations();
        $this.getCompanyBaseCurrency();
      });
    };

    this.getCurrencyByBaseCurrencyId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.getCompanyBaseCurrency = function () {
      currencyFactory.getCompany(companyId).then(function (companyDataFromAPI) {
        $scope.companyBaseCurrency = $this.getCurrencyByBaseCurrencyId($scope.globalCurrencies, companyDataFromAPI.baseCurrencyId);
      });
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrenciesForSearch();
    };

    this.init();
  });
