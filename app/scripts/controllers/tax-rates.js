'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TaxRatesCtrl
 * @description
 * # TaxRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TaxRatesCtrl', function($scope, $q, taxRatesFactory, dateUtility) {

    var $this = this;

    this.createScopeVariables = function() {
      $scope.viewName = 'Tax Management';
      $scope.taxRatesList = [];
      $scope.taxTypesList = [];
      $scope.countriesList = [];
      $scope.stationsList = [];
      $scope.currenciesList = [];
      $scope.companyTaxRatesList = [];
      $scope.search = {};
      $scope.dateRange = {
        startDate: '',
        endDate: ''
      };
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setTaxTypesList = function(dataFromAPI) {
      $scope.taxTypesList = angular.copy(dataFromAPI.response);
    };

    this.setTaxRateTypesList = function(dataFromAPI) {
      $scope.taxRatesList = angular.copy(dataFromAPI);
    };

    this.setCountriesList = function(dataFromAPI) {
      $scope.countriesList = angular.copy(dataFromAPI.countries);
    };

    this.setStationsList = function(dataFromAPI) {
      $scope.stationsList = angular.copy(dataFromAPI.response);
    };

    this.setCurrenciesList = function(dataFromAPI) {
      $scope.currenciesList = angular.copy(dataFromAPI.response);
    };

    this.setCompanyTaxRatesList = function(dataFromAPI) {
      $scope.companyTaxRatesList = angular.copy(dataFromAPI.taxRates);
    };

    this.getTaxTypesList = function() {
      return taxRatesFactory.getTaxTypesList().then($this.setTaxTypesList);
    };

    this.getTaxRateTypesList = function() {
      return taxRatesFactory.getTaxRateTypes().then($this.setTaxRateTypesList);
    };

    this.getCountriesList = function() {
      return taxRatesFactory.getCountriesList().then($this.setCountriesList);
    };

    this.getStationsList = function() {
      return taxRatesFactory.getStationsList().then($this.setStationsList);
    };

    this.getCurrenciesList = function() {
      return taxRatesFactory.getCompanyCurrencies().then($this.setCurrenciesList);
    };

    this.getCompanyTaxRatesList = function(query) {
      var q = query || {};
      return taxRatesFactory.getCompanyTaxRatesList(q).then($this.setCompanyTaxRatesList);
    };

    this.createPromises = function() {
      return [
        $this.getTaxTypesList(),
        $this.getTaxRateTypesList(),
        $this.getCountriesList(),
        $this.getStationsList(),
        $this.getCurrenciesList(),
        $this.getCompanyTaxRatesList()
      ];
    };

    this.makePromises = function() {
      var promises = $this.createPromises();
      $q.all(promises).then($this.initSuccess);
    };

    this.initSuccess = function() {
      $this.hideLoadingModal();
      $scope.viewIsReady = true;
    };

    this.init = function() {
      $this.createScopeVariables();
      $this.showLoadingModal('Loading data for Tax Management...');
      $this.makePromises();
    };

    this.init();

    // Place user facing / post-init controller functions here
    this.isDateRangeSet = function() {
      return ($scope.dateRange.startDate.length || $scope.dateRange.endDate.length);
    };

    this.isSearchFieldActive = function(searchField) {
      return (angular.isObject(searchField) || angular.isNumber(searchField));
    };

    this.isSearchActive = function() {
      var isActive = false;
      for (var key in $scope.search) {
        var searchField = $scope.search[key];
        if (angular.isDefined(searchField) && $this.isSearchFieldActive(searchField)) {
          isActive = true;
          break;
        }
      }
      return isActive;
    };

    this.generateCompanyStationIds = function() {
      var companyStationIds = [];
      for (var key in $scope.search.stations) {
        var station = $scope.search.stations[key];
        if (station.stationId) {
          companyStationIds.push(station.stationId);
        }
      }
      return encodeURI(companyStationIds);
    };

    this.createUiSelectSearchPayload = function() {
      var query = {
        limit: 100
      };
      if ($scope.search.taxType) {
        query.taxTypeCode = $scope.search.taxType.taxTypeCode;
      }
      if ($scope.search.country) {
        query.countryName = $scope.search.country.countryName;
      }
      if ($scope.search.currency) {
        query.companyCurrencyId = $scope.search.currency.id;
      }
      if ($scope.search.taxRateType) {
        query.taxRateType = $scope.search.taxRateType.taxRateType;
      }
      return query;
    };

    this.createSearchPayload = function() {
      var query = $this.createUiSelectSearchPayload();
      if (angular.isDefined($scope.search.stations) && $scope.search.stations.length) {
        query.companyStationIds = $this.generateCompanyStationIds();
      }
      if ($scope.search.taxRate) {
        query.taxRateValue = $scope.search.taxRate;
      }
      if ($scope.dateRange.startDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
      }
      if ($scope.dateRange.endDate) {
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }
      return query;
    };

    this.createSearchPromises = function() {
      var query = $this.createSearchPayload();
      return [
        $this.getCompanyTaxRatesList(query)
      ];
    };

    this.makeSearchPromises = function() {
      $this.showLoadingModal();
      var promises = $this.createSearchPromises();
      $q.all(promises).then($this.initSuccess);
    };

    // Place $scope functions here
    $scope.clearSearchFilters = function() {
      if (angular.isDefined($scope.search)) {
        $scope.search = {};
        $scope.dateRange = {
          startDate: '',
          endDate: ''
        };
        $this.makeSearchPromises();
      }
    };

    $scope.showClearButton = function() {
      return ($this.isDateRangeSet() || $this.isSearchActive());
    };

    $scope.searchRecords = function() {
      $this.makeSearchPromises();
    };

  });
