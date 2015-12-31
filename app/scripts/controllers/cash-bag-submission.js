'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagSubmissionCtrl
 * @description
 * # CashBagSubmissionCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('CashBagSubmissionCtrl',
  function($scope, $http, GlobalMenuService,
    cashBagFactory, $filter, lodash
  ) {

    $scope.viewName = 'Cash Bag Submission';
    $scope.search = {};
    $scope.bankReferenceNumbers = [];
    $scope.cashBagList = [];
    $scope.allCheckboxesSelected = false;

    var $this = this;
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

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setReferenceNumberList = function() {
      var bankReferenceNumbersList = lodash.map($scope.cashBagList, function(cashBag) { return cashBag.bankReferenceNumber; });
      $this.bankReferenceNumbers = lodash.uniq(bankReferenceNumbersList, true);
    };

    this.getCashBagListSuccessHandler = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      lodash.forEach(dataFromAPI.cashBags, function(cashBag) {
        cashBag.selected = false;
      });
      $scope.cashBagList = $scope.cashBagList.concat(dataFromAPI.cashBags);
      $this.setReferenceNumberList();
      hideLoadingBar();
      loadingProgress = false;
    };

    var loadingProgress = false;
    $scope.updateCashBagList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      if (loadingProgress) {
        return;
      }
      loadingProgress = true;

      showLoadingBar();
      cashBagFactory.getCashBagList(null, {limit: $this.meta.limit, offset: $this.meta.offset})
        .then($this.getCashBagListSuccessHandler);
      $this.meta.offset += $this.meta.limit;
    };

    this.init = function() {
      hideLoadingBar();
    };

    this.init();

    $scope.toggleAllCheckboxes = function() {
      lodash.forEach($scope.cashBagList, function(cashBag) {
        cashBag.selected = $scope.allCheckboxesSelected;
      });
    };

    $scope.toggleCheckbox = function() {
      $scope.allCheckboxesSelected = false;
    };

  });
