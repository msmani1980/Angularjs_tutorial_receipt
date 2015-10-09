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

    this.getCompanyGlobalCurrencies = function () {
      currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencyList) {
        $scope.globalCurrencyList = globalCurrencyList.response;
        $this.getCompanyBaseCurrency();
      });
    };

    this.getCompanyBaseCurrency = function() {
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

    $scope.searchDetailedCompanyCurrencies = function () {
      currencyFactory.getDetailedCompanyCurrencies(payloadUtility.serializeDates($scope.search)).then($this.attachCompanyCurrencyListToScope);
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
      });
      return formattedCurrencies;
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
      $this.getDetailedCompanyCurrencies();
    };

    this.init();
  });
