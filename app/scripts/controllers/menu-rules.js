'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuRulesCtrl
 * @description
 * # MenuRulesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
.controller('MenuRulesCtrl', function($scope, $q, $route, $location, $filter, menuRulesFactory, dateUtility, messageService, lodash) {
    
    var $this = this;
    
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    
    var companyId;
    
    $scope.viewName = 'Rule Management';
    $scope.menuRules = [];
    $scope.isSearch = false;
    $scope.multiSelectedValues = {};
    $scope.search = {};
    $scope.modal = null;
    $scope.displayModalImportInfo = false;
    $scope.stationList = [];
   
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];

    $scope.allExpanded = false;
    
    $scope.toggleAllCheckboxes = function () {
      angular.forEach($scope.menuRules, function (menuRule) {
        menuRule.selected = $scope.allCheckboxesSelected;
      });
    };
    
    $scope.toggleAllAccordionView = function () {
      $scope.allExpanded = !$scope.allExpanded;
      angular.forEach($scope.menuRules, function (menuRule) {
        menuRule.isExpanded = $scope.allExpanded;
      });
    };

    $scope.toggleAccordionView = function (menuRule) {
      menuRule.isExpanded = !menuRule.isExpanded;
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
      $this.addSearchValuesFromMultiSelectArray('depStationId', $scope.multiSelectedValues.depStations, 'id');
      $this.addSearchValuesFromMultiSelectArray('arrStationId', $scope.multiSelectedValues.arrStations, 'id');
    };

    $scope.toggleColumnView = function(columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.menuRules = [];
      $scope.search = {};
      $scope.multiSelectedValues = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };
    
    $scope.isCurrentEffectiveDate = function (menuRuleDate) {
      return (dateUtility.isTodayOrEarlierDatePicker(menuRuleDate.startDate) && (dateUtility.isAfterTodayDatePicker(menuRuleDate.endDate) || dateUtility.isTodayDatePicker(menuRuleDate.endDate)));
    };
      
    $scope.isFutureEffectiveDate = function (menuRuleDate) {
      return (dateUtility.isAfterTodayDatePicker(menuRuleDate.startDate) && (dateUtility.isAfterTodayDatePicker(menuRuleDate.endDate)));
    };
      
    $scope.redirectToMenuRules = function(id, state) {
      $location.search({});
      $location.path('menu-rules/' + state + '/' + id).search();
    };
    
    $scope.showDeleteConfirmation = function(menuRuleToDelete) {
      $scope.menuRuleToDelete = menuRuleToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };
    
    $scope.deleteMenuRule = function() {
      angular.element('.delete-warning-modal').modal('hide');
      menuRulesFactory.deleteMenuRule($scope.menuRuleToDelete).then(successDeleteHandler, showErrors);
    };
    
    function showErrors(dataFromAPI) {
      $scope.errorResponse = dataFromAPI;
      $scope.displayError = true;
    }

    function successDeleteHandler() {
      $scope.searchMenuRulesData();
      $this.showToastMessage('success', 'Menu Rule Management', 'successfully deleted Menu Rule!');
    }
      
    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.constructStartDate = function () {
      return dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    this.getStationsSuccess = function(response) {
      $scope.stationList = angular.copy(response.response);
    };
    
    this.getSchedulesSuccess = function(response) {
      $scope.schedules = angular.copy(response.distinctSchedules);
    };
    
    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };
    
    this.getMenuRulesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.menuRules = response.response.map(function (menuRule) {
        menuRule.days = (menuRule.days) ? menuRule.days.replace('{', '').replace('}', '') : menuRule.days;
        menuRule.startDate = dateUtility.formatDateForApp(menuRule.startDate);
        menuRule.endDate = dateUtility.formatDateForApp(menuRule.endDate);

        return menuRule;
      });
      
      hideLoadingBar();
    };

    $scope.loadMenuRulesData = function() {
      angular.element('#search-collapse').addClass('collapse');
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
      
      menuRulesFactory.getMenuRules(payload).then($this.getMenuRulesSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchMenuRulesData = function() {
      $scope.menuRules = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;

      $scope.loadMenuRulesData();
    };
    
    this.getOnLoadingPayload = function() {
      var onLoadPayload = lodash.assign(angular.copy($scope.search), {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
      });
      return onLoadPayload;
    };
    
    this.makeInitPromises = function() {
      companyId = menuRulesFactory.getCompanyId();

      var promises = [
        menuRulesFactory.getSchedules(companyId),
        menuRulesFactory.getCompanyGlobalStationList($this.getOnLoadingPayload())
      ];

      return promises;
    };
    
    this.init = function() {
      $this.showLoadingModal('Loading Data');
      angular.element('#search-collapse').addClass('collapse');
      $scope.allCheckboxesSelected = false;
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function(response) {
        $this.getSchedulesSuccess(response[0]);
        $this.getStationsSuccess(response[1]);
        $scope.uiReady = true;
        $this.hideLoadingModal();
      });

    };

    this.init();
  });
