'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CurrencyEditCtrl
 * @description
 * # CurrencyEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CurrencyEditCtrl', function ($scope, currencyFactory, GlobalMenuService, dateUtility, payloadUtility) {
    var $this = this;
    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Retail Company Currency & Denomination Setup';
    $scope.search = {};
    $scope.companyBaseCurrency = {};
    $scope.globalCurrencyList = [];
    $scope.companyCurrencyList = [];
    $scope.currencyToDelete = {};
    $scope.addDetailedCompanyCurrenciesNumber = 1;

    this.getCompanyGlobalCurrencies = function () {
      currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencyList) {
        $scope.globalCurrencyList = globalCurrencyList.response;
        $this.getCompanyBaseCurrency();
      });
    };

    this.getCompanyBaseCurrency = function () {
      currencyFactory.getCompany(companyId).then(function (companyDataFromAPI) {
        $scope.companyBaseCurrency = $this.getCurrencyByBaseCurrencyId($scope.globalCurrencyList, companyDataFromAPI.baseCurrencyId);
      });
    }

    this.getCurrencyByBaseCurrencyId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.getDetailedCompanyCurrencies = function () {
      currencyFactory.getDetailedCompanyCurrencies().then($this.attachCompanyCurrencyListToScope);
    };

    this.attachCompanyCurrencyListToScope = function (companyCurrencyListFromAPI) {
      $scope.companyCurrencyList = $this.normalizeDetailedCompanyCurrencies(companyCurrencyListFromAPI.companyCurrencies);
    };

    this.deleteDetailedCompanyCurrency = function(currencyId) {
      currencyFactory.deleteDetailedCompanyCurrency(currencyId);
    }

    $scope.searchDetailedCompanyCurrencies = function () {
      currencyFactory.getDetailedCompanyCurrencies(payloadUtility.serializeDates($scope.search)).then($this.attachCompanyCurrencyListToScope);
    };

    $scope.isCurrencyReadOnly = function (currency) {
      if (angular.isUndefined(currency)) {
        return false;
      }
      return !(currency.isNew || dateUtility.isAfterToday(currency.startDate));
    };

    $scope.isCurrencyPartialReadOnly = function (currency) {
      if (angular.isUndefined(currency)) {
        return false;
      }
      return !(currency.isNew || dateUtility.isToday(currency.endDate) || dateUtility.isAfterToday(currency.endDate));
    };

    $scope.showDeleteConfirmation = function (index, currency) {
      $scope.currencyToDelete = currency;
      $scope.currencyToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteDetailedCompanyCurrency = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element("#currency-" + $scope.currencyToDelete.rowIndex).remove();

      $this.deleteDetailedCompanyCurrency($scope.currencyToDelete.id);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchDetailedCompanyCurrencies();
    };

    this.normalizeDetailedCompanyCurrencies = function(currencies) {
      var formattedCurrencies = angular.copy(currencies);
      angular.forEach(formattedCurrencies, function (currency) {
        currency.startDate = dateUtility.formatDateForApp(currency.startDate);
        currency.endDate = dateUtility.formatDateForApp(currency.endDate);


        currency.flatDenominations = currency.denominations.map(function(denomination){
          return denomination.currencyDenominationId;
        }).join(", ");

        currency.flatEasyPayDenominations = currency.denominations.filter(function(denomination) {
          return denomination.isEasyPay === 'true';
        }).map(function(denomination){
          return denomination.currencyDenominationId;
        }).join(", ");
      });

      return formattedCurrencies;
    };

    $scope.addDetailedCompanyCurrencies = function() {
      var totalRowsToAdd = $scope.addDetailedCompanyCurrenciesNumber || 1;
      for (var i = 0; i < totalRowsToAdd; i++) {
        $scope.companyCurrencyList.push({
          isNew: true,
          startDate: dateUtility.nowFormatted(),
          endDate: dateUtility.nowFormatted()
        });
      }
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrencies();
    };

    this.init();
  });
