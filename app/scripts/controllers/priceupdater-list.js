'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PriceupdaterListCtrl
 * @description
 * # PriceupdaterListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
.controller('PriceupdaterListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, priceupdaterFactory, accessService) {

  var $this = this;
  this.meta = {
    count: undefined,
    limit: 100,
    offset: 0
  };

  $scope.viewName = 'Manage Price Update Rule';
  $scope.search = {};
  $scope.priceUpdateRules = [];
  $scope.loadingBarVisible = false;
  $scope.selectedRulesForExecution = [];
  $scope.isSearch = false;

  function showLoadingBar() {
    $scope.loadingBarVisible = true;
    angular.element('.loading-more').show();
  }

  function hideLoadingBar() {
    $scope.loadingBarVisible = false;
    angular.element('.loading-more').hide();
    angular.element('.modal-backdrop').remove();
  }

  $scope.clearSearchForm = function() {
    $scope.isSearch = false;
    $scope.search = {};
    $scope.priceUpdateRules = [];
  };

  this.getPriceUpdateRuleSuccess = function(response) {
    $this.meta.count = $this.meta.count || response.meta.count;
    $scope.priceUpdateRules = $scope.priceUpdateRules.concat(response.response.map(function (priceupdater) {
      priceupdater.taxIs = (priceupdater.taxFilter !== null) ? (priceupdater.taxFilter ? 'Included' : 'Excluded') : 'Exempt';
      priceupdater.startDate = dateUtility.formatDateForApp(priceupdater.startDate);
      priceupdater.endDate = dateUtility.formatDateForApp(priceupdater.endDate);
      return priceupdater;
    }));

    hideLoadingBar();
  };

  this.constructStartDate = function () {
    return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
  };
    
  $scope.loadPriceUpdaterRules = function() {
    if ($this.meta.offset >= $this.meta.count) {
      return;
    }

    showLoadingBar();
    var payload = lodash.assign(angular.copy($scope.search), {
      limit: $this.meta.limit,
      offset: $this.meta.offset
    });
    
    payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
    payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;
        
    priceupdaterFactory.getPriceUpdaterRules(payload).then($this.getPriceUpdateRuleSuccess);
    $this.meta.offset += $this.meta.limit;
  };

  $scope.searchPriceUpdateRulesData = function() {
    $scope.priceUpdateRules = [];
    $this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.isSearch = true;
    $scope.loadPriceUpdaterRules();
  };

  this.displayLoadingModal = function (loadingText) {
    angular.element('#loading').modal('show').find('p').text(loadingText);
  };

  this.hideLoadingModal = function () {
    angular.element('#loading').modal('hide');
  };

  this.showToastMessage = function(className, type, message) {
    messageService.display(className, message, type);
  };

  $scope.redirectToPriceUpdateRule = function(id, state) {
    $location.search({});
    $location.path('priceupdater/' + state + '/' + id).search();
  };

  this.deleteSuccess = function() {
    $this.hideLoadingModal();
    $this.showToastMessage('success', 'Price Update', 'Price Update Rule successfully deleted');
    $scope.priceUpdateRules = [];
    $this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.loadPriceUpdaterRules();
  };

  this.deleteFailure = function() {
    $this.hideLoadingModal();  
    $this.showToastMessage('danger', 'Price Update', 'Price Update Rule could not be deleted');
  };

  $scope.isValidForRuleApply = function(priceupdater) {
    if (angular.isUndefined(priceupdater)) {
      return false;
    }

    return dateUtility.isAfterTodayDatePicker(priceupdater.startDate);
  };

  $scope.isPriceUpdaterEditable = function(priceupdater) {
    if (angular.isUndefined(priceupdater)) {
      return false;
    }

    return dateUtility.isAfterOrEqualDatePicker(priceupdater.endDate, dateUtility.nowFormattedDatePicker());
  };

  $scope.showDeleteButton = function(priceupdater) {
    return dateUtility.isAfterTodayDatePicker(priceupdater.startDate) || priceupdater.runBy !== null;
  };

  $scope.removeRecord = function (priceupdater) {

    $this.displayLoadingModal('Removing Price Update Rule Record');

    priceupdaterFactory.deletePriceUpdaterRule(priceupdater.id).then(
      $this.deleteSuccess, 
      $this.deleteFailure
    );
  };

  $scope.hasSelectedAnyRules = function () {
    return lodash.filter($scope.priceUpdateRules, function(rule) {
      return rule.selected === true;
    }).length > 0;
  };

  $scope.selectAllCheckboxes = function () {
    angular.forEach($scope.priceUpdateRules, function (rule) {
      rule.selected = $scope.allCheckboxesSelected;
    });
  };

  this.findAllSelectedRules = function() {
    return lodash.filter($scope.priceUpdateRules, function(rule) {
      return rule.selected === true;
    });
  };

  $scope.showBulkExecuteActionModal = function(action) {
    $scope.selectedRulesForExecution = $this.findAllSelectedRules();
    $scope.actionToExecute = action;
    angular.element('.delete-warning-modal').modal('show');
  };

  this.applyPriceUpdateRulesSuccess = function () {
    $this.showToastMessage('success', 'Rules have been applied', 'success');
  };

  this.applyPriceUpdateRulesFailure = function () {
    $this.showToastMessage('error', 'Something went wrong while applying rules. Please try again.', 'success');
  };
  
  this.executeApplyRulesAction = function () {
    var payload = {
      id: $scope.selectedRulesForExecution.map(function (rule) {
        return rule.id;
      })
    };

    priceupdaterFactory.applyPriceUpdateRules(payload.id).then($this.applyPriceUpdateRulesSuccess, $this.applyPriceUpdateRulesFailure);
  };

  $scope.executeAction = function() {
    $scope.displayError = false;
    angular.element('.delete-warning-modal').modal('hide');
    if ($scope.actionToExecute === 'Apply Rules') {
      $this.executeApplyRulesAction();
    }
  };

  this.initSuccessHandler = function(responseCollection) {
    angular.element('#search-collapse').addClass('collapse');
    $scope.salesCategories = angular.copy(responseCollection[0].salesCategories);
    $scope.priceTypes = angular.copy(responseCollection[1]);
  };

  $scope.loadUpdatedOn = function (priceupdater) {
    return priceupdater.updatedOn ? dateUtility.formatTimestampForApp(priceupdater.updatedOn) : null;
  };

  $scope.loadCreatedOn = function (priceupdater) {
    return priceupdater.createdOn ? dateUtility.formatTimestampForApp(priceupdater.createdOn) : null;
  };

  this.makeInitPromises = function() {
    var promises = [
      priceupdaterFactory.getSalesCategoriesList({}),
      priceupdaterFactory.getPriceTypesList({})
    ];
    return promises;
  };

  this.init = function() {
    var initDependencies = $this.makeInitPromises();
    $scope.isCRUD = accessService.crudAccessGranted('RETAIL', 'D_PRICE_UPDATE', 'RIBPU');
    $q.all(initDependencies).then($this.initSuccessHandler);
    $scope.allCheckboxesSelected = false;
  };

  this.init();

});
