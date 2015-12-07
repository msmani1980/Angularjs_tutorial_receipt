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
          'isCaterer': true,
          'endDate': '2015-12-31',
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
          'endDate': '2015-05-30',
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
          'endDate': '2016-03-01',
          'startDate': '2016-05-01',
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

    this.setGlobalStationList = function(dataFromAPI) {
      $scope.globalStationList = angular.copy(dataFromAPI.response);
    };

    this.getGlobalStationList = function() {
      // add factory API call here
      this.setGlobalStationList(globalStationListJSON);
    };

    this.setupFormDataObject = function() {
      $scope.formData = {
        stations: []
      };
      angular.forEach($scope.stationList, function(station) {
        $scope.formData.stations.push({
          id: station.id,
          isCaterer: station.isCaterer,
          startDate: dateUtility.formatDateForApp(station.startDate),
          endDate: dateUtility.formatDateForApp(station.endDate)
        });
      });
    };

    this.dateActive = function(date) {
      return dateUtility.isTodayOrEarlier(date);
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

    this.validateForm = function() {
      $scope.displayError = $scope.stationListForm.$invalid;
      return $scope.stationListForm.$valid;
    };

    this.errorHandler = function(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.saveStationsSuccess = function() {
      this.showSuccessMessage('Selected stations have been updated!');
    };

    this.saveStations = function() {
      var payload = this.generatePayload();
      // make service call here
      this.saveStationsSuccess(payload);
    };

    this.submitForm = function() {
      if( $this.validateForm() ) {
        $this.saveStations();
      }

    };

    this.getStationInFormData = function(stationId) {
      return $scope.formData.stations.filter(function(station){
        return stationId === station.id;
      })[0];
    };

    this.updateStationStartDate = function(current,stationId) {
      var station = this.getStationInFormData(stationId);
      if(station && !this.dateActive(station.startDate)){
        station.startDate = current.startDate;
      }
    };

    this.updateStationEndDate = function(current,stationId) {
      var station = this.getStationInFormData(stationId);
      if( station && !dateUtility.isYesterdayOrEarlier(station.endDate) &&
        !dateUtility.isYesterdayOrEarlier(current.endDate) ){
        station.endDate = current.endDate;
      }
    };

    this.updateSelectedStartDates = function(current) {
      if(angular.isDefined(current) && current.startDate) {
        angular.forEach($scope.selectedStations, function(selected,stationId){
          if(selected){
            $this.updateStationStartDate(current,stationId);
          }
        });
      }
    };

    this.updateSelectedEndDates = function(current) {
      if(angular.isDefined(current) && current.endDate) {
        angular.forEach($scope.selectedStations, function(selected,stationId){
          if(selected){
            $this.updateStationEndDate(current,stationId);
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

    this.toggleAllStations = function(selectAll) {
      if(selectAll) {
        this.selectAllStations();
        return;
      }
      this.deselectAllStations();
    };

    this.filterByCountry = function(record) {
      if(angular.isUndefined($scope.search) || angular.isUndefined($scope.search.countryId)) {
        return true;
      }
      return parseInt(record.countryId) === parseInt($scope.search.countryId);
    };

    this.makeInitPromises = function() {
      return [
        this.getGlobalStationList(),
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

    $scope.hideSearch = function() {
      var filterControls = angular.element(
        angular.element.find('#filter-controls')[0]
      );
      filterControls.addClass('collapse').removeClass('in');
    };

    $scope.searchRecords = function() {
      // TODO: Add waiting
      $this.getStationList();
      $this.setupFormDataObject();
      $scope.hideSearch();
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

    $scope.filterByCountry = function(record) {
      return $this.filterByCountry(record);
    };

    $scope.isDateActive = function (date) {
      return $this.dateActive(date);
    };

    $scope.$watch('dateRange', function(current) {
      $this.updateSelectedStartDates(current);
      $this.updateSelectedEndDates(current);
    },true);

    $scope.$watch('allStationsSelected', function(selectAll) {
      $this.toggleAllStations(selectAll);
    });

  });
