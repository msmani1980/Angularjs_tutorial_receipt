'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeListCtrl
 * @description
 * # EmployeeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeListCtrl', function ($scope, $q, $location, dateUtility, lodash, employeeFactory) {
    
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
    $scope.countriesList = [];
    $scope.globalStationList = [];
    
    function showLoadingBar() {
        $scope.loadingBarVisible = true;
        angular.element('.loading-more').show();
      }

    function hideLoadingBar() {
        $scope.loadingBarVisible = false;
        angular.element('.loading-more').hide();
        angular.element('.modal-backdrop').remove();
      }

    $scope.redirectToSchedule = function(id, state) {
        $location.search({});
        $location.path('employee/' + state + '/' + id).search();
      };

    $scope.showDeleteButton = function(dateString) {
        return dateUtility.isAfterTodayDatePicker(dateString);
      };

    $scope.clearSearchForm = function() {
      $scope.isSearch = false;
      $scope.search = {};
      $scope.multiSelectedValues = {};
      $scope.employees = [];
    };
    
    $scope.loadEmployees = function() {
      loadEmployees();
    };
    
    $scope.onCounrtyChange = function() {
      $scope.multiSelectedValues = {};
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        countryId: $scope.search.countryId
      };
      return employeeFactory.getCompanyGlobalStationList(payload).then($this.getCompanyGlobalStationSuccess);
    };
      
    function loadEmployees() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var payload = lodash.assign(angular.copy($scope.search), {
          limit: $this.meta.limit,
          offset: $this.meta.offset
        });

      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;

      employeeFactory.getEmployees(payload).then($this.getEmployeesSuccess);
      $this.meta.offset += $this.meta.limit;
    }
    
    $scope.searchEmployeeData = function() {
        $scope.employees = [];
        $this.meta = {
          count: undefined,
          limit: 100,
          offset: 0
        };

        $scope.isSearch = true;

        $scope.loadEmployees();
      };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };
    
    this.deleteEmployeeFailure = function() {
      $this.showToastMessage('danger', 'Employee', 'Employee could not be deleted');
    };
	
    this.deleteScheduleSuccess = function() {
      $this.showToastMessage('success', 'Employee', 'Employee successfully deleted');
      $scope.employees = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadEmployees();
    };
	
    $scope.isEmployeeEditable = function(employee) {
      if (angular.isUndefined(employee)) {
        return false;
      }
	
      return dateUtility.isAfterToday(employee.endDate);
    };
    
    this.getCompanyGlobalStationSuccess = function(response) {
      $scope.globalStationList = angular.copy(response.response);
    };

    this.getCountireSuccess = function(response) {
      $scope.countriesList = angular.copy(response.countries);
    };
      
    this.getEmployeesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.employees = angular.copy(response.companyEmployees);
      hideLoadingBar();
    };
       
    this.makeInitPromises = function() {
      var promises = [
        employeeFactory.getCountriesList().then($this.getCountireSuccess),
        employeeFactory.getCompanyGlobalStationList($this.getOnLoadingPayload).then($this.getCompanyGlobalStationSuccess)
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
