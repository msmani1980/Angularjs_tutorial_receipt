'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SalesTargetsCtrl
 * @description
 * # SalesTargetsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SalesTargetsCtrl', function ($scope, $q, $location, dateUtility, $routeParams, salesTargetFactory, salesTargetCategoryFactory, messageService, lodash, formValidationUtility) {

    var $this = this;

    $scope.viewName = 'Sales Target ';
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
      $scope.viewName = 'Create Sales Target';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Sales Target';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Sales Target';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();

      return $scope.salesTargetDataForm.$valid;
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
        $this.showToastMessage('success', 'Create Sales Target', 'Success');
      } else {
        $this.showToastMessage('success', 'Edit Sales Target', 'Success');
      }

      $location.path('sales-target-categories');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.createSalesTarget = function() {
      $this.showLoadingModal('Creating Sales Target');
      var payload = {
        name: $scope.salesTarget.name,
        description: $scope.salesTarget.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTarget.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTarget.endDate)
      };

      salesTargetFactory.createSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    this.editSalesTarget = function() {
      $this.showLoadingModal('Saving Sales Target');
      var payload = {
        id: $routeParams.id,
        name: $scope.salesTarget.name,
        description: $scope.salesTarget.description,
        startDate: dateUtility.formatDateForAPI($scope.salesTarget.startDate),
        endDate: dateUtility.formatDateForAPI($scope.salesTarget.endDate)
      };

      salesTargetFactory.updateSalesTarget(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'SalesTarget');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.salesTargetSuccess = function(response) {
      console.log(response)
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);
      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);

      $scope.salesTarget = {
        id: response.id,
        name: response.name,
        description: response.description,
        startDate: $scope.viewStartDate,
        endDate: $scope.viewEndDate
      };

    };

    this.initDependenciesSuccess = function(responseCollection) {
      $scope.salesTargetCategoryList = responseCollection[0].salesTargetCategories;

      if ($routeParams.id) {
        salesTargetFactory.getSalesTargetById($routeParams.id).then($this.salesTargetSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

    };

    this.makeInitPromises = function() {
      var promises = [
        salesTargetCategoryFactory.getSalesTargetCategoryList()
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
