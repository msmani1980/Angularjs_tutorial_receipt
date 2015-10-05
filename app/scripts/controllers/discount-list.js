'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountListCtrl
 * @description
 * # DiscountListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountListCtrl', function ($scope, $location, discountFactory, ngToast, dateUtility) {
    var $this = this;
    $scope.viewName = 'Discount';
    $scope.search = {};
    $scope.discountList = [];

    this.getDiscountList = function () {
      discountFactory.getDiscountList().then($this.attachDiscountListToScope);
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

    $scope.searchDiscounts = function () {
      discountFactory.getDiscountList($this.serializeDates($scope.search)).then($this.attachDiscountListToScope);
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

    this.serializeDates = function(payload) {
      var formattedPayload = angular.copy(payload);
      if (formattedPayload.startDate) {
        formattedPayload.startDate = dateUtility.formatDateForAPI(formattedPayload.startDate);
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = dateUtility.formatDateForAPI(formattedPayload.endDate);
      }
      return formattedPayload;
    };

    $scope.isDiscountEditable = function (discount) {
      if (angular.isUndefined(discount)) {
        return false;
      }
      return dateUtility.isAfterToday(discount.endDate);
    };

    this.init = function () {
      $this.getDiscountList();
      $this.getDiscountTypesList();
    };

    this.init();
  });
