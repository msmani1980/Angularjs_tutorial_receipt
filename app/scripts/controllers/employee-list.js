'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeListCtrl
 * @description
 * # EmployeeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, employeeFactory) {
    
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
    $scope.multiSelectedValues = {};
    $scope.empTitles = [];
    
    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    $scope.redirectToEmployee = function(id, state) {
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
      employeeFactory.getCompanyGlobalStationList($this.getOnLoadingPayload).then($this.getCompanyGlobalStationSuccess);
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
      $this.formatMultiSelectedValuesForSearch();
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
    
    this.formatMultiSelectedValuesForSearch = function() {
      $this.addSearchValuesFromMultiSelectArray('baseStationIds', $scope.multiSelectedValues.globalStationList, 'id');
      $this.addSearchValuesFromMultiSelectArray('title', $scope.multiSelectedValues.titlesList);
    };
    
    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
      if (!multiSelectArray || multiSelectArray.length <= 0) {
        return;
      }

      var searchArray = [];
      angular.forEach(multiSelectArray, function(element) {
        if (angular.isUndefined(multiSelectElementKey)) {
          searchArray.push(element);
        } else {
          searchArray.push(element[multiSelectElementKey]);	
        }
      });

      $scope.search[searchKeyName] = searchArray.toString();
    };
      
    $scope.isEmployeeEditable = function(employee) {
      if (angular.isUndefined(employee)) {
        return false;
      }
	
      return dateUtility.isAfterOrEqualDatePicker(employee.endDate, dateUtility.nowFormattedDatePicker());
    };
    
    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };
    
    this.showToastMessage = function(className, type, message) {
        messageService.display(className, message, type);
      };

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Employee', 'Employee successfully deleted');
      $scope.employees = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadEmployees();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();  
      $this.showToastMessage('danger', 'Employee', 'Employee could not be deleted');
    };
      
    $scope.removeRecord = function (employee) {

      $this.displayLoadingModal('Removing Employee Record');
      
      employeeFactory.deleteEmployee(employee.id).then(
        $this.deleteSuccess, 
        $this.deleteFailure
      );
    };
    
    this.getCompanyGlobalStationSuccess = function(response) {
      $scope.globalStationList = angular.copy(response.response);
      if ($scope.search.countryId) {
        $this.addSearchValuesFromMultiSelectArray('baseStationIds', $scope.globalStationList, 'id');  
      }
      
    };

    this.getCountireSuccess = function(response) {
      $scope.countriesList = angular.copy(response.countries);
    };
      
    this.getEmployeesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.employees = $scope.employees.concat(response.companyEmployees.map(function (employee) {
        employee.startDate = dateUtility.formatDateForApp(employee.startDate);
        employee.endDate = dateUtility.formatDateForApp(employee.endDate);

        return employee;
      }));

      hideLoadingBar();
    };
    
    this.getEmployeeTitleSuccess = function(response) {
      $scope.empTitles = angular.copy(response.titles);
    };
       
    this.makeInitPromises = function() {
      var promises = [
        employeeFactory.getCountriesList().then($this.getCountireSuccess),
        employeeFactory.getEmployeeTitles().then($this.getEmployeeTitleSuccess),
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
