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

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.companyReceiptForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Company Receipt', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Company Receipt', 'success');
      }

      $location.path('company-receipts');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
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

    this.createCompanyReceipt = function() {
      $this.showLoadingModal('Creating Company Receipt');

      var payload = {
        companyId: surveyQuestionsFactory.getCompanyId(),
        receiptTemplateTypeId: $scope.companyReceipt.receiptTypeId,
        logoUrl: $scope.companyReceipt.logoUrl,
        receiptTemplateText: $scope.companyReceipt.template,
        startDate: dateUtility.formatDateForAPI($scope.companyReceipt.startDate),
        endDate: dateUtility.formatDateForAPI($scope.companyReceipt.endDate)
      };

      companyReceiptFactory.createCompanyReceipt(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editCompanyReceipt = function() {
      $this.showLoadingModal('Saving Company Receipt');

      var payload = {
        id: $routeParams.id,
        companyId: surveyQuestionsFactory.getCompanyId(),
        receiptTemplateTypeId: $scope.companyReceipt.receiptTypeId,
        logoUrl: $scope.companyReceipt.logoUrl,
        receiptTemplateText: $scope.companyReceipt.template,
        startDate: dateUtility.formatDateForAPI($scope.surveyQuestion.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyQuestion.endDate)
      };

      companyReceiptFactory.updateCompanyReceipt($routeParams.id, payload).then($this.saveFormSuccess, $this.saveFormFailure);
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
