'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyExchangeRateEditCtrl
 * @description
 * # CompanyExchangeRateEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyExchangeRateEditCtrl', function($scope, globalMenuService, currencyFactory, dateUtility,
    payloadUtility, messageService, $filter, lodash) {

    var $this = this;

    this.companyId = globalMenuService.company.get();
    $scope.viewName = 'Manage Retail Company ePOS Exchange Rate';
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

    this.formatPayloadForSearch = function() {
      var searchPayload = angular.copy($scope.search);
      searchPayload = payloadUtility.serializeDates(searchPayload);
      if (searchPayload.acceptedCurrencies) {
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
            return denomination.isEasyPay;
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
          
          exchangeRate.exchangeRate = parseFloat(exchangeRate.exchangeRate).toFixed(4);
          
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
              isNew: true,
              id: null,
              acceptedCurrencyCode: currency.currencyCode,
              operatingCurrencyCode: $scope.search.operatingCurrencyCode,
              denominations: currency.flatDenominations,
              easyPayDenominations: currency.flatEasyPayDenominations,
              exchangeRateType: 1,
              startDate: dateUtility.tomorrowFormattedDatePicker(),
              endDate: dateUtility.tomorrowFormattedDatePicker()
            });
          }
        });

        $scope.companyExchangeRates = companyExchangeRates.sort($this.sortExchangeRatesByCurrencyCode);
        $this.hideLoadingModal();
      });
    };
    
    $scope.isCurrentEffectiveDate = function (exchangeRate) {
      return (dateUtility.isTodayOrEarlierDatePicker(exchangeRate.startDate) && (dateUtility.isAfterTodayDatePicker(exchangeRate.endDate) || dateUtility.isTodayDatePicker(exchangeRate.endDate)));
    };
    
    $scope.isPastDate = function (exchangeRate) {
      return (dateUtility.isYesterdayOrEarlierDatePicker(exchangeRate.startDate) && dateUtility.isYesterdayOrEarlierDatePicker(exchangeRate.endDate));
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
      messageService.display(className, message, type);
    };

    this.showSaveSuccess = function(response) {
//      console.log('created ID: '+response.id);  TODO setup payload with resonce id
      $this.showToast('success', 'Company Exchange Rate', 'exchange rate successfully saved!');
      $this.hideLoadingModal();
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
        currencyFactory.createCompanyExchangeRate(payload).then($this.showSaveSuccess(), $this.showSaveErrors);
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

      return !(dateUtility.isAfterTodayDatePicker(exchangeRate.startDate));
    };

    $scope.isExchangeRatePartialReadOnly = function(exchangeRate) {
      if (!exchangeRate.endDate || $scope.isExchangeRateNewOne(exchangeRate) || exchangeRate.isCloned) {
        return false;
      }

      return !(dateUtility.isAfterTodayDatePicker(exchangeRate.endDate) || dateUtility.isTodayDatePicker(exchangeRate.endDate));
    };

    $scope.isExchangeRateNewOne = function(exchangeRate) {
      return (exchangeRate.id) ? false : true;
    };

    $scope.searchCompanyExchangeRates = function() {
      $this.showLoadingModal('Loading Data');
      $scope.companyExchangeRates = [];
      $scope.displayError = false;
      $scope.errorResponse = {};
      var searchPayload = $this.formatPayloadForSearch();
      if ($this.eposExchangeRateType) {
        searchPayload.exchangeRateType = $this.eposExchangeRateType.id;
      }

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
      $scope.displayError = false;
      $scope.errorResponse = {};
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
      $scope.searchCompanyExchangeRates();
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
      if (exchangeRate.id !== undefined || exchangeRate.id) {
        $scope.exchangeRateToDelete = exchangeRate;
        $scope.exchangeRateToDelete.rowIndex = index;
        angular.element('.delete-warning-modal').modal('show');
      }else {
        $scope.companyExchangeRates.splice(index, 1);
      }
      
    };
    
    $scope.isClonedRowClass = function (exchangeRate) {
        if (exchangeRate.isCloned) {
          return 'bg-warning';
        }
      };
      
    $scope.deleteCompanyExchangeRate = function() {
      angular.element('.delete-warning-modal').modal('hide');
      $scope.companyExchangeRates.splice($scope.exchangeRateToDelete.rowIndex, 1);
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
      newExchangeRate.startDate = dateUtility.tomorrowFormattedDatePicker();
      newExchangeRate.endDate = dateUtility.tomorrowFormattedDatePicker();
      newExchangeRate.isCloned = true;

      var newExchangeRates = angular.copy($scope.companyExchangeRates);
      newExchangeRates.push(newExchangeRate);
      $scope.companyExchangeRates = $filter('orderBy')(newExchangeRates,
        'acceptedCurrencyCode + exchangeRate + startDate');
    };

    this.setPortalExchangeRate = function (dataFromAPI) {
      var exchangeRateTypes = angular.copy(dataFromAPI);
      $this.eposExchangeRateType = lodash.findWhere(exchangeRateTypes, { name: 'EPOS Exchange Rate' });
    };

    this.getExchangeRateTypes = function () {
      currencyFactory.getExchangeRateTypes().then($this.setPortalExchangeRate);
    };

    this.init = function() {
      $this.getExchangeRateTypes();
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrenciesForSearch();
    };

    this.init();
  });
