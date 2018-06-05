'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyReceiptListCtrl
 * @description
 * # CompanyReceiptListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReceiptListCtrl', function ($scope, $q, $route, $location, lodash, dateUtility, accessService, companyReceiptFactory, recordsService) {
    var $this = this;

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.companyReceipts = [];
    $scope.$scope.receiptTemplates = [];
    $scope.isSearch = false;
    $scope.search = {};

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.companyReceipts = [];
      $scope.search = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    $scope.toggleSearchPanel = function() {
      togglePanel('#search-collapse');
    };

    $scope.redirectToCompanyReceipt = function(id, state) {
      $location.search({});
      $location.path('company-receipts/' + state + '/' + id).search();
    };

    $scope.loadCompanyReceipts = function() {
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

      $scope.uiReady = true;
      $this.meta.offset += $this.meta.limit;

      return companyReceiptFactory.getCompanyReceipts(payload).then($this.getCompanyReceiptsSuccess);
    };

    $scope.searchCompanyReceipts = function() {
      $scope.isSearch = true;
      $scope.companyReceipts = [];

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadCompanyReceipts();
    };

    $scope.canEdit = function (endDate) {
      return dateUtility.isYesterdayOrEarlierDatePicker(endDate);
    };

    $scope.isDateActive = function (date) {
      return dateUtility.isTodayOrEarlierDatePicker(date);
    };

    $scope.removeRecord = function (companyReceiptId) {
      $this.displayLoadingModal('Removing Company Receipt');

      companyReceiptFactory.removeCompanyReceipt(companyReceiptId).then($this.removeCompanyReceiptSuccess(companyReceiptId), $this.removeCompanyReceiptFailure);
    };

    this.removeCompanyReceiptSuccess = function (companyReceiptId) {
      lodash.remove($scope.companyReceipts, function (companyReceipt) {
        return companyReceipt.id === companyReceiptId;
      });

      $this.hideLoadingModal();
    };

    this.removeCompanyReceiptFailure = function () {
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

    this.getCompanyReceiptsSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.companyReceipts = $scope.companyReceipts.concat(response.companyReceipts.map(function (companyReceipt) {
        companyReceipt.startDate = dateUtility.formatDateForApp(companyReceipt.startDate);
        companyReceipt.endDate = dateUtility.formatDateForApp(companyReceipt.endDate);

        return companyReceipt;
      }));

      hideLoadingBar();
    };

    this.initPromisesSuccess = function (dataFromAPI) {
      $scope.receiptTemplates = dataFromAPI;

      return $scope.loadCompanyReceipts();
    };

    this.makeInitPromises = function() {
      var promises = [
        recordsService.getReceiptTemplates()
      ];

      return promises;
    };

    this.init = function() {
      angular.element('.loading-more').hide();
      $scope.isCRUD = accessService.crudAccessGranted('SURVEY', 'SURVEY', 'SURVEYQ');
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function(dataFromAPI) {
        angular.element('#search-collapse').addClass('collapse');

        $this.initPromisesSuccess(dataFromAPI);
      });

    };

    this.init();
  });
