'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationListCtrl
 * @description
 * # StationListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationListCtrl', function ($scope,dateUtility,ngToast) {

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
        },
        {
          'id': 117,
          'cityId': 14,
          'cityName': 'Alicante',
          'companyId': 403,
          'countryId': 75,
          'countryName': 'Spain',
          'description': 'Alicante',
          'isCaterer': false,
          'endDate': '2050-01-01',
          'startDate': '2015-05-02',
          'regionId': 9,
          'regionName': 'All',
          'stationCode': 'ALC',
          'stationId': 19,
          'stationName': 'Alicante',
          'timezone': 'Europe/Madrid',
          'timezoneId': '86',
          'utcDstOffset': '+02:00',
          'utcOffset': '+01:00',
          'companyStationRelationships': []
        },
        {
          'id': 118,
          'cityId': 15,
          'cityName': 'Barcelona',
          'companyId': 403,
          'countryId': 75,
          'countryName': 'Spain',
          'description': 'Barcelona',
          'isCaterer': false,
          'endDate': '2050-01-01',
          'startDate': '2015-05-02',
          'regionId': 9,
          'regionName': 'All',
          'stationCode': 'BCN',
          'stationId': 20,
          'stationName': 'Barcelona',
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

    this.init = function() {
      // TODO: Get countries
      // TODO: Get cities
      // TODO: Get regions
      this.getStationList();
      this.setupFormDataObject();
    };

    this.init();
    var $this = this;

    /* Scope */

    $scope.selectedStations = [];

    $scope.searchRecords = function() {
      $scope.searched = true;
    };

    $scope.canSave = function() {
      return $this.canSave();
    };

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.selectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = true;
      });
    };

    $scope.deselectAllStations = function() {
      angular.forEach($scope.stationList, function(station) {
        $scope.selectedStations[station.id] = false;
      });
    };

  });
