'use strict';

/* global moment */
/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageListCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageListCtrl',
  function ($scope, employeeMessagesFactory, lodash, dateUtility, $q, $route, ngToast, $location) {

    var $this = this;
    $scope.viewName = 'Employee Messages';

    this.getMessagesSuccess = function (dataFromAPI) {
      $scope.employeeMessagesList = angular.copy(dataFromAPI.employeeMessages);
      angular.forEach($scope.employeeMessagesList, function (message) {
        message.startDate = dateUtility.formatDateForApp(message.startDate);
        message.endDate = dateUtility.formatDateForApp(message.endDate);
      });
    };

    this.getEmployeeMessages = function () {
      employeeMessagesFactory.getEmployeeMessages({}).then($this.getMessagesSuccess);
    };

    this.init = function () {
      $this.getEmployeeMessages();
    };
    this.init();

  });
