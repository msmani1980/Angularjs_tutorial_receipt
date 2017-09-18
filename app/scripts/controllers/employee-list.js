'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeListCtrl
 * @description
 * # EmployeeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeListCtrl', function ($scope, globalMenuService, $q, $location, dateUtility, lodash, employeeFactory) {
    var companyId = globalMenuService.company.get();
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
  
    $scope.viewName = 'Employees';
    $scope.search = {};
    $scope.employees = [];
    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
 
    this.getEmployeesSuccess = function(response) {
      $scope.employees = angular.copy(response.employees);
    };
       
    this.makeInitPromises = function() {
      var promises = [
        employeeFactory.getEmployees(companyId).then($this.getEmployeesSuccess),
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
          angular.element('#search-collapse').addClass('collapse');
        });
    };

    this.init();
  });
