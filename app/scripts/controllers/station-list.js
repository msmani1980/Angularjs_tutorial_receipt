'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StationListCtrl
 * @description
 * # StationListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StationListCtrl', function ($scope,dateUtility) {

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
        stations:[]
      };
      angular.forEach($scope.stationList, function(station) {
        $scope.formData.stations[station.id] = {
          startDate: dateUtility.formatDateForApp(station.startDate),
          endDate: dateUtility.formatDateForApp(station.endDate)
        };
      });
    };


    this.init = function() {
      this.getStationList();
      this.setupFormDataObject();
    };

    this.init();

  });
