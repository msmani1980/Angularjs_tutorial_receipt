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

    this.getEmployeeMessage = function () {
      $this.showLoadingModal();
      return employeeMessagesFactory.getEmployeeMessage($routeParams.id).then(function (dataFromAPI) {
        $scope.employeeMessage = angular.copy(dataFromAPI.employeeMessage);
        $this.hideLoadingModal();
      });
    };

    this.getSchedules = function () {
      return employeeMessagesFactory.getSchedules(companyId).then(function (dataFromAPI) {
        $scope.schedules = angular.copy(dataFromAPI.distinctSchedules);
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
      $scope.employeeMessage = {};
      if($routeParams.id) {
        $this.getEmployeeMessage();
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
      $this.showLoadingModal();
      var initPromises = $this.initDependencies();
      $q.all(initPromises).then(function() {
        $this.initEmployeeMessage();
        $this.hideLoadingModal();
      });
    };
    this.init();

  });
