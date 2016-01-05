'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagSubmissionCtrl
 * @description
 * # CashBagSubmissionCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('CashBagSubmissionCtrl',
  function ($scope, $http, GlobalMenuService, cashBagFactory, $filter, dateUtility, lodash) {
    $scope.viewName = 'Cash Bag Submission';
    $scope.search = {};
    $scope.bankReferenceNumbers = [];
    $scope.cashBagNumberList = [];
    $scope.scheduleNumber = [];
    $scope.cashBagList = [];
    $scope.allCheckboxesSelected = false;

    var $this = this;
    this.loadingProgress = false;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    function sortByNumber(a, b) {
      return a - b;
    }

    this.setSearchFields = function () {
      var bankReferenceNumbersList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.bankReferenceNumber) {
          return cashBag.bankReferenceNumber;
        }
      });

      var cashBagNumberList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.cashBagNumber) {
          return cashBag.cashBagNumber;
        }
      });

      var scheduleNumberList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.scheduleNumber) {
          return cashBag.scheduleNumber;
        }
      });

      $scope.bankReferenceNumbers = lodash.uniq(lodash.compact(bankReferenceNumbersList.sort(sortByNumber)), true);
      $scope.cashBagNumberList = lodash.uniq(lodash.compact(cashBagNumberList.sort()), true);
      $scope.scheduleNumberList = lodash.uniq(lodash.compact(scheduleNumberList.sort()), true);
    };

    function formatCashBag(cashBag) {
      cashBag.selected = false;
      cashBag.submittedDate = (cashBag.isSubmitted === 'true') ? dateUtility.formatDateForApp(cashBag.updatedOn) : '-';
      cashBag.scheduleDate = dateUtility.formatDateForApp(cashBag.scheduleDate);
      cashBag.submittedBy = (cashBag.originationSource === 2) ? 'Auto' : (cashBag.cashbagSubmittedBy || '-');
    }

    this.getCashBagListSuccessHandler = function (dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      lodash.forEach(dataFromAPI.cashBags, function (cashBag) {
        formatCashBag(cashBag);
      });
      $scope.cashBagList = $scope.cashBagList.concat(dataFromAPI.cashBags);
      $this.setSearchFields();
      hideLoadingBar();
      $this.loadingProgress = false;
    };

    $scope.updateCashBagList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      if ($this.loadingProgress) {
        return;
      }
      showLoadingBar();
      $this.loadingProgress = true;

      var companyId = GlobalMenuService.company.get();
      var payload = {
        submission: 'submit',
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        companyId: companyId
      };
      cashBagFactory.getCashBagList(null, payload).then($this.getCashBagListSuccessHandler);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.toggleAllCheckboxes = function () {
      lodash.forEach($scope.cashBagList, function (cashBag) {
        cashBag.selected = $scope.allCheckboxesSelected;
      });
    };

    $scope.toggleCheckbox = function () {
      $scope.allCheckboxesSelected = false;
    };

  });
