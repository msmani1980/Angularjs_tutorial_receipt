'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountListCtrl
 * @description
 * # DiscountListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountListCtrl', function ($scope, $location, discountFactory, ngToast, dateUtility, payloadUtility) {
    var $this = this;
    $scope.viewName = 'Discount';
    $scope.search = {};
    $scope.discountList = [];
    $scope.discountToDelete = {};
    $scope.defaultLimit = 100;

    this.getDiscountList = function () {
      discountFactory.getDiscountList({limit: $scope.defaultLimit}).then($this.attachDiscountListToScope);
    };

    this.getDiscountTypesList = function () {
      discountFactory.getDiscountTypesList().then(function (discountTypes) {
        $scope.discountTypes = discountTypes.discounts;
      });
    };

    $scope.editDiscount = function (discount) {
      $location.search({});
      $location.path('/discounts/edit/' + discount.id);
    };

    $scope.searchDiscounts = function () {
      discountFactory.getDiscountList(payloadUtility.serializeDates($scope.search)).then($this.attachDiscountListToScope);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchDiscounts();
    };

    this.attachDiscountListToScope = function (discountListFromAPI) {
      $scope.discountList = $this.formatDates(discountListFromAPI.companyDiscounts);
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

    this.init = function () {
      $this.getDiscountList();
      $this.getDiscountTypesList();
    };

    this.init();
  });
