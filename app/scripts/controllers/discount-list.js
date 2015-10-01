'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountListCtrl
 * @description
 * # DiscountListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountListCtrl', function ($scope, $location, menuService, ngToast, dateUtility) {
    $scope.viewName = 'Discount';
    $scope.search = {};

    var attachDiscountListToScope = function (discountListFromAPI) {
      $scope.menuList = formatDates(discountListFromAPI.discounts);
    };

    function formatDates(discountArray) {
      var formattedDiscountArray = angular.copy(discountArray);
      angular.forEach(formattedDiscountArray, function (discount) {
        discount.startDate = dateUtility.formatDateForApp(discount.startDate);
        discount.endDate = dateUtility.formatDateForApp(discount.endDate);
      });
      return formattedDiscountArray;
    }

    $scope.searchDiscounts = function () {
      discountService.getDiscountList(serializeDates($scope.search)).then(attachDiscountListToScope);
    };

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

    $scope.editDiscount = function (discount) {
      $location.search({});
      $location.path('ember/#/discounts/' + discount.id + '/edit');
    };

    $scope.isDiscountEditable = function (discount) {
      if (angular.isUndefined(discount)) {
        return false;
      }
      return dateUtility.isAfterToday(discount.endDate);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchMenus();
    };
  });
