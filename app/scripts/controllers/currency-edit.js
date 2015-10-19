'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CurrencyEditCtrl
 * @description
 * # CurrencyEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CurrencyEditCtrl', function ($scope, currencyFactory, GlobalMenuService, dateUtility, payloadUtility, ngToast) {
    var $this = this;
    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Retail Company Currency & Denomination Setup';
    $scope.search = {};
    $scope.companyBaseCurrency = {};
    $scope.globalCurrencyList = [];
    $scope.companyCurrencyList = [];
    $scope.currencyToDelete = {};
    $scope.currencyDenominations = {};
    $scope.addDetailedCompanyCurrenciesNumber = 1;

    this.getCompanyGlobalCurrencies = function () {
      currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencyList) {
        $scope.globalCurrencyList = globalCurrencyList.response;
        $this.getDenominations();
        $this.getDetailedCompanyCurrencies();
        $this.getCompanyBaseCurrency();
      });
    };

    this.getDenominations = function () {
      angular.forEach($scope.globalCurrencyList, function (currency){
          $scope.currencyDenominations[currency.id] = currency.currencyDenominations ;
      });
    };

    this.getDetailedCompanyCurrencies = function () {
      currencyFactory.getDetailedCompanyCurrencies().then($this.attachDetailedCompanyCurrencyListToScope);
    };

    this.getCompanyBaseCurrency = function () {
      currencyFactory.getCompany(companyId).then(function (companyDataFromAPI) {
        $scope.companyBaseCurrency = $this.getCurrencyByBaseCurrencyId($scope.globalCurrencyList, companyDataFromAPI.baseCurrencyId);
      });
    };

    this.deleteDetailedCompanyCurrency = function (currencyId) {
      currencyFactory.deleteDetailedCompanyCurrency(currencyId);
    };

    this.getCurrencyByBaseCurrencyId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    $scope.searchDetailedCompanyCurrencies = function () {
      currencyFactory.getDetailedCompanyCurrencies(payloadUtility.serializeDates($scope.search))
                     .then($this.attachDetailedCompanyCurrencyListToScope);
    };

    $scope.saveDetailedCompanyCurrency = function (index, currency) {
      showLoadingModal('Loading Data');

      var payload = $this.denormalizeDetailedCompanyCurrency(index, currency);
      if (currency.isNew) {
        currencyFactory.createDetailedCompanyCurrency(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
      else {
        currencyFactory.updateDetailedCompanyCurrency(payload).then($this.showSaveSuccess, $this.showSaveErrors);
      }
    };

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    this.showSaveSuccess = function () {
      $this.getDetailedCompanyCurrencies();
      hideLoadingModal();
      $this.showToast('success', 'Currency', 'currency successfully saved!');
    };

    this.showSaveErrors = function (dataFromAPI) {
      hideLoadingModal();
      $this.showToast('danger', 'Currency', 'error saving currency!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    };

    $scope.showDeleteConfirmation = function (index, currency) {
      $scope.currencyToDelete = currency;
      $scope.currencyToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteDetailedCompanyCurrency = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#currency-' + $scope.currencyToDelete.rowIndex).remove();

      $this.deleteDetailedCompanyCurrency($scope.currencyToDelete.id);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchDetailedCompanyCurrencies();
    };

    $scope.addDetailedCompanyCurrencies = function () {
      var totalRowsToAdd = $scope.addDetailedCompanyCurrenciesNumber || 1;
      for (var i = 0; i < totalRowsToAdd; i++) {
        $scope.companyCurrencyList.push({
          isNew: true,
          companyId: $this.companyId,
          selectedDenominations: [],
          selectedEasyPayDenominations: []
        });
      }
    };

    this.showToast = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    $scope.isCurrencyReadOnly = function (currency) {
      if (!currency.startDate || currency.isNew) {
        return false;
      }
      return !(dateUtility.isAfterToday(currency.startDate));
    };

    $scope.isCurrencyPartialReadOnly = function (currency) {
      if (!currency.endDate || currency.isNew) {
        return false;
      }
      return !(dateUtility.isToday(currency.endDate) || dateUtility.isAfterToday(currency.endDate));
    };

    this.attachDetailedCompanyCurrencyListToScope = function (companyCurrencyListFromAPI) {
      $scope.companyCurrencyList = $this.normalizeDetailedCompanyCurrencies(companyCurrencyListFromAPI.companyCurrencies);
    };

    this.normalizeDetailedCompanyCurrencies = function (currencies) {
      var formattedCurrencies = angular.copy(currencies);
      angular.forEach(formattedCurrencies, function (currency) {
        currency.startDate = dateUtility.formatDateForApp(currency.startDate);
        currency.endDate = dateUtility.formatDateForApp(currency.endDate);

        // Populate select box with denominations
        currency.selectedDenominations = currency.denominations.map(function (denomination){
          return $this.getDenominationById($scope.currencyDenominations[currency.currencyId], denomination.currencyDenominationId);
        }).sort($this.sortDenominationByValue);

        // Populate select box with easy pay denominations
        currency.selectedEasyPayDenominations = currency.denominations.filter(function (denomination) {
          return denomination.isEasyPay === 'true';
        }).map(function (denomination){
          return $this.getDenominationById($scope.currencyDenominations[currency.currencyId], denomination.currencyDenominationId);
        }).sort($this.sortDenominationByValue);
      });

      return formattedCurrencies;
    };

    this.denormalizeDetailedCompanyCurrency = function (index, currency) {
      var payload = {};

      payload.id = currency.id;
      payload.companyId = currency.companyId;
      payload.currencyId = currency.currencyId;
      payload.startDate = (currency.startDate) ? dateUtility.formatDateForAPI(currency.startDate) : null;
      payload.endDate = (currency.endDate) ? dateUtility.formatDateForAPI(currency.endDate) : null;
      payload.isOperatedCurrency = currency.isOperatedCurrency;
      payload.eposDisplayOrder = index + 1;
      payload.denominations = currency.selectedDenominations.map(function (denomination) {
        return {
          id: null,
          companyCurrencyId: denomination.currencyId,
          currencyDenominationId: denomination.id,
          isEasyPay: $this.isDenominationEasyPay(currency.selectedEasyPayDenominations, denomination.id)
        };
      });

      return payload;
    };

    this.isDenominationEasyPay = function (selectedEasyPayDenominations, denominationId) {
      return selectedEasyPayDenominations.map(function (denomination) {
        return denomination.id;
      })
      .indexOf(denominationId) > -1;
    };

    this.getDenominationById = function (denominations, denominationId) {
      return denominations.filter(function (denomination) {
        return denomination.id === denominationId;
      })[0];
    };

    this.sortDenominationByValue = function (a, b) {
      return parseFloat(a.denomination) - parseFloat(b.denomination);
    };

    $scope.clearDenominations = function (currency){
      currency.selectedDenominations = [];
      currency.selectedEasyPayDenominations = [];
    };

    $scope.removeInvalidEasyPayDenominations = function (currency){
      currency.selectedEasyPayDenominations = currency.selectedEasyPayDenominations.filter(function (el) {
        return currency.selectedDenominations.indexOf(el) > 0;
      } );
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
    };

    this.init();
  });
