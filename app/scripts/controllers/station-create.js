'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationCreateCtrl
 * @description
 * # StationCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationCreateCtrl', function($scope, $location, $q, messageService, dateUtility, $routeParams, stationsFactory, $filter) {

    var $this = this;

    var stationJSON = {
      id: 114,
      cityId: 18,
      cityName: 'Copenhagen',
      companyId: 403,
      countryId: 66,
      countryName: 'Denmark',
      description: 'Copenhagen',
      isCaterer: true,
      endDate: '2015-12-31',
      startDate: '2015-05-02',
      regionId: 8,
      regionName: 'All',
      stationCode: 'CPH',
      stationId: 3,
      stationName: 'London',
      timezone: 'Europe/Madrid',
      timezoneId: '86',
      utcDstOffset: '+02:00',
      utcOffset: '+01:00',
      companyStationRelationships: [{
        catererId: '44',
        endDate: '2015-12-31',
        startDate: '2015-05-02',
      }]
    };

    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
    $scope.stationList = [];

    this.setCatererStationList = function(dataFromAPI) {
      $scope.catererStationList = angular.copy(dataFromAPI.response);
    };

    this.getCatererStationList = function() {
      // add factory API call here
      this.setCatererStationList(catererStationListJSON);
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

    this.setCountryList = function (stationsList) {
      var countriesList = [];
      angular.forEach(stationsList, function (station) {
        var country = {
          id: station.countryId,
          countryName: station.countryName
        };
        countriesList.push(country);
      });

      $scope.countryList = $filter('unique')(countriesList, 'id');
    };

    this.setGlobalStationList = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI.response);

      var distinctStations = $filter('unique')(response, 'stationId');

      $scope.globalStationList = distinctStations;
      $this.setCountryList(distinctStations);
      $this.setCityList(distinctStations);
    };

    this.getGlobalStationList = function() {
      return stationsFactory.getGlobalStationList().then($this.setGlobalStationList);
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
      $scope.formData = {
        station: {
          id: station.id,
          code: station.stationCode,
          name: station.stationName
        },
        city: {
          id: station.cityId,
          cityName: station.cityName
        },
        country: {
          id: station.countryId,
          countryName: station.countryName
        },
        startDate: dateUtility.formatDateForApp(station.startDate),
        endDate: dateUtility.formatDateForApp(station.endDate),
        isCaterer: station.isCaterer,
      };
      this.setStationRelationships(station);
      $scope.dataReady = true;
    };

    this.getStation = function() {
      // add factory API call here
      this.setStation(stationJSON);
    };

    this.showSuccessMessage = function(message) {
      messageService.display('success', message, 'Success');
    };

    this.filterByCountry = function(record) {
      if (angular.isUndefined($scope.formData) || angular.isUndefined($scope.formData.countryId)) {
        return true;
      }

      return parseInt(record.countryId) === parseInt($scope.formData.countryId);
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
        countryId: $scope.formData.country.id
      };
    };

    this.createStation = function() {
      var payload = this.generatePayload();

      // mock API call here
      this.createStationSuccess(payload);
    };

    this.submitForm = function() {
      if (this.validateForm()) {
        this.createStation();
      }
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
      this.checkIfViewOnly();
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
        this.getGlobalStationList()
        //this.getCatererStationList()
      ];
    };

    this.initSuccessHandler = function() {
      if ($routeParams.id) {
        $this.getStation();
        $this.setFormAsEdit();
        return false;
      }

      $scope.dataReady = true;
    };

    this.init = function() {
      this.viewOnly = false;
      $scope.formData = {
        stationId: null,
        endDate: dateUtility.nowFormatted(),
        startDate: dateUtility.nowFormatted(),
        companyStationRelationships: []
      };

      $scope.displayError = false;
      $scope.buttonText = 'Add';
      $scope.viewLabel = 'Add';

      // TODO: Add waiting
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

    $scope.addRelationship = function() {
      return $this.addRelationship();
    };

    $scope.isViewOnly = function() {
      return $this.viewOnly;
    };

  });
