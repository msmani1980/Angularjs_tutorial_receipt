'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationCreateCtrl
 * @description
 * # StationCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationCreateCtrl', function ($scope,$location,$q,ngToast,dateUtility,$routeParams) {

    var $this = this;

    var stationJSON = {
      'id': 114,
      'cityId': 18,
      'cityName': 'Copenhagen',
      'companyId': 403,
      'countryId': 66,
      'countryName': 'Denmark',
      'description': 'Copenhagen',
      'isCaterer': true,
      'endDate': '2015-12-31',
      'startDate': '2015-05-02',
      'regionId': 8,
      'regionName': 'All',
      'stationCode': 'CPH',
      'stationId': 3,
      'stationName': 'London',
      'timezone': 'Europe/Madrid',
      'timezoneId': '86',
      'utcDstOffset': '+02:00',
      'utcOffset': '+01:00',
      'companyStationRelationships': [{
        'catererId': '44',
        'endDate': '2015-12-31',
        'startDate': '2015-05-02',
      }]
    };

    var globalStationListJSON = {
      'response': [
        {
          'id': 1,
          'companyId': 403,
          'code': 'ORD',
          'name': 'Chicago O-hare'
        },
        {
          'id': 2,
          'companyId': 403,
          'code': 'MDW',
          'name': 'Chicago Midway'
        },
        {
          'id': 3,
          'companyId': 403,
          'code': 'LON3',
          'name': 'London'
        },
        {
          'id': 4,
          'companyId': 403,
          'code': 'SAN',
          'name': 'San Jose'
        },
        {
          'id': 5,
          'companyId': 403,
          'code': 'DEL',
          'name': 'Delhi'
        },
        {
          'id': 6,
          'companyId': 403,
          'code': 'JFK',
          'name': 'New York'
        },
        {
          'id': 7,
          'companyId': 403,
          'code': 'EWR',
          'name': 'Newark'
        },
        {
          'id': 8,
          'companyId': 403,
          'code': 'LAX',
          'name': 'Los Angeles'
        },
        {
          'id': 9,
          'companyId': 403,
          'code': 'MIA',
          'name': 'Miami'
        },
        {
          'id': 10,
          'companyId': 403,
          'code': 'IAH',
          'name': 'Houston'
        },
        {
          'id': 11,
          'companyId': 403,
          'code': 'BOS',
          'name': 'Boston'
        },
        {
          'id': 13,
          'companyId': 403,
          'code': 'CD123',
          'name': 'CHICAGO-NEW'
        },
        {
          'id': 19,
          'companyId': 403,
          'code': 'ALC',
          'name': 'Alicante'
        },
        {
          'id': 20,
          'companyId': 403,
          'code': 'BCN',
          'name': 'Barcelona'
        },
        {
          'id': 21,
          'companyId': 403,
          'code': 'AGP',
          'name': 'Malaga'
        },
        {
          'id': 22,
          'companyId': 403,
          'code': 'VLC',
          'name': 'Valencia'
        },
        {
          'id': 23,
          'companyId': 403,
          'code': 'CPH',
          'name': 'Copenhagen'
        },
        {
          'id': 24,
          'companyId': 403,
          'code': 'SKS',
          'name': 'Vojens'
        },
        {
          'id': 25,
          'companyId': 403,
          'code': 'EKHG',
          'name': 'Herning'
        },
        {
          'id': 26,
          'companyId': 403,
          'code': 'BSL',
          'name': 'Basel'
        },
        {
          'id': 27,
          'companyId': 403,
          'code': 'GVA',
          'name': 'Geneva'
        },
        {
          'id': 28,
          'companyId': 403,
          'code': 'ZRH',
          'name': 'Zurich'
        },
        {
          'id': 29,
          'companyId': 403,
          'code': 'BRN',
          'name': 'Bern'
        },
        {
          'id': 30,
          'companyId': 403,
          'code': 'ZHI',
          'name': 'Grenchen'
        },
        {
          'id': 39,
          'companyId': 403,
          'code': 'LON',
          'name': 'Heathrow Intl'
        },
        {
          'id': 41,
          'companyId': 403,
          'code': 'LGW',
          'name': 'Gatwick '
        },
        {
          'id': 43,
          'companyId': 403,
          'code': 'LPL',
          'name': 'Liverpool '
        },
        {
          'id': 44,
          'companyId': 403,
          'code': 'LTN',
          'name': 'Luton '
        },
        {
          'id': 45,
          'companyId': 403,
          'code': 'MAD',
          'name': 'Madrid '
        }
      ],
      'meta': {
        'count': 29,
        'limit': 29,
        'start': 0
      }
    };

    var countryListJSON = {
      'meta': {
        'count': 249,
        'limit': 249,
        'start': 0
      },
      'countries': [
        {
          'id': 66,
          'countryName': 'Denmark'
        },
        {
          'id': 10,
          'countryName': 'Afghanistan'
        },
        {
          'id': 22,
          'countryName': 'Åland Islands'
        },
        {
          'id': 13,
          'countryName': 'Albania'
        },
        {
          'id': 69,
          'countryName': 'Algeria'
        },
        {
          'id': 18,
          'countryName': 'American Samoa'
        },
        {
          'id': 8,
          'countryName': 'Andorra'
        }
      ]
    };

    var cityListJSON = {
      'meta': {
        'count': 270,
        'limit': 270,
        'start': 0
      },
      'cities': [
        {
          'cityId': 11,
          'cityName': 'Albany',
          'countryId': 240,
          'countryName': 'United States',
          'regionId': 2,
          'regionName': 'New York',
          'timeZoneId': 440,
          'timeZone': 'America/New_York',
          'utcDstOffset': '-04:00',
          'utcOffset': '-05:00'
        },
        {
          'cityId': 14,
          'cityName': 'Alicante',
          'countryId': 75,
          'countryName': 'Spain',
          'regionId': 9,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 15,
          'cityName': 'Barcelona',
          'countryId': 75,
          'countryName': 'Spain',
          'regionId': 9,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 21,
          'cityName': 'Basel',
          'countryId': 50,
          'countryName': 'Switzerland',
          'regionId': 7,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 24,
          'cityName': 'Bern',
          'countryId': 50,
          'countryName': 'Switzerland',
          'regionId': 7,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 5,
          'cityName': 'Chicago',
          'countryId': 240,
          'countryName': 'United States',
          'regionId': 4,
          'regionName': 'Illinois',
          'timeZoneId': 459,
          'timeZone': 'America/Chicago',
          'utcDstOffset': '-05:00',
          'utcOffset': '-06:00'
        },
        {
          'cityId': 18,
          'cityName': 'Copenhagen',
          'countryId': 66,
          'countryName': 'Denmark',
          'regionId': 8,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 13,
          'cityName': 'Detroit',
          'countryId': 240,
          'countryName': 'United States',
          'regionId': 5,
          'regionName': 'Michigan',
          'timeZoneId': 440,
          'timeZone': 'America/New_York',
          'utcDstOffset': '-04:00',
          'utcOffset': '-05:00'
        },
        {
          'cityId': 26,
          'cityName': 'Gatwick',
          'countryId': 84,
          'countryName': 'United Kingdom',
          'regionId': 10,
          'regionName': 'UK-REGION',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        },
        {
          'cityId': 22,
          'cityName': 'Geneva',
          'countryId': 50,
          'countryName': 'Switzerland',
          'regionId': 7,
          'regionName': 'All',
          'timeZoneId': 86,
          'timeZone': 'Europe/Madrid',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00'
        }
      ]
    };

    var catererStationListJSON = {
      'response': [{
        'id': 3,
        'companyId': 403,
        'code': 'LON3',
        'name': 'London'
      }, {
        'id': 5,
        'companyId': 403,
        'code': 'DEL',
        'name': 'Delhi'
      }],
      'meta': {
        'count': 2,
        'limit': 2,
        'start': 0
      }
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.catererStationList = angular.copy(dataFromAPI.response);
    };

    this.getCatererStationList = function() {
      // add factory API call here
      this.setCatererStationList(catererStationListJSON);
    };

    this.setCityList = function(dataFromAPI) {
      $scope.cityList = angular.copy(dataFromAPI.cities);
    };

    this.getCityList = function() {
      // add factory API call here
      this.setCityList(cityListJSON);
    };

    this.setCountryList = function(dataFromAPI) {
      $scope.countryList = angular.copy(dataFromAPI.countries);
    };

    this.getCountryList = function() {
      // add factory API call here
      this.setCountryList(countryListJSON);
    };

    this.setGlobalStationList = function(dataFromAPI) {
      $scope.globalStationList = angular.copy(dataFromAPI.response);
    };

    this.getGlobalStationList = function() {
      // add factory API call here
      this.setGlobalStationList(globalStationListJSON);
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
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Success</strong> - ' + message
      });
    };

    this.filterByCountry = function(record) {
      if(angular.isUndefined($scope.formData) || angular.isUndefined($scope.formData.countryId)) {
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
      if( this.validateForm() ) {
        this.createStation();
      }
    };

    this.checkIfViewOnly = function () {
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

    this.setFormAsEdit = function () {
      $scope.buttonText = 'Save';
      $scope.viewLabel = 'Editing';
      this.checkIfViewOnly();
    };

    this.setUISelectValidationClass = function (inputName) {
      if( angular.isUndefined($scope.stationCreateForm[inputName]) ){
        return '';
      }
      if($scope.stationCreateForm[inputName].length === 0) {
        return 'has-error';
      }
      if($scope.stationCreateForm[inputName].length > 0) {
        return 'has-success';
      }
      return '';
    };

    this.makeInitPromises = function() {
      return [
        this.getGlobalStationList(),
        this.getCountryList(),
        this.getCityList(),
        this.getCatererStationList()
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
