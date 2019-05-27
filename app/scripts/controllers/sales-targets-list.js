'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SalesTargetsListCtrl
 * @description
 * # SalesTargetsListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SalesTargetsListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, accessService, salesTargetFactory) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Sales Targets';
    $scope.search = {};
    $scope.salesTargetList = [];
    $scope.loadingBarVisible = false;
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
      $scope.salesTargetList = [];
    };

    this.getSalesTargetListSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.salesTargetList = $scope.salesTargetList.concat(response.salesTargets.map(function (salesTarget) {
        salesTarget.startDate = dateUtility.formatDateForApp(salesTarget.startDate);
        salesTarget.endDate = dateUtility.formatDateForApp(salesTarget.endDate);
        return salesTarget;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadSalesTargetList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        sortOn: 'name,startDate',
        sortBy: 'ASC'
      });

      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;
      salesTargetFactory.getSalesTargetList(payload).then($this.getSalesTargetListSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchSalesTargetData = function() {
      $scope.salesTargetList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0,
        sortOn: 'name,startDate',
        sortBy: 'ASC'
      };

      $scope.isSearch = true;
      $scope.loadSalesTargetList();
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

    $scope.redirectToSalesTarget = function(id, state) {
      $location.search({});
      $location.path('sales-targets/' + state + '/' + id).search();
    };

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Sales Targets', 'Sales Target successfully deleted');
      $scope.salesTargetList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSalesTargetList();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('danger', 'Sales Target', 'Sales Target could not be deleted');
    };

    $scope.isValidForRuleApply = function(salesTarget) {
      if (angular.isUndefined(salesTarget)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(salesTarget.startDate);
    };

    $scope.isSalesTargetEditable = function(salesTarget) {
      if (angular.isUndefined(salesTarget)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(salesTarget.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.showDeleteButton = function(salesTarget) {
      return dateUtility.isAfterTodayDatePicker(salesTarget.startDate);
    };

    $scope.removeRecord = function (salesTarget) {
      $this.displayLoadingModal('Removing Sales Target Record');
      salesTargetFactory.deleteSalesTarget(salesTarget.id).then(
        $this.deleteSuccess, $this.deleteFailure
      );
    };

    this.initSuccessHandler = function() {
      angular.element('#search-collapse').addClass('collapse');
    };

    $scope.loadUpdatedOn = function (salesTarget) {
      return salesTarget.updatedOn ? dateUtility.formatTimestampForApp(salesTarget.updatedOn) : dateUtility.formatTimestampForApp(salesTarget.createdOn);
    };

    $scope.loadUpdatedBy = function (salesTarget) {
      return salesTarget.updatedByPerson ? salesTarget.updatedByPerson.userName : salesTarget.createdByPerson.userName;
    };

    this.makeInitPromises = function() {
      var promises = [
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $scope.isCRUD = accessService.crudAccessGranted('SALESTARGETS', 'SALESTARGETS', 'CRUDST');
      $q.all(initDependencies).then($this.initSuccessHandler);
    };

    this.init();

  });
