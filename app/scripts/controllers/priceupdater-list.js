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
      priceupdater.categoryName = lodash.findWhere($scope.salesCategories, { id: priceupdater.categoryId });
      priceupdater.priceType = lodash.findWhere($scope.priceTypes, { id: priceupdater.priceTypeId });
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

  $scope.isPriceUpdaterEditable = function(priceupdater) {
    if (angular.isUndefined(priceupdater)) {
      return false;
    }

    return dateUtility.isAfterOrEqualDatePicker(priceupdater.endDate, dateUtility.nowFormattedDatePicker());
  };

  $scope.showDeleteButton = function(dateString) {
    return dateUtility.isAfterTodayDatePicker(dateString);
  };

  $scope.removeRecord = function (priceupdater) {

    $this.displayLoadingModal('Removing Price Update Rule Record');

    priceupdaterFactory.deletePriceUpdaterRule(priceupdater.id).then(
      $this.deleteSuccess, 
      $this.deleteFailure
    );
  };

  this.initSuccessHandler = function(responseCollection) {
    angular.element('#search-collapse').addClass('collapse');
    $scope.salesCategories = angular.copy(responseCollection[0].salesCategories);
    $scope.priceTypes = angular.copy(responseCollection[1]);
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
    $scope.isCRUD = accessService.crudAccessGranted('RETAIL', 'RETAILITEMCATEGORY', 'CRUDRICAT');
    $q.all(initDependencies).then($this.initSuccessHandler);
  };

  this.init();

});
