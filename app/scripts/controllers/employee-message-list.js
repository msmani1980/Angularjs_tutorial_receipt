'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageListCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageListCtrl',
  function($scope, employeeMessagesFactory, globalMenuService, lodash, dateUtility, $q, $route, $location) {

    var $this = this;
    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.showErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    $scope.isActiveOrFutureRecord = function(record) {
      return dateUtility.isTodayDatePicker(record.endDate) || dateUtility.isAfterTodayDatePicker(record.endDate);
    };

    $scope.isFutureRecord = function(record) {
      return dateUtility.isAfterTodayDatePicker(record.startDate);
    };

    $scope.goToDetailPage = function(action, id) {
      $location.path('employee-message/' + action + '/' + id);
    };

    this.getMessagesSuccess = function(dataFromAPI) {
      $scope.employeeMessagesList = angular.copy(dataFromAPI.employeeMessages);
      angular.forEach($scope.employeeMessagesList, function(message) {
        message.startDate = dateUtility.formatDateForApp(message.startDate);
        message.endDate = dateUtility.formatDateForApp(message.endDate);
      });
    };

    this.getEmployeeMessages = function(payload) {
      employeeMessagesFactory.getEmployeeMessages(payload).then($this.getMessagesSuccess);
    };

    this.deleteEmployeeMessagesSuccess = function() {
      $this.getEmployeeMessages({});
      $this.hideLoadingModal();
    };

    $scope.removeRecord = function(record) {
      $this.showLoadingModal();
      employeeMessagesFactory.deleteEmployeeMessage(record.id).then($this.deleteEmployeeMessagesSuccess);
    };

    this.setSchedulesFromAPI = function(dataFromAPI) {
      $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
    };

    this.getSchedules = function() {
      var companyId = globalMenuService.company.get();
      return employeeMessagesFactory.getSchedules(companyId).then($this.setSchedulesFromAPI, $this.showErrors);
    };

    this.setStationsFromAPI = function(dataFromAPI) {
      $scope.stationsList = angular.copy(dataFromAPI.response);
    };

    this.getStations = function() {
      return employeeMessagesFactory.getStations().then($this.setStationsFromAPI, $this.showErrors);
    };

    this.setEmployeesFromAPI = function(dataFromAPI) {
      $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
    };

    this.getEmployees = function() {
      var companyId = globalMenuService.company.get();
      return employeeMessagesFactory.getEmployees(companyId).then($this.setEmployeesFromAPI, $this.showErrors);
    };

    this.formatSearchArray = function(arrayToFormat, attributeToSave) {
      if (!arrayToFormat) {
        return [];
      }

      var newArray = [];
      angular.forEach(arrayToFormat, function(record) {
        newArray.push(record[attributeToSave]);
      });

      return newArray.toString();
    };

    this.formatSearchPayload = function(searchData) {
      var newPayload = {};
      if (searchData.startDate) {
        newPayload.startDate = dateUtility.formatDateForAPI(searchData.startDate);
      }

      if (searchData.endDate) {
        newPayload.endDate = dateUtility.formatDateForAPI(searchData.endDate);
      }

      newPayload.arrivalStationId = $this.formatSearchArray(searchData.arrStations, 'id');
      newPayload.departureStationId = $this.formatSearchArray(searchData.depStations, 'id');
      newPayload.employeeIdentifier = $this.formatSearchArray(searchData.employees, 'employeeIdentifier');
      newPayload.scheduleNumber = $this.formatSearchArray(searchData.schedules, 'scheduleNumber');

      return newPayload;
    };

    $scope.submitSearch = function() {
      var searchPayload = $this.formatSearchPayload(angular.copy($scope.search));
      $this.getEmployeeMessages(searchPayload);
    };

    $scope.clearSearch = function() {
      $scope.search = {};
      $scope.employeeMessagesList = [];
    };

    this.initSuccess = function() {
      angular.element('#search-collapse').addClass('collapse');
      $this.hideLoadingModal();
    };

    this.makeInitPromises = function() {
      return [
        $this.getEmployeeMessages({}),
        $this.getSchedules(),
        $this.getStations(),
        $this.getEmployees()
      ];
    };

    this.init = function() {
      $scope.viewName = 'Employee Messages';
      $scope.search = {};

      $this.showLoadingModal('Loading data...');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initSuccess);
      $scope.minDate = dateUtility.nowFormattedDatePicker();
    };

    this.init();

  });
