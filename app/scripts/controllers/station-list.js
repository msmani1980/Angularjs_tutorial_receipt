'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationListCtrl
 * @description
 * # StationListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationListCtrl', function ($scope,dateUtility,ngToast,$q) {

    var $this = this;

    var stationListJSON = {
      'response': [
        {
          'id': 114,
          'cityId': 18,
          'cityName': 'Copenhagen',
          'companyId': 403,
          'countryId': 66,
          'countryName': 'Denmark',
          'description': 'Copenhagen',
          'isCaterer': false,
          'endDate': '2050-01-01',
          'startDate': '2015-05-02',
          'regionId': 8,
          'regionName': 'All',
          'stationCode': 'CPH',
          'stationId': 23,
          'stationName': 'Copenhagen',
          'timezone': 'Europe/Madrid',
          'timezoneId': '86',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00',
          'companyStationRelationships': []
        },
        {
          'id': 115,
          'cityId': 20,
          'cityName': 'Herning',
          'companyId': 403,
          'countryId': 66,
          'countryName': 'Denmark',
          'description': 'Herning',
          'isCaterer': false,
          'endDate': '2050-01-01',
          'startDate': '2015-05-02',
          'regionId': 8,
          'regionName': 'All',
          'stationCode': 'EKHG',
          'stationId': 25,
          'stationName': 'Herning',
          'timezone': 'Europe/Madrid',
          'timezoneId': '86',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00',
          'companyStationRelationships': []
        },
        {
          'id': 116,
          'cityId': 19,
          'cityName': 'Vojens',
          'companyId': 403,
          'countryId': 66,
          'countryName': 'Denmark',
          'description': 'Vojens',
          'isCaterer': false,
          'endDate': '2050-01-01',
          'startDate': '2015-05-02',
          'regionId': 8,
          'regionName': 'All',
          'stationCode': 'SKS',
          'stationId': 24,
          'stationName': 'Vojens',
          'timezone': 'Europe/Madrid',
          'timezoneId': '86',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00',
          'companyStationRelationships': []
        }
      ],
      'meta': {
        'count': 5,
        'limit': 5,
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

    this.setStationList = function(dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
    };

    this.getStationList = function() {
      // add factory API call here
      this.setStationList(stationListJSON);
    };

    this.setupFormDataObject = function() {
      $scope.formData = {
        stations: []
      };
      angular.forEach($scope.stationList, function(station) {
        $scope.formData.stations.push({
          id: station.id,
          startDate: dateUtility.formatDateForApp(station.startDate),
          endDate: dateUtility.formatDateForApp(station.endDate)
        });
      });
    };

    this.getSelectedStations = function() {
      return $scope.selectedStations.filter(function(selected,stationId){
        if(selected === true)  {
          return stationId;
        }
      });
    };

    this.canSave = function() {
      if($scope.selectedStations.length > 0) {
        var selected = this.getSelectedStations();
        return selected.length > 0;
      }
      return $scope.selectedStations.length > 0;
    };

    this.showSuccessMessage = function(message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Success</strong> - ' + message
      });
    };

    this.getStationObject = function(stationId) {
      var selectedStation = $scope.stationList.filter(function(station){
        return station.id === stationId;
      })[0];
      return selectedStation;
    };

    this.generatePayload = function() {
      var payload = [];
      angular.forEach($scope.selectedStations, function(selected,stationId){
        if(selected){
          payload.push( $this.getStationObject(stationId) );
        }
      });
      return payload;
    };

    this.submitForm = function() {
      // TODO: Validation
      var payload = this.generatePayload();
      console.log(payload);
      this.showSuccessMessage(payload.length + ' stations have been updated!');
    };

    this.updateSelectedStartDates = function(current) {
      if(angular.isDefined(current) && current.startDate) {
        angular.forEach($scope.selectedStations, function(selected,stationId){
          if(selected){
            var station = $scope.formData.stations.filter(function(station){
              return stationId === station.id;
            })[0];
            if(station){
              station.startDate = current.startDate;
            }
          }
        });
      }
    };

    this.updateSelectedEndDates = function(current) {
      if(angular.isDefined(current) && current.endDate) {
        angular.forEach($scope.selectedStations, function(selected,stationId){
          if(selected){
            var station = $scope.formData.stations.filter(function(station){
              return stationId === station.id;
            })[0];
            if(station){
              station.endDate = current.endDate;
            }
          }
        });
      }
    };

    this.selectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = true;
      });
    };

    this.deselectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = false;
      });
    };

    this.filterCityByCountry = function(city) {
      if(angular.isUndefined($scope.search) || angular.isUndefined($scope.search.countryId)) {
        return true;
      }
      return parseInt(city.countryId) === parseInt($scope.search.countryId);
    };

    this.makeInitPromises = function() {
      return [
        this.getCountryList(),
        this.getCityList()
      ];
    };

    this.initSuccessHandler = function() {
      // TODO: hide loader
    };

    this.init = function() {
      // TODO: Add waiting
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.init();

    /* Scope */

    $scope.selectedStations = [];

    $scope.searchRecords = function() {
      // TODO: Add waiting
      $this.getStationList();
      $this.setupFormDataObject();
    };

    $scope.canSave = function() {
      return $this.canSave();
    };

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.selectAllStations = function() {
      return $this.selectAllStations();
    };

    $scope.deselectAllStations = function() {
      return $this.deselectAllStations();
    };

    $scope.filterCityByCountry = function(city) {
      return $this.filterCityByCountry(city);
    };

    $scope.$watch('dateRange', function(current) {
      $this.updateSelectedStartDates(current);
      $this.updateSelectedEndDates(current);
    },true);

  });
