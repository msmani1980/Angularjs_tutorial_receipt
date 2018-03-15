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
    $scope.isCatererDropdownOptions = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];

    this.setCatererStationList = function(dataFromAPI) {
      $scope.catererStationList = angular.copy(dataFromAPI.response);
    };

    this.getCatererStationList = function() {
      // add factory API call here
      // this.setCatererStationList(catererStationListJSON);
    };

    this.setCityList = function(stationsList) {
      var citiesList = [];
      angular.forEach(stationsList, function (station) {
        var country = {
          id: station.cityId,
          cityName: station.cityName,
          countryId: station.countryId
        };
        citiesList.push(country);
      });

      $scope.cityList = $filter('unique')(citiesList, 'id');
    };

    this.setCountryList = function (dataFromAPI) {
      $scope.countryList = angular.copy(dataFromAPI.countries);
    };

    this.getCountryList = function () {
      var payload = { limit: 1000 };

      countriesService.getCountriesList(payload).then($this.setCountryList);
    };

    this.setGlobalStationList = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI.response);

      var distinctStations = $filter('unique')(response, 'stationId');

      $scope.globalStationList = distinctStations;
      $this.setCityList(distinctStations);
    };

    this.getGlobalStationList = function() {
      return stationsFactory.getStations().then($this.setGlobalStationList);
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

    this.findCountryInGlobalStationList = function (countryId) {
      return lodash.find($scope.globalStationList, { countryId: countryId });
    };

    this.findCityInGlobalStationList = function (cityId) {
      return lodash.find($scope.globalStationList, { cityId: cityId });
    };

    this.findStationInGlobalStationList = function (stationId) {
      return lodash.find($scope.globalStationList, { id: stationId });
    };

    this.addExpiredStation = function(stationFromAPI) {
      var countryFound = $this.findCountryInGlobalStationList(stationFromAPI.countryId);
      var cityFound = $this.findCityInGlobalStationList(stationFromAPI.cityId);
      var stationFound = $this.findStationInGlobalStationList(stationFromAPI.stationId);

      if (!stationFound) {
        $scope.globalStationList.push({
          id: stationFromAPI.stationId,
          code: stationFromAPI.stationCode,
          cityId: stationFromAPI.cityId,
          cityName: stationFromAPI.cityName,
          countryId: stationFromAPI.countryId,
          countryName: stationFromAPI.countryName,
          name: stationFromAPI.stationName,
          expired: true
        });
      }

      if (!cityFound) {
        $scope.cityList.push({
          id: stationFromAPI.cityId,
          cityName: stationFromAPI.cityName,
          countryId: stationFromAPI.countryId,
          expired: true
        });
      }

      if (!countryFound) {
        $scope.countryList.push({
          id: stationFromAPI.countryId,
          countryName: stationFromAPI.countryName,
          expired: true
        });
      }
    };

    this.setStation = function(dataFromAPI) {
      var station = angular.copy(dataFromAPI);

      var startDate = dateUtility.formatDateForApp(dataFromAPI.startDate);
      var endDate = dateUtility.formatDateForApp(dataFromAPI.endDate);

      $this.addExpiredStation(station);

      $scope.formData = {
        station: $this.findStationInGlobalStationList(station.stationId),
        city: {
          id: station.cityId,
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

      $scope.dataReady = true;
    };

    this.getStation = function(id) {
      stationsFactory.getCompanyStation(id).then($this.setStation);
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

      return parseInt(record.cityId) === parseInt($scope.formData.city.id);
    };

    this.validateForm = function() {
      $scope.displayError = $scope.stationCreateForm.$invalid;
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
        stationId: $scope.formData.station.id,
        cityId: $scope.formData.city.id,
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
        $this.getStation($routeParams.id);
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

    $scope.$watch('formData.country', function(country) {
      if (!$scope.formData || !$scope.formData.city || !country) {
        return;
      }

      // Clear city and station if they don't belong to newly selected country
      if (parseInt($scope.formData.city.countryId) !== parseInt(country.id)) {
        $scope.formData.city = '';
        $scope.formData.station = '';
      }
    });

    $scope.$watch('formData.city', function(city) {
      if (!$scope.formData || !city) {
        return;
      }

      // Clear station if they don't belong to newly selected city
      if ($scope.formData.station && parseInt($scope.formData.station.cityId) !== parseInt(city.id)) {
        $scope.formData.station = '';
      }

      // Preselect country based on city location
      $scope.formData.country = lodash.find($scope.countryList, { id: city.countryId });
    });

    $scope.$watch('formData.station', function(station) {
      if (!$scope.formData || !station) {
        return;
      }

      // Preselect country based on city location
      $scope.formData.country = lodash.find($scope.countryList, { id: station.countryId });
      $scope.formData.city = lodash.find($scope.cityList, { id: station.cityId });
    });

  });
