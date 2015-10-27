'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyExchangeRateEditCtrl
 * @description
 * # CompanyExchangeRateEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyExchangeRateEditCtrl', function ($scope, GlobalMenuService, currencyFactory, dateUtility, payloadUtility, ngToast) {
    var companyId = GlobalMenuService.company.get();

    var $this = this;
    $scope.viewName = 'Manage Retail Company Exchange Rate';
    $scope.search = {};
    $scope.globalCurrencies = [];
    $scope.currencyDenominations = {};
    $scope.companyBaseCurrency = {};
    $scope.exchangeRateToDelete = {};
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

    this.normalizeCompanyExchangeRatesList = function (companyExchangeRatesFromAPI) {
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
        $this.hideLoadingModal();
      });
    };

    this.denormalizeCompanyExchangeRate = function (index, exchangeRate) {
      var payload = {};

      payload.id = exchangeRate.id;
      payload.acceptedCurrencyCode = exchangeRate.acceptedCurrencyCode;
      payload.operatingCurrencyCode = exchangeRate.operatingCurrencyCode;
      payload.companyId = $this.companyId;
      payload.exchangeRate = exchangeRate.exchangeRate;
      payload.exchangeRateType = 1;
      payload.startDate = (exchangeRate.startDate) ? dateUtility.formatDateForAPI(exchangeRate.startDate) : null;
      payload.endDate = (exchangeRate.endDate) ? dateUtility.formatDateForAPI(exchangeRate.endDate) : null;

      return payload;
    };

    this.showLoadingModal = function (message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    this.showToast = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.showSaveSuccess = function () {
      $scope.searchCompanyExchangeRates();
      $this.showToast('success', 'Company Exchange Rate', 'exchange rate successfully saved!');
    };

    this.showSaveErrors = function (dataFromAPI) {
      $this.hideLoadingModal();
      $this.showToast('danger', 'Company Exchange Rate', 'error saving exchange rate!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    };

    $scope.saveCompanyExchangeRate = function (index, exchangeRate) {
      $this.showLoadingModal('Loading Data');

      var payload = $this.denormalizeCompanyExchangeRate(index, exchangeRate);
      if (exchangeRate.id) {
        currencyFactory.updateCompanyExchangeRate(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
      else {
        currencyFactory.createCompanyExchangeRate(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
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
      $this.showLoadingModal('Loading Data');
      $scope.companyExchangeRates = [];
      currencyFactory.getCompanyExchangeRates(payloadUtility.serializeDates($scope.search)).then(function (companyExchangeRatesFromAPI) {
        $this.normalizeCompanyExchangeRatesList(companyExchangeRatesFromAPI.response)
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

    this.deleteCompanyExchangeRate = function (exchangeRateId) {
      currencyFactory.deleteCompanyExchangeRate(exchangeRateId);
    };

    $scope.showDeleteConfirmation = function (index, exchangeRate) {
      $scope.exchangeRateToDelete = exchangeRate;
      $scope.exchangeRateToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteCompanyExchangeRate = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#exchange-rate-' + $scope.exchangeRateToDelete.rowIndex).remove();

      $this.deleteCompanyExchangeRate($scope.exchangeRateToDelete.id);
    };

    $scope.duplicateExchangeRate = function (index, exchangeRate) {
      var newExchangeRate = angular.copy(exchangeRate);
      newExchangeRate.id = null;
      newExchangeRate.startDate = dateUtility.nowFormatted();
      newExchangeRate.endDate = dateUtility.nowFormatted();
      newExchangeRate.exchangeRate = "1.0000";

      $scope.companyExchangeRates.splice(index, 0, newExchangeRate);
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrenciesForSearch();
    };

    this.init();
  });
