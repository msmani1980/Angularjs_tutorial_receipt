'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleListCtrl
 * @description
 * # ScheduleListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleListCtrl', function ($scope, globalMenuService, $q, $location, dateUtility, lodash, postTripFactory, scheduleFactory, messageService, accessService) {
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
    $scope.isSearch = false;
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];

    $scope.displayColumns = {
      blockTime: false,
      groundTime: false,
      previousFlight: false,
      nextFlight: false
    };

    $scope.toggleColumnView = function(columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

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
      return dateUtility.isTodayDatePicker(dateString) || dateUtility.isAfterTodayDatePicker(dateString);
    };

    $scope.clearSearchForm = function() {
      $scope.isSearch = false;
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

    this.getStationsSuccess = function(response) {
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');

      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }
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
      $this.addSearchValuesFromMultiSelectArray('operationalDays', $scope.multiSelectedValues.daysOfOperation, 'id');
      $this.addSearchValuesFromMultiSelectArray('companyCarrierTypeId', $scope.multiSelectedValues.aircraftTypes, 'companyCarrierTypeId');
      $this.addSearchValuesFromMultiSelectArray('departureStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrivalStationId', $scope.multiSelectedValues.arrStations, 'stationId');
    };

    this.getSchedulesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;

      $scope.schedules = $scope.schedules.concat(response.schedules.map(function (schedule) {
        schedule.hasTripDistance = schedule.tripDistance !== null && schedule.tripDistance !== undefined;
        schedule.days = (schedule.days) ? schedule.days.replace('{', '').replace('}', '') : schedule.days;
        schedule.startDate = dateUtility.formatDateForApp(schedule.startDate);
        schedule.endDate = dateUtility.formatDateForApp(schedule.endDate);

        return schedule;
      }));

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

      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;

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

      $scope.isSearch = true;

      $scope.loadSchedules();
    };

    $scope.getUpdateBy = function (schedule) {
      if (schedule.updatedByPerson) {
        return schedule.updatedByPerson.userName;
      }

      if (schedule.createdByPerson) {
        return schedule.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (schedule) {
      return schedule.updatedOn ? dateUtility.formatTimestampForApp(schedule.updatedOn) : dateUtility.formatTimestampForApp(schedule.createdOn);
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.deleteScheduleFailure = function() {
      $this.showToastMessage('danger', 'Schedule', 'Schedule could not be deleted');
    };

    this.deleteScheduleSuccess = function() {
      $this.showToastMessage('success', 'Schedule', 'Schedule successfully deleted');
      $scope.schedules = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSchedules();
    };

    $scope.isScheduleEditable = function(schedule) {
      if (angular.isUndefined(schedule)) {
        return false;
      }

      return dateUtility.isTodayDatePicker(schedule.endDate) || dateUtility.isAfterTodayDatePicker(schedule.endDate);
    };

    $scope.removeRecord = function(schedule) {
      if (!$scope.schedules || $scope.schedules.length <= 0) {
        $this.deleteScheduleFailure();
        return;
      }

      scheduleFactory.deleteSchedule(companyId, schedule.id).then(
        $this.deleteScheduleSuccess,
        $this.deleteScheduleFailure
      );

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
      $scope.isCRUD = accessService.crudAccessGranted('SCHEDULE', 'SCHEDULE', 'CRUDSCH');
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
  });
