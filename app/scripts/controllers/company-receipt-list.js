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
    $scope.receiptTypes = [];
    $scope.isSearch = false;
    $scope.isSearching = false;
    $scope.search = {};

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
        companyReceipt.receiptType = $this.getReceiptTypeName(companyReceipt.receiptTemplateTypeId);

        return companyReceipt;
      }));

      hideLoadingBar();
    };

    this.getReceiptTypeName = function (templateTypeId) {
      var receiptType = lodash.find($scope.receiptTypes, { id: templateTypeId });

      return receiptType.displayName;
    };

    this.normalizeReceiptTypeName = function(input) {
      var uppercase = (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';

      return uppercase.replace('_', ' ');
    };

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.companyReceipts = [];
      $scope.search = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadCompanyReceipts();
    };

    $scope.toggleSearchPanel = function() {
      togglePanel('#search-collapse');
    };

    $scope.redirectToCompanyReceipt = function(id, state) {
      $location.search({});
      $location.path('company-receipts/' + state + '/' + id).search();
    };

    $scope.loadCompanyReceipts = function() {
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

      companyReceiptFactory.getCompanyReceipts(payload).then($this.getCompanyReceiptsSuccess).finally(function() { $scope.isSearching = false; });

      $this.meta.offset += $this.meta.limit;
      $scope.uiReady = true;
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

    $scope.isCompanyReceiptEditable = function(companyReceipt) {
      if (angular.isUndefined(companyReceipt)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(companyReceipt.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.canEdit = function (endDate) {
      return dateUtility.isYesterdayOrEarlierDatePicker(endDate);
    };

    $scope.isDateActive = function (date) {
      return dateUtility.isTodayOrEarlierDatePicker(date);
    };

    $scope.removeRecord = function (companyEmailReceipt) {
      $this.displayLoadingModal('Removing Company Receipt');

      companyReceiptFactory.removeCompanyReceipt(companyEmailReceipt.id).then($this.removeCompanyReceiptSuccess(companyEmailReceipt.id), $this.removeCompanyReceiptFailure);
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterTodayDatePicker(dateString);
    };

    this.initPromisesSuccess = function (dataFromAPI) {
      var receiptTypes = dataFromAPI[0];

      receiptTypes.forEach(function (template) {
        template.displayName = $this.normalizeReceiptTypeName(template.name.replace('_', ' '));

        $scope.receiptTypes.push(template);
      });

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
      $scope.isCRUD = accessService.crudAccessGranted('COMPANYRECEIPTS', 'COMPANYRECEIPTS', 'COMPANYRECEIPTS');
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function(dataFromAPI) {
        angular.element('#search-collapse').addClass('collapse');

        $this.initPromisesSuccess(dataFromAPI);
      });

    };

    this.init();
  });
