'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyReceiptCreateCtrl
 * @description
 * # CompanyReceiptCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReceiptCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, companyReceiptFactory, $filter) {
    var $this = this;

    $scope.viewName = 'Company Receipts';
    $scope.shouldDisableEndDate = false;
    $scope.displayError = false;
    $scope.companyReceipt = {};

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.editingItem = false;
      $scope.isLoadingCompleted = true;
      $scope.viewName = 'Create Company Receipt';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.editingItem = true;
      $scope.viewName = 'View Company Receipt';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.editingItem = true;
      $scope.viewName = 'Edit Company Receipt';
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'CompanyReceipt');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate || $scope.readOnly;
    };

    $scope.isCompanyReceiptEditable = function () {
      if ($routeParams.action === 'create') {
        return true;
      }

      if ($routeParams.action === 'view' || angular.isUndefined($scope.companyReceipt)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker($scope.companyReceipt.startDate);
    };
  });
