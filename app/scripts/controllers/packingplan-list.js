'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PackingplanListCtrl
 * @description
 * # PackingplanListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PackingplanListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, packingplanFactory, accessService) {
  var $this = this;
  this.meta = {
    count: undefined,
    limit: 100,
    offset: 0
  };

  $scope.viewName = 'Packing Plans';
  $scope.search = {};
  $scope.packingPlanList = [];
  $scope.loadingBarVisible = false;
  $scope.selectedRulesForExecution = [];
  $scope.isSearch = false;

  function showLoadingBar() {
    $scope.loadingBarVisible = true;
    angular.element('.loading-more').show();
  }

  function hideLoadingBar() {
    $scope.loadingBarVisible = false;
    angular.element('.loading-more').hide();
    angular.element('.modal-backdrop').remove();
  }

  $scope.clearSearchForm = function() {
    $scope.isSearch = false;
    $scope.search = {};
    $scope.packingPlanList = [];
  };

  this.getPackingPlanListSuccess = function(response) {
    $this.meta.count = $this.meta.count || response.meta.count;
    $scope.packingPlanList = $scope.packingPlanList.concat(response.packingPlans.map(function (packingplan) {
      packingplan.startDate = dateUtility.formatDateForApp(packingplan.startDate);
      packingplan.endDate = dateUtility.formatDateForApp(packingplan.endDate);
      return packingplan;
    }));

    hideLoadingBar();
  };

  this.constructStartDate = function () {
    return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
  };
   
  $scope.loadPackingPlanList = function() {
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
    packingplanFactory.getPackingPlansList(payload).then($this.getPackingPlanListSuccess);
    $this.meta.offset += $this.meta.limit;
  };

  $scope.searchPackingPlansData = function() {
    $scope.packingPlanList = [];
    $this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.isSearch = true;
    $scope.loadPackingPlanList();
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

  $scope.redirectToPackingPlan = function(id, state) {
    $location.search({});
    $location.path('packingplan/' + state + '/' + id).search();
  };

  this.deleteSuccess = function() {
    $this.hideLoadingModal();
    $this.showToastMessage('success', 'Packing Plan', 'Packing Plan successfully deleted');
    $scope.packingPlanList = [];
    $this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.loadPackingPlanList();
  };

  this.deleteFailure = function() {
    $this.hideLoadingModal();
    $this.showToastMessage('danger', 'Packing Plan', 'Packing Plan could not be deleted');
  };

  $scope.isValidForRuleApply = function(packingPlan) {
    if (angular.isUndefined(packingPlan)) {
      return false;
    }

    return dateUtility.isAfterTodayDatePicker(packingPlan.startDate);
  };

  $scope.isPackingPlanEditable = function(packingPlan) {
    if (angular.isUndefined(packingPlan)) {
      return false;
    }

    return dateUtility.isAfterOrEqualDatePicker(packingPlan.endDate, dateUtility.nowFormattedDatePicker());
  };

  $scope.showDeleteButton = function(packingPlan) {
    return dateUtility.isAfterTodayDatePicker(packingPlan.startDate);
  };

  $scope.removeRecord = function (packingPlan) {
    $this.displayLoadingModal('Removing Packing Plan Record');
    packingplanFactory.deletePackingPlan(packingPlan.id).then(
      $this.deleteSuccess, $this.deleteFailure
    );
  };

  this.initSuccessHandler = function(responseCollection) {
    angular.element('#search-collapse').addClass('collapse');
    $scope.menuMasterList = angular.copy(responseCollection[0].companyMenuMasters);
  };

  $scope.loadUpdatedOn = function (packingPlan) {
    return packingPlan.updatedOn ? dateUtility.formatTimestampForApp(packingPlan.updatedOn) : dateUtility.formatTimestampForApp(packingPlan.createdOn);
  };

  $scope.loadUpdatedBy = function (packingPlan) {
    return packingPlan.updatedByPerson ? packingPlan.updatedByPerson.userName : packingPlan.createdByPerson.userName;
  };

  this.makeInitPromises = function() {
    var promises = [
      packingplanFactory.getMenuMasterList({})
    ];
    return promises;
  };

  this.init = function() {
    var initDependencies = $this.makeInitPromises();
    $scope.isCRUD = accessService.crudAccessGranted('PACKINGPLAN', 'PACKINGPLAN', 'CRUDPP');
    $q.all(initDependencies).then($this.initSuccessHandler);
  };

  this.init();

});
