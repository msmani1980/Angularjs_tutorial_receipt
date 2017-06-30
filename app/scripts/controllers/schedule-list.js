'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleListCtrl
 * @description
 * # ScheduleListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleListCtrl', function ($scope, globalMenuService, $q, $location, dateUtility, lodash, postTripFactory, scheduleFactory) {
    var companyId = globalMenuService.company.get();
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Schedules';
    $scope.search = {};
    $scope.multiSelectedValues = {};
    $scope.schedules = [];
    $scope.stationList = [];
    $scope.loadingBarVisible = false;
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    $scope.redirectToSchedule = function(id, state) {
      $location.search({});
      $location.path('schedules/' + state + '/' + id).search();
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterToday(dateString);
    };

    $scope.clearSearchForm = function() {
      $scope.search = {};
      $scope.multiSelectedValues = {};
      $scope.schedules = [];
    };

    this.getStationById = function(stationId) {
      var stationCode = '';
      if (!stationId || $scope.stationList.length <= 0) {
        return '';
      }

      angular.forEach($scope.stationList, function(value) {
        if (value.stationId === stationId) {
          stationCode = value.stationCode;
        }
      });

      return stationCode;
    };

    this.updateStationCodes = function() {
      if ($scope.postTrips.length > 0 && $scope.stationList.length > 0) {
        angular.forEach($scope.postTrips, function(trip) {
          trip.depStationCode = $this.getStationById(trip.depStationId);
          trip.arrStationCode = $this.getStationById(trip.arrStationId);
        });
      }
    };

    this.getStationsSuccess = function(response) {
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');

      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }

      $this.updateStationCodes();
    };

    this.getCarrierSuccess = function(response) {
      $scope.carrierNumbers = angular.copy(response.response);
    };

    this.getCarrierTypesSuccess = function(response) {
      $scope.carrierTypes = angular.copy(response.response);
    };

    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
      if (!multiSelectArray || multiSelectArray.length <= 0) {
        return;
      }

      var searchArray = [];
      angular.forEach(multiSelectArray, function(element) {
        searchArray.push(element[multiSelectElementKey]);
      });

      $scope.search[searchKeyName] = searchArray.toString();
    };

    this.formatMultiSelectedValuesForSearch = function() {
      $this.addSearchValuesFromMultiSelectArray('aircraftTypeId', $scope.multiSelectedValues.aircraftTypes, 'aircraftTypeId');
      $this.addSearchValuesFromMultiSelectArray('depStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrStationId', $scope.multiSelectedValues.arrStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('tailNumber', $scope.multiSelectedValues.tailNumbers, 'carrierNumber');
    };

    this.getSchedulesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;

      $scope.schedules = $scope.schedules.concat(response.schedules);
      hideLoadingBar();
    };

    function loadSchedules() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      $this.formatMultiSelectedValuesForSearch();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      scheduleFactory.getSchedules(payload).then($this.getSchedulesSuccess);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadSchedules = function() {
      loadSchedules();
    };

    $scope.searchScheduleData = function() {
      $scope.schedules = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSchedules();
    };

    this.makeInitPromises = function() {
      var promises = [
        scheduleFactory.getStationList(companyId).then($this.getStationsSuccess),
        scheduleFactory.getCarrierNumbers(companyId).then($this.getCarrierSuccess),
        scheduleFactory.getCarrierTypes(companyId).then($this.getCarrierTypesSuccess)
      ];

      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
  });
