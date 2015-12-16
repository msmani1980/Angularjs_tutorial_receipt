'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TaxRatesCtrl
 * @description
 * # TaxRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TaxRatesCtrl', function($scope, $q, $route, taxRatesFactory, dateUtility, ngToast) {

    var $this = this;

    this.createScopeVariables = function() {
      $scope.viewName = 'Tax Management';
      $scope.taxRatesList = [];
      $scope.taxTypesList = [];
      $scope.countriesList = [];
      $scope.stationsList = [];
      $scope.currenciesList = [];
      $scope.companyTaxRatesList = [];
      $scope.taxRateToRemove = [];
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
      $scope.companyTaxRatesList = [];
      var taxRatesList = angular.copy(dataFromAPI.taxRates);
      angular.forEach(taxRatesList, function(taxRate) {
        if (angular.isDefined(taxRate)) {
          taxRate.action = 'read';
          taxRate.startDate = dateUtility.formatDateForApp(taxRate.startDate);
          taxRate.endDate = dateUtility.formatDateForApp(taxRate.endDate);
        }
        if (angular.isDefined(taxRate.action)) {
          $scope.companyTaxRatesList.push(taxRate);
        }
      });
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
    this.reloadRoute = function() {
      $route.reload();
    };

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

    this.makeSearchPromises = function(clear) {
      var message = 'Searching Tax Rates...';
      if (clear) {
        message = 'Clearing Search...';
      }
      $this.showLoadingModal(message);
      var promises = $this.createSearchPromises();
      $q.all(promises).then($this.initSuccess);
    };

    this.createDeletePromises = function(id) {
      return [
        taxRatesFactory.removeCompanyTaxRate(id)
      ];
    };

    this.makeDeletePromises = function(id) {
      var message = 'Deleting Tax Rate ID: ' + id;
      $this.showLoadingModal(message);
      var promises = $this.createDeletePromises(id);
      $q.all(promises).then($this.deleteSuccess);
    };

    this.deleteSuccess = function() {
      var id = angular.copy($scope.taxRateToRemove.id);
      ngToast.create('Successfully Deleted <b>Tax Rate ID: </b>' + id);
      $scope.taxRateToRemove = [];
      return $this.reloadRoute();
    };

    this.isTaxRateActive = function(taxRate) {
      return (dateUtility.isTodayOrEarlier(taxRate.startDate) && dateUtility.isAfterToday(taxRate.endDate));
    };

    this.hasTaxRateStarted = function(taxRate) {
      return (dateUtility.isAfterToday(taxRate.startDate) && dateUtility.isAfterToday(taxRate.endDate));
    };

    this.displayConfirmDialog = function(id) {
      angular.element('#confirmation-modal').modal('show');
      $scope.taxRateToRemove.id = id;
    };

    this.addEditActionToTaxRate = function(taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'edit';
      }
    };

    this.editCompanyTaxRate = function(taxRate) {
      $this.addEditActionToTaxRate(taxRate);
    };

    this.cancelTaxRateEdit = function(taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'read';
        taxRate.edited = true;
      }
    };

    // Place $scope functions here
    $scope.clearSearchFilters = function() {
      if (angular.isDefined($scope.search)) {
        $scope.search = {};
        $scope.dateRange = {
          startDate: '',
          endDate: ''
        };
        return $this.makeSearchPromises(true);
      }
    };

    $scope.showClearButton = function() {
      return ($this.isDateRangeSet() || $this.isSearchActive());
    };

    $scope.searchRecords = function() {
      return $this.makeSearchPromises();
    };

    $scope.deleteCompanyTaxRate = function(id) {
      return $this.makeDeletePromises(id);
    };

    $scope.showDeleteButton = function(taxRate) {
      return ($this.hasTaxRateStarted(taxRate) && angular.isUndefined(taxRate.edited));
    };

    $scope.showEditButton = function(taxRate) {
      return ($this.isTaxRateActive(taxRate) || angular.isDefined(taxRate.edited));
    };

    $scope.displayConfirmDialog = function(id) {
      return $this.displayConfirmDialog(id);
    };

    $scope.editCompanyTaxRate = function(taxRate) {
      return $this.editCompanyTaxRate(taxRate);
    };

    $scope.cancelTaxRateEdit = function(taxRate) {
      return $this.cancelTaxRateEdit(taxRate);
    };

  });
