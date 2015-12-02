'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyExchangeRateEditCtrl
 * @description
 * # CompanyExchangeRateEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyExchangeRateEditCtrl', function($scope, GlobalMenuService, currencyFactory, dateUtility,
    payloadUtility, ngToast, $filter) {
    var $this = this;

    this.companyId = GlobalMenuService.company.get();
    $scope.viewName = 'Manage Retail Company Exchange Rate';
    $scope.search = {};
    $scope.globalCurrencies = [];
    $scope.currencyDenominations = {};
    $scope.companyBaseCurrency = {};
    $scope.exchangeRateToDelete = {};
    $scope.companyExchangeRates = [];
    $scope.detailedCompanyCurrenciesForSearch = [];

    $scope.companyExchangeRateFilter = function(exchangeRate) {
      if (!$scope.search.acceptedCurrencies || $scope.search.acceptedCurrencies.length === 0) {
        return true;
      }

      return $scope.search.acceptedCurrencies.filter(function(acceptedCurrency) {
          return acceptedCurrency.currencyCode === exchangeRate.acceptedCurrencyCode;
        })
        .length > 0;
    };

    this.getDenominations = function() {
      angular.forEach($scope.globalCurrencies, function(currency) {
        angular.forEach(currency.currencyDenominations, function(denomination) {
          $scope.currencyDenominations[denomination.id] = denomination;
        });
      });
    };

    this.getDenominationById = function(denominationId) {
      return $scope.currencyDenominations[denominationId];
    };

    this.sortDenominationByValue = function(a, b) {
      return parseFloat(a) - parseFloat(b);
    };

    this.sortExchangeRatesByCurrencyCode = function(a, b) {
      return a.acceptedCurrencyCode.localeCompare(b.acceptedCurrencyCode);
    };

    this.getDetailedCompanyCurrenciesForSearch = function() {
      currencyFactory.getDetailedCompanyCurrencies().then(function(companyCurrencyListFromAPI) {
        $scope.detailedCompanyCurrenciesForSearch = payloadUtility.deserializeDates(companyCurrencyListFromAPI.companyCurrencies);
      });
    };

    this.makeFlatDenominations = function(denominations) {
      if (!denominations) {
        denominations = [];
      }

      return denominations.map(function(denomination) {
          return parseFloat($this.getDenominationById(denomination.currencyDenominationId).denomination);
        })
        .sort($this.sortDenominationByValue)
        .join(', ');
    };

    this.formatPayloadForSearch = function () {
      var searchPayload = angular.copy($scope.search);
      searchPayload = payloadUtility.serializeDates(searchPayload);
      if(searchPayload.acceptedCurrencies) {
        delete searchPayload.acceptedCurrencies;
      }
      return searchPayload;
    };

    this.normalizeCompanyExchangeRatesList = function(companyExchangeRatesFromAPI) {
      var companyExchangeRates = payloadUtility.deserializeDates(companyExchangeRatesFromAPI);
      var companyCurrencies = {};

      var searchPayload = $this.formatPayloadForSearch();
      currencyFactory.getDetailedCompanyCurrencies(searchPayload).then(function(
        companyCurrenciesFromAPI) {
        // Create company currencies map
        angular.forEach(companyCurrenciesFromAPI.companyCurrencies, function(companyCurrency) {
          companyCurrency.flatDenominations = $this.makeFlatDenominations(companyCurrency.denominations);

          var easyPayDenominations = companyCurrency.denominations.filter(function(denomination) {
            return denomination.isEasyPay === 'true';
          });
          companyCurrency.flatEasyPayDenominations = $this.makeFlatDenominations(easyPayDenominations);

          companyCurrencies[companyCurrency.currencyCode] = companyCurrency;
        });

        // Populate company exchange rates with denomination info
        angular.forEach(companyExchangeRates, function(exchangeRate) {
          if (companyCurrencies[exchangeRate.acceptedCurrencyCode]) {
            exchangeRate.denominations = companyCurrencies[exchangeRate.acceptedCurrencyCode].flatDenominations;
            exchangeRate.easyPayDenominations = companyCurrencies[exchangeRate.acceptedCurrencyCode].flatEasyPayDenominations;
          } else {
            exchangeRate.invalid = true;
          }

          if (exchangeRate.acceptedCurrencyCode === $scope.search.operatingCurrencyCode) {
            exchangeRate.exchangeRate = '1.0000';
          }
        });

        companyExchangeRates = companyExchangeRates.filter(function(exchangeRate) {
          return !exchangeRate.invalid;
        });

        // Add exchange rate rows which are not defined yet
        angular.forEach(companyCurrencies, function(currency) {
          var isFound = companyExchangeRates.filter(function(exchangeRate) {
            return exchangeRate.acceptedCurrencyCode === currency.currencyCode;
          }).length > 0;

          if (!isFound) {
            companyExchangeRates.push({
              companyId: $this.companyId,
              acceptedCurrencyCode: currency.currencyCode,
              operatingCurrencyCode: $scope.search.operatingCurrencyCode,
              denominations: currency.flatDenominations,
              easyPayDenominations: currency.flatEasyPayDenominations,
              exchangeRate: '1.0000',
              exchangeRateType: 1,
              startDate: dateUtility.tomorrowFormatted(),
              endDate: dateUtility.tomorrowFormatted()
            });
          }
        });

        $scope.companyExchangeRates = companyExchangeRates.sort($this.sortExchangeRatesByCurrencyCode);
        $this.hideLoadingModal();
      });
    };

    this.denormalizeCompanyExchangeRate = function(index, exchangeRate) {
      var payload = {};

      payload.id = exchangeRate.id;
      payload.acceptedCurrencyCode = exchangeRate.acceptedCurrencyCode;
      payload.operatingCurrencyCode = $scope.search.operatingCurrencyCode;
      payload.companyId = $this.companyId;
      payload.exchangeRate = exchangeRate.exchangeRate;
      payload.exchangeRateType = 1;
      payload.startDate = (exchangeRate.startDate) ? dateUtility.formatDateForAPI(exchangeRate.startDate) : null;
      payload.endDate = (exchangeRate.endDate) ? dateUtility.formatDateForAPI(exchangeRate.endDate) : null;

      return payload;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    this.showToast = function(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.showSaveSuccess = function() {
      $scope.searchCompanyExchangeRates();
      $this.showToast('success', 'Company Exchange Rate', 'exchange rate successfully saved!');
    };

    this.showSaveErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    $scope.saveCompanyExchangeRate = function(index, exchangeRate) {
      $this.showLoadingModal('Loading Data');

      var payload = $this.denormalizeCompanyExchangeRate(index, exchangeRate);
      if (exchangeRate.id) {
        currencyFactory.updateCompanyExchangeRate(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      } else {
        currencyFactory.createCompanyExchangeRate(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
    };

    $scope.isExchangeRateDisabled = function(exchangeRate) {
      if (exchangeRate.acceptedCurrencyCode === $scope.search.operatingCurrencyCode) {
        return true;
      }
      if ($scope.isExchangeRateReadOnly(exchangeRate)) {
        return true;
      }
      return false;
    };

    $scope.isExchangeRateReadOnly = function(exchangeRate) {
      if (!exchangeRate.startDate || $scope.isExchangeRateNewOne(exchangeRate) || exchangeRate.isCloned) {
        return false;
      }
      return !(dateUtility.isAfterToday(exchangeRate.startDate));
    };

    $scope.isExchangeRatePartialReadOnly = function(exchangeRate) {
      if (!exchangeRate.endDate || $scope.isExchangeRateNewOne(exchangeRate) || exchangeRate.isCloned) {
        return false;
      }
      return !(dateUtility.isAfterToday(exchangeRate.endDate) || dateUtility.isToday(exchangeRate.endDate));
    };

    $scope.isExchangeRateNewOne = function(exchangeRate) {
      return (exchangeRate.id) ? false : true;
    };

    $scope.searchCompanyExchangeRates = function() {
      $this.showLoadingModal('Loading Data');
      $scope.companyExchangeRates = [];
      var searchPayload = $this.formatPayloadForSearch();
      console.log(searchPayload);
      currencyFactory.getCompanyExchangeRates(searchPayload).then(function(
        companyExchangeRatesFromAPI) {
        $this.normalizeCompanyExchangeRatesList(companyExchangeRatesFromAPI.response);
      });
    };

    $scope.isSearchFormValid = function() {
      return ($scope.search && $scope.search.operatingCurrencyCode) ? true : false;
    };

    $scope.clearSearchForm = function() {
      $scope.search = {};
      $scope.companyExchangeRates = [];
    };

    this.getCompanyGlobalCurrencies = function() {
      currencyFactory.getCompanyGlobalCurrencies().then(function(globalCurrencyList) {
        $scope.globalCurrencies = globalCurrencyList.response;
        $this.getDenominations();
        $this.getCompanyBaseCurrency();
      });
    };

    this.getCurrencyByBaseCurrencyId = function(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function(currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.getCompanyBaseCurrency = function() {
      currencyFactory.getCompany($this.companyId).then(function(companyDataFromAPI) {
        $scope.companyBaseCurrency = $this.getCurrencyByBaseCurrencyId($scope.globalCurrencies,
          companyDataFromAPI.baseCurrencyId);
      });
    };

    this.deleteExchangeRateSuccessHandler = function() {
      $this.hideLoadingModal();
    };

    this.deleteCompanyExchangeRate = function(exchangeRateId) {
      var payload = {
        companyId: $this.companyId,
        exchangeRateType: 1,
        id: exchangeRateId
      };
      if (exchangeRateId) {
        $this.showLoadingModal('Loading Data');
        currencyFactory.deleteCompanyExchangeRate(payload).then($this.deleteExchangeRateSuccessHandler);
      }
    };

    $scope.showDeleteConfirmation = function(index, exchangeRate) {
      $scope.exchangeRateToDelete = exchangeRate;
      $scope.exchangeRateToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteCompanyExchangeRate = function() {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#exchange-rate-' + $scope.exchangeRateToDelete.rowIndex).remove();

      $this.deleteCompanyExchangeRate($scope.exchangeRateToDelete.id);
    };

    $scope.duplicateExchangeRate = function(index, exchangeRate) {
      var newExchangeRate = {};
      newExchangeRate.companyId = exchangeRate.companyId;
      newExchangeRate.acceptedCurrencyCode = exchangeRate.acceptedCurrencyCode;
      newExchangeRate.operatingCurrencyCode = exchangeRate.operatingCurrencyCode;
      newExchangeRate.denominations = exchangeRate.denominations;
      newExchangeRate.easyPayDenominations = exchangeRate.easyPayDenominations;
      newExchangeRate.exchangeRate = exchangeRate.exchangeRate;
      newExchangeRate.exchangeRateType = exchangeRate.exchangeRateType;
      newExchangeRate.startDate = dateUtility.tomorrowFormatted();
      newExchangeRate.endDate = dateUtility.tomorrowFormatted();
      newExchangeRate.isCloned = true;

      var newExchangeRates = angular.copy($scope.companyExchangeRates);
      newExchangeRates.push(newExchangeRate);
      $scope.companyExchangeRates = $filter('orderBy')(newExchangeRates,
        'acceptedCurrencyCode + exchangeRate + startDate');
    };

    this.init = function() {
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrenciesForSearch();
    };

    this.init();
  });
