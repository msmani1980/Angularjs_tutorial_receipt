'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountListCtrl
 * @description
 * # DiscountListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountListCtrl', function($scope, $location, discountFactory, dateUtility, payloadUtility, lodash, accessService) {

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

    function errorHandler(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }

    this.attachDiscountListToScope = function(discountListFromAPI) {
      $this.meta.count = $this.meta.count || discountListFromAPI.meta.count;

      if ($scope.discountList.length !== discountListFromAPI.meta.count) {
        $scope.discountList = $scope.discountList.concat($this.formatDates(discountListFromAPI.companyDiscounts));
      }

      hideLoadingBar();
    };

    this.getDiscountList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var query = lodash.assign(payloadUtility.serializeDates($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      if ($scope.search.startDate === undefined || $scope.search.startDate === null || $scope.search.startDate === '') {
        query.startDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      }
      
      discountFactory.getDiscountList(query).then($this.attachDiscountListToScope, errorHandler);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchDiscounts = function() {
      $scope.discountList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $this.getDiscountList();
    };

    this.setDiscountTypesList = function(dataFromAPI) {
      $scope.discountTypes = dataFromAPI.discounts;
    };

    this.getDiscountTypesList = function() {
      discountFactory.getDiscountTypesList().then($this.setDiscountTypesList, errorHandler);
    };

    $scope.editDiscount = function(discount) {
      $location.search({});
      $location.path('/discounts/edit/' + discount.id);
    };

    $scope.clearForm = function() {
      $scope.search = {};
      $scope.discountList = [];
    };

    this.formatDates = function(discountArray) {
      var formattedDiscountArray = angular.copy(discountArray);
      angular.forEach(formattedDiscountArray, function(discount) {
        discount.startDate = dateUtility.formatDateForApp(discount.startDate);
        discount.endDate = dateUtility.formatDateForApp(discount.endDate);
      });

      return formattedDiscountArray;
    };

    $scope.isDiscountEditable = function(discount) {
      if (angular.isUndefined(discount)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(discount.endDate) || dateUtility.isTodayDatePicker(discount.endDate);
    };

    $scope.isDiscountReadOnly = function(exchangeRate) {
      if (!exchangeRate.startDate) {
        return false;
      }

      return !(dateUtility.isAfterTodayDatePicker(exchangeRate.startDate));
    };

    this.deleteDiscount = function(discountId) {
      discountFactory.deleteDiscount(discountId);
    };

    $scope.showDeleteConfirmation = function(index, discount) {
      $scope.discountToDelete = discount;
      $scope.discountToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteDiscount = function() {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#discount-' + $scope.discountToDelete.rowIndex).remove();

      $this.deleteDiscount($scope.discountToDelete.id);
    };

    $scope.getUpdatedOn = function (discount) {
      return discount.updatedOn ? dateUtility.formatTimestampForApp(discount.updatedOn) : dateUtility.formatTimestampForApp(discount.createdOn);
    };

    $scope.getUpdateBy = function (discount) {
      if (discount.updatedByPerson) {
        return discount.updatedByPerson.userName;
      }

      if (discount.createdByPerson) {
        return discount.createdByPerson.userName;
      }

      return '';
    };

    $scope.loadDiscounts = function() {
      $this.getDiscountList();
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('DISCOUNT', 'DISCOUNT', 'CRUDDSCNT');
      $this.getDiscountTypesList();
    };

    this.init();
  });
