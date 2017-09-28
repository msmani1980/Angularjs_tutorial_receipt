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
    var initDone = false;
    var companyId;
    var lastStartDate = null;  
    $scope.viewName = 'Menu Assignment';
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
    $scope.schedule = {
      selected: false,
      scheduleNumber: '',
      departureStation: '',
      departureTime: null,
      arrivalStation: '',
      arrivalTime: null,
      assignment: '',
      scheduleDate: null,
      days: '',
      updatedDate: null
    };
    var loadingProgress = false;

    function showErrors(dataFromAPI) {
      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    }
    /*
    $scope.toggleAllCheckboxes = function () {
      console.log('$scope.toggleAllCheckboxes');
      angular.forEach($scope.menuAssignmentList, function (schedule) {
        schedule.selected = $scope.allCheckboxesSelected;
      });
    };
    */
    function showLoadingBar() {
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
      $this.addSearchValuesFromMultiSelectArray('operationalDays', $scope.multiSelectedValues.daysOfOperation, 'id');
      $this.addSearchValuesFromMultiSelectArray('companyCarrierTypeId', $scope.multiSelectedValues.aircraftTypes, 'companyCarrierTypeId');
      $this.addSearchValuesFromMultiSelectArray('departureStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrivalStationId', $scope.multiSelectedValues.arrStations, 'stationId');
    };

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.search = {};
      $scope.search.scheduleNumber = '';
      $scope.search.startDate = new Date();
      $scope.search.endDate = '';
      $scope.search.departureTimeFrom = '';
      $scope.search.departureTimeTo = '';
      $scope.search.arrivalTimeFrom = '';
      $scope.search.arrivalTimeTo = '';
      $scope.search.menuCode = '';
      $scope.search.menuName = '';
      $scope.search.itemName = '';
      $scope.search.isAssignment = '';
      $scope.multiSelectedValues = {};
      $scope.menuAssignmentList = [];
      $localStorage.search.searchMenuAssignment = {};
      
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    function checkForLocalStorage() {
      console.log('checkForLocalStorage');
      var savedSearch = $localStorage.search;
      if (angular.isDefined(savedSearch)) {
        $scope.search = savedSearch.searchMenuAssignment || {};
      } else {
        $scope.search = {};
        $localStorage.search = {};
      }
    }

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

    this.getMenuAssignmenListSuccess = function(response) {
      console.log(' this.getMenuAssignmenListSuccess  response = ', response);
      console.log('$scope.menuAssignmentList', $scope.menuAssignmentList);
      console.log('response.response', response.response);
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.menuAssignmentList = response.response;
      console.log('$scope.menuAssignmentList', $scope.menuAssignmentList);
      /*      
      $scope.menuAssignmentList = $scope.menuAssignmentList.concat(response.response.map(function (schedule) {
        schedule.days = (schedule.days) ? schedule.days.replace('{', '').replace('}', '') : schedule.days;
        schedule.startDate = dateUtility.formatDateForApp(schedule.startDate);
        schedule.endDate = dateUtility.formatDateForApp(schedule.endDate);

        return schedule;
      }));
      */
      hideLoadingBar();
    };

    function loadMenuAssignmentData() {
      console.log(' function loadMenuAssignmentData()');
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      $this.formatMultiSelectedValuesForSearch();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      payload.dateFrom = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;
      console.log('searchMenuAssignmentData->payload', payload);	
      console.log('searchMenuAssignmentData->$scope.menuAssignmentList', $scope.menuAssignmentList);	
      menuAssignmentFactory.getMenuAssignmentList(payload).then($this.getMenuAssignmenListSuccess);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadMenuAssignmentData = function() {
      console.log('$scope.loadMenuAssignmentData $scope.menuAssignmentList', $scope.menuAssignmentList);
      loadMenuAssignmentData();
    };

    $scope.searchMenuAssignmentData = function() {
      console.log('$scope.searchMenuAssignmentData');
      $scope.menuAssignmentList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;
      $scope.loadMenuAssignmentData();
    };
    
    this.makeInitPromises = function() {
      companyId = scheduleFactory.getCompanyId();
      console.log('makeInitPromises companyId = ', companyId);
      var promises = [
        scheduleFactory.getStationList(companyId).then($this.getStationsSuccess),
        scheduleFactory.getCarrierNumbers(companyId).then($this.getCarrierNumberSuccess),
        scheduleFactory.getCarrierTypes(companyId).then($this.getCarrierTypesSuccess)
      ];

      return promises;
    };
    
    this.init = function() {
      console.log('init');
      $scope.allCheckboxesSelected = false;
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });

    };

    this.init();
  });
