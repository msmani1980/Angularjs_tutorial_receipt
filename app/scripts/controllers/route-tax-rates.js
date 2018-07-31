'use strict';
/*jshint maxcomplexity:9 */
/**
 * @ngdoc function
 * @name ts5App.controller:RouteTaxRatesCtrl
 * @description
 * # RouteTaxRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('RouteTaxRatesCtrl', function ($scope, $q, $route, $filter, routeTaxRatesFactory, dateUtility, messageService, accessService, lodash) {

    var $this = this;

    this.createScopeVariables = function () {
      $scope.viewName = 'Route Tax Management';
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
      $scope.taxTypesList = lodash.filter(angular.copy(dataFromAPI.response), { applicableTo: 'Route' });
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

    $scope.findCompanyCurrencyCode = function (companyCurrencyId) {
      var currencyCode = '';
      if (angular.isDefined(companyCurrencyId) && angular.isDefined($scope.currenciesList)) {
        angular.forEach($scope.currenciesList, function (currency) {
          if (currency.id === companyCurrencyId) {
            currencyCode = currency.code;
          }
        });

        return currencyCode;
      }
    };

    this.checkForExistingDepartureStations = function (taxRate, currentStation) {
      var existingStation = [];
      angular.forEach(taxRate.departureStations, function (station) {
        if (station.stationCode === currentStation.stationCode) {
          existingStation.push(station);
        }
      });

      return (!existingStation.length);
    };

    this.checkForExistingArrivalStations = function (taxRate, currentStation) {
      var existingStation = [];
      angular.forEach(taxRate.arrivalStations, function (station) {
        if (station.stationCode === currentStation.stationCode) {
          existingStation.push(station);
        }
      });

      return (!existingStation.length);
    };

    this.setTaxRateAvailableDepartureStations = function (taxRate) {
      var availableStations = [];
      if ($scope.stationsList.length > 0) {
        angular.forEach($scope.stationsList, function (station) {
          if ($this.checkForExistingDepartureStations(taxRate, station)) {
            if (taxRate.departureStationsCountryName === station.countryName) {
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

    this.setTaxRateAvailableArrivalStations = function (taxRate) {
      var availableStations = [];
      if ($scope.stationsList.length > 0) {
        angular.forEach($scope.stationsList, function (station) {
          if ($this.checkForExistingArrivalStations(taxRate, station)) {
            if (taxRate.arrivalStationsCountryName === station.countryName) {
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

    this.formatTaxTypeDepartureCountryName = function (taxRate) {
      return {
        countryName: taxRate.departureStationsCountryName
      };
    };

    this.formatTaxTypeArrivalCountryName = function (taxRate) {
      return {
        countryName: taxRate.arrivalStationsCountryName
      };
    };

    this.formatDepartureStations = function (taxRate) {
      var stations = lodash.filter(taxRate.stations, { direction: 'Departure' });

      return stations.map(function (station) {
        var departureStation = lodash.find($scope.stationsList, { stationCode: station.stationCode });

        return {
          companyStationId: departureStation.stationId,
          stationCode: departureStation.stationCode,
          stationName: departureStation.stationName,
          countryName: departureStation.countryName
        };
      });
    };

    this.formatArrivalStations = function (taxRate) {
      var stations = lodash.filter(taxRate.stations, { direction: 'Arrival' });

      return stations.map(function (station) {
        var arrivalStation = lodash.find($scope.stationsList, { stationCode: station.stationCode });

        return {
          companyStationId: arrivalStation.stationId,
          stationCode: arrivalStation.stationCode,
          stationName: arrivalStation.stationName,
          countryName: arrivalStation.countryName
        };
      });
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
      taxRate.allDepartureStations = false;
      taxRate.allArrivalStations = false;
      taxRate.availableDepartureStations = $this.setTaxRateAvailableDepartureStations(taxRate);
      taxRate.availableArrivalStations = $this.setTaxRateAvailableArrivalStations(taxRate);
      taxRate.departureStationsCountryName = $this.formatTaxTypeDepartureCountryName(taxRate);
      taxRate.arrivalStationsCountryName = $this.formatTaxTypeArrivalCountryName(taxRate);
      taxRate.departureStations = $this.formatDepartureStations(taxRate);
      taxRate.arrivalStations = $this.formatArrivalStations(taxRate);
      taxRate.taxTypeCode = $this.formatTaxTypeCode(taxRate);
      taxRate.taxRateType = $this.formatTaxRateType(taxRate);
      if (angular.isDefined(dates) && dates === true) {
        taxRate.startDate = $this.formatTaxRateDate(taxRate.startDate);
        taxRate.endDate = $this.formatTaxRateDate(taxRate.endDate);
      }

      taxRate.taxRateValue = Number(taxRate.taxRateValue).toFixed(2);
      taxRate.taxRateAmounts = taxRate.taxRateAmounts.map(function(amount) {
        amount.amount = Number(amount.amount).toFixed(2);
        return amount;
      });

      return taxRate;
    };

    this.formatTaxRatesAfterCreation = function (newTaxRatesList) {
      var taxRatesList = [];
      angular.forEach(newTaxRatesList, function (taxRate) {
        taxRate = $this.formatTaxRateObject(taxRate, true);
        taxRatesList.push(taxRate);
      });

      return taxRatesList;
    };

    this.createRouteTaxRates = function (taxRatesList) {
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
      var taxRatesList = angular.copy(dataFromAPI.response);
      $this.setMasterCompanyTaxRatesList(masterRatesList);
      if (angular.isDefined(taxRatesList)) {
        $scope.companyTaxRatesList = $this.createRouteTaxRates(taxRatesList);
      }
    };

    this.setMasterCompanyTaxRatesList = function (dataFromAPI) {
      $scope.masterTaxRates = [];
      var masterRatesList = angular.copy(dataFromAPI.response);
      if (angular.isDefined(masterRatesList)) {
        $scope.masterTaxRates = $this.createMasterCompanyTaxRates(masterRatesList);
      }
    };

    this.getTaxTypesList = function () {
      return routeTaxRatesFactory.getTaxTypesList().then($this.setTaxTypesList);
    };

    this.getTaxRateTypesList = function () {
      return routeTaxRatesFactory.getTaxRateTypes().then($this.setTaxRateTypesList);
    };

    this.getStationsList = function () {
      return routeTaxRatesFactory.getStationsList().then($this.setStationsList);
    };

    this.getCurrenciesList = function () {
      var nowDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var payload = {
        startDate: nowDate,
        endDate: nowDate,
        isOperatedCurrency: true
      };

      return routeTaxRatesFactory.getCompanyCurrencies(payload).then($this.setCurrenciesList);
    };

    this.getRouteTaxRates = function (query) {
      var q = query || {};
      return routeTaxRatesFactory.getRouteTaxRates(q).then($this.setCompanyTaxRatesList);
    };

    this.getCompanyMasterTaxRatesList = function (query) {
      var q = query || {};
      return routeTaxRatesFactory.getRouteTaxRates(q).then($this.setMasterCompanyTaxRatesList);
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
        $this.getRouteTaxRates()
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
      $scope.isCRUD = accessService.crudAccessGranted('TAX', 'TAX', 'CRUDTAX');
      $this.createScopeVariables();
      $this.showLoadingModal('Loading data for Route Tax Management...');
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

    this.generateDepartureCompanyStationIds = function () {
      var companyStationIds = [];
      for (var key in $scope.search.departureStations) {
        var station = $scope.search.departureStations[key];
        if (station.stationId) {
          companyStationIds.push(station.stationId);
        }
      }

      return encodeURI(companyStationIds);
    };

    this.generateArrivalCompanyStationIds = function () {
      var companyStationIds = [];
      for (var key in $scope.search.arrivalStations) {
        var station = $scope.search.arrivalStations[key];
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
        query.companyTaxTypeId = $scope.search.taxType.id;
      }

      if ($scope.search.departureCountry) {
        query.departureStationsCountryName = $scope.search.departureCountry.countryName;
      }

      if ($scope.search.arrivalCountry) {
        query.arrivalStationsCountryName = $scope.search.arrivalCountry.countryName;
      }

      if ($scope.search.taxRateType) {
        query.taxRateType = $scope.search.taxRateType.taxRateType;
      }

      return query;
    };

    this.createSearchPayload = function () {
      var query = $this.createUiSelectSearchPayload();

      if (angular.isDefined($scope.search.departureStations) && $scope.search.departureStations.length) {
        query.departureStationIds = $this.generateDepartureCompanyStationIds();
      }

      if (angular.isDefined($scope.search.arrivalStations) && $scope.search.arrivalStations.length) {
        query.arrivalStationIds = $this.generateArrivalCompanyStationIds();
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
        $this.getRouteTaxRates(query)
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

      var message = 'Searching Route Tax Rates...';
      if (clear) {
        message = 'Clearing Search...';
      }

      $this.showLoadingModal(message);
      var promises = $this.createSearchPromises();
      $q.all(promises).then($this.searchSuccess, $this.errorHandler);
    };

    this.deleteTaxRate = function (taxRate) {
      if (angular.isDefined(taxRate)) {
        taxRate.deleted = true;
      }

      var message = 'Deleting Route Tax Rate ID: ' + taxRate.id;
      $this.showLoadingModal(message);

      return routeTaxRatesFactory.removeRouteTaxRate(taxRate.id).then($this.deleteSuccess, $this.errorHandler);
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
      messageService.display('success', 'Successfully Deleted <b>Route Tax Rate ID: </b>' + id);
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
      var departureStations = taxRate.departureStations.map(function (station) {
        var existingStation = lodash.find(taxRate.stations, { stationCode: station.stationCode, direction: 'Departure' });

        return {
          id: existingStation ? existingStation.id : null,
          companyStationId: station.companyStationId,
          direction: 'Departure'
        };
      });

      var arrivalStations = taxRate.arrivalStations.map(function (station) {
        var existingStation = lodash.find(taxRate.stations, { stationCode: station.stationCode, direction: 'Arrival' });

        return {
          id: existingStation ? existingStation.id : null,
          companyStationId: station.companyStationId,
          direction: 'Arrival'
        };
      });

      return departureStations.concat(arrivalStations);
    };

    this.createTaxRateAmountsPayload = function (taxRate) {
      return taxRate.taxRateAmounts;
    };

    this.editSuccess = function (taxRate) {
      delete taxRate.edited;
      delete taxRate.readOnly;
      taxRate.action = 'read';
      taxRate.saved = true;
      taxRate.allDepartureStations = false;
      taxRate.allArrivalStations = false;

      $this.hideLoadingModal();
      $this.getTaxRateById(taxRate.id);
      $this.getCompanyMasterTaxRatesList();
      $this.clearCustomErrors();

      messageService.display('success', 'Successfully Saved <b>Route Tax Rate ID: </b>' + taxRate.id);
    };

    this.saveTaxRateEdits = function (taxRate) {
      $this.clearCustomErrors();

      var taxRateType = taxRate.taxRateType ? taxRate.taxRateType.taxRateType : null;
      var companyTaxTypeId = taxRate.taxTypeCode ? taxRate.taxTypeCode.id : taxRate.companyTaxTypeId;
      var taxRateValue = taxRateType === 'Percentage' ? taxRate.taxRateValue : null;
      var taxRateAmounts = taxRateType === 'Amount' ? $this.createTaxRateAmountsPayload(taxRate) : [];

      if ($scope.isTaxRateTypePercentage(taxRate)) {
        $this.validateNewData('rate', taxRateValue, taxRate);
      }

      if ($scope.isTaxRateTypeAmount(taxRate)) {
        $this.validateNewData('rate', taxRateAmounts, taxRate);
      }

      $this.validateNewData('rateType', taxRateType, taxRate);
      $this.validateNewData('startDate', dateUtility.formatDateForAPI(taxRate.startDate), taxRate);
      $this.validateNewData('endDate', dateUtility.formatDateForAPI(taxRate.endDate), taxRate);
      $this.validateNewData('taxType', companyTaxTypeId, taxRate);
      $this.validateNewData('arrivalStations', taxRate.arrivalStations, taxRate);
      $this.validateNewData('departureStations', taxRate.departureStations, taxRate);

      var payload = {
        id: taxRate.id,
        taxRateValue: taxRateValue,
        taxRateType: taxRateType,
        allDepartureStations: taxRate.allDepartureStations,
        allArrivalStations: taxRate.allArrivalStations,
        startDate: dateUtility.formatDateForAPI(taxRate.startDate),
        endDate: dateUtility.formatDateForAPI(taxRate.endDate),
        companyTaxTypeId: companyTaxTypeId,
        stations: $this.createStationsPayload(taxRate),
        taxRateAmounts: taxRateAmounts
      };

      if ($scope.displayError !== true) {
        $this.showLoadingModal('Saving Edits for Route Tax Rate ID: ' + taxRate.id);

        return routeTaxRatesFactory.updateRouteTaxRate(taxRate.id, payload).then(function () {
          $this.editSuccess(taxRate);
        }, $this.errorHandler);
      }
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
      var length = $scope.companyTaxRatesList.length;
      var payload = {
        action: 'create',
        position: 'up',
        key: length + 1,
        taxRateValue: undefined,
        taxRateAmounts: [],
        taxRateType: undefined,
        startDate: undefined,
        endDate: undefined,
        taxTypeCode: undefined,
        stations: [],
        departureStations: [],
        arrivalStations: [],
        created: true
      };
      $scope.companyTaxRatesList.push(payload);
    };

    this.parseNewTaxRatePayload = function (taxRate) {
      $this.clearCustomErrors();

      var taxRateType = taxRate.taxRateType ? taxRate.taxRateType.taxRateType : null;
      var companyTaxTypeId = taxRate.taxTypeCode ? taxRate.taxTypeCode.id : taxRate.companyTaxTypeId;
      var taxRateValue = taxRateType === 'Percentage' ? taxRate.taxRateValue : null;
      var taxRateAmounts = taxRateType === 'Amount' ? $this.createTaxRateAmountsPayload(taxRate) : [];

      if ($scope.isTaxRateTypePercentage(taxRate)) {
        $this.validateNewData('rate', taxRateValue, taxRate);
      }

      if ($scope.isTaxRateTypeAmount(taxRate)) {
        $this.validateNewData('rate', taxRateAmounts, taxRate);
      }

      $this.validateNewData('rateType', taxRateType, taxRate);
      $this.validateNewData('startDate', dateUtility.formatDateForAPI(taxRate.startDate), taxRate);
      $this.validateNewData('endDate', dateUtility.formatDateForAPI(taxRate.endDate), taxRate);
      $this.validateNewData('taxType', companyTaxTypeId, taxRate);
      $this.validateNewData('arrivalStations', taxRate.arrivalStations, taxRate);
      $this.validateNewData('departureStations', taxRate.departureStations, taxRate);

      var payload = {
        taxRateValue: taxRateValue,
        taxRateType: taxRateType,
        startDate: dateUtility.formatDateForAPI(taxRate.startDate),
        endDate: dateUtility.formatDateForAPI(taxRate.endDate),
        companyTaxTypeId: companyTaxTypeId,
        stations: $this.createStationsPayload(taxRate),
        taxRateAmounts: taxRateAmounts
      };

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

    this.setTaxRateById = function (dataFromAPI) {
      angular.forEach($scope.companyTaxRatesList, function (taxRate) {
        if (taxRate.id === dataFromAPI.id) {
          taxRate.createdOn = dataFromAPI.createdOn;
          taxRate.createdByPerson = dataFromAPI.createdByPerson;
          taxRate.updatedOn = dataFromAPI.updatedOn;
          taxRate.updatedByPerson = dataFromAPI.updatedByPerson;
          taxRate.taxRateValue = Number(dataFromAPI.taxRateValue).toFixed(2);
          taxRate.stations = dataFromAPI.stations;
          taxRate.departureStations = $this.formatDepartureStations(dataFromAPI);
          taxRate.arrivalStations = $this.formatArrivalStations(dataFromAPI);
          taxRate.taxRateAmounts = dataFromAPI.taxRateAmounts.map(function(amount) {
            amount.amount = Number(amount.amount).toFixed(2);
            return amount;
          });
        }
      });
    };

    this.getTaxRateById = function (id) {
      routeTaxRatesFactory.getRouteTaxRate(id).then($this.setTaxRateById);
    };

    this.createNewTaxRateSuccess = function (response) {
      var id = response.id;

      $this.getCompanyMasterTaxRatesList();
      $this.setIdOnTaxRateObjectOnSuccess(id);
      $this.getTaxRateById(id);
      $this.hideLoadingModal();
      messageService.display('success', 'Successfully Created <b>Route Tax Rate ID: </b>' + id);
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
      $this.showLoadingModal('Creating new Route Tax Rate...');

      return routeTaxRatesFactory.createRouteTaxRate(payload).then($this.createNewTaxRateSuccess, $this.createNewTaxRateError);
    };

    // Place $scope functions here
    $scope.clearSearchFilters = function () {
      if (angular.isDefined($scope.search)) {
        $scope.search = {};
        $scope.dateRange = {
          startDate: '',
          endDate: ''
        };
        $scope.enableDepartureSearchStations = false;
        $scope.enableArrivalSearchStations = false;
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
      return $this.deleteTaxRate(taxRate);
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

    $scope.isTaxRateTypeAmount = function (taxRate) {
      return angular.isDefined(taxRate.taxRateType) && taxRate.taxRateType.taxRateType === 'Amount';
    };

    $scope.cancelNewTaxRate = function (taxRate) {
      $this.clearCustomErrors();
      $scope.errorResponse = [];
      taxRate.deleted = true;
      taxRate.action = 'deleted';
    };

    $scope.filterSearchDepartureStationsByCountry = function (countryName) {
      $scope.enableDepartureSearchStations = true;
      $scope.departureStationsListSearch = angular.copy($scope.masterStationsList);
      $scope.departureStationsListSearch = $filter('filter')($scope.departureStationsListSearch, {
        countryName: countryName
      }, true);
      $scope.search.departureStations = [];
    };

    $scope.filterSearchArrivalStationsByCountry = function (countryName) {
      $scope.enableArrivalSearchStations = true;
      $scope.arrivalStationsListSearch = angular.copy($scope.masterStationsList);
      $scope.arrivalStationsListSearch = $filter('filter')($scope.arrivalStationsListSearch, {
        countryName: countryName
      }, true);
      $scope.search.arrivalStations = [];
    };

    $scope.isTaxRateDepartureCountryFieldDisabled = function (taxRate) {
      return $scope.isDisabled(taxRate) || (angular.isDefined(taxRate.departureStations) && taxRate.departureStations.length);
    };

    $scope.isTaxRateArrivalCountryFieldDisabled = function (taxRate) {
      return $scope.isDisabled(taxRate) || (angular.isDefined(taxRate.arrivalStations) && taxRate.arrivalStations.length);
    };

    $scope.isTaxRateDepartureCountryFieldDisabledForCreate = function (taxRate) {
      return angular.isDefined(taxRate.departureStations) && taxRate.departureStations.length;
    };

    $scope.isTaxRateArrivalCountryFieldDisabledForCreate = function (taxRate) {
      return angular.isDefined(taxRate.arrivalStations) && taxRate.arrivalStations.length;
    };

    $scope.isTaxRateDepartureStationsDisabled = function (taxRate) {
      return this.isDisabled(taxRate) || (!taxRate.departureStationsCountryName || $scope.isFieldReadOnly(taxRate));
    };

    $scope.isTaxRateArrivalStationsDisabled = function (taxRate) {
      return this.isDisabled(taxRate) || (!taxRate.arrivalStationsCountryName || $scope.isFieldReadOnly(taxRate));
    };

    $scope.isTaxRateDepartureStationsDisabledForCreate = function (taxRate) {
      return !taxRate.departureStationsCountryName || $scope.isFieldReadOnly(taxRate);
    };

    $scope.isTaxRateArrivalStationsDisabledForCreate = function (taxRate) {
      return !taxRate.arrivalStationsCountryName || $scope.isFieldReadOnly(taxRate);
    };

    $scope.showCurrencyCode = function (taxRate) {
      return (angular.isDefined(taxRate.currency) && taxRate.currency.code && !$scope.isTaxRateTypePercentage(
        taxRate));
    };

    $scope.isTaxRateCurrencyCodeDisabled = function (taxRate) {
      return $scope.isDisabled(taxRate) || $scope.isTaxRateTypePercentage(taxRate);
    };

    $scope.filterDepartureTaxRateStations = function (taxRate) {
      taxRate.availableDepartureStations = lodash.filter($scope.masterStationsList, { countryName: taxRate.departureStationsCountryName.countryName })
        .map(function (station) {
          return {
            companyStationId: station.stationId,
            stationCode: station.stationCode,
            stationName: station.stationName,
            countryName: station.countryName
          };
        });

      taxRate.departureStations = [];
    };

    $scope.filterArrivalTaxRateStations = function (taxRate) {
      taxRate.availableArrivalStations = lodash.filter($scope.masterStationsList, { countryName: taxRate.arrivalStationsCountryName.countryName })
        .map(function (station) {
          return {
            companyStationId: station.stationId,
            stationCode: station.stationCode,
            stationName: station.stationName,
            countryName: station.countryName
          };
        });

      taxRate.arrivalStations = [];
    };

    $scope.taxRateSelectReady = function (taxRate) {
      return ($scope.viewIsReady && taxRate.action === 'edit' && taxRate.availableDepartureStations && taxRate.availableArrivalStations);
    };

    $scope.shouldTaxRateCurrencyBeClear = function (taxRate) {
      if ($scope.isTaxRateTypePercentage(taxRate) && angular.isDefined(taxRate.taxRateAmounts)) {
        taxRate.taxRateAmounts = [];
      }
    };

    $scope.onUiSelect = function ($select) {
      $select.search = '';
    };

    $scope.isCurrentEffectiveDate = function (taxRate) {
      return (dateUtility.isTodayOrEarlierDatePicker(taxRate.startDate) && dateUtility.isAfterTodayDatePicker(taxRate.endDate));
    };

    $scope.showCompanyTaxAmountModal = function (taxRate) {
      $scope.taxRateToEdit = taxRate;
      $scope.taxRateToEditAmounts = [];

      taxRate.taxRateAmounts.forEach(function (taxRateAmount) {
        $scope.taxRateToEditAmounts[taxRateAmount.companyCurrencyId] = taxRateAmount;
      });

      angular.element('#currency-amounts-modal').modal('show');
    };

    $scope.saveRateAmounts = function () {
      if (!$scope.taxRateAmountsForm.$valid) {
        return;
      }

      var taxRateAmounts = [];
      $scope.taxRateToEditAmounts.forEach(function (taxRateAmount, companyCurrencyId) {
        var amount = {};

        if (taxRateAmount.amount && !isNaN(parseFloat(taxRateAmount.amount))) {
          amount.companyCurrencyId = companyCurrencyId;
          amount.amount = parseFloat(taxRateAmount.amount);

          if (taxRateAmount.id) {
            amount.id = taxRateAmount.id;
          }

          taxRateAmounts.push(amount);
        }
      });

      $scope.taxRateToEdit.taxRateAmounts = taxRateAmounts;

      angular.element('#currency-amounts-modal').modal('hide');
    };

    $scope.getUpdateBy = function (taxRate) {
      if (taxRate.updatedByPerson) {
        return taxRate.updatedByPerson.userName;
      }

      if (taxRate.createdByPerson) {
        return taxRate.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (taxRate) {
      if (!taxRate.createdOn) {
        return '';
      }

      return taxRate.updatedOn ? dateUtility.formatTimestampForApp(taxRate.updatedOn) : dateUtility.formatTimestampForApp(taxRate.createdOn);
    };

    $scope.addAllDepartureStations = function (taxRate) {
      if (taxRate.allDepartureStations) {
        taxRate.departureStationsBackup = taxRate.departureStations;
        taxRate.departureStations = taxRate.availableDepartureStations;
      } else {
        taxRate.departureStations = taxRate.departureStationsBackup;
      }
    };

    $scope.addAllArrivalStations = function (taxRate) {
      if (taxRate.allArrivalStations) {
        taxRate.arrivalStationsBackup = taxRate.arrivalStations;
        taxRate.arrivalStations = taxRate.availableArrivalStations;
      } else {
        taxRate.arrivalStations = taxRate.arrivalStationsBackup;
      }
    };
  });

