'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyEmailReceiptCreateCtrl
 * @description
 * # CompanyEmailReceiptCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyEmailReceiptCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, companyEmailReceiptFactory) {
    var $this = this;

    $scope.viewName = 'Company E-mail Receipts';
    $scope.shouldDisableEndDate = false;
    $scope.displayError = false;
    $scope.companyEmailReceipt = {};
    $scope.receiptTypes = [];

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.editingItem = false;
      $scope.isLoadingCompleted = true;
      $scope.viewName = 'Create Company E-mail Receipt';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.editingItem = true;
      $scope.viewName = 'View Company E-mail Receipt';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.editingItem = true;
      $scope.viewName = 'Edit Company E-mail Receipt';
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.companyEmailReceiptForm.$valid;
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
        $this.showToastMessage('success', 'Create Company E-mail Receipt', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Company E-mail Receipt', 'success');
      }

      $location.path('company-email-receipts');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'CompanyEmailReceipt');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.createCompanyEmailReceipt = function() {
      $this.showLoadingModal('Creating Company E-mail Receipt');

      var payload = {
        companyId: companyEmailReceiptFactory.getCompanyId(),
        receiptTemplateTypeId: $scope.companyEmailReceipt.receiptTypeId,
        logoUrl: $scope.companyEmailReceipt.logoUrl,
        receiptTemplateText: $scope.companyEmailReceipt.template,
        startDate: dateUtility.formatDateForAPI($scope.companyEmailReceipt.startDate),
        endDate: dateUtility.formatDateForAPI($scope.companyEmailReceipt.endDate)
      };

      companyEmailReceiptFactory.createCompanyEmailReceipt(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editCompanyEmailReceipt = function() {
      $this.showLoadingModal('Saving Company E-mail Receipt');

      var payload = {
        id: $routeParams.id,
        companyId: companyEmailReceiptFactory.getCompanyId(),
        receiptTemplateTypeId: $scope.companyEmailReceipt.receiptTypeId,
        logoUrl: $scope.companyEmailReceipt.logoUrl,
        receiptTemplateText: $scope.companyEmailReceipt.template,
        startDate: dateUtility.formatDateForAPI($scope.companyEmailReceipt.startDate),
        endDate: dateUtility.formatDateForAPI($scope.companyEmailReceipt.endDate)
      };

      companyEmailReceiptFactory.updateCompanyEmailReceipt($routeParams.id, payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.normalizeReceiptTypeName = function(input) {
      var uppercase = (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';

      return uppercase.replace('_', ' ');
    };

    this.getCompanyEmailReceiptSuccess = function(response) {
      var startDate = dateUtility.formatDateForApp(response.startDate);
      var endDate = dateUtility.formatDateForApp(response.endDate);

      $scope.shouldDisableStartDate = dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

      $scope.companyEmailReceipt = {
        id: response.id,
        receiptTypeId: response.receiptTemplateTypeId,
        logoUrl: response.logoUrl,
        template: response.receiptTemplateText,
        startDate: startDate,
        endDate: endDate
      };

      $scope.isLoadingCompleted = true;
    };

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate || $scope.readOnly;
    };

    $scope.isCompanyEmailReceiptEditable = function () {
      if ($routeParams.action === 'create') {
        return true;
      }

      if ($routeParams.action === 'view' || angular.isUndefined($scope.companyEmailReceipt)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker($scope.companyEmailReceipt.startDate);
    };

    this.initDependenciesSuccess = function(dataFromAPI) {
      var receiptTypes = dataFromAPI[0];

      receiptTypes.forEach(function (template) {
        template.displayName = $this.normalizeReceiptTypeName(template.name.replace('_', ' '));

        $scope.receiptTypes.push(template);
      });

      if ($routeParams.id) {
        companyEmailReceiptFactory.getCompanyEmailReceipt($routeParams.id).then($this.getCompanyEmailReceiptSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };

    this.makeInitPromises = function() {
      var promises = [
        recordsService.getReceiptTemplates()
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');

      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
