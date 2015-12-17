'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageListCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageListCtrl',
  function ($scope, employeeMessagesFactory, GlobalMenuService, lodash, dateUtility, $q, $route, ngToast, $location) {

    var $this = this;
    var companyId = GlobalMenuService.company.get();


    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showErrors = function (dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    $scope.isActiveOrFutureRecord = function (record) {
      return dateUtility.isAfterToday(record.endDate);
    };

    $scope.goToDetailPage = function (action, id) {
      $location.path('employee-message/' + action + '/' + id);
    };

    this.getMessagesSuccess = function (dataFromAPI) {
      $scope.employeeMessagesList = angular.copy(dataFromAPI.employeeMessages);
      angular.forEach($scope.employeeMessagesList, function (message) {
        message.startDate = dateUtility.formatDateForApp(message.startDate);
        message.endDate = dateUtility.formatDateForApp(message.endDate);
      });
    };

    this.getEmployeeMessages = function (payload) {
      employeeMessagesFactory.getEmployeeMessages(payload).then($this.getMessagesSuccess);
    };

    this.getSchedules = function () {
      return employeeMessagesFactory.getSchedules(companyId).then(function (dataFromAPI) {
        $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      }, $this.showErrors);
    };

    this.getStations = function () {
      return employeeMessagesFactory.getStations().then(function (dataFromAPI) {
        $scope.stationsList = angular.copy(dataFromAPI.response);
      }, $this.showErrors);
    };

    this.getEmployees = function () {
      return employeeMessagesFactory.getEmployees(companyId).then(function (dataFromAPI) {
        $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
      }, $this.showErrors);
    };

    this.formatSearchArray = function (arrayToFormat, attributeToSave) {
      if (!arrayToFormat) {
        return [];
      }
      var newArray = [];
      angular.forEach(arrayToFormat, function (record) {
        newArray.push(record[attributeToSave]);
      });
      return newArray;
    };

    this.formatSearchPayload = function (searchData) {
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

    $scope.submitSearch = function () {
      var searchPayload = $this.formatSearchPayload(angular.copy($scope.search));
      $this.getEmployeeMessages(searchPayload);
    };

    $scope.clearSearch = function () {
      $scope.search = {};
      $this.getEmployeeMessages({});
    };

    this.init = function () {
      $scope.viewName = 'Employee Messages';
      $scope.search = {};

      $this.showLoadingModal('Loading data...');
      var initPromises = [
        $this.getEmployeeMessages({}),
        $this.getSchedules(),
        $this.getStations(),
        $this.getEmployees()
      ];
      $q.all(initPromises).then(function () {
        $this.hideLoadingModal();
      });
    };
    this.init();

  });
