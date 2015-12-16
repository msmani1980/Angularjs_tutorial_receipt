'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountListCtrl
 * @description
 * # DiscountListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountListCtrl', function ($scope, $location, discountFactory, ngToast, dateUtility, payloadUtility, lodash) {
    var $this = this;
    $scope.viewName = 'Discount';
    $scope.search = {};
    $scope.discountList = [];
    $scope.discountToDelete = {};
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

    this.attachDiscountListToScope = function (discountListFromAPI) {
      $this.meta.count = $this.meta.count || discountListFromAPI.meta.count;
      $scope.discountList = $scope.discountList.concat($this.formatDates(discountListFromAPI.companyDiscounts));
      hideLoadingBar();
    };

    this.getDiscountList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var query = lodash.assign(payloadUtility.serializeDates($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      discountFactory.getDiscountList(query).then($this.attachDiscountListToScope);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchDiscounts = function () {
      $scope.discountList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $this.getDiscountList();
    };

    this.getDiscountTypesList = function () {
      discountFactory.getDiscountTypesList().then(function (discountTypes) {
        $scope.discountTypes = discountTypes.discounts;
      });
    };

    $scope.editDiscount = function (discount) {
      $location.search({});
      window.location.href = '/ember/#/discounts/' + discount.id + '/edit';
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchDiscounts();
    };

    this.formatDates = function(discountArray) {
      var formattedDiscountArray = angular.copy(discountArray);
      angular.forEach(formattedDiscountArray, function (discount) {
        discount.startDate = dateUtility.formatDateForApp(discount.startDate);
        discount.endDate = dateUtility.formatDateForApp(discount.endDate);
      });
      return formattedDiscountArray;
    };

    $scope.isDiscountEditable = function (discount) {
      if (angular.isUndefined(discount)) {
        return false;
      }
      return dateUtility.isAfterToday(discount.endDate);
    };

    $scope.isDiscountReadOnly = function (exchangeRate) {
      if (!exchangeRate.startDate) {
        return false;
      }
      return !(dateUtility.isAfterToday(exchangeRate.startDate));
    };

    this.deleteDiscount = function (discountId) {
      discountFactory.deleteDiscount(discountId);
    };

    $scope.showDeleteConfirmation = function (index, discount) {
      $scope.discountToDelete = discount;
      $scope.discountToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteDiscount = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#discount-' + $scope.discountToDelete.rowIndex).remove();

      $this.deleteDiscount($scope.discountToDelete.id);
    };

    $scope.loadDiscounts = function() {
      $this.getDiscountList();
    };

    this.init = function () {
      $this.getDiscountTypesList();
    };

    this.init();
  });
