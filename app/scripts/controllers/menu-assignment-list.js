'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentListCtrl
 * @description
 * # MenuAssignmentListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentListCtrl', function($scope, $q, $route, $location, $filter, $localStorage, menuService, menuAssignmentFactory, messageService, dateUtility, scheduleFactory, globalMenuService, lodash) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    var companyId;
    $scope.viewName = 'Menu Assignment';
    $scope.menuAssignments = [];
    $scope.isSearch = false;
    $scope.multiSelectedValues = {};
    $scope.search = {};
    $scope.modal = null;
    $scope.displayModalImportInfo = false;
    $scope.stationList = [];
    $scope.carrierTypes = [];
    $scope.menuList = [];
    $scope.isAssignment = [
      { id: 1, name: 'Assignment' },
      { id: 2, name: 'Not Assignment' },
    ];
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];

    $scope.displayColumns = {
      blockTime: false,
      groundTime: false,
      previousFlight: false,
      nextFlight: false
    };

    /*
    $scope.toggleAllCheckboxes = function () {
      console.log('$scope.toggleAllCheckboxes');
      angular.forEach($scope.menuAssignmentList, function (schedule) {
        schedule.selected = $scope.allCheckboxesSelected;
      });
    };
    */

    function showLoadingBar() {
      if (!$scope.isSearch) {
        return;
      }

      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
      if (!multiSelectArray || multiSelectArray.length <= 0) {
        return;
      }

      var searchArray = [];
      angular.forEach(multiSelectArray, function(element) {
        searchArray.push(element[multiSelectElementKey]);
      });

      $scope.search[searchKeyName] = searchArray.toString();
    };

    this.formatMultiSelectedValuesForSearch = function() {
      $this.addSearchValuesFromMultiSelectArray('day', $scope.multiSelectedValues.daysOfOperation, 'id');
      $this.addSearchValuesFromMultiSelectArray('companyCarrierTypeId', $scope.multiSelectedValues.aircraftTypes, 'companyCarrierTypeId');
      $this.addSearchValuesFromMultiSelectArray('depStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrStationId', $scope.multiSelectedValues.arrStations, 'stationId');
    };

    $scope.toggleColumnView = function(columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.menuAssignments = [];
      $scope.search = {};
      $scope.multiSelectedValues = {};
      $localStorage.search.menuAssignments = {};
      $localStorage.multiSelectedValues.menuAssignments = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    $scope.redirectToMenuAssignment = function(id, state) {
      $location.search({});
      $location.path('menu-assignment/' + state + '/' + id).search();
    };

    this.constructStartDate = function () {
      return dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    this.getCarrierNumberSuccess = function(response) {
      $scope.carrierNumbers = angular.copy(response.response);
    };

    this.getStationsSuccess = function(response) {
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');
      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        scheduleFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }
    };

    this.getCarrierTypesSuccess = function(response) {
      $scope.carrierTypes = angular.copy(response.response);
    };

    this.getMenuAssignmentListSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.menuAssignments = $scope.menuAssignments.concat(response.response.map(function (menuAssignment) {
        menuAssignment.updatedOn = (menuAssignment.updatedOn) ? dateUtility.formatDateForApp(menuAssignment.updatedOn) : null;

        return menuAssignment;
      }));

      hideLoadingBar();
    };

    $scope.loadMenuAssignmentData = function() {
      if ($this.meta.offset >= $this.meta.count || !$scope.isSearch) {
        return;
      }

      showLoadingBar();
      $this.formatMultiSelectedValuesForSearch();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      payload.dateFrom = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.dateTo = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;
      payload.startDate = null;
      payload.endDate = null;

      menuAssignmentFactory.getMenuAssignmentList(payload).then($this.getMenuAssignmentListSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchMenuAssignmentData = function() {
      $scope.menuAssignments = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;
      $localStorage.search.menuAssignments = angular.copy($scope.search);
      $localStorage.multiSelectedValues.menuAssignments = angular.copy($scope.multiSelectedValues);

      $scope.loadMenuAssignmentData();
    };

    this.makeInitPromises = function() {
      companyId = scheduleFactory.getCompanyId();

      var promises = [
        scheduleFactory.getStationList(companyId).then($this.getStationsSuccess),
        scheduleFactory.getCarrierNumbers(companyId).then($this.getCarrierNumberSuccess),
        scheduleFactory.getCarrierTypes(companyId).then($this.getCarrierTypesSuccess)
      ];

      return promises;
    };

    this.init = function() {
      angular.element('.loading-more').hide();

      $scope.allCheckboxesSelected = false;
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
      });

    };

    this.init();
  });
