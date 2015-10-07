'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CurrencyEditCtrl
 * @description
 * # CurrencyEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CurrencyEditCtrl', function ($scope, currencyFactory, GlobalMenuService) {
    var $this = this;
    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Retail Company Currency & Denomination Setup';
    $scope.companyBaseCurrency = {};
    $scope.search = {};
    $scope.globalCurrencyList = [];

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

    $scope.clearForm = function () {
      $scope.search = {};
      //$scope.searchCurrencies();
    };

    this.init = function () {
      $this.getCompanyGlobalCurrencies();
      $this.getCompanyBaseCurrency(companyId);
    };

    this.init();
  });
