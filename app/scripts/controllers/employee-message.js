'use strict';

/* global moment */
/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageCtrl
 * @description
 * # EmployeeMessageCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageCtrl',
  function ($scope, employeeMessagesFactory, GlobalMenuService,
            lodash, dateUtility, $q, $routeParams) {

    var $this = this;
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'Employee Message';

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getAttributeByIdFromArray = function (id, attribute, array) {
      var objectMatch = lodash.findWhere(array, {id: id});
      if(objectMatch) {
        return objectMatch[attribute];
      }
      return '';
    };

    this.reformatEmployeeMessageStation = function (arrayToReformat) {
      var stationArray = [];
      angular.forEach(arrayToReformat, function (stationId) {
        var stationCode = $this.getAttributeByIdFromArray(stationId, 'code', $scope.stationsList);
        var stationName = $this.getAttributeByIdFromArray(stationId, 'name', $scope.stationsList);
        stationArray.push({id: stationId, code: stationCode, name: stationName});
      });
      return stationArray;
    };

    this.formatEmployeeMessageForApp = function (dataFromAPI) {
      var employeeMessage = angular.copy(dataFromAPI.employeeMessage);
      employeeMessage.startDate = dateUtility.formatDateForApp(employeeMessage.startDate);
      employeeMessage.endDate = dateUtility.formatDateForApp(employeeMessage.endDate);

      employeeMessage.arrivalStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageArrivalStations);
      employeeMessage.departureStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageDepartureStations);

      employeeMessage.employees = [];
      angular.forEach(employeeMessage.employeeMessageEmployeeIdentifiers, function (employee) {
        var employeeMatch = lodash.findWhere($scope.employeesList, {employeeIdentifier: employee.employeeIdentifier});
        employeeMessage.employees.push({id: employee.id, employeeId: employee.employeeIdentifier, firstName: employeeMatch.firstName, lastName: employeeMatch.lastName});
      });

      employeeMessage.schedules = employeeMessage.employeeMessageSchedules;
      $scope.employeeMessage = employeeMessage;
    };

    this.getEmployeeMessage = function () {
      $this.showLoadingModal('Loading Employee Message');
      return employeeMessagesFactory.getEmployeeMessage($routeParams.id).then(function (dataFromAPI) {
        $this.formatEmployeeMessageForApp(dataFromAPI);
        $this.hideLoadingModal();
      });
    };

    this.getSchedules = function () {
      return employeeMessagesFactory.getSchedules(companyId).then(function (dataFromAPI) {
        $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      });
    };

    this.getStations = function () {
      return employeeMessagesFactory.getStations().then(function (dataFromAPI) {
        $scope.stationsList = angular.copy(dataFromAPI.response);
      });
    };


    this.getEmployees = function () {
      return employeeMessagesFactory.getEmployees(companyId).then(function (dataFromAPI) {
        $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
      });
    };

    this.initEmployeeMessage = function () {
      if($routeParams.id) {
        $this.getEmployeeMessage();
      } else {
        $scope.employeeMessage = {};
        $this.hideLoadingModal();
      }
    };

    this.initDependencies = function () {
      return [
        $this.getSchedules(),
        $this.getStations(),
        $this.getEmployees()
      ];
    };

    this.init = function () {
      $this.showLoadingModal('Loading page dependencies');
      var initPromises = $this.initDependencies();
      $q.all(initPromises).then(function() {
        $this.initEmployeeMessage();
      });
    };
    this.init();

  });
