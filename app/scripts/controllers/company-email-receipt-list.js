'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyEmailReceiptListCtrl
 * @description
 * # CompanyEmailReceiptListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyEmailReceiptListCtrl', function ($scope, $q, $route, $location, lodash, dateUtility, accessService, companyEmailReceiptFactory) {
    var $this = this;

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.companyEmailReceipts = [];
    $scope.receiptTypes = [];
    $scope.isSearch = false;
    $scope.isSearching = false;
    $scope.search = {};

    this.removeCompanyEmailReceiptSuccess = function (companyEmailReceiptId) {
      lodash.remove($scope.companyEmailReceipts, function (companyEmailReceipt) {
        return companyEmailReceipt.id === companyEmailReceiptId;
      });

      $this.hideLoadingModal();
    };

    this.removeCompanyEmailReceiptFailure = function () {
      $this.hideLoadingModal();
    };

    function togglePanel(panelName) {
      isPanelOpen(panelName) ? hidePanel(panelName) : showPanel(panelName); // jshint ignore:line
    }

    function isPanelOpen(panelName) {
      return !angular.element(panelName).hasClass('collapse');
    }

    function hidePanel(panelName) {
      if (!isPanelOpen(panelName)) {
        return;
      }

      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      angular.element(panelName).removeClass('collapse');
    }

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

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.constructStartDate = function () {
      return dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    this.getCompanyEmailReceiptsSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.companyEmailReceipts = $scope.companyEmailReceipts.concat(response.companyEmailReceipts.map(function (companyEmailReceipt) {
        companyEmailReceipt.startDate = dateUtility.formatDateForApp(companyEmailReceipt.startDate);
        companyEmailReceipt.endDate = dateUtility.formatDateForApp(companyEmailReceipt.endDate);
        companyEmailReceipt.emailAsAttachmentDisplayValue = companyEmailReceipt.emailAsAttachment ? 'Yes' : 'No';

        return companyEmailReceipt;
      }));

      hideLoadingBar();
    };

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.companyEmailReceipts = [];
      $scope.search = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadCompanyEmailReceipts();
    };

    $scope.toggleSearchPanel = function() {
      togglePanel('#search-collapse');
    };

    $scope.redirectToCompanyEmailReceipt = function(id, state) {
      $location.search({});
      $location.path('company-email-receipts/' + state + '/' + id).search();
    };

    $scope.loadCompanyEmailReceipts = function() {
      $scope.isSearching = true;

      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();

      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        sortOn: 'startDate',
        sortBy: 'ASC'
      });

      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;

      companyEmailReceiptFactory.getCompanyEmailReceipts(payload).then($this.getCompanyEmailReceiptsSuccess).finally(function() { $scope.isSearching = false; });

      $this.meta.offset += $this.meta.limit;
      $scope.uiReady = true;
    };

    $scope.searchCompanyEmailReceipts = function() {
      $scope.isSearch = true;
      $scope.companyEmailReceipts = [];

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadCompanyEmailReceipts();
    };

    $scope.isCompanyEmailReceiptEditable = function(companyEmailReceipt) {
      if (angular.isUndefined(companyEmailReceipt)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(companyEmailReceipt.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.canEdit = function (endDate) {
      return dateUtility.isYesterdayOrEarlierDatePicker(endDate);
    };

    $scope.isDateActive = function (date) {
      return dateUtility.isTodayOrEarlierDatePicker(date);
    };

    $scope.removeRecord = function (companyEmailReceipt) {
      $this.displayLoadingModal('Removing Company E-mail Receipt');

      companyEmailReceiptFactory.removeCompanyEmailReceipt(companyEmailReceipt.id).then($this.removeCompanyEmailReceiptSuccess(companyEmailReceipt.id), $this.removeCompanyEmailReceiptFailure);
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterTodayDatePicker(dateString);
    };

    this.initPromisesSuccess = function () {
      return $scope.loadCompanyEmailReceipts();
    };

    this.makeInitPromises = function() {
      var promises = [
      ];

      return promises;
    };

    this.init = function() {
      angular.element('.loading-more').hide();
      $scope.isCRUD = accessService.crudAccessGranted('COMPANYRECEIPTS', 'COMPANYEMAILRECEIPTS', 'COMPANYEMAILRECEIPTS');
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function(dataFromAPI) {
        angular.element('#search-collapse').addClass('collapse');

        $this.initPromisesSuccess(dataFromAPI);
      });

    };

    this.init();
  });
