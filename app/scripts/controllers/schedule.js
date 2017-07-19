'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleCtrl', function ($scope, scheduleFactory, $location, $routeParams, messageService, unitsService, lodash, $q) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Schedule';
    $scope.readOnly = false;
    $scope.schedule = {};
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

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Create Schedule';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Schedule';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Schedule';
    };

    this.saveFormSuccess = function(response) {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $location.path('schedules').search({
          newScheduleId: response.id
        });
      } else {
        $this.showToastMessage('success', 'Edit Schedule', 'success');
      }
    };

    this.saveFormFailure = function(dataFromAPI) {
      console.log(dataFromAPI)
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createSchedule = function() {
      $this.showLoadingModal('Creating Schedule Data');
      var payload = $scope.schedule;

      scheduleFactory.createSchedule(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.editSchedule = function() {
      $this.showLoadingModal('Saving Schedule Data');

      scheduleFactory.updateSchedule(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.validateForm = function() {
      // validate days of operation
      return $scope.scheduleDataForm.$valid;
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
      $scope.schedule = response;
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

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
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
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
