'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleCtrl', function ($scope, scheduleFactory, $location, $routeParams, messageService, unitsService, lodash, $q, dateUtility) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Schedule';
    $scope.readOnly = false;
    $scope.shouldDisableStartDate = false;
    $scope.schedule = { };
    $scope.stationList = [];
    $scope.carrierTypes = [];
    $scope.distanceUnits = [];
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];
    $scope.getScheduleSucceded = false;
    $scope.isCreate = false;
    $scope.calendarsReady = false;

    $scope.areCarrierNumbersLoaded = true;

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Schedule';

      $scope.calendarsReady = true;
      $scope.schedule.tripDistanceUnitId = 1;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Schedule';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Schedule';
      $scope.editingItem = true;
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Schedule', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Schedule', 'success');
      }

      $location.path('schedules');
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createSchedule = function() {
      $this.showLoadingModal('Creating Schedule Data');

      var payload = {
        depTime: $scope.schedule.departureTime,
        arrTime: $scope.schedule.arrivalTime,
        scheduleNumber: $scope.schedule.scheduleNumber,
        startDate: dateUtility.formatDateForAPI($scope.schedule.startDate),
        endDate: dateUtility.formatDateForAPI($scope.schedule.endDate),
        blockTime: $scope.schedule.blockTime,
        groundTime: $scope.schedule.groundTime,
        tripDistance: $scope.schedule.tripDistance,
        preScheduleNumber: $scope.schedule.preScheduleNumber,
        nextScheduleNumber: $scope.schedule.nextScheduleNumber,
        firstTrip: $scope.schedule.firstTrip,
        lastTrip: $scope.schedule.lastTrip,
        depStationId: $scope.schedule.departureStationId,
        arrStationId: $scope.schedule.arrivalStationId,
        daysOfWeek: $this.formatDaysOfWeekForPayload($scope.schedule.days),
        tripDistanceUnitId: $scope.schedule.tripDistanceUnitId,
        companyCarrierTypeId: $scope.schedule.companyCarrierTypeId,
        companyCarrierId: $scope.schedule.companyCarrierId,
        seatConfigId: $scope.schedule.seatConfigurationId,
      };

      scheduleFactory.createSchedule(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.formatDaysOfWeekForPayload = function (days) {
      if (!days) {
        return '{}';
      }

      var daysPayload = days.map(function (day) {
        return day.id;
      });

      return '{' + daysPayload + '}';
    };

    this.formatDaysOfWeekForEdit = function (days) {
      if (!days || days === '{}') {
        return [];
      }

      return days.replace('{', '')
        .replace('}', '')
        .split(',')
        .map(Number)
        .map(function (day) {
          return lodash.find($scope.daysOfOperation, { id: day });
        });
    };

    this.editSchedule = function() {
      $this.showLoadingModal('Saving Schedule Data');

      var payload = {
        id: $routeParams.id,
        depTime: $scope.schedule.departureTime,
        arrTime: $scope.schedule.arrivalTime,
        scheduleNumber: $scope.schedule.scheduleNumber,
        startDate: dateUtility.formatDateForAPI($scope.schedule.startDate),
        endDate: dateUtility.formatDateForAPI($scope.schedule.endDate),
        blockTime: $scope.schedule.blockTime,
        groundTime: $scope.schedule.groundTime,
        tripDistance: $scope.schedule.tripDistance,
        preScheduleNumber: $scope.schedule.preScheduleNumber,
        nextScheduleNumber: $scope.schedule.nextScheduleNumber,
        firstTrip: $scope.schedule.firstTrip,
        lastTrip: $scope.schedule.lastTrip,
        depStationId: $scope.schedule.departureStationId,
        arrStationId: $scope.schedule.arrivalStationId,
        daysOfWeek: $this.formatDaysOfWeekForPayload($scope.schedule.days),
        tripDistanceUnitId: $scope.schedule.tripDistanceUnitId,
        companyCarrierTypeId: $scope.schedule.companyCarrierTypeId,
        companyCarrierId: $scope.schedule.companyCarrierId,
        seatConfigId: $scope.schedule.seatConfigurationId,
      };

      scheduleFactory.updateSchedule(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.getCarrierNumbersSuccess = function(response) {
      $scope.carrierNumbers = response.response;
      $scope.onCompanyCarrierNumberChange();
      $scope.areCarrierNumbersLoaded = true;

      if(!$scope.getScheduleSucceded) {
        $scope.getScheduleSucceded = true;
      }
    };

    $scope.onCompanyCarrierTypeChange = function () {
      $scope.areCarrierNumbersLoaded = false;
      $scope.schedule.carrierNumber = null;
      $scope.schedule.companyCarrierId = null;

      var payload = {
        companyCarrierTypeId: $scope.schedule.companyCarrierTypeId
      };

      return scheduleFactory.getCarrierNumbers(companyId, '2', payload).then($this.getCarrierNumbersSuccess);
    };

    this.getAllCarrierNumbers = function () {
      return scheduleFactory.getCarrierNumbers(companyId, '2').then($this.getCarrierNumbersSuccess);
    };

    $scope.onCompanyCarrierNumberChange = function () {
      var carrierNumber = lodash.find($scope.carrierNumbers, { id: $scope.schedule.companyCarrierId });
      if (carrierNumber) {
        // jscs:disable
        $scope.seatConfigurations = carrierNumber.carrier_seatconfigs; // jshint ignore:line
        // jscs:enable
      }
    };

    this.validateForm = function() {
      return $scope.scheduleDataForm.$valid;
    };

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate || $scope.readOnly;
    };

    $scope.isDisabledForEndDate = function() {
      return $scope.shouldDisableEndDate || $scope.readOnly;
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'Schedule');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.getScheduleSuccess = function(response) {
      var startDate = dateUtility.formatDateForApp(response.startDate);
      var endDate = dateUtility.formatDateForApp(response.endDate);

      $scope.shouldDisableStartDate = dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

      $scope.calendarsReady = true;

      $scope.schedule = {
        departureTime: response.departureTime,
        arrivalTime: response.arrivalTime,
        scheduleNumber: response.scheduleNumber,
        startDate: startDate,
        endDate: endDate,
        blockTime: response.blockTime,
        groundTime: response.groundTime,
        tripDistance: response.tripDistance,
        preScheduleNumber: response.preScheduleNumber,
        nextScheduleNumber: response.nextScheduleNumber,
        firstTrip: response.firstTrip,
        lastTrip: response.lastTrip,
        departureStationId: response.departureStationId,
        arrivalStationId: response.arrivalStationId,
        days: $this.formatDaysOfWeekForEdit(response.days),
        tripDistanceUnitId: response.tripDistanceUnitId,
        companyCarrierTypeId: response.companyCarrierTypeId,
        companyCarrierId: response.companyCarrierId,
        seatConfigurationId: response.seatConfigurationId,
        carrierNumber: response.carrierNumber,
        seatConfigurationCode: response.seatConfigurationCode
      };

      $scope.onCompanyCarrierTypeChange();
    };

    this.getStationsSuccess = function(response) {
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');

      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        scheduleFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }
    };

    this.getCarrierTypesSuccess = function(response) {
      $scope.carrierTypes = angular.copy(response.response);
    };

    this.getDistanceUnitsSuccess = function(response) {
      $scope.distanceUnits = angular.copy(response.units);
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        scheduleFactory.getSchedule($routeParams.id).then($this.getScheduleSuccess);
      }

      $this.hideLoadingModal();
    };

    this.makeInitPromises = function() {
      companyId = scheduleFactory.getCompanyId();
      var promises = [
        scheduleFactory.getStationList(companyId).then($this.getStationsSuccess),
        scheduleFactory.getCarrierTypes(companyId).then($this.getCarrierTypesSuccess),
        unitsService.getDistanceList().then($this.getDistanceUnitsSuccess)
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
