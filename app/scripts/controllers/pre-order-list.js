'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PreOrderListCtrl
 * @description
 * # PreOrderListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PreOrderListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, accessService,) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Pre-Orders';
    $scope.search = {};
    $scope.preOrderList = [];
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
      $scope.preOrderList = [];
    };

    this.getPreOrderListSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.preOrderList = $scope.preOrderList.concat(response.preOrders.map(function (preOrder) {
        preOrder.startDate = dateUtility.formatDateForApp(preOrder.startDate);
        preOrder.endDate = dateUtility.formatDateForApp(preOrder.endDate);
        return preOrder;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadPreOrderList = function() {
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
      preOrderFactory.getPreOrderList(payload).then($this.getPreOrderListSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchPreOrderData = function() {
      $scope.preOrderList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0,
        sortOn: 'name,startDate',
        sortBy: 'ASC'
      };

      $scope.isSearch = true;
      $scope.loadPreOrderList();
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

    $scope.redirectToPreOrder = function(id, state) {
      $location.search({});
      $location.path('pre-orders/' + state + '/' + id).search();
    };

    $scope.isValidForRuleApply = function(preOrder) {
      if (angular.isUndefined(preOrder)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(preOrder.startDate);
    };

    $scope.isPreOrderEditable = function(preOrder) {
      if (angular.isUndefined(preOrder)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(preOrder.endDate, dateUtility.nowFormattedDatePicker());
    };

    this.initSuccessHandler = function() {
      angular.element('#search-collapse').addClass('collapse');
    };

    $scope.loadUpdatedOn = function (preOrder) {
      return preOrder.updatedOn ? dateUtility.formatTimestampForApp(preOrder.updatedOn) : dateUtility.formatTimestampForApp(preOrder.createdOn);
    };

    $scope.loadUpdatedBy = function (preOrder) {
      return preOrder.updatedByPerson ? preOrder.updatedByPerson.userName : preOrder.createdByPerson.userName;
    };

    this.makeInitPromises = function() {
      var promises = [
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $scope.isCRUD = accessService.crudAccessGranted('PREORDER', 'PREORDER', 'CRUDST');
      $q.all(initDependencies).then($this.initSuccessHandler);
    };

    this.init();

  });
