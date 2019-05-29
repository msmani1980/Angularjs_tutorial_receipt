'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SalesTargetsCategoriesListCtrl
 * @description
 * # SalesTargetsCategoriesListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SalesTargetsCategoriesListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, accessService, salesTargetCategoryFactory) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Sales Target Categories';
    $scope.search = {};
    $scope.salesTargetCategoryList = [];
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
      $scope.salesTargetCategoryList = [];
    };

    this.getSalesTargetListSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.salesTargetCategoryList = $scope.salesTargetCategoryList.concat(response.salesTargetCategories.map(function (category) {
        category.startDate = dateUtility.formatDateForApp(category.startDate);
        category.endDate = dateUtility.formatDateForApp(category.endDate);
        return category;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadSalesTargetCategoryList = function() {
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
      salesTargetCategoryFactory.getSalesTargetCategoryList(payload).then($this.getSalesTargetListSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchSalesTargetCategoryData = function() {
      $scope.salesTargetCategoryList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;
      $scope.loadSalesTargetCategoryList();
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

    $scope.redirectToSalesTargetCategory = function(id, state) {
      $location.search({});

      $location.path('sales-target-categories/' + state + '/' + id).search();
    };

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Sales Target Category', 'Sales Target Category successfully deleted');
      $scope.salesTargetCategoryList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSalesTargetCategoryList();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('danger', 'Sales Target Category', 'Sales Target Category could not be deleted');
    };

    $scope.isValidForRuleApply = function(salesTargetCategory) {
      if (angular.isUndefined(salesTargetCategory)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(salesTargetCategory.startDate);
    };

    $scope.isSalesTargetCategoryEditable = function(salesTargetCategory) {
      if (angular.isUndefined(salesTargetCategory)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(salesTargetCategory.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.showDeleteButton = function(salesTargetCategory) {
      return dateUtility.isAfterTodayDatePicker(salesTargetCategory.startDate);
    };

    $scope.removeRecord = function (salesTargetCategory) {
      $this.displayLoadingModal('Removing Packing Plan Record');
      salesTargetCategoryFactory.deleteSalesTargetCategory(salesTargetCategory.id).then(
        $this.deleteSuccess, $this.deleteFailure
      );
    };

    this.initSuccessHandler = function() {
      angular.element('#search-collapse').addClass('collapse');
    };

    $scope.loadUpdatedOn = function (salesTargetCategory) {
      return salesTargetCategory.updatedOn ? dateUtility.formatTimestampForApp(salesTargetCategory.updatedOn) : dateUtility.formatTimestampForApp(salesTargetCategory.createdOn);
    };

    $scope.loadUpdatedBy = function (salesTargetCategory) {
      return salesTargetCategory.updatedByPerson ? salesTargetCategory.updatedByPerson.userName : salesTargetCategory.createdByPerson.userName;
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
