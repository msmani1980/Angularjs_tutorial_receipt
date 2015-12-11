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
  function ($scope, employeeMessagesFactory, lodash, dateUtility, $q, $route, ngToast, $location) {

    var $this = this;
    $scope.viewName = 'Employee Message';

    this.getEmployeeMessages = function () {
      employeeMessagesFactory.getEmployeeMessages({}).then($this.getMessagesSuccess);
    };

    this.init = function () {
      $this.getEmployeeMessages();
    };
    this.init();

  });
