'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SalesTargetsCategoriesCtrl
 * @description
 * # SalesTargetsCategoriesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SalesTargetsCategoriesCtrl', function ($scope, $q, $location, dateUtility, $routeParams, salesTargetCategoryFactory, messageService, lodash, formValidationUtility) {

    var $this = this;

    $scope.viewName = 'Sales Target Category';
    $scope.shouldDisableEndDate = false;
    $scope.menuMasterList = [];
    $scope.itemMasterList = [];
    $scope.validation = formValidationUtility;
    $scope.plan = {
      startDate: '',
      endDate: '',
      packingPlanMenu: [],
      packingPlanObject: []
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Sales Target Category';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Sales Target Category';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Sales Target Category';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();

      return $scope.salesTargetCategoryDataForm.$valid;
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
        $this.showToastMessage('success', 'Create Sales Target Category', 'Success');
      } else {
        $this.showToastMessage('success', 'Edit Sales Target Category', 'Success');
      }

      $location.path('sales-target-categories');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createSalesTargetCategory = function() {
      $this.showLoadingModal('Creating Sales Target Category');
      var payload = {
        name: $scope.salesTargetCategory.name,
        description: $scope.salesTargetCategory.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTargetCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTargetCategory.endDate)
      };

      salesTargetCategoryFactory.createSalesTargetCategory(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    this.editSalesTargetCategory = function() {
      $this.showLoadingModal('Saving Sales Target Category');
      var payload = {
        id: $routeParams.id,
        name: $scope.salesTargetCategory.name,
        description: $scope.salesTargetCategory.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTargetCategory.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTargetCategory.endDate)
      };

      salesTargetCategoryFactory.updateSalesTargetCategory(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'SalesTargetCategory');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.salesTargetCategorySuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);
      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);
      
      $scope.salesTargetCategory = {
        id: response.id,
        name: response.name,
        description: response.description,
        startDate: $scope.viewStartDate,
        endDate: $scope.viewEndDate
      };

    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        salesTargetCategoryFactory.getSalesTargetCategoryById($routeParams.id).then($this.salesTargetCategorySuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

    };

    this.makeInitPromises = function() {
      var promises = [
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    $this.init();

  });
