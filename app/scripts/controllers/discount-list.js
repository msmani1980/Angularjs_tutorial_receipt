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
      discountFactory.getDiscountList().then(attachDiscountListToScope);
    };

    this.getDiscountTypesList = function () {
      discountFactory.getDiscountTypesList().then(function (discountTypes) {
        $scope.discountTypes = discountTypes.discounts;
      });
    };

    $scope.editDiscount = function (discount) {
      $location.search({});
      $location.path('/ember/#/discounts/' + discount.id + '/edit');
    };

    $scope.searchDiscounts = function () {
      discountFactory.getDiscountList(serializeDates($scope.search)).then(attachDiscountListToScope);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchDiscounts();
    };

    var attachDiscountListToScope = function (discountListFromAPI) {
      $scope.discountList = formatDates(discountListFromAPI.companyDiscounts);
    };

    function formatDates(discountArray) {
      var formattedDiscountArray = angular.copy(discountArray);
      angular.forEach(formattedDiscountArray, function (discount) {
        discount.startDate = dateUtility.formatDateForApp(discount.startDate);
        discount.endDate = dateUtility.formatDateForApp(discount.endDate);
      });
      return formattedDiscountArray;
    }

    function serializeDates(payload) {
      var formattedPayload = angular.copy(payload);
      if (formattedPayload.startDate) {
        formattedPayload.startDate = dateUtility.formatDateForAPI(formattedPayload.startDate);
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = dateUtility.formatDateForAPI(formattedPayload.endDate);
      }
      return formattedPayload;
    }

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
