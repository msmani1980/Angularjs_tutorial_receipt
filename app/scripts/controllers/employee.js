'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCtrl
 * @description
 * # EmployeeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCtrl', function($scope, $q, $location, dateUtility, $routeParams, $filter, employeeFactory, messageService) {

    var $this = this;
    $scope.validation = Utils.validation;
    $scope.viewName = 'Employee';
    $scope.employee = {
      startDate: dateUtility.nowFormattedDatePicker(),
      endDate: dateUtility.nowFormattedDatePicker()
    };
    $scope.countriesList = [];
    $scope.globalStationList = [];
    $scope.multiSelectedValues = {};
    $scope.disablePastDate = false;
    $scope.viewStartDate = '';
    $scope.viewEndDate = '';
    $scope.shouldDisableEndDate = false;
    $scope.isLoadingCompleted = false;
    $scope.empTitles = [];

    $scope.onCounrtyChange = function() {
      $scope.multiSelectedValues = {};
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        countryId: $scope.employee.countryId
      };
      return employeeFactory.getCompanyGlobalStationList(payload).then($this.getCompanyGlobalStationSuccess);
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Employee';
      $scope.viewEditItem = false;

      $scope.employee.startDate = dateUtility.nowFormattedDatePicker();
      $scope.employee.endDate = dateUtility.nowFormattedDatePicker();
      $scope.isLoadingCompleted = true;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Employee';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Employee';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.employeeDataForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Employee', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Employee', 'success');
      }

      $location.path('employees');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createEmployee = function() {
      $this.showLoadingModal('Creating Employee Data');

      var payload = {
        baseStationId: $scope.employee.baseStationId,
        employeeIdentifier: $scope.employee.employeeIdentifier,
        firstName: $scope.employee.firstName,
        lastName: $scope.employee.lastName,
        passcode: $scope.employee.passcode,
        title: $scope.employee.title,
        startDate: dateUtility.formatDateForAPI($scope.employee.startDate),
        endDate: dateUtility.formatDateForAPI($scope.employee.endDate)
      };

      employeeFactory.createEmployee(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.editEmployee = function() {
      $this.showLoadingModal('Saving Employee Data');

      var payload = {
        id: $routeParams.id,
        baseStationId: $scope.employee.baseStationId,
        employeeIdentifier: $scope.employee.employeeIdentifier,
        firstName: $scope.employee.firstName,
        lastName: $scope.employee.lastName,
        passcode: $scope.employee.passcode,
        title: $scope.employee.title,
        startDate: dateUtility.formatDateForAPI($scope.employee.startDate),
        endDate: dateUtility.formatDateForAPI($scope.employee.endDate)
      };

      employeeFactory.updateEmployee(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.setMinDateValue = function () {
      if ($scope.viewEditItem) {
        $scope.employee.startDate = $scope.viewStartDate;
        $scope.employee.endDate = $scope.viewEndDate;
      }

    };

    $scope.formSave = function() {
      $scope.employeeDataForm.$setSubmitted(true);
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'Employee');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.getCompanyGlobalStationSuccess = function(response) {
      $scope.globalStationList = angular.copy(response.response);
    };

    this.setCountireList = function(stationList) {
      var countriesList = [];
      angular.forEach(stationList, function (station) {
        var country = {
          id: station.countryId,
          countryName: station.countryName,
          countryCode: station.countryCode,
        };
        countriesList.push(country);
      });

      countriesList = $filter('unique')(countriesList, 'countryName');
      $scope.countriesList = $filter('orderBy')(countriesList, 'countryName');
    };

    this.getEmployeeTitleSuccess = function(response) {
      $scope.empTitles = angular.copy(response.titles);
    };

    this.makeInitPromises = function() {
      var promises = [
        employeeFactory.getEmployeeTitles().then($this.getEmployeeTitleSuccess),
        employeeFactory.getCompanyGlobalStationList($this.getOnLoadingPayload).then($this.getCompanyGlobalStationSuccess)
      ];
      return promises;
    };

    $scope.getEmployeeTitles = function(search) {
      var emptitle = $scope.empTitles.slice();
      if (search && emptitle.indexOf(search) === -1) {
        emptitle.unshift(search);
      }

      return emptitle;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getEmployeeSuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);

      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);

      $scope.employee = {
        id: response.id,
        baseStationId: response.baseStationId,
        countryId: response.countryId,
        employeeIdentifier: response.employeeIdentifier,
        firstName: response.firstName,
        lastName: response.lastName,
        passcode: response.passcode,
        title: response.title,
        startDate: $scope.viewStartDate,
        endDate: $scope.viewEndDate
      };

      $scope.isLoadingCompleted = true;
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        employeeFactory.getEmployee($routeParams.id).then($this.getEmployeeSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

      $this.setMinDateValue();
      $this.setCountireList($scope.globalStationList);
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
