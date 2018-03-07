'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentListCtrl
 * @description
 * # MenuAssignmentListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentListCtrl', function($scope, $q, $route, $location, $filter, menuService, menuAssignmentFactory, messageService, companiesFactory, dateUtility, scheduleFactory, globalMenuService, lodash, accessService) {
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
    $scope.menuAssignmentsForApplyRulesExecution = [];
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

    $scope.allExpanded = false;

    $scope.toggleAllCheckboxes = function () {
      angular.forEach($scope.menuAssignments, function (menuAssignment) {
        menuAssignment.selected = $scope.allCheckboxesSelected;
      });
    };

    $scope.toggleAllAccordionView = function () {
      $scope.allExpanded = !$scope.allExpanded;
      angular.forEach($scope.menuAssignments, function (menuAssignment) {
        menuAssignment.isExpanded = $scope.allExpanded;
      });
    };

    $scope.toggleAccordionView = function (menuAssignment) {
      menuAssignment.isExpanded = !menuAssignment.isExpanded;
    };

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

    $scope.hasSelectedMenuAssignments = function () {
      return lodash.filter($scope.menuAssignments, function(item) {
        return item.selected === true;
      }).length > 0;
    };

    $scope.showBulkExecuteActionModal = function(action) {
      $scope.menuAssignmentsForApplyRulesExecution = $this.findSelectedMenuAssignments();
      $scope.actionToExecute = action;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.executeAction = function() {
      $scope.displayError = false;
      angular.element('.delete-warning-modal').modal('hide');

      if ($scope.actionToExecute === 'Apply Rules') {
        $this.executeApplyRulesAction();
      }
    };

    this.executeApplyRulesAction = function () {
      var payload = {
        scheduleDays: $scope.menuAssignmentsForApplyRulesExecution.map(function (assignment) {
          return assignment.scheduleDayId;
        })
      };

      menuAssignmentFactory.applyMenuRules(payload).then($this.applyMenuRulesSuccess, $this.applyMenuRulesFailure);
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.applyMenuRulesSuccess = function () {
      $this.showToastMessage('success', 'Rules have been applied', 'success');
    };

    this.applyMenuRulesFailure = function () {
      $this.showToastMessage('error', 'Something went wrong while applying rules. Please try again.', 'success');
    };

    this.findSelectedMenuAssignments = function() {
      return lodash.filter($scope.menuAssignments, function(instance) {
        return instance.selected === true;
      });
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
        menuAssignment.isExpanded = false;
        menuAssignment.selected = false;

        return menuAssignment;
      }));

      hideLoadingBar();
    };

    this.getCompanySuccess = function(dataFromAPI) {
      $scope.company = angular.copy(dataFromAPI);
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

      $scope.loadMenuAssignmentData();
    };

    $scope.getUpdateBy = function (menu) {
      if (menu.updatedByPerson) {
        return menu.updatedByPerson.userName;
      }

      if (menu.createdByPerson) {
        return menu.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (menu) {
      return menu.updatedOn ? dateUtility.formatTimestampForApp(menu.updatedOn) : dateUtility.formatTimestampForApp(menu.createdOn);
    };

    this.makeInitPromises = function() {
      companyId = scheduleFactory.getCompanyId();

      var promises = [
        scheduleFactory.getStationList(companyId),
        scheduleFactory.getCarrierNumbers(companyId),
        scheduleFactory.getCarrierTypes(companyId),
        companiesFactory.getCompany(companyId)
      ];

      return promises;
    };

    this.init = function() {
      angular.element('.loading-more').hide();
      $scope.isCRUD = accessService.crudAccessGranted('MENUASSG', 'MENUASSIGNMENT', 'CRUDMENUA');
      $scope.allCheckboxesSelected = false;
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function(response) {
        $this.getStationsSuccess(response[0]);
        $this.getCarrierNumberSuccess(response[1]);
        $this.getCarrierTypesSuccess(response[2]);
        $this.getCompanySuccess(response[3]);

        $scope.uiReady = true;
      });

    };

    this.init();
  });
