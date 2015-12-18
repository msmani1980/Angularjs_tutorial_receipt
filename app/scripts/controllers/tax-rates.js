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
      $scope.masterTaxRates = [];
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

    this.uiSelectPosition = function(length, key) {
      length = parseInt(length - (length / 2));
      key = parseInt(key);
      if (key > length) {
        return 'up';
      }
      return 'auto';
    };

    this.setCompanyCurrency = function(taxRate) {
      var payload;
      if (angular.isDefined(taxRate.companyCurrencyId)) {
        angular.forEach($scope.currenciesList, function(currency) {
          if (currency.id === taxRate.companyCurrencyId) {
            payload = {
              id: taxRate.companyCurrencyId,
              code: currency.code
            };
          }
        });
        return payload;
      }
    };

    this.formatTaxRateObject = function(taxRate, dates) {
      if (angular.isDefined(dates) && dates === true) {
        taxRate.startDate = dateUtility.formatDateForApp(taxRate.startDate);
        taxRate.endDate = dateUtility.formatDateForApp(taxRate.endDate);
      }
      taxRate.action = 'read';
      taxRate.taxTypeCode = {
        taxTypeCode: taxRate.taxTypeCode
      };
      taxRate.countryName = {
        countryName: taxRate.countryName
      };
      taxRate.taxRateType = {
        taxRateType: taxRate.taxRateType
      };
      taxRate.currency = $this.setCompanyCurrency(taxRate);
      return taxRate;
    };

    this.createCompanyTaxRates = function(taxRatesList) {
      var newTaxRatesList = [];
      angular.forEach(taxRatesList, function(taxRate, key) {
        if (angular.isDefined(taxRate)) {
          taxRate = $this.formatTaxRateObject(taxRate, true);
          taxRate.key = key;
          taxRate.position = $this.uiSelectPosition(taxRatesList.length, key);
          newTaxRatesList.push(taxRate);
        }
      });
      return newTaxRatesList;
    };

    this.createMasterCompanyTaxRates = function(taxRatesList) {
      var newTaxRatesList = [];
      angular.forEach(taxRatesList, function(taxRate, key) {
        if (angular.isDefined(taxRate)) {
          taxRate = $this.formatTaxRateObject(taxRate);
          taxRate.key = key;
          newTaxRatesList.push(taxRate);
        }
      });
      return newTaxRatesList;
    };

    this.setCompanyTaxRatesList = function(dataFromAPI) {
      $scope.companyTaxRatesList = [];
      var taxRatesList = angular.copy(dataFromAPI.taxRates);
      if (angular.isDefined(taxRatesList)) {
        $scope.companyTaxRatesList = $this.createCompanyTaxRates(taxRatesList);
      }
    };

    this.setMasterCompanyTaxRatesList = function(dataFromAPI) {
      $scope.masterTaxRates = [];
      var masterRatesList = angular.copy(dataFromAPI.taxRates);
      if (angular.isDefined(masterRatesList)) {
        $scope.masterTaxRates = $this.createMasterCompanyTaxRates(masterRatesList);
      }
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

    this.getMasterCompanyTaxRatesList = function(query) {
      var q = query || {};
      return taxRatesFactory.getCompanyTaxRatesList(q).then($this.setMasterCompanyTaxRatesList);
    };

    this.errorHandler = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
      $this.getCompanyTaxRatesList();
    };

    this.hideSearchPanel = function() {
      var panel = angular.element('#filter-controls');
      panel.removeClass('in').addClass('collapse');
    };

    this.createPromises = function() {
      return [
        $this.getTaxTypesList(),
        $this.getTaxRateTypesList(),
        $this.getCountriesList(),
        $this.getStationsList(),
        $this.getCurrenciesList(),
        $this.getCompanyTaxRatesList(),
        $this.getMasterCompanyTaxRatesList()
      ];
    };

    this.makePromises = function() {
      var promises = $this.createPromises();
      $q.all(promises).then($this.initSuccess, $this.errorHandler);
    };

    this.searchSuccess = function() {
      $this.hideLoadingModal();
      $scope.viewIsReady = true;
    };

    this.initSuccess = function() {
      $this.hideLoadingModal();
      $this.hideSearchPanel();
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
      $q.all(promises).then($this.searchSuccess, $this.errorHandler);
    };

    this.createDeletePromises = function(id) {
      return [
        taxRatesFactory.removeCompanyTaxRate(id)
      ];
    };

    this.makeDeletePromises = function(taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.deleted = true;
      }
      var message = 'Deleting Tax Rate ID: ' + taxRate.id;
      $this.showLoadingModal(message);
      var promises = $this.createDeletePromises(taxRate.id);
      $q.all(promises).then($this.deleteSuccess, $this.errorHandler);
    };

    this.removeTaxRateFromList = function(id) {
      var newList = [];
      angular.forEach($scope.companyTaxRatesList, function(taxRate) {
        if (taxRate.id !== id) {
          newList.push(taxRate);
        }
      });
      $scope.companyTaxRatesList = newList;
    };

    this.deleteSuccess = function() {
      var id = angular.copy($scope.taxRateToRemove.id);
      ngToast.create('Successfully Deleted <b>Tax Rate ID: </b>' + id);
      $scope.taxRateToRemove = [];
      $this.hideLoadingModal();
      return $this.removeTaxRateFromList(id);
    };

    this.isTaxRateActive = function(taxRate) {
      return (dateUtility.isTodayOrEarlier(taxRate.startDate) && dateUtility.isAfterToday(taxRate.endDate));
    };

    this.hasTaxRateStarted = function(taxRate) {
      return (dateUtility.isAfterToday(taxRate.startDate) && dateUtility.isAfterToday(taxRate.endDate));
    };

    this.displayConfirmDialog = function(taxRate) {
      angular.element('#confirmation-modal').modal('show');
      $scope.taxRateToRemove = taxRate;
    };

    this.addEditActionToTaxRate = function(taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'edit';
        taxRate.edited = true;
        if ($this.isTaxRateActive(taxRate) && !$this.hasTaxRateStarted(taxRate)) {
          taxRate.readOnly = true;
        }
      }
    };

    this.editCompanyTaxRate = function(taxRate) {
      $this.addEditActionToTaxRate(taxRate);
    };

    this.cancelTaxRateEdit = function(taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'read';
        delete taxRate.readOnly;
      }
    };

    this.createStationsPayload = function(taxRate) {
      var companyTaxRateStations = [];
      angular.forEach(taxRate.companyTaxRateStations, function(station) {
        companyTaxRateStations.push({
          companyStationId: parseInt(station.companyStationId)
        });
      });
      return companyTaxRateStations;
    };

    this.editSuccess = function() {
      $this.hideLoadingModal();
      var id = angular.copy($scope.taxRateSaved);
      ngToast.create('Successfully Saved <b>Tax Rate ID: </b>' + id);
      $scope.taxRateSaved = [];
      $this.getMasterCompanyTaxRatesList();
    };

    this.createEditPromises = function(taxRate) {
      return [
        taxRatesFactory.updateCompanyTaxRate(taxRate)
      ];
    };

    this.makeEditPromises = function(taxRate) {
      var message = 'Editing Tax Rate ID: ' + taxRate.id;
      $this.showLoadingModal(message);
      $scope.taxRateSaved = taxRate.id;
      var promises = $this.createEditPromises(taxRate);
      $q.all(promises).then($this.editSuccess, $this.errorHandler);
    };

    this.saveTaxRateEdits = function(taxRate) {
      delete taxRate.edited;
      delete taxRate.readOnly;
      taxRate.action = 'read';
      taxRate.saved = true;
      var payload = {
        id: taxRate.id,
        taxRateValue: taxRate.taxRateValue,
        taxRateType: taxRate.taxRateType.taxRateType,
        startDate: dateUtility.formatDateForAPI(taxRate.startDate),
        endDate: dateUtility.formatDateForAPI(taxRate.endDate),
        companyTaxTypeId: taxRate.taxTypeCode.id,
        companyTaxRateStations: $this.createStationsPayload(taxRate),
        companyCurrencyId: taxRate.companyCurrencyId
      };
      $this.makeEditPromises(payload);
    };

    this.determineMinDate = function(date) {
      var diff = dateUtility.diff(dateUtility.nowFormatted(), date);
      var dateString = diff.toString() + 'd';
      if (diff >= 0) {
        dateString = '+' + dateString;
      }
      return dateString;
    };

    this.resetTaxRate = function(newRate) {
      var newList = [];
      angular.forEach($scope.companyTaxRatesList, function(taxRate) {
        if (newRate.id === taxRate.id) {
          taxRate = newRate;
        }
        newList.push(taxRate);
      });
      $scope.companyTaxRatesList = newList;
    };

    this.resetTaxRateEdit = function(taxRate) {
      angular.forEach($scope.masterTaxRates, function(originalRate) {
        if (originalRate.id === taxRate.id) {
          var rate = angular.copy(originalRate);
          rate.action = 'read';
          rate.startDate = dateUtility.formatDateForApp(rate.startDate);
          rate.endDate = dateUtility.formatDateForApp(rate.endDate);
          $this.resetTaxRate(rate);
        }
      });
    };

    this.showValidationError = function(field) {
      var payload = {
        field: field,
        value: ' - is a required field. Please update and try again!'
      };
      $scope.errorCustom.push(payload);
      $scope.displayError = true;
    };

    this.validateNewData = function(field, value, taxRate) {
      if (value === undefined || value === null || value.length === 0 || value === 'Invalid date') {
        taxRate.deleted = true;
        $this.showValidationError(field);
      }
      return value;
    };

    this.clearCustomErrors = function() {
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.createNewTaxRate = function() {
      var length = parseInt($scope.companyTaxRatesList.length);
      var payload = {
        action: 'create',
        position: 'up',
        key: length + 1,
        taxRateValue: undefined,
        taxRateType: undefined,
        startDate: dateUtility.nowFormatted(),
        endDate: dateUtility.nowFormatted(),
        taxTypeCode: undefined,
        companyTaxRateStations: undefined,
        companyCurrencyId: undefined,
        created: true
      };
      $scope.companyTaxRatesList.push(payload);
    };

    this.parseNewTaxRatePayload = function(taxRate) {
      var stations = $this.createStationsPayload(taxRate);
      var taxTypeId = taxRate.taxTypeCode ? taxRate.taxTypeCode.id : null;
      var taxRateType = taxRate.taxRateType ? taxRate.taxRateType.taxRateType : null;
      var payload = {
        taxRateValue: $this.validateNewData('taxRateValue', taxRate.taxRateValue, taxRate),
        taxRateType: $this.validateNewData('taxRateType', taxRateType, taxRate),
        startDate: $this.validateNewData('startDate', dateUtility.formatDateForAPI(taxRate.startDate), taxRate),
        endDate: $this.validateNewData('endDate', dateUtility.formatDateForAPI(taxRate.endDate), taxRate),
        companyTaxTypeId: $this.validateNewData('companyTaxTypeId', taxTypeId, taxRate),
        companyTaxRateStations: $this.validateNewData('companyTaxRateStations', stations, taxRate)
      };
      if (taxRate.companyCurrencyId) {
        $this.validateNewData('companyCurrencyId', taxRate.companyCurrencyId, taxRate);
      }
      return payload;
    };

    this.createNewTaxRatePayload = function(taxRate) {
      if ($scope.displayError === true) {
        $this.clearCustomErrors();
      }
      var payload = $this.parseNewTaxRatePayload(taxRate);
      if ($scope.displayError === false) {
        delete taxRate.deleted;
        taxRate.saved = true;
        taxRate.action = 'read';
        console.log('Create Promises Here', payload);
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

    $scope.deleteCompanyTaxRate = function(taxRate) {
      return $this.makeDeletePromises(taxRate);
    };

    $scope.showDeleteButton = function(taxRate) {
      return ($this.hasTaxRateStarted(taxRate) && angular.isUndefined(taxRate.edited));
    };

    $scope.isFieldReadOnly = function(taxRate) {
      return ($this.isTaxRateActive(taxRate) && !$this.hasTaxRateStarted(taxRate) || angular.isDefined(taxRate.readOnly));
    };

    $scope.showEditButton = function(taxRate) {
      return ($this.isTaxRateActive(taxRate) || angular.isDefined(taxRate.edited));
    };

    $scope.displayConfirmDialog = function(taxRate) {
      return $this.displayConfirmDialog(taxRate);
    };

    $scope.editCompanyTaxRate = function(taxRate) {
      return $this.editCompanyTaxRate(taxRate);
    };

    $scope.cancelTaxRateEdit = function(taxRate) {
      return $this.cancelTaxRateEdit(taxRate);
    };

    $scope.saveTaxRateEdits = function(taxRate) {
      return $this.saveTaxRateEdits(taxRate);
    };

    $scope.determineMinDate = function(date) {
      date = date || dateUtility.tomorrowFormatted();
      return $this.determineMinDate(date);
    };

    $scope.resetTaxRateEdit = function(taxRate) {
      return $this.resetTaxRateEdit(taxRate);
    };

    $scope.taxRateRowClass = function(taxRate) {
      if (taxRate.edited) {
        return 'bg-warning';
      }
      if (taxRate.saved) {
        return 'bg-success';
      }
      if (taxRate.deleted) {
        return 'bg-danger';
      }
      if (taxRate.created) {
        return 'bg-info';
      }
    };

    $scope.determineDatePickerOrientation = function(taxRate) {
      var length = parseInt($scope.companyTaxRatesList.length - ($scope.companyTaxRatesList.length / 2));
      var key = parseInt(taxRate.key);
      if (key > length) {
        return 'auto';
      }
    };

    $scope.searchUiSelectReady = function() {
      if (angular.isUndefined($scope.uiSelectReady)) {
        $scope.uiSelectReady = true;
      }
    };

    $scope.createNewTaxRate = function() {
      return $this.createNewTaxRate();
    };

    $scope.createNewTaxRatePayload = function(taxRate) {
      return $this.createNewTaxRatePayload(taxRate);
    };

    $scope.isTaxRateTypePercentage = function(taxRate) {
      if (angular.isDefined(taxRate.taxRateType)) {
        return (taxRate.taxRateType.taxRateType === 'Percentage');
      }
      return true;
    };

    $scope.cancelNewTaxRate = function(taxRate) {
      $this.clearCustomErrors();
      taxRate.deleted = true;
      taxRate.action = 'deleted';
    };

  });
