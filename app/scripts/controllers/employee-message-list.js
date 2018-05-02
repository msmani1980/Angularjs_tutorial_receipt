'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageListCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageListCtrl',
  function($scope, employeeMessagesFactory, globalMenuService, lodash, dateUtility, $q, $route, $location, accessService) {

    var $this = this;
    $scope.employeeMessagesList = [];
    $scope.employeesList = [];

    function hideFilterPanel() {
      angular.element('#search-collapse').addClass('collapse');
    }

    function showFilterPanel() {
      angular.element('#search-collapse').removeClass('collapse');
    }

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    $scope.toggleFilterPanel = function() {
      if (angular.element('#search-collapse').hasClass('collapse')) {
        showFilterPanel();
      } else {
        hideFilterPanel();
      }
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

      $this.hideLoadingModal();
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

    $scope.getUpdateBy = function (message) {
      if (message.updatedByPerson) {
        return message.updatedByPerson.userName;
      }

      if (message.createdByPerson) {
        return message.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (message) {
      return message.updatedOn ? dateUtility.formatTimestampForApp(message.updatedOn) : dateUtility.formatTimestampForApp(message.createdOn);
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

    $scope.searchEmployees = function($select, $event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      if ($select.search && $select.search.length !== 0) {
        var payload = employeeDatesPayload($select, $scope.search);
        var companyId = globalMenuService.company.get();

        employeeMessagesFactory.getEmployees(companyId, payload).then($this.setEmployeesFromAPI);
      }
    };

    function employeeDatesPayload($select, search) {
      var payload = {
        search: $select.search
      };

      if (!search.startDate && !search.endDate) {
        payload.date = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      }

      if (search.startDate) {
        payload.startDate =  dateUtility.formatDateForAPI(search.startDate);
      }

      if (search.endDate) {
        payload.endDate =  dateUtility.formatDateForAPI(search.endDate);
      }

      return payload;
    }

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
      $this.showLoadingModal('Loading data...');
      var searchPayload = $this.formatSearchPayload(angular.copy($scope.search));
      $this.getEmployeeMessages(searchPayload);
    };

    $scope.clearSearch = function() {
      $scope.search = {};
      $scope.employeeMessagesList = [];
      $scope.employeesList = [];
    };

    this.initSuccess = function() {
      angular.element('#search-collapse').addClass('collapse');
      $this.hideLoadingModal();
    };

    this.makeInitPromises = function() {
      return [
        $this.getEmployeeMessages({}),
        $this.getSchedules(),
        $this.getStations()
      ];
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('EMPLOYEEMSG', 'EMPLOYEEMESSAGE', 'CRUDEMSG');
      $scope.viewName = 'Employee Messages';
      $scope.search = {};
      $scope.selectedEmployees = {};
      $scope.selectedEmployees.employeeIds = [];
      $scope.multiSelectedValues = {};

      $this.showLoadingModal('Loading data...');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initSuccess);
      $scope.minDate = dateUtility.nowFormattedDatePicker();
    };

    this.init();

  });
