'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationCreateCtrl
 * @description
 * # StationCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationCreateCtrl', function($scope, $location, $q, messageService, dateUtility, $routeParams, stationsFactory, $filter, lodash, countriesService) {

    var $this = this;

    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
    $scope.editingItem = false;
    $scope.globalStationList = [];
    $scope.formData = { };
    $scope.isCatererDropdownOptions = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];

    this.setCatererStationList = function(dataFromAPI) {
      $scope.catererStationList = angular.copy(dataFromAPI.response);
    };

    this.getCatererStationList = function() {
      // add factory API call here
      // this.setCatererStationList(catererStationListJSON);
    };

    this.setCityList = function(dataFromAPI) {
      $scope.cityList = angular.copy(dataFromAPI.response);
    };

    this.getCityList = function(payload) {
      return countriesService.getCities(payload).then(function(dataFromAPI) {
        $this.setCityList(dataFromAPI);
        $this.preselectCityBasedOnStation();
      });
    };

    this.setCountryList = function (dataFromAPI) {
      $scope.countryList = angular.copy(dataFromAPI.countries);
    };

    this.getCountryList = function () {
      var payload = { limit: 9000 };

      return countriesService.getCountriesList(payload).then($this.setCountryList);
    };

    this.setGlobalStationList = function(dataFromAPI) {
      $scope.globalStationList = angular.copy(dataFromAPI.response);
    };

    this.getGlobalStationList = function(payload) {
      return stationsFactory.getStations(payload).then($this.setGlobalStationList);
    };

    this.setStationRelationships = function(station) {
      $scope.formData.companyStationRelationships = [];
      angular.forEach(station.companyStationRelationships, function(relationship) {
        $scope.formData.companyStationRelationships.push({
          id: relationship.id,
          stationId: parseInt(station.stationId),
          endDate: dateUtility.formatDateForApp(relationship.endDate),
          startDate: dateUtility.formatDateForApp(relationship.startDate)
        });
      });
    };

    this.setStation = function(dataFromAPI) {
      var station = angular.copy(dataFromAPI);

      var startDate = dateUtility.formatDateForApp(dataFromAPI.startDate);
      var endDate = dateUtility.formatDateForApp(dataFromAPI.endDate);

      $scope.formData = {
        station: {
          cityName: station.cityName,
          countryName: station.countryName,
          countryCode: station.countryCode,
          countryId: station.countryId,
          cityId: station.cityId,
          stationId: station.stationId,
          name: station.name,
          code: station.code
        },
        city: {
          cityId: station.cityId,
          cityName: station.cityName,
          countryId: station.countryId
        },
        country: {
          id: station.countryId,
          countryName: station.countryName
        },
        startDate: startDate,
        endDate: endDate,
        isCaterer: lodash.find($scope.isCatererDropdownOptions, { value: station.isCaterer })
      };

      $scope.shouldDisableStartDate = dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

      //this.setStationRelationships(station);
    };

    this.getStation = function(id) {
      return stationsFactory.getCompanyStation(id).then($this.setStation);
    };

    this.setStationValidationDates = function(dataFromAPI) {
      $scope.maxStartDate = dateUtility.formatDateForApp(dataFromAPI.startDate);
      $scope.minEndDate = dateUtility.formatDateForApp(dataFromAPI.endDate);
    };

    this.getStationValidationDates = function(id) {
      return stationsFactory.getCompanyStationValidationDates(id).then($this.setStationValidationDates);
    };

    this.showSuccessMessage = function(message) {
      messageService.display('success', message, 'Success');
    };

    this.filterByCountry = function(record) {
      if (!$scope.formData || !$scope.formData.country) {
        return true;
      }

      return parseInt(record.countryId) === parseInt($scope.formData.country.id);
    };

    this.filterByCity = function(record) {
      if (!$scope.formData || !$scope.formData.city) {
        return true;
      }

      return parseInt(record.cityId) === parseInt($scope.formData.city.cityId);
    };

    this.validateForm = function() {
      $scope.displayError = $scope.stationCreateForm.$invalid;

      if (this.validateEndDate()) {
        $scope.errorCustom = [{
          field: 'Required Fields',
          value: 'Outbound Seal or Inbound Seal or Cart Quantity or Canister Quantity, any one of these are required'
        }];
        $scope.displayError = true;
        return false;
      }

      return $scope.stationCreateForm.$valid;
    };

    this.errorHandler = function(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.createStationSuccess = function() {
      this.showSuccessMessage('Station has been created!');
    };

    this.generatePayload = function() {
      return {
        stationId: $scope.formData.station.stationId,
        cityId: $scope.formData.city.cityId,
        countryId: $scope.formData.country.id,
        startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.endDate),
        isCaterer: $scope.formData.isCaterer.value
      };
    };

    this.createStation = function() {
      $this.displayLoadingModal('Creating Station');

      var payload = this.generatePayload();

      stationsFactory.createStation(payload).then($this.saveFormSuccess, $this.saveFormFailure).finally($this.hideLoadingModal);
    };

    this.updateStation = function() {
      $this.displayLoadingModal('Saving Station');

      var payload = this.generatePayload();

      stationsFactory.updateStation($routeParams.id, payload).then($this.saveFormSuccess, $this.saveFormFailure).finally($this.hideLoadingModal);
    };

    this.submitForm = function() {
      if (this.validateForm()) {
        if ($routeParams.id) {
          this.updateStation();
        } else {
          this.createStation();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.checkIfViewOnly = function() {
      var path = $location.path();
      if (path.search('/station-view') !== -1) {
        $this.viewOnly = true;
        $scope.viewLabel = 'Viewing ';
      }
    };

    this.addRelationship = function() {
      $scope.formData.companyStationRelationships.push({
        catererId: '',
        startDate: '',
        endDate: ''
      });
    };

    this.setFormAsEdit = function() {
      $scope.buttonText = 'Save';
      $scope.viewLabel = 'Editing';
      $scope.editingItem = true;
      this.checkIfViewOnly();
    };

    this.saveFormSuccess = function() {
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Station successfully created', 'success');
      } else {
        $this.showToastMessage('success', 'Station successfully saved', 'success');
      }

      $location.path('station-list');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.setUISelectValidationClass = function(inputName) {
      if (angular.isUndefined($scope.stationCreateForm[inputName])) {
        return '';
      }

      if ($scope.stationCreateForm[inputName].length === 0) {
        return 'has-error';
      }

      if ($scope.stationCreateForm[inputName].length > 0) {
        return 'has-success';
      }

      return '';
    };

    this.makeInitPromises = function() {
      return [
        this.getCountryList()

        //this.getCatererStationList()
      ];
    };

    this.initSuccessHandler = function() {
      if ($routeParams.id) {
        $q.all([
          $this.getStation($routeParams.id),
          $this.getStationValidationDates($routeParams.id)
        ]).then(function () {
          $scope.dataReady = true;
        });

        $this.setFormAsEdit();
        return false;
      }

      $scope.dataReady = true;
    };

    this.init = function() {
      this.viewOnly = false;
      $scope.formData = {
        stationId: null,
        endDate: null,
        startDate: null,
        companyStationRelationships: []
      };

      $scope.displayError = false;
      $scope.buttonText = 'Add';
      $scope.viewLabel = 'Add';

      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.init();

    /* Scope */

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.setUISelectValidationClass = function(inputName) {
      return $this.setUISelectValidationClass(inputName);
    };

    $scope.filterByCountry = function(record) {
      return $this.filterByCountry(record);
    };

    $scope.filterByCity = function(record) {
      return $this.filterByCity(record);
    };

    $scope.addRelationship = function() {
      return $this.addRelationship();
    };

    $scope.isViewOnly = function() {
      return $this.viewOnly;
    };

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate || $this.viewOnly;
    };

    $scope.autocompleteCities = function($select, $event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      // Do not use autocomplete if cities are filtered by country
      if ($scope.formData.country) {
        return;
      }

      if ($select.search && $select.search.length !== 0) {
        var payload = {
          cityName: $select.search,
          withStations: true,
          limit: 9000
        };

        $this.getCityList(payload);
      } else {
        $scope.cityList = [];
      }
    };

    $scope.autocompleteStations = function($select, $event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      // Do not use autocomplete if stations are filtered by country or city
      if ($scope.formData.country || $scope.formData.city) {
        return;
      }

      if ($select.search && $select.search.length !== 0) {
        var payload = {
          stationCode: $select.search,
          limit: 9000
        };

        $this.getGlobalStationList(payload);
      } else {
        $scope.globalStationList = [];
      }
    };

    this.preselectCountryBasedOnCity = function () {
      // If city is preselected, select appropriate country
      if ($scope.formData.city) {
        $scope.formData.country = lodash.find($scope.countryList, { id: $scope.formData.city.countryId });
      }
    };

    this.preselectCountryBasedOnStation = function () {
      // If station is preselected, select appropriate country
      if ($scope.formData.station) {
        $scope.formData.country = lodash.find($scope.countryList, { id: $scope.formData.station.countryId });
      }
    };

    this.preselectCityBasedOnStation = function () {
      // If station is preselected, select appropriate city
      if ($scope.formData.station) {
        $scope.formData.city = lodash.find($scope.cityList, { cityId: $scope.formData.station.cityId });
      }
    };

    this.prepareStationDropdownForAutocompleteIfCountryAndCityAreNotSelected = function () {
      // Remove other stations from list except selected one if both country and city dropdowns are empty
      if ($scope.formData.station && !$scope.formData.country && !$scope.formData.city) {
        $scope.globalStationList = lodash.filter($scope.globalStationList, { stationId: $scope.formData.station.stationId });
      }
    };

    this.clearCityAndStationIfTheyDontBelongToNewlySelectedCountry = function () {
      // Remove other stations from list except selected one if both country and city dropdowns are empty
      if ($scope.formData.station && !$scope.formData.country && !$scope.formData.city) {
        $scope.globalStationList = lodash.filter($scope.globalStationList, { stationId: $scope.formData.station.stationId });
      }
    };

    $scope.$watch('formData.country', function(country) {
      $this.prepareStationDropdownForAutocompleteIfCountryAndCityAreNotSelected();

      if (!$scope.formData || !country) {
        return;
      }

      $this.displayLoadingModal('Loading Cities and Stations for selected Country');

      var cityListPayload = { countryId: country.id, limit: 9000 };
      var globalStationListPayload = { country: country.countryName, limit: 9000 };

      $q.all([
        $this.getCityList(cityListPayload),
        $this.getGlobalStationList(globalStationListPayload)
      ]).then($this.clearCityAndStationIfTheyDontBelongToNewlySelectedCountry).finally($this.hideLoadingModal);

    });

    $scope.$watch('formData.city', function(city) {
      $this.prepareStationDropdownForAutocompleteIfCountryAndCityAreNotSelected();

      if (!$scope.formData || !city) {
        return;
      }

      // Clear station if it doesn't belong to newly selected city
      if ($scope.formData.station && parseInt($scope.formData.station.cityId) !== parseInt(city.cityId)) {
        $scope.formData.station = '';
      }

      // Preselect country based on city location
      $this.preselectCountryBasedOnCity();
    });

    $scope.$watch('formData.station', function(station) {
      if (!$scope.formData || !station) {
        return;
      }

      // Preselect country and city based on station location
      $this.preselectCountryBasedOnStation();
      $this.preselectCityBasedOnStation();
    });

  });
