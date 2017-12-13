'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TaxRatesCtrl
 * @description
 * # TaxRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TaxRatesCtrl', function ($scope, $q, $route, $filter, taxRatesFactory, dateUtility, messageService) {

    var $this = this;

    this.createScopeVariables = function () {
      $scope.viewName = 'Tax Management';
      $scope.taxRatesList = [];
      $scope.taxTypesList = [];
      $scope.stationsList = [];
      $scope.masterStationsList = [];
      $scope.stationsListSearch = [];
      $scope.currenciesList = [];
      $scope.countriesList = [];
      $scope.companyTaxRatesList = [];
      $scope.masterTaxRates = [];
      $scope.taxRateToRemove = [];
      $scope.taxRateToCreate = [];
      $scope.search = {};
      $scope.dateRange = {
        startDate: '',
        endDate: ''
      };
    };

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.setTaxTypesList = function (dataFromAPI) {
      $scope.taxTypesList = angular.copy(dataFromAPI.response);
    };

    this.setTaxRateTypesList = function (dataFromAPI) {
      $scope.taxRatesList = angular.copy(dataFromAPI);
    };

    this.setCountriesList = function (stationsList) {
      var countriesList = [];
      angular.forEach(stationsList, function (station) {
        var country = {
          id: station.countryId,
          countryName: station.countryName
        };
        countriesList.push(country);
      });

      $scope.countriesList = $filter('unique')(countriesList, 'countryName');
    };

    this.setStationsList = function (dataFromAPI) {
      var response = angular.copy(dataFromAPI.response);
      var distinctStations = $filter('unique')(response, 'stationId');
      $this.setCountriesList(distinctStations);
      $scope.stationsList = distinctStations;
      $scope.masterStationsList = distinctStations;
      $scope.stationsListSearch = distinctStations;
    };

    this.setCurrenciesList = function (dataFromAPI) {
      $scope.currenciesList = angular.copy(dataFromAPI.response);
    };

    this.uiSelectPosition = function (length, key) {
      length = parseInt(length - (length / 2));
      key = parseInt(key);
      if (key > length) {
        return 'up';
      }

      return 'auto';
    };

    this.setCompanyCurrency = function (taxRate) {
      var payload;
      if (angular.isDefined(taxRate.companyCurrencyId) && angular.isDefined($scope.currenciesList)) {
        angular.forEach($scope.currenciesList, function (currency) {
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

    this.checkForExistingStations = function (taxRate, currentStation) {
      var existingStation = [];
      angular.forEach(taxRate.companyTaxRateStations, function (station) {
        if (station.stationCode === currentStation.stationCode) {
          existingStation.push(station);
        }
      });

      return (!existingStation.length);
    };

    this.setTaxRateAvailableStations = function (taxRate) {
      var availableStations = [];
      if ($scope.stationsList.length > 0) {
        angular.forEach($scope.stationsList, function (station) {
          if ($this.checkForExistingStations(taxRate, station)) {
            if (taxRate.countryName === station.countryName) {
              var payload = {
                companyStationId: station.stationId,
                stationCode: station.stationCode,
                stationName: station.stationName,
                countryName: station.countryName
              };
              availableStations.push(payload);
            }
          }
        });
      }

      return availableStations;
    };

    this.formatTaxTypeCode = function (taxRate) {
      if (angular.isDefined(taxRate.taxTypeCode)) {
        taxRate.taxTypeCode = {
          taxTypeCode: taxRate.taxTypeCode,
          id: taxRate.taxTypeCode.id ? taxRate.taxTypeCode.id : taxRate.companyTaxTypeId
        };
        return taxRate.taxTypeCode;
      }
    };

    this.formatTaxTypeCountryName = function (taxRate) {
      taxRate.countryName = {
        countryName: taxRate.countryName
      };
      return taxRate.countryName;
    };

    this.formatTaxRateType = function (taxRate) {
      taxRate.taxRateType = {
        taxRateType: taxRate.taxRateType
      };
      return taxRate.taxRateType;
    };

    this.formatTaxRateDate = function (date) {
      return dateUtility.formatDateForApp(date);
    };

    this.formatTaxRateObject = function (taxRate, dates) {
      taxRate.action = 'read';
      taxRate.availableStations = $this.setTaxRateAvailableStations(taxRate);
      taxRate.currency = $this.setCompanyCurrency(taxRate);
      taxRate.countryName = $this.formatTaxTypeCountryName(taxRate);
      taxRate.taxTypeCode = $this.formatTaxTypeCode(taxRate);
      taxRate.taxRateType = $this.formatTaxRateType(taxRate);
      if (angular.isDefined(dates) && dates === true) {
        taxRate.startDate = $this.formatTaxRateDate(taxRate.startDate);
        taxRate.endDate = $this.formatTaxRateDate(taxRate.endDate);
      }

      if (taxRate.availableStations) {
        return taxRate;
      }
    };

    this.formatTaxRatesAfterCreation = function (newTaxRatesList) {
      var taxRatesList = [];
      angular.forEach(newTaxRatesList, function (taxRate) {
        taxRate = $this.formatTaxRateObject(taxRate, true);
        taxRatesList.push(taxRate);
      });

      return taxRatesList;
    };

    this.createCompanyTaxRates = function (taxRatesList) {
      var newTaxRatesList = [];
      angular.forEach(taxRatesList, function (taxRate, key) {
        taxRate.position = $this.uiSelectPosition(taxRatesList.length, key);
        taxRate.key = key;
        newTaxRatesList.push(taxRate);
      });

      return $this.formatTaxRatesAfterCreation(newTaxRatesList);
    };

    this.createMasterCompanyTaxRates = function (taxRatesList) {
      var newTaxRatesList = [];
      angular.forEach(taxRatesList, function (taxRate, key) {
        taxRate = $this.formatTaxRateObject(taxRate);
        taxRate.key = key;
        newTaxRatesList.push(taxRate);
      });

      return newTaxRatesList;
    };

    this.setCompanyTaxRatesList = function (dataFromAPI) {
      $scope.companyTaxRatesList = [];
      var masterRatesList = angular.copy(dataFromAPI);
      var taxRatesList = angular.copy(dataFromAPI.taxRates);
      $this.setMasterCompanyTaxRatesList(masterRatesList);
      if (angular.isDefined(taxRatesList)) {
        $scope.companyTaxRatesList = $this.createCompanyTaxRates(taxRatesList);
      }
    };

    this.setMasterCompanyTaxRatesList = function (dataFromAPI) {
      $scope.masterTaxRates = [];
      var masterRatesList = angular.copy(dataFromAPI.taxRates);
      if (angular.isDefined(masterRatesList)) {
        $scope.masterTaxRates = $this.createMasterCompanyTaxRates(masterRatesList);
      }
    };

    this.getTaxTypesList = function () {
      return taxRatesFactory.getTaxTypesList().then($this.setTaxTypesList);
    };

    this.getTaxRateTypesList = function () {
      return taxRatesFactory.getTaxRateTypes().then($this.setTaxRateTypesList);
    };

    this.getStationsList = function () {
      return taxRatesFactory.getStationsList().then($this.setStationsList);
    };

    this.getCurrenciesList = function () {
      var nowDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var payload = {
        startDate: nowDate,
        endDate: nowDate,
        isOperatedCurrency: true
      };

      return taxRatesFactory.getCompanyCurrencies(payload).then($this.setCurrenciesList);
    };

    this.getCompanyTaxRatesList = function (query) {
      var q = query || {};
      return taxRatesFactory.getCompanyTaxRatesList(q).then($this.setCompanyTaxRatesList);
    };

    this.getCompanyMasterTaxRatesList = function (query) {
      var q = query || {};
      return taxRatesFactory.getCompanyTaxRatesList(q).then($this.setMasterCompanyTaxRatesList);
    };

    this.errorHandler = function (dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.hideSearchPanel = function () {
      var panel = angular.element('#filter-controls');
      panel.removeClass('in').addClass('collapse');
    };

    this.createTaxRatePromises = function () {
      return [
        $this.getCompanyTaxRatesList()
      ];
    };

    this.createPromises = function () {
      return [
        $this.getTaxTypesList(),
        $this.getTaxRateTypesList(),
        $this.getStationsList(),
        $this.getCurrenciesList()
      ];
    };

    this.initPromises = function () {
      var promises = $this.createTaxRatePromises();
      $q.all(promises).then($this.initSuccess, $this.errorHandler);
    };

    this.makePromises = function () {
      var promises = $this.createPromises();
      $q.all(promises).then($this.initPromises, $this.errorHandler);
    };

    this.searchSuccess = function () {
      $this.hideLoadingModal();
      $scope.viewIsReady = true;
    };

    this.initSuccess = function () {
      $this.hideLoadingModal();
      $this.hideSearchPanel();
      $scope.viewIsReady = true;
    };

    this.init = function () {
      $this.createScopeVariables();
      $this.showLoadingModal('Loading data for Tax Management...');
      $this.makePromises();
      $scope.minDate = dateUtility.nowFormattedDatePicker();
    };

    this.init();

    // Place user facing / post-init controller functions here
    this.reloadRoute = function () {
      $route.reload();
    };

    this.isDateRangeSet = function () {
      return ($scope.dateRange.startDate.length || $scope.dateRange.endDate.length);
    };

    this.isSearchFieldActive = function (searchField) {
      return (angular.isObject(searchField) || angular.isNumber(searchField));
    };

    this.isSearchActive = function () {
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

    this.generateCompanyStationIds = function () {
      var companyStationIds = [];
      for (var key in $scope.search.stations) {
        var station = $scope.search.stations[key];
        if (station.stationId) {
          companyStationIds.push(station.stationId);
        }
      }

      return encodeURI(companyStationIds);
    };

    this.createUiSelectSearchPayload = function () {
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

    this.createSearchPayload = function () {
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

    this.createSearchPromises = function () {
      var query = $this.createSearchPayload();
      return [
        $this.getCompanyTaxRatesList(query)
      ];
    };

    this.makeSearchPromises = function (clear) {
      $scope.displayError = false;
      $scope.errorResponse = [];

      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        if (dateUtility.diff($scope.dateRange.startDate, $scope.dateRange.endDate) < 0) {
          var errorData = {
            data: [
              {
                field: 'Effective To',
                code: '021'
              }
            ]
          };
          $scope.errorResponse = angular.copy(errorData);
          $scope.displayError = true;

          return;
        }
      }

      var message = 'Searching Tax Rates...';
      if (clear) {
        message = 'Clearing Search...';
      }

      $this.showLoadingModal(message);
      var promises = $this.createSearchPromises();
      $q.all(promises).then($this.searchSuccess, $this.errorHandler);
    };

    this.createDeletePromises = function (id) {
      return [
        taxRatesFactory.removeCompanyTaxRate(id)
      ];
    };

    this.makeDeletePromises = function (taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.deleted = true;
      }

      var message = 'Deleting Tax Rate ID: ' + taxRate.id;
      $this.showLoadingModal(message);
      var promises = $this.createDeletePromises(taxRate.id);
      $q.all(promises).then($this.deleteSuccess, $this.errorHandler);
    };

    this.removeTaxRateFromList = function (id) {
      var newList = [];
      angular.forEach($scope.companyTaxRatesList, function (taxRate, key) {
        if (taxRate.id !== id) {
          taxRate.position = $this.uiSelectPosition($scope.companyTaxRatesList.length, key);
          newList.push(taxRate);
        }
      });

      $scope.companyTaxRatesList = newList;
    };

    this.deleteSuccess = function () {
      var id = angular.copy($scope.taxRateToRemove.id);
      messageService.display('success', 'Successfully Deleted <b>Tax Rate ID: </b>' + id);
      $scope.taxRateToRemove = [];
      $this.hideLoadingModal();
      return $this.removeTaxRateFromList(id);
    };

    this.isTaxRateActive = function (taxRate) {
      return (dateUtility.isTodayOrEarlierDatePicker(taxRate.startDate) && dateUtility.isAfterTodayDatePicker(taxRate.endDate));
    };

    this.hasTaxRateStarted = function (taxRate) {
      return (dateUtility.isAfterTodayDatePicker(taxRate.startDate) && dateUtility.isAfterTodayDatePicker(taxRate.endDate));
    };

    $scope.isTaxRateEditable = function(taxRate) {
      if (angular.isUndefined(taxRate)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(taxRate.endDate) || dateUtility.isTodayDatePicker(taxRate.endDate);
    };

    $scope.isDisabled = function(taxRate) {
      return !(dateUtility.isAfterTodayDatePicker(taxRate.startDate));
    };

    $scope.isDisabledEndDateForm = function(taxRate) {
      return !(dateUtility.isAfterTodayDatePicker(taxRate.endDate) || dateUtility.isTodayDatePicker(taxRate.endDate));
    };

    this.displayConfirmDialog = function (taxRate) {
      angular.element('#confirmation-modal').modal('show');
      $scope.taxRateToRemove = taxRate;
    };

    this.addEditActionToTaxRate = function (taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'edit';
        taxRate.edited = true;
        if ($this.isTaxRateActive(taxRate) && !$this.hasTaxRateStarted(taxRate)) {
          taxRate.readOnly = true;
        }
      }
    };

    this.editCompanyTaxRate = function (taxRate) {
      $this.addEditActionToTaxRate(taxRate);
    };

    this.cancelTaxRateEdit = function (taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.action = 'read';
        delete taxRate.readOnly;
        $this.resetTaxRateEdit(taxRate);
      }
    };

    this.createStationsPayload = function (taxRate) {
      var companyTaxRateStations = [];
      angular.forEach(taxRate.companyTaxRateStations, function (station) {
        companyTaxRateStations.push({
          companyStationId: station.stationId ? station.stationId : station.companyStationId
        });
      });

      return companyTaxRateStations;
    };

    this.editSuccess = function () {
      $this.hideLoadingModal();
      var id = angular.copy($scope.taxRateSaved);
      messageService.display('success', 'Successfully Saved <b>Tax Rate ID: </b>' + id);
      $scope.taxRateSaved = [];
      $this.getCompanyMasterTaxRatesList();
    };

    this.createEditPromises = function (taxRate) {
      return [
        taxRatesFactory.updateCompanyTaxRate(taxRate)
      ];
    };

    this.makeEditPromises = function (taxRate) {
      var message = 'Saving Edits for Tax Rate ID: ' + taxRate.id;
      $this.showLoadingModal(message);
      $scope.taxRateSaved = taxRate.id;
      var promises = $this.createEditPromises(taxRate);
      $q.all(promises).then($this.editSuccess, $this.errorHandler);
    };

    this.saveTaxRateEdits = function (taxRate) {
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
        companyTaxTypeId: taxRate.taxTypeCode ? taxRate.taxTypeCode.id : taxRate.companyTaxTypeId,
        companyTaxRateStations: $this.createStationsPayload(taxRate),
        companyCurrencyId: $scope.isTaxRateTypePercentage(taxRate) ? null : taxRate.currency.id
      };
      $this.makeEditPromises(payload);
    };

    this.determineMinDate = function (date) {
      var diff = 1;
      if (!dateUtility.isTodayDatePicker(date)) {
        diff = 0;
      }

      if (!dateUtility.isTomorrowOrLaterDatePicker(date)) {
        diff = dateUtility.diff(dateUtility.nowFormattedDatePicker(), date);
      }

      var dateString = diff.toString() + 'd';
      if (diff >= 0) {
        dateString = '+' + dateString;
      }

      return dateString;
    };

    this.resetTaxRate = function (newRate) {
      var newList = [];
      angular.forEach($scope.companyTaxRatesList, function (taxRate) {
        if (newRate.id === taxRate.id) {
          taxRate = newRate;
        }

        newList.push(taxRate);
      });

      $scope.companyTaxRatesList = newList;
    };

    this.resetTaxRateEdit = function (taxRate) {
      angular.forEach($scope.masterTaxRates, function (originalRate, key) {
        if (originalRate.id === taxRate.id) {
          var rate = angular.copy(originalRate);
          rate.action = 'read';
          rate.startDate = dateUtility.formatDateForApp(rate.startDate);
          rate.endDate = dateUtility.formatDateForApp(rate.endDate);
          rate.position = $this.uiSelectPosition($scope.masterTaxRates.length, key);
          $this.resetTaxRate(rate);
        }
      });
    };

    this.showValidationError = function (field) {
      var payload = {
        field: field,
        value: 'is a required field. Please update and try again!'
      };
      $scope.errorCustom.push(payload);
      $scope.displayError = true;
    };

    this.validateNewData = function (field, value, taxRate) {
      if (value === undefined || value === null || value.length === 0 || value === 'Invalid date') {
        taxRate.deleted = true;
        $this.showValidationError(field);
      }

      return value;
    };

    this.clearCustomErrors = function () {
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.createNewTaxRate = function () {
      var length = parseInt($scope.companyTaxRatesList.length);
      var payload = {
        action: 'create',
        position: 'up',
        key: length + 1,
        taxRateValue: undefined,
        taxRateType: undefined,
        startDate: undefined,
        endDate: undefined,
        taxTypeCode: undefined,
        companyTaxRateStations: undefined,
        companyCurrencyId: undefined,
        created: true
      };
      $scope.companyTaxRatesList.push(payload);
    };

    this.parseNewTaxRatePayload = function (taxRate) {
      var stations = $this.createStationsPayload(taxRate);
      var taxTypeId = taxRate.taxTypeCode ? taxRate.taxTypeCode.id : null;
      var taxRateType = taxRate.taxRateType ? taxRate.taxRateType.taxRateType : null;
      var companyCurrencyId = taxRate.currency ? taxRate.currency.id : null;
      var payload = {
        taxRateValue: $this.validateNewData('taxRateValue', taxRate.taxRateValue, taxRate),
        taxRateType: $this.validateNewData('taxRateType', taxRateType, taxRate),
        startDate: $this.validateNewData('startDate', dateUtility.formatDateForAPI(taxRate.startDate), taxRate),
        endDate: $this.validateNewData('endDate', dateUtility.formatDateForAPI(taxRate.endDate), taxRate),
        companyTaxTypeId: $this.validateNewData('companyTaxTypeId', taxTypeId, taxRate),
        companyTaxRateStations: $this.validateNewData('companyTaxRateStations', stations, taxRate)
      };
      if (!$scope.isTaxRateTypePercentage(taxRate)) {
        payload.companyCurrencyId = $this.validateNewData('companyCurrencyId', companyCurrencyId, taxRate);
      }

      return payload;
    };

    this.createNewTaxRatePayload = function (taxRate) {
      $scope.errorCustom = [];
      if ($scope.displayError === true) {
        $this.clearCustomErrors();
      }

      var payload = $this.parseNewTaxRatePayload(taxRate);
      if ($scope.displayError !== true) {
        taxRate.new = true;
        $this.makeCreatePromises(payload);
      }
    };

    this.createNewTaxRatePromises = function (payload) {
      return [
        taxRatesFactory.createCompanyTaxRate(payload)
      ];
    };

    this.setIdOnTaxRateObjectOnSuccess = function (id) {
      angular.forEach($scope.companyTaxRatesList, function (taxRate) {
        if (taxRate.new) {
          taxRate.id = id;
          delete taxRate.new;
          delete taxRate.deleted;
          taxRate.saved = true;
          taxRate.action = 'read';
          taxRate.created = true;
          taxRate.position = 'auto';
        }
      });
    };

    this.createNewTaxRateSuccess = function (response) {
      var id = response[0].id;
      $this.getCompanyMasterTaxRatesList();
      $this.setIdOnTaxRateObjectOnSuccess(id);
      $this.hideLoadingModal();
      messageService.display('success', 'Successfully Created <b>Tax Rate ID: </b>' + id);
      $scope.taxRateToCreate = [];
    };

    this.createNewTaxRateError = function (response) {
      $this.errorHandler(response);
      angular.forEach($scope.companyTaxRatesList, function (taxRate) {
        if (taxRate.new) {
          taxRate.deleted = true;
        }
      });
    };

    this.makeCreatePromises = function (payload) {
      $this.showLoadingModal('Creating new Tax Rate...');
      var promises = $this.createNewTaxRatePromises(payload);
      $q.all(promises).then($this.createNewTaxRateSuccess, $this.createNewTaxRateError);
    };

    // Place $scope functions here
    $scope.clearSearchFilters = function () {
      if (angular.isDefined($scope.search)) {
        $scope.search = {};
        $scope.dateRange = {
          startDate: '',
          endDate: ''
        };
        $scope.enableSearchStations = false;
      }

      $scope.companyTaxRatesList = [];
    };

    $scope.showClearButton = function () {
      return ($this.isDateRangeSet() || $this.isSearchActive() || ($scope.companyTaxRatesList.length > 0));
    };

    $scope.searchRecords = function () {
      return $this.makeSearchPromises();
    };

    $scope.deleteCompanyTaxRate = function (taxRate) {
      return $this.makeDeletePromises(taxRate);
    };

    $scope.showDeleteButton = function (taxRate) {
      return ($this.hasTaxRateStarted(taxRate) && angular.isUndefined(taxRate.edited));
    };

    $scope.isFieldReadOnly = function (taxRate) {
      return ($this.isTaxRateActive(taxRate) && !$this.hasTaxRateStarted(taxRate) || angular.isDefined(taxRate.readOnly));
    };

    $scope.showEditButton = function (taxRate) {
      return ($this.isTaxRateActive(taxRate) || angular.isDefined(taxRate.edited));
    };

    $scope.displayConfirmDialog = function (taxRate) {
      return $this.displayConfirmDialog(taxRate);
    };

    $scope.editCompanyTaxRate = function (taxRate) {
      return $this.editCompanyTaxRate(taxRate);
    };

    $scope.cancelTaxRateEdit = function (taxRate) {
      return $this.cancelTaxRateEdit(taxRate);
    };

    $scope.saveTaxRateEdits = function (taxRate) {
      return $this.saveTaxRateEdits(taxRate);
    };

    $scope.determineMinDate = function (date) {
      date = date || dateUtility.tomorrowFormattedDatePicker();
      return $this.determineMinDate(date);
    };

    $scope.resetTaxRateEdit = function (taxRate) {
      return $this.resetTaxRateEdit(taxRate);
    };

    $scope.taxRateRowClass = function (taxRate) {
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

    $scope.determineDatePickerOrientation = function (taxRate) {
      var length = parseInt($scope.companyTaxRatesList.length - ($scope.companyTaxRatesList.length / 2));
      var key = parseInt(taxRate.key);
      if (key > length) {
        return 'auto';
      }
    };

    $scope.searchUiSelectReady = function () {
      if (angular.isUndefined($scope.uiSelectReady)) {
        $scope.uiSelectReady = true;
      }
    };

    $scope.createNewTaxRate = function () {
      return $this.createNewTaxRate();
    };

    $scope.createNewTaxRatePayload = function (taxRate) {
      return $this.createNewTaxRatePayload(taxRate);
    };

    $scope.isTaxRateTypePercentage = function (taxRate) {
      return angular.isDefined(taxRate.taxRateType) && taxRate.taxRateType.taxRateType === 'Percentage';
    };

    $scope.cancelNewTaxRate = function (taxRate) {
      $this.clearCustomErrors();
      $scope.errorResponse = [];
      taxRate.deleted = true;
      taxRate.action = 'deleted';
    };

    $scope.filterSearchStationsByCountry = function (countryName) {
      $scope.enableSearchStations = true;
      $scope.stationsListSearch = angular.copy($scope.masterStationsList);
      $scope.stationsListSearch = $filter('filter')($scope.stationsListSearch, {
        countryName: countryName
      }, true);
      $scope.search.stations = [];
    };

    $scope.isTaxRateCountryFieldDisabled = function (taxRate) {
      return $scope.isDisabled(taxRate) || (angular.isDefined(taxRate.companyTaxRateStations) && taxRate.companyTaxRateStations.length);
    };

    $scope.isTaxRateCountryFieldDisabledForCreate = function (taxRate) {
      return angular.isDefined(taxRate.companyTaxRateStations) && taxRate.companyTaxRateStations.length;
    };

    $scope.isTaxRateStationsDisabled = function (taxRate) {
      return this.isDisabled(taxRate) || (!taxRate.countryName || $scope.isFieldReadOnly(taxRate));
    };

    $scope.isTaxRateStationsDisabledForCreate = function (taxRate) {
      return !taxRate.countryName || $scope.isFieldReadOnly(taxRate);
    };

    $scope.showCurrencyCode = function (taxRate) {
      return (angular.isDefined(taxRate.currency) && taxRate.currency.code && !$scope.isTaxRateTypePercentage(
        taxRate));
    };

    $scope.isTaxRateCurrencyCodeDisabled = function (taxRate) {
      return $scope.isDisabled(taxRate) || $scope.isTaxRateTypePercentage(taxRate);
    };

    $scope.filterTaxRateStations = function (taxRate) {
      taxRate.availableStations = angular.copy($scope.masterStationsList);
      taxRate.availableStations = $filter('filter')(taxRate.availableStations, {
        countryName: taxRate.countryName.countryName
      }, true);
      taxRate.companyTaxRateStations = [];
    };

    $scope.taxRateSelectReady = function (taxRate) {
      return ($scope.viewIsReady && taxRate.action === 'edit' && taxRate.availableStations);
    };

    $scope.shouldTaxRateCurrencyBeClear = function (taxRate) {
      if ($scope.isTaxRateTypePercentage(taxRate) && angular.isDefined(taxRate.currency)) {
        taxRate.currency = null;
      }
    };

    $scope.onUiSelect = function ($select) {
      $select.search = '';
    };

    $scope.isCurrentEffectiveDate = function (taxRate) {
      return (dateUtility.isTodayOrEarlierDatePicker(taxRate.startDate) && dateUtility.isAfterTodayDatePicker(taxRate.endDate));
    };

  });
