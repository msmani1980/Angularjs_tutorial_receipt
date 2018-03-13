'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CurrencyEditCtrl
 * @description
 * # CurrencyEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CurrencyEditCtrl', function($scope, currencyFactory, globalMenuService, dateUtility, payloadUtility,
    messageService, accessService) {

    var $this = this;
    $scope.viewName = 'Retail Company Currency & Denomination Setup';
    $scope.search = {};
    $scope.companyBaseCurrency = {};
    $scope.globalCurrencyList = [];
    $scope.companyCurrencyList = [];
    $scope.currencyToDelete = {};
    $scope.currencyDenominations = {};
    $scope.addDetailedCompanyCurrenciesNumber = 1;

    this.getDenominations = function() {
      angular.forEach($scope.globalCurrencyList, function(currency) {
        $scope.currencyDenominations[currency.id] = currency.currencyDenominations;
      });
    };

    this.getDenominationById = function(denominations, denominationId) {
      return denominations.filter(function(denomination) {
        return denomination.id === denominationId;
      })[0];
    };

    this.sortDenominationByValue = function(a, b) {
      return parseFloat(a.denomination) - parseFloat(b.denomination);
    };

    this.normalizeDetailedCompanyCurrencies = function(currencies) {
      var formattedCurrencies = angular.copy(currencies);
      angular.forEach(formattedCurrencies, function(currency) {
        currency.startDate = dateUtility.formatDateForApp(currency.startDate);
        currency.endDate = dateUtility.formatDateForApp(currency.endDate);

        // Populate select box with denominations
        currency.selectedDenominations = currency.denominations.map(function(denomination) {
          return $this.getDenominationById($scope.currencyDenominations[currency.currencyId], denomination.currencyDenominationId);
        }).sort($this.sortDenominationByValue);

        // Populate select box with easy pay denominations
        currency.selectedEasyPayDenominations = currency.denominations.filter(function(denomination) {
          return denomination.isEasyPay;
        }).map(function(denomination) {
          return $this.getDenominationById($scope.currencyDenominations[currency.currencyId], denomination.currencyDenominationId);
        }).sort($this.sortDenominationByValue);
      });

      return formattedCurrencies;
    };

    this.attachDetailedCompanyCurrencyListToScope = function(companyCurrencyListFromAPI) {
      $scope.companyCurrencyList = $this.normalizeDetailedCompanyCurrencies(companyCurrencyListFromAPI.companyCurrencies);
      $this.hideLoadingModal();
    };

    this.getDetailedCompanyCurrencies = function() {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };
      currencyFactory.getDetailedCompanyCurrencies(payload).then($this.attachDetailedCompanyCurrencyListToScope);
    };

    this.getCurrencyByBaseCurrencyId = function(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function(currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.getCompanyBaseCurrency = function() {
      var companyId = globalMenuService.company.get();
      currencyFactory.getCompany(companyId).then(function(companyDataFromAPI) {
        $scope.companyBaseCurrency = $this.getCurrencyByBaseCurrencyId($scope.globalCurrencyList,
          companyDataFromAPI.baseCurrencyId);
      });
    };

    this.getCompanyGlobalCurrencies = function() {
      $this.showLoadingModal('Loading Data');
      currencyFactory.getCompanyGlobalCurrencies().then(function(globalCurrencyList) {
        $scope.globalCurrencyList = globalCurrencyList.response;
        $this.getDenominations();
        $this.getDetailedCompanyCurrencies();
        $this.getCompanyBaseCurrency();
      });
    };

    $scope.searchDetailedCompanyCurrencies = function() {
      $this.showLoadingModal('Loading Data');

      if (!$scope.search.currencyId) {
        $scope.search.currencyId = null;
      }

      currencyFactory.getDetailedCompanyCurrencies(payloadUtility.serializeDates($scope.search))
        .then($this.attachDetailedCompanyCurrencyListToScope);
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    this.showToast = function(className, type, message) {
      messageService.display(className, '<strong>' + type + '</strong>: ' + message);
    };

    this.showSaveSuccess = function() {
      $scope.displayError = false;
      $this.getDetailedCompanyCurrencies();
      $this.showToast('success', 'Currency', 'currency successfully saved!');
    };

    this.showSaveErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $this.showToast('danger', 'Currency', 'error saving currency!');

      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    };

    this.isDenominationEasyPay = function(selectedEasyPayDenominations, denominationId) {
      return selectedEasyPayDenominations.map(function(denomination) {
          return denomination.id;
        })
        .indexOf(denominationId) > -1;
    };

    this.denormalizeDetailedCompanyCurrency = function(index, currency) {
      var payload = {};
      if (!currency.isNew) {
        payload.id = currency.id;
      }

      payload.companyId = currency.companyId;
      payload.currencyId = currency.currencyId;
      payload.startDate = (currency.startDate) ? dateUtility.formatDateForAPI(currency.startDate) : null;
      payload.endDate = (currency.endDate) ? dateUtility.formatDateForAPI(currency.endDate) : null;
      payload.isOperatedCurrency = currency.isOperatedCurrency;
      payload.eposDisplayOrder = index + 1;
      payload.denominations = currency.selectedDenominations.map(function(denomination) {
        return {
          id: null,
          companyCurrencyId: denomination.currencyId,
          currencyDenominationId: denomination.id,
          isEasyPay: $this.isDenominationEasyPay(currency.selectedEasyPayDenominations, denomination.id)
        };
      });

      return payload;
    };

    $scope.saveDetailedCompanyCurrency = function(index, currency) {
      $this.showLoadingModal('Loading Data');

      var payload = $this.denormalizeDetailedCompanyCurrency(index, currency);
      if (currency.isNew) {
        currencyFactory.createDetailedCompanyCurrency(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      } else {
        currencyFactory.updateDetailedCompanyCurrency(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
    };

    $scope.showDeleteConfirmation = function(index, currency) {
      $scope.currencyToDelete = angular.copy(currency);
      $scope.currencyToDelete.rowIndex = index;
      $scope.currencyToDelete.currencyCode = $this.getCurrencyCodeById(currency.currencyId);
      $scope.currencyToDelete.isOperatedCurrency = (currency.isOperatedCurrency === true) ? 'Yes' : 'No';

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.removeAddedCurrency = function(key) {
      $scope.companyCurrencyList.splice(key, 1);
    };

    this.getCurrencyIndexById = function(currencyId) {
      return $scope.companyCurrencyList.map(function(currency) {
        return currency.id;
      }).indexOf(currencyId);
    };

    this.getCurrencyCodeById = function(currencyId) {
      var currency = $scope.globalCurrencyList.filter(function(currency) {
        return currency.id === currencyId;
      });

      return (currency.length > 0) ? currency[0].currencyCode : '';
    };

    this.errorHandler = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    function deleteCurrencySuccessHandler() {
      var index = $this.getCurrencyIndexById($scope.currencyToDelete.id);
      $scope.companyCurrencyList.splice(index, 1);
      $this.hideLoadingModal();
    }

    $scope.deleteDetailedCompanyCurrency = function() {
      angular.element('.delete-warning-modal').modal('hide');
      if ($scope.currencyToDelete.id) {
        $this.showLoadingModal('Loading Data');
        currencyFactory.deleteDetailedCompanyCurrency($scope.currencyToDelete.id).then(deleteCurrencySuccessHandler,
          $this.errorHandler);
        return;
      }

      $scope.companyCurrencyList.splice($scope.currencyToDelete.rowIndex, 1);
    };

    $scope.clearForm = function() {
      $scope.search = {};
      $scope.companyCurrencyList = [];
    };

    $scope.addDetailedCompanyCurrencies = function() {
      var nextIndex = $scope.companyCurrencyList.length;
      var totalRowsToAdd = $scope.addDetailedCompanyCurrenciesNumber || 1;
      for (var i = 0; i < totalRowsToAdd; i++) {
        nextIndex++;
        $scope.companyCurrencyList.push({
          isNew: true,
          id: nextIndex,
          companyId: globalMenuService.company.get(),
          startDate: dateUtility.tomorrowFormattedDatePicker(),
          endDate: dateUtility.tomorrowFormattedDatePicker(),
          selectedDenominations: [],
          selectedEasyPayDenominations: []
        });
      }
    };

    $scope.isCurrencyReadOnly = function(currency) {
      if (!currency.startDate || currency.isNew) {
        return false;
      }

      return !(dateUtility.isAfterTodayDatePicker(currency.startDate));
    };

    $scope.isCurrencyPartialReadOnly = function(currency) {
      if (!currency.endDate || currency.isNew) {
        return false;
      }

      return !(dateUtility.isTodayDatePicker(currency.endDate) || dateUtility.isAfterTodayDatePicker(currency.endDate));
    };

    $scope.clearDenominations = function(currency) {
      currency.selectedDenominations = [];
      currency.selectedEasyPayDenominations = [];
    };

    $scope.removeInvalidEasyPayDenominations = function(currency) {
      currency.selectedEasyPayDenominations = currency.selectedEasyPayDenominations.filter(function(el) {
        return currency.selectedDenominations.indexOf(el) > 0;
      });
    };

    $scope.getUpdateBy = function (row) {
      if (row.updatedByPerson) {
        return row.updatedByPerson.userName;
      }

      if (row.createdByPerson) {
        return row.createdByPerson.userName;
      }

      return 'Unknown';
    };

    $scope.getUpdatedOn = function (row) {
      if (!row.createdOn) {
        return 'Unknown';
      }

      return row.updatedOn ? dateUtility.formatTimestampForApp(row.updatedOn) : dateUtility.formatTimestampForApp(row.createdOn);
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('CURRENCYEXCHNG', 'COMPANYCURRENCY', 'CUDCMPCURR');
      $this.getCompanyGlobalCurrencies();
    };

    this.init();
  });
